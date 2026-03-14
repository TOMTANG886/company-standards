# Versioning Policy

Specs use semver `MAJOR.MINOR.PATCH`.

| Change | Bump |
|--------|------|
| Typo, formatting, clarification (no meaning change) | PATCH |
| New section, additive non-breaking change | MINOR |
| Breaking change to scope, interface, or acceptance criteria | MAJOR |
| Deprecation | MINOR or MAJOR |

## Deprecation

1. Set `status: deprecated`, bump version, update `updated`
2. Add at top of spec body:
   ```
   > **Deprecated as of `<version>` (`<date>`).** Superseded by `<new-spec-id>`.
   ```
3. Retain for 2 release cycles, then move to `specs/_archived/`
