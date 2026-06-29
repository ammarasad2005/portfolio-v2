#!/usr/bin/env python3
"""Parse each repo HTML to extract metadata: language, stars, forks, last update, description, commit count."""
import re, json, sys
from pathlib import Path
from bs4 import BeautifulSoup

REPO_DIR = Path("/home/z/my-project/research/repos")
summary = json.loads((REPO_DIR / "_summary.json").read_text())

def text(node):
    return node.get_text(strip=True) if node else ""

def parse_repo(name, html):
    soup = BeautifulSoup(html, "html.parser")
    out = {"name": name}
    
    # Description
    desc = soup.select_one("[data-test-selector='repository-description'] p, .f4.my-3")
    if not desc:
        # Try alternative
        desc = soup.find("p", class_=re.compile("f4|my-3"))
    out["description"] = text(desc).strip()
    
    # Primary language
    lang_ul = soup.find("ul", class_=re.compile("list-style-none.*h-tabs.*"))
    if lang_ul:
        items = lang_ul.find_all("li")
        if items:
            out["primary_language"] = text(items[0])
    
    # Stars
    star_link = soup.find("a", href=re.compile(r"/ammarasad2005/.+/stargazers"))
    if star_link:
        out["stars"] = text(star_link.find("strong") or star_link)
    
    # Forks
    fork_link = soup.find("a", href=re.compile(r"/ammarasad2005/.+/forks"))
    if fork_link:
        out["forks"] = text(fork_link.find("strong") or fork_link)
    
    # Watchers (less important)
    
    # Last commit relative time - look for "relative-time" elements
    rel_times = soup.find_all("relative-time", limit=5)
    if rel_times:
        out["last_commit_iso"] = rel_times[0].get("datetime", "")
        out["last_commit_text"] = rel_times[0].get("title", text(rel_times[0]))
    
    # Commit count - look for "X commits" link
    commit_link = soup.find("a", href=re.compile(r"/ammarasad2005/.+/commits"))
    if commit_link:
        out["commit_count_text"] = text(commit_link.find("strong") or commit_link)
    
    # Topics
    topics = []
    for t in soup.select("a.topic-tag"):
        topics.append(text(t))
    out["topics"] = topics
    
    # Languages breakdown (file navigation language stats)
    lang_stats = {}
    lang_span = soup.find_all("span", class_="color-fg-default text-bold mr-1")
    # try a different selector
    for li in soup.select("li.d-inline"):
        lang_name = li.find("span", class_=re.compile("color-text"))
        pct = li.find("span", string=re.compile(r"\d+\.\d+%"))
        if lang_name and pct:
            lang_stats[text(lang_name)] = text(pct)
    out["languages_pct"] = lang_stats
    
    # Top-level dirs/files in main branch
    files = []
    for row in soup.select("div[role='row']"):
        link = row.find("a", href=re.compile(rf"/ammarasad2005/{re.escape(name)}/(tree|blob)/"))
        if link:
            fname = link.get_text(strip=True)
            if fname and fname not in ("..",):
                files.append(fname)
    # Dedupe, keep order
    seen = set()
    files_unique = []
    for f in files:
        if f not in seen:
            seen.add(f)
            files_unique.append(f)
    out["top_level_files"] = files_unique[:30]
    
    # README quality (length, headings, code blocks, badges)
    readme_path = REPO_DIR / f"{name}.README.md"
    if readme_path.exists():
        readme = readme_path.read_text(errors="replace")
        out["readme_chars"] = len(readme)
        out["readme_headings"] = len(re.findall(r"^#+\s", readme, re.MULTILINE))
        out["readme_code_blocks"] = readme.count("```")
        out["readme_images"] = len(re.findall(r"!\[", readme))
        out["readme_badges"] = len(re.findall(r"shields\.io|badge|img\.shields", readme, re.IGNORECASE))
        out["readme_links"] = len(re.findall(r"\[.+?\]\(.+?\)", readme))
        # Quality 1-5
        score = 1
        if len(readme) > 500: score += 1
        if len(readme) > 2000: score += 1
        if re.search(r"^#+\s", readme, re.MULTILINE): score += 1
        if "```" in readme or re.search(r"!\[", readme): score += 1
        out["readme_quality"] = min(5, score)
    else:
        out["readme_chars"] = 0
        out["readme_quality"] = 0
    
    # package.json analysis
    pkg_path = REPO_DIR / f"{name}.package.json"
    if pkg_path.exists():
        try:
            pkg = json.loads(pkg_path.read_text())
            out["pkg_name"] = pkg.get("name", "")
            out["pkg_description"] = pkg.get("description", "")
            out["pkg_dependencies"] = list(pkg.get("dependencies", {}).keys())
            out["pkg_devDependencies"] = list(pkg.get("devDependencies", {}).keys())
            out["pkg_scripts"] = list(pkg.get("scripts", {}).keys())
        except Exception as e:
            out["pkg_error"] = str(e)
    
    return out

all_parsed = []
for entry in summary:
    name = entry["name"]
    html_path = REPO_DIR / f"{name}.html"
    if not html_path.exists():
        continue
    html = html_path.read_text(errors="replace")
    parsed = parse_repo(name, html)
    all_parsed.append(parsed)

(REPO_DIR / "_parsed.json").write_text(json.dumps(all_parsed, indent=2))

# Print summary table
print(f"{'REPO':<35} {'LANG':<15} {'★':<5} {'F':<5} {'COMMITS':<10} {'LAST':<25} {'README':<7} {'TOPICS'}")
print("-" * 140)
for r in all_parsed:
    print(f"{r['name']:<35} {r.get('primary_language','?'):<15} {r.get('stars','?'):<5} {r.get('forks','?'):<5} {r.get('commit_count_text','?'):<10} {(r.get('last_commit_iso') or r.get('last_commit_text','?'))[:23]:<25} {r.get('readme_quality','?'):<7} {','.join(r.get('topics',[])[:3])}")
