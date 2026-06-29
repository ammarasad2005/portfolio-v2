#!/usr/bin/env python3
"""Fetch each repo's HTML page + README + package.json (via raw)."""
import re, json, sys, time, urllib.request, urllib.error, concurrent.futures
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
OUT = Path("/home/z/my-project/research")
REPO_DIR = OUT / "repos"
REPO_DIR.mkdir(parents=True, exist_ok=True)

repo_names = json.loads((OUT / "repo_names.json").read_text())

def fetch(url, tries=2):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as e:
            if e.code in (404, 410):
                return None
            time.sleep(1 + i)
        except Exception:
            time.sleep(1 + i)
    return None

def fetch_repo(name):
    base = f"https://github.com/ammarasad2005/{name}"
    result = {"name": name, "html": None, "readme": None, "package_json": None,
             "readme_path": None, "files": []}
    
    # Repo HTML page
    html = fetch(base)
    result["html"] = html
    result["html_size"] = len(html or "")
    
    # Try common README paths via raw.githubusercontent
    readme_candidates = [
        f"https://raw.githubusercontent.com/ammarasad2005/{name}/main/README.md",
        f"https://raw.githubusercontent.com/ammarasad2005/{name}/master/README.md",
        f"https://raw.githubusercontent.com/ammarasad2005/{name}/main/readme.md",
        f"https://raw.githubusercontent.com/ammarasad2005/{name}/main/README.MD",
    ]
    for url in readme_candidates:
        r = fetch(url)
        if r and not r.startswith("<!DOCTYPE"):
            result["readme"] = r
            result["readme_path"] = url
            break
    
    # Try package.json
    pkg_url = f"https://raw.githubusercontent.com/ammarasad2005/{name}/main/package.json"
    pkg = fetch(pkg_url)
    if not pkg:
        pkg = fetch(f"https://raw.githubusercontent.com/ammarasad2005/{name}/master/package.json")
    if pkg and pkg.strip().startswith("{"):
        result["package_json"] = pkg
    
    # Save artifacts
    (REPO_DIR / f"{name}.html").write_text(html or "", encoding="utf-8")
    if result["readme"]:
        (REPO_DIR / f"{name}.README.md").write_text(result["readme"], encoding="utf-8")
    if result["package_json"]:
        (REPO_DIR / f"{name}.package.json").write_text(result["package_json"], encoding="utf-8")
    
    return {k: v for k, v in result.items() if k != "html"}

# Fetch repos in parallel
print(f"Fetching {len(repo_names)} repos in parallel...")
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    futures = {ex.submit(fetch_repo, n): n for n in repo_names}
    for f in concurrent.futures.as_completed(futures):
        name = futures[f]
        try:
            r = f.result()
            results.append(r)
            print(f"  {name}: html={r.get('html_size',0)}B readme={'Y' if r.get('readme') else 'N'} pkg={'Y' if r.get('package_json') else 'N'}")
        except Exception as e:
            print(f"  {name}: ERROR {e}")

(REPO_DIR / "_summary.json").write_text(json.dumps(results, indent=2))
print(f"\nSaved summary to {REPO_DIR}/_summary.json")
print(f"Total repos: {len(results)}")
print(f"Repos with README: {sum(1 for r in results if r.get('readme'))}")
print(f"Repos with package.json: {sum(1 for r in results if r.get('package_json'))}")
