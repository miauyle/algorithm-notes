"""Validate the built Jekyll artifact using navigation.json as the route and pager source."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import json

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "_site"
BASE = "/algorithm-notes"
REPO = "https://github.com/miauyle/algorithm-notes"


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = set()
        self.links = []
        self.edit_links = []
        self.h1_count = 0
        self.pager_prev = None
        self.pager_next = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get("class", "").split()
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f"Duplicate ID: {self.path}: {attrs['id']}"
            self.ids.add(attrs["id"])
        self.h1_count += tag == "h1"
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append(attrs[key])
        if "doc-head__edit" in classes:
            self.edit_links.append(attrs.get("href"))
        if "doc-pager__prev" in classes:
            self.pager_prev = attrs.get("href")
        if "doc-pager__next" in classes:
            self.pager_next = attrs.get("href")


def route_for(source):
    return f"/docs/{Path(source).stem}/"


def output_for(source):
    return SITE / "docs" / Path(source).stem / "index.html"


def main():
    assert SITE.is_dir(), "Run bundle exec jekyll build first"

    pages = {}
    for file in SITE.rglob("*.html"):
        if "assets" in file.relative_to(SITE).parts:
            continue
        page = Page(file)
        page.feed(file.read_text())
        assert page.h1_count == 1, f"Expected one H1: {file}"
        pages[file.resolve()] = page

    nav = json.loads((ROOT / "navigation.json").read_text())
    expected = [page for group in nav["groups"] for page in group["pages"]] + nav.get("reference_pages", [])
    ordered_routes = [route_for(item["path"]) for item in expected]

    for index, item in enumerate(expected):
        file = output_for(item["path"])
        assert file.resolve() in pages, f"Missing route: {item['path']}"
        page = pages[file.resolve()]
        assert page.edit_links == [f"{REPO}/edit/master/{item['path']}"], f"Wrong edit link: {file}"

        expected_prev = BASE + ordered_routes[index - 1] if index > 0 else None
        expected_next = BASE + ordered_routes[index + 1] if index + 1 < len(ordered_routes) else None
        assert page.pager_prev == expected_prev, f"Wrong Previous link: {file}: {page.pager_prev} != {expected_prev}"
        assert page.pager_next == expected_next, f"Wrong Next link: {file}: {page.pager_next} != {expected_next}"

    docs_index = SITE / "docs" / "index.html"
    assert docs_index.is_file(), "Missing /docs/ catalog page"

    for file, page in pages.items():
        for link in page.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            if url.path.startswith("/"):
                assert url.path == BASE or url.path.startswith(BASE + "/"), f"Escaped baseurl: {file}: {link}"
                relative = unquote(url.path.removeprefix(BASE)).lstrip("/")
                target = SITE / relative
            else:
                target = file.parent / unquote(url.path)
            if target.is_dir():
                target /= "index.html"
            assert target.is_file(), f"Broken output link: {file}: {link}"
            if url.fragment and target.resolve() in pages:
                assert unquote(url.fragment) in pages[target.resolve()].ids, f"Broken anchor: {file}: {link}"

    index = json.loads((SITE / "search.json").read_text())
    search_urls = {item["url"] for item in index}
    for route in ordered_routes:
        assert BASE + route in search_urls, f"Missing search entry: {route}"
    assert BASE + "/docs/" in search_urls, "Missing search entry: /docs/"

    print(
        f"Site: {len(pages)} HTML pages; {len(index)} searchable documents; "
        "routes, links, edit links and data-driven pager order OK"
    )


if __name__ == "__main__":
    main()
