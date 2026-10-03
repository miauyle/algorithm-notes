"""Validate the canonical navigation catalog against the algorithm note sources."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]


def frontmatter_value(path: Path, key: str):
    text = path.read_text()
    if not text.startswith("---\n"):
        return None
    end = text.find("\n---", 4)
    if end < 0:
        return None
    match = re.search(rf"^{re.escape(key)}:\s*(.+?)\s*$", text[4:end], re.M)
    return match.group(1).strip().strip('"').strip("'") if match else None


def main():
    errors = []
    try:
        nav = json.loads((ROOT / "navigation.json").read_text())
    except (OSError, ValueError) as exc:
        raise SystemExit(f"navigation.json: {exc}")

    if nav.get("schema_version") != 1:
        errors.append("navigation.json: unsupported schema version")

    groups = nav.get("groups", [])
    group_ids, page_ids, paths = set(), set(), set()
    pages = []

    for group in groups:
        group_id = group.get("id")
        if not group_id or group_id in group_ids:
            errors.append(f"navigation.json: missing or duplicate group ID {group_id}")
        group_ids.add(group_id)
        if not group.get("title") or not group.get("pages"):
            errors.append(f"navigation.json: empty group {group_id}")
        for page in group.get("pages", []):
            page_id = page.get("id")
            source = page.get("path", "")
            if not page_id or page_id in page_ids:
                errors.append(f"navigation.json: missing or duplicate page ID {page_id}")
            if not source or source in paths:
                errors.append(f"navigation.json: missing or duplicate path {source}")
            page_ids.add(page_id)
            paths.add(source)
            pages.append(page)

            target = (ROOT / source).resolve()
            if not target.is_relative_to(ROOT) or not target.is_file():
                errors.append(f"navigation.json: invalid file {source}")
                continue

            title = frontmatter_value(target, "title")
            category = frontmatter_value(target, "category")
            if page.get("title") != title:
                errors.append(f"navigation.json: title mismatch for {source}: {page.get('title')} != {title}")
            if category != group.get("title"):
                errors.append(f"navigation.json: category mismatch for {source}: {category} != {group.get('title')}")
            if not page.get("summary"):
                errors.append(f"navigation.json: missing summary for {source}")

    for page in nav.get("reference_pages", []):
        pages.append(page)
        source = page.get("path", "")
        if not source or source in paths:
            errors.append(f"navigation.json: missing or duplicate reference path {source}")
        paths.add(source)

    maintained = {
        str(path.relative_to(ROOT))
        for path in (ROOT / "_docs").glob("*.md")
        if path.name != "index.md"
    }
    catalog = {page.get("path") for page in pages}
    if maintained != catalog:
        errors.append(f"navigation.json: document coverage mismatch {sorted(maintained ^ catalog)}")

    for stale in (ROOT / "_data" / "navigation.yml", ROOT / "_data" / "knowledge_map.yml"):
        if stale.exists():
            errors.append(f"{stale.relative_to(ROOT)}: stale duplicate navigation source")

    if errors:
        print("\n".join(errors))
        raise SystemExit(1)

    print(f"Navigation groups: {len(groups)}; catalog pages: {len(pages)}")
    print("navigation.json is the single source for sidebar and knowledge-map ordering.")


if __name__ == "__main__":
    main()
