#!/usr/bin/env python3
"""Improved parser: languages via li items with %, last commit via atom feed, top files via div row structure."""
import re, json, sys, time, urllib.request, urllib.error, concurrent.futures
from pathlib import Path
from bs4 import BeautifulSoup

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
REPO_DIR = Path("/home/z/my-project/research/repos")
summary = json.loads((REPO_DIR / "_summary.json").read_text())

def fetch(url, tries=2):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as e:
            if e.code in (404, 410): return None
            time.sleep(1 + i)
        except Exception:
            time.sleep(1 + i)
    return None

def get_atom_info(name):
    """Fetch /commits.atom to get last commit date & recent messages."""
    url = f"https://github.com/ammarasad2005/{name}/commits.atom"
    xml = fetch(url)
    if not xml:
        return None
    info = {"name": name, "atom_url": url, "recent_commits": []}
    # <updated>2024-01-15T12:00:00Z</updated>
    m = re.search(r"<updated>([^<]+)</updated>", xml)
    if m:
        info["last_commit_iso"] = m.group(1)
    # Parse <entry> blocks
    entries = re.findall(r"<entry>(.*?)</entry>", xml, re.DOTALL)
    for e in entries[:10]:
        title_m = re.search(r"<title[^>]*>(.*?)</title>", e, re.DOTALL)
        date_m = re.search(r"<updated>([^<]+)</updated>", e)
        author_m = re.search(r"<name>([^<]+)</name>", e)
        info["recent_commits"].append({
            "title": (title_m.group(1) if title_m else "").strip(),
            "date": date_m.group(1) if date_m else "",
            "author": author_m.group(1) if author_m else ""
        })
    return info

def parse_repo_html(name, html):
    soup = BeautifulSoup(html, "html.parser")
    out = {"name": name}
    
    # Description - look for paragraph with class containing 'f4'
    desc = ""
    for p in soup.find_all("p"):
        cls = " ".join(p.get("class") or [])
        if "f4" in cls and len(p.get_text(strip=True)) > 5:
            desc = p.get_text(strip=True)
            break
    out["description"] = desc
    
    # Primary language - find li with text matching X.X%
    langs = []
    for li in soup.find_all("li"):
        spans = li.find_all("span")
        texts = [s.get_text(strip=True) for s in spans]
        for i, t in enumerate(texts):
            if re.match(r"^\d+\.\d+%$", t) and i > 0:
                lang = texts[i-1]
                if lang and lang not in ("Code", "Issues", "Pull requests", "Actions", "Projects",
                                          "Models", "Security and quality", "Insights"):
                    langs.append({"lang": lang, "pct": t})
    out["languages"] = langs
    out["primary_language"] = langs[0]["lang"] if langs else ""
    
    # Stars
    star_link = soup.find("a", href=re.compile(rf"/ammarasad2005/{re.escape(name)}/stargazers"))
    if star_link:
        out["stars"] = text_or_strong(star_link)
    
    # Forks
    fork_link = soup.find("a", href=re.compile(rf"/ammarasad2005/{re.escape(name)}/forks"))
    if fork_link:
        out["forks"] = text_or_strong(fork_link)
    
    # Commit count
    commit_link = soup.find("a", href=re.compile(rf"/ammarasad2005/{re.escape(name)}/commits"))
    if commit_link:
        out["commit_count_text"] = text_or_strong(commit_link)
    
    # Topics
    topics = []
    for t in soup.select("a.topic-tag, a.topic-tag-link"):
        topics.append(t.get_text(strip=True))
    out["topics"] = topics
    
    # Top-level files
    files = []
    for row in soup.find_all(["div", "tr"], role="row"):
        for link in row.find_all("a", href=re.compile(rf"/ammarasad2005/{re.escape(name)}/(tree|blob)/main/")):
            fname = link.get_text(strip=True)
            if fname and fname != ".." and len(fname) < 80:
                files.append(fname)
    seen = set()
    files_unique = []
    for f in files:
        if f not in seen:
            seen.add(f)
            files_unique.append(f)
    out["top_level_files"] = files_unique[:30]
    
    # README quality
    readme_path = REPO_DIR / f"{name}.README.md"
    if readme_path.exists():
        readme = readme_path.read_text(errors="replace")
        out["readme_chars"] = len(readme)
        out["readme_headings"] = len(re.findall(r"^#+\s", readme, re.MULTILINE))
        out["readme_code_blocks"] = readme.count("```")
        out["readme_images"] = len(re.findall(r"!\[", readme))
        out["readme_badges"] = len(re.findall(r"shields\.io|badge|img\.shields", readme, re.IGNORECASE))
        out["readme_links"] = len(re.findall(r"\[.+?\]\(.+?\)", readme))
        score = 1
        if len(readme) > 500: score += 1
        if len(readme) > 2000: score += 1
        if re.search(r"^#+\s", readme, re.MULTILINE): score += 1
        if "```" in readme or re.search(r"!\[", readme): score += 1
        out["readme_quality"] = min(5, score)
        out["readme_first_500"] = readme[:500]
    else:
        out["readme_chars"] = 0
        out["readme_quality"] = 0
        out["readme_first_500"] = ""
    
    # package.json
    pkg_path = REPO_DIR / f"{name}.package.json"
    if pkg_path.exists():
        try:
            pkg = json.loads(pkg_path.read_text())
            out["pkg_name"] = pkg.get("name", "")
            out["pkg_description"] = pkg.get("description", "")
            out["pkg_dependencies"] = list(pkg.get("dependencies", {}).keys())
            out["pkg_devDependencies"] = list(pkg.get("devDependencies", {}).keys())
            out["pkg_scripts"] = list(pkg.get("scripts", {}).keys())
            out["pkg_engines"] = pkg.get("engines", {})
        except Exception as e:
            out["pkg_error"] = str(e)
    
    return out

