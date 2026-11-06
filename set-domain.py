"""Run once you have a domain:  python set-domain.py https://www.yourdomain.com
Replaces the __SITE_URL__ placeholder in every page and SEO file."""
import sys, pathlib
if len(sys.argv) != 2 or not sys.argv[1].startswith("http"):
    sys.exit("usage: python set-domain.py https://www.yourdomain.com")
url = sys.argv[1].rstrip("/")
for p in pathlib.Path(__file__).parent.iterdir():
    if p.suffix in {".html", ".xml", ".txt"} and p.is_file():
        t = p.read_text(encoding="utf-8")
        if "__SITE_URL__" in t:
            p.write_text(t.replace("__SITE_URL__", url), encoding="utf-8"); print("updated", p.name)
