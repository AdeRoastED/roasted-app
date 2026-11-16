#!/usr/bin/env python3
"""
translation_guard.py — standalone snapshot/diff tool for RoastED's translation data.

NOT part of the running app. Does not get loaded by index.html/app.js/sw.js.
Never modifies data/*.js. Only reads them.

It protects native-speaker-approved translation content from accidental
overwriting during future AI-assisted edits, by keeping a separate baseline
snapshot (tools/translation_baseline.json) and letting you diff the current
data files against it before trusting any change.

IMPORTANT: the baseline is a REFERENCE POINT, not a correctness guarantee.
Taking a baseline does not mean the translations in it are confirmed correct
by a native speaker — it only means "this is what the files looked like when
the baseline was last approved." Native-speaker review is a separate process.

Usage (run from the project root, e.g. /home/claude/roasted-app):
  python3 tools/translation_guard.py baseline     # create the FIRST baseline (refuses if one exists)
  python3 tools/translation_guard.py diff          # compare current files against the baseline
  python3 tools/translation_guard.py approve        # explicitly replace the baseline with current state
  python3 tools/translation_guard.py approve --yes   # same, without the confirmation prompt

No third-party dependencies — standard library only.
"""
import json
import os
import re
import sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
BASELINE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "translation_baseline.json")

DATA_FILES = ["it", "en", "fr", "de", "th", "af"]


def load_lang_file(lang):
    path = os.path.join(DATA_DIR, f"{lang}.js")
    with open(path, encoding="utf-8") as f:
        txt = f.read()
    m = re.match(r'^window\.RE=window\.RE\|\|\{\};RE\["' + lang + r'"\]=(\{.*\});\s*$', txt, re.S)
    if not m:
        raise RuntimeError(f"Could not parse {path} — unexpected file format, refusing to continue.")
    return json.loads(m.group(1))


def load_all_current():
    """Returns {lang: parsed_RE_object}."""
    out = {}
    for lang in DATA_FILES:
        out[lang] = load_lang_file(lang)
    return out


def flatten(all_data):
    """
    Flatten into {(lang, topic, native_sentence, target_lang): value_dict}
    native_sentence (the 's' field) is used as the entry identifier because
    it's stable across reordering/insertion, unlike array index.
    """
    flat = {}
    for lang, topics in all_data.items():
        for topic, entries in topics.items():
            if not isinstance(entries, list):
                continue
            for e in entries:
                s = e.get("s", "")
                for tgt, val in e.get("t", {}).items():
                    key = (lang, topic, s, tgt)
                    if key in flat:
                        # duplicate native sentence within the same topic/lang — note it, don't crash
                        key = (lang, topic, s + "  [dup]", tgt)
                    flat[key] = val
    return flat


def make_snapshot():
    data = load_all_current()
    return {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "note": "Reference baseline only — NOT a correctness guarantee. Native-speaker review is separate.",
        "data": data,
    }


def cmd_baseline():
    if os.path.exists(BASELINE_PATH):
        print(f"A baseline already exists at {BASELINE_PATH}.")
        print("Refusing to overwrite it. Use 'approve' if you really want to replace it.")
        sys.exit(1)
    snap = make_snapshot()
    with open(BASELINE_PATH, "w", encoding="utf-8") as f:
        json.dump(snap, f, ensure_ascii=False, indent=1)
    print(f"Baseline created at {BASELINE_PATH} ({snap['created_at']}).")
    print("Reminder: this is a reference point, not a correctness guarantee.")


def cmd_approve(auto_yes):
    existing_note = ""
    if os.path.exists(BASELINE_PATH):
        with open(BASELINE_PATH, encoding="utf-8") as f:
            old = json.load(f)
        existing_note = f" (current baseline was created {old.get('created_at', 'unknown')})"
    if not auto_yes:
        print(f"This will replace the approved baseline{existing_note}.")
        ans = input("Type 'yes' to confirm: ").strip().lower()
        if ans != "yes":
            print("Cancelled. Baseline not changed.")
            sys.exit(1)
    snap = make_snapshot()
    with open(BASELINE_PATH, "w", encoding="utf-8") as f:
        json.dump(snap, f, ensure_ascii=False, indent=1)
    print(f"Baseline approved and replaced ({snap['created_at']}).")


def cmd_diff():
    if not os.path.exists(BASELINE_PATH):
        print("No baseline found yet. Run: python3 tools/translation_guard.py baseline")
        sys.exit(1)
    with open(BASELINE_PATH, encoding="utf-8") as f:
        baseline = json.load(f)
    current = load_all_current()

    old_flat = flatten(baseline["data"])
    new_flat = flatten(current)

    old_keys = set(old_flat.keys())
    new_keys = set(new_flat.keys())

    added = sorted(new_keys - old_keys)
    removed = sorted(old_keys - new_keys)
    common = old_keys & new_keys
    modified = sorted(k for k in common if old_flat[k] != new_flat[k])

    def fmt_key(k):
        lang, topic, s, tgt = k
        return f"[{lang}.{topic}] \"{s}\" -> {tgt}"

    print(f"Baseline created: {baseline.get('created_at', 'unknown')}")
    print(f"Comparing against current files in {DATA_DIR}\n")

    if not added and not removed and not modified:
        print("No differences found. Current files match the approved baseline exactly.")
        return

    if added:
        print(f"=== ADDED ({len(added)}) ===")
        for k in added:
            print(fmt_key(k))
            print("  new:", json.dumps(new_flat[k], ensure_ascii=False))
        print()

    if removed:
        print(f"=== REMOVED ({len(removed)}) ===")
        for k in removed:
            print(fmt_key(k))
            print("  old:", json.dumps(old_flat[k], ensure_ascii=False))
        print()

    if modified:
        print(f"=== MODIFIED ({len(modified)}) ===")
        for k in modified:
            print(fmt_key(k))
            print("  old:", json.dumps(old_flat[k], ensure_ascii=False))
            print("  new:", json.dumps(new_flat[k], ensure_ascii=False))
        print()

    print(f"Total: {len(added)} added, {len(removed)} removed, {len(modified)} modified.")
    print("Nothing was changed on disk. If these changes are intentional and reviewed,")
    print("run: python3 tools/translation_guard.py approve")


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        sys.exit(1)
    cmd = args[0]
    if cmd == "baseline":
        cmd_baseline()
    elif cmd == "diff":
        cmd_diff()
    elif cmd == "approve":
        cmd_approve(auto_yes="--yes" in args)
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
