#!/usr/bin/env python3
"""Scrape GitHub profile and repos via HTML (no API key needed)."""
import re, json, sys, time, urllib.request, urllib.error
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
OUT = Path("/home/z/my-project/research")
OUT.mkdir(parents=True, exist_ok=True)

def fetch(url, tries=3):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/json"})
    for i in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            print(f"  HTTP {e.code} on {url} (try {i+1})", file=sys.stderr)
            time.sleep(2 * (i + 1))
        except Exception as e:
            print(f"  ERR {e} on {url} (try {i+1})", file=sys.stderr)
            time.sleep(2 * (i + 1))
    return None

def save(name, content):
    p = OUT / name
    p.write_text(content or "", encoding="utf-8")
    return p

# 1. Profile page
print("== Fetching profile page ==")
profile_html = fetch("https://github.com/ammarasad2005")
save("profile.html", profile_html)
print(f"  profile.html: {len(profile_html or '')} bytes")

# 2. Tabs - repositories (all)
print("== Fetching repos tab ==")
repos_html = fetch("https://github.com/ammarasad2005?tab=repositories")
save("repos_tab.html", repos_html)
print(f"  repos_tab.html: {len(repos_html or '')} bytes")

# 3. Stars tab
print("== Fetching stars tab ==")
stars_html = fetch("https://github.com/ammarasad2005?tab=stars")
save("stars_tab.html", stars_html)
print(f"  stars_tab.html: {len(stars_html or '')} bytes")

# Extract repo names from repos tab using regex
repo_names = []
if repos_html:
    # Pattern: href="/ammarasad2005/REPO_NAME"
    matches = re.findall(r'href="/ammarasad2005/([^/"]+)"', repos_html)
    seen = set()
    for m in matches:
        if m in seen:
            continue
        if m in ("followers", "following", "stars", "repositories", "projects",
                 "packages", "sponsors", "overview", "repositories", "settings", "account"):
            continue
        seen.add(m)
        repo_names.append(m)

print(f"\nFound {len(repo_names)} candidate repo names:")
for n in repo_names:
    print(f"  - {n}")

# Save repo name list
(OUT / "repo_names.json").write_text(json.dumps(repo_names, indent=2))

print("\nDone with batch 1.")
