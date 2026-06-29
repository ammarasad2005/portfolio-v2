#!/usr/bin/env python3
"""Deep-dive on the 4 resume projects: fetch source files (App.tsx, package.json, README, src structure)."""
import re, json, sys, time, urllib.request, urllib.error, concurrent.futures
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
OUT = Path("/home/z/my-project/research")
DEEP = OUT / "deep_dive"
DEEP.mkdir(parents=True, exist_ok=True)

PROJECTS = ["Exam-Table", "WayFinder", "gcr-resources-fetch", "Drama-Ghar"]

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

# Files to try fetching for each project
CANDIDATE_FILES = [
    "package.json",
    "README.md",
    "tsconfig.json",
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
    "vite.config.ts",
    "vite.config.js",
    "manifest.json",  # for Chrome Extension
    "src/App.tsx",
    "src/App.jsx",
    "src/app/page.tsx",
    "src/app/layout.tsx",
    "app/page.tsx",
    "app/layout.tsx",
    "src/main.tsx",
    "src/main.jsx",
    "src/index.tsx",
    "src/index.ts",
    "background.js",
    "background.ts",
    "content.js",
    "content.ts",
    "src/lib/auth.ts",
    "src/lib/prisma.ts",
    "src/lib/db.ts",
    "prisma/schema.prisma",
    "src/components/Navbar.tsx",
    "src/components/Header.tsx",
    ".github/workflows/ci.yml",
    ".github/workflows/deploy.yml",
    "tailwind.config.ts",
    "tailwind.config.js",
    "Dockerfile",
    "vercel.json",
    "LICENSE",
    "pyproject.toml",
    "requirements.txt",
    "main.py",
    "app/main.py",
    "src/index.css",
    "src/app/globals.css",
    "app/globals.css",
]

def fetch_repo_files(name):
    repo_dir = DEEP / name
    repo_dir.mkdir(parents=True, exist_ok=True)
    out = {"name": name, "files": {}}
    
    # Try main and master branches
    for branch in ["main", "master"]:
        for fname in CANDIDATE_FILES:
            if fname in out["files"]: continue
            url = f"https://raw.githubusercontent.com/ammarasad2005/{name}/{branch}/{fname}"
            content = fetch(url)
            if content and not content.startswith("<!DOCTYPE"):
                # Save to file with safe name
                safe = fname.replace("/", "_")
                (repo_dir / f"{safe}").write_text(content, encoding="utf-8")
                out["files"][fname] = {
                    "branch": branch,
                    "size": len(content),
                    "lines": content.count("\n") + 1,
                    "first_500": content[:500]
                }
    
    # Also fetch the repo's tree listing via GitHub HTML
    html = fetch(f"https://github.com/ammarasad2005/{name}")
    if html:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")
        files = []
        for link in soup.find_all("a", href=re.compile(rf"/ammarasad2005/{re.escape(name)}/(tree|blob)/")):
            href = link.get("href", "")
            # Extract file name after /main/ or /master/
            m = re.search(r"/(main|master)/(.+)$", href)
            if m:
                files.append(m.group(2))
        out["top_level_listed"] = sorted(set(files))
    
    return out

print("Deep diving into 4 resume projects...")
results = {}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
    futures = {ex.submit(fetch_repo_files, p): p for p in PROJECTS}
    for f in concurrent.futures.as_completed(futures):
        name = futures[f]
        try:
            r = f.result()
            results[name] = r
            print(f"\n=== {name} ===")
            print(f"  Files fetched: {len(r['files'])}")
            for fname, info in r["files"].items():
                print(f"    {fname}: {info['lines']} lines, {info['size']}B")
            print(f"  Top-level listed in HTML: {len(r.get('top_level_listed', []))}")
        except Exception as e:
            print(f"  {name}: ERR {e}")

(DEEP / "_deep_dive.json").write_text(json.dumps(results, indent=2))
print(f"\nSaved to {DEEP}/_deep_dive.json")
