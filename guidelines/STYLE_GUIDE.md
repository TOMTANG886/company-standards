# Style Guide

## Writing

- Present tense, active voice
- Define acronyms on first use
- Avoid weasel words in acceptance criteria — use "must", never "should/might/could"

## Acceptance criteria

Use _Given / When / Then_ or a direct measurable assertion.

| Avoid | Replace with |
|-------|-------------|
| fast, performant | specific latency/throughput target |
| intuitive | specific usability criteria |
| scalable | specific load target |
| should | must |

## Frontmatter conventions

| Field | Format / rule |
|-------|--------------|
| `id` | `{project}/{###-name}` — matches directory path |
| `created` / `updated` | `YYYY-MM-DD`; `created` is immutable after first commit |
| `authors` | `[@handle]`; list contributors, not reviewers |
| `tags` | lowercase hyphen-separated; reuse existing tags before adding new ones |
| `version` | `0.1.0` for new drafts; bump to `1.0.0` on first `active` merge |