def text_or_strong(a):
    strong = a.find("strong")
    if strong:
        return strong.get_text(strip=True)
    return a.get_text(strip=True)

# Parse all HTML
print("Parsing repo HTML...")
all_parsed = []
for entry in summary:
    name = entry["name"]
    html_path = REPO_DIR / f"{name}.html"
    if not html_path.exists(): continue
    html = html_path.read_text(errors="replace")
    parsed = parse_repo_html(name, html)
    all_parsed.append(parsed)
print(f"Parsed {len(all_parsed)} repos")

# Fetch atom feeds in parallel for last commit info
print("\nFetching atom feeds (commit timestamps)...")
atom_results = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:
    futures = {ex.submit(get_atom_info, e["name"]): e["name"] for e in summary}
    for f in concurrent.futures.as_completed(futures):
        name = futures[f]
        try:
            r = f.result()
            if r:
                atom_results[name] = r
                lc = r.get("last_commit_iso", "")[:10]
                cnt = len(r.get("recent_commits", []))
                print(f"  {name}: last_commit={lc} entries={cnt}")
        except Exception as e:
            print(f"  {name}: ERR {e}")

# Merge atom info into parsed
for r in all_parsed:
    a = atom_results.get(r["name"])
    if a:
        r["last_commit_iso"] = a.get("last_commit_iso", "")
        r["recent_commits"] = a.get("recent_commits", [])

(REPO_DIR / "_parsed.json").write_text(json.dumps(all_parsed, indent=2))

# Print summary
print(f"\n{'='*160}")
print(f"{'REPO':<35} {'LANG':<12} {'★':<3} {'F':<3} {'COMMITS':<10} {'LAST':<12} {'RDM':<4} {'TOPICS'}")
print("-" * 160)
for r in sorted(all_parsed, key=lambda x: x.get("last_commit_iso", ""), reverse=True):
    print(f"{r['name']:<35} {(r.get('primary_language') or '?'):<12} {str(r.get('stars','?')):<3} {str(r.get('forks','?')):<3} {str(r.get('commit_count_text','?')):<10} {(r.get('last_commit_iso') or '?')[:10]:<12} {r.get('readme_quality','?'):<4} {','.join(r.get('topics',[])[:3])}")
