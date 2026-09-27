# AGENTS.md

## Purpose

This repository is a Chinese, pattern-oriented algorithm interview notebook. It is designed to restore the ability to analyze, explain, and code common interview problems quickly rather than to be an encyclopedic algorithms textbook.

The current notebook contains 147 problems and uses Java as the main language. Existing prose targets common Java 8 syntax; compilation checks may use Java 17.

## Source of truth and structure

Read nearby content before editing.

- `README.md` — repository overview, current problem count, recommended first-pass set, and chapter map.
- `_docs/introduction.md` — reading method, interview presentation, code conventions, and validation scope.
- `_docs/01-*.md` through `_docs/13-*.md` — problem chapters grouped by pattern.
- `_docs/appendices.md` — coverage list, revisions, review guidance, and validation records.
- `_config.yml` — Jekyll/DocSteer configuration.

Keep the notebook organized by reusable problem-solving patterns. Do not turn it into a chronological LeetCode diary or a list of isolated memorized answers.

## Problem-writing template

When adding or substantially rewriting a problem, keep the surrounding chapter's style and cover the useful interview chain:

1. concise problem statement/constraint summary;
2. reasoning from a direct approach to the chosen solution;
3. the property or invariant being exploited;
4. a small worked example;
5. correctness key or invariant;
6. important boundary cases;
7. time and auxiliary-space complexity;
8. a clean Java implementation;
9. alternatives only when they teach a meaningful trade-off.

The preferred primary solution is the one that is easy to explain and implement correctly under interview pressure. Do not replace a stable solution with a cleverer one merely because it is theoretically more advanced.

## Java conventions

- Treat each problem's code as an independent submission. Do not try to combine all `Solution` classes into one source file.
- Use normal interview/LeetCode-style Java. Add or assume `import java.util.*;` where the surrounding format expects it.
- Do not add a package declaration.
- `ListNode`, `TreeNode`, problem-specific `Node`, and APIs such as `rand7()` are platform-provided when the problem says so.
- Do not mix incompatible `Node` definitions between problems.
- State recursive-stack space as auxiliary space. Distinguish auxiliary space from returned output space.
- Hash-table operations described as O(1) should be understood as average-case unless a stronger guarantee is actually required.
- Preserve original problem constraints instead of silently inventing a general-purpose API contract.

If code is changed, verify the exact snippet or a faithful harness when practical. Never expand the validation record to claim a test or LeetCode submission that was not actually performed.

## Count and index consistency

The repository currently states that it contains 147 problems.

If a problem is added, removed, merged, or split, search the repository for dependent counts and coverage lists. Update all affected reader-facing places together, especially:

- `README.md`;
- `_docs/introduction.md`;
- `_docs/appendices.md`;
- chapter/index/navigation data that enumerates problems.

Do not change the recommended first-pass set or A/B/C priority labels merely because a new problem was added. Those are review recommendations, not automatic frequency rankings.

Preserve older Offer-style names where they intentionally map back to the original notes.

## Interview orientation

A good solution should support this spoken sequence:

- clarify the input/output and constraints;
- give a correct direct approach;
- identify repeated work or exploitable structure;
- define pointers/state/recursion meaning and invariants;
- code the stable solution;
- walk through a normal example and a boundary case;
- state complexity;
- discuss a faster or alternative method only when useful.

Avoid explanations that reduce the reasoning to “this is a sliding-window/DP/greedy problem.” Explain why the pattern applies.

## Jekyll / DocSteer conventions

The site uses Jekyll with the DocSteer theme.

- Collection pages live under `_docs/`.
- New pages should use front matter consistent with neighboring files, normally including `title`, `category`, and `description`.
- Preserve the GitHub Pages project base path `/algorithm-notes`.
- Keep links valid both for the intended rendered site and, where applicable, GitHub repository reading. Follow the link style already used in the surrounding file.
- Do not add hand-written “previous / next / contents” controls to article bodies. Page navigation is handled by DocSteer and the repository's footer override.
- Preserve `docsteer.edit_page.path: ""` unless the collection layout changes; collection document paths already include `_docs/`.
- Do not re-enable the DocSteer footer credit unless explicitly requested.
- Avoid changing theme/config files for a content-only task.

When renaming or moving a page, update incoming links and navigation references rather than leaving redirects or duplicate copies unless explicitly required.

## Validation

For site/content changes, run:

```bash
bundle exec jekyll build --baseurl /algorithm-notes
```

The GitHub Pages workflow also validates generated “Edit this page” links after the build.

For Java solution changes, perform targeted compilation/runtime checks appropriate to the modified problems when practical. Use platform stubs for `ListNode`, `TreeNode`, `Node`, or other supplied APIs as needed.

If a validation step was not run, state that explicitly. Do not claim that all 147 problems were revalidated after a local change unless that actually happened.

## Change discipline

- Make focused edits; do not restyle unrelated chapters.
- Preserve the chapter taxonomy unless the task is specifically a structural reorganization.
- Keep problem links pointing to the intended problem page and summarize copyrighted statements rather than copying full problem text.
- Before changing a shared convention, search other chapters so the repository remains internally consistent.
- Favor correctness, teachability, and interview stability over novelty.
