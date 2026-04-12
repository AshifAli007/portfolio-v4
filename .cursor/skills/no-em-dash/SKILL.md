---
name: no-em-dash
description: >-
  Avoids Unicode em dashes (U+2014) in all project text. Use when writing or
  editing copy, comments, UI strings, emails, markdown, or code. Apply whenever
  the user cares about punctuation style or has asked to avoid em dashes.
---

# No em dash (U+2014)

## Rule

**Do not** type or insert the **em dash** character: `—` (Unicode U+2014).

## Use instead

- A **comma** or **period** where a natural pause fits.
- A **colon** before lists or explanations.
- A **hyphen** with spaces: ` - ` for a break in thought (ASCII hyphen-minus, U+002D).
- For **year ranges**, use `2020 - 2024` or `2020 to 2024`, not an em dash.

## Scope

Applies to:

- User-visible strings (React, emails, metadata descriptions).
- Markdown and MDX.
- Comments when they contain prose for humans.

## Exceptions

- **Markdown horizontal rules** use three ASCII hyphens on their own line (`---`). That is not an em dash; keep as usual.
- **Math / code** where `-` is subtraction or part of syntax is unchanged.

## Check

Before finishing edits, search the diff for U+2014 (`—`) and remove it.
