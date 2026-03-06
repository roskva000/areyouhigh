# Content Editor Flow: Preview + Publish

## Goal
Make editors safely iterate on experience content before it reaches production.

## Content model (new schema)
Each experience record is organized as:
- `metadata`: editorial fields (`id`, `title`, `description`, `category`, `order`)
- `visuals`: presentation fields (`background`, `accent`, `thumbnail`, optional `mode`)
- `tuningParams`: runtime shader mapping (`masterGroup`, numeric `params`)
- `workflow`: lifecycle status (`draft`, `in_review`, `published`)

## Recommended flow
1. **Edit as Draft**
   - Editors update JSON/DB/CMS entries with `workflow.status = "draft"`.
   - CI runs `npm run validate:content` to catch invalid IDs, master groups, thumbnails, and params.

2. **Preview Build**
   - Build with preview source and optional status filter:
     - `VITE_EXPERIENCE_SOURCE=json` for JSON snapshots
     - `VITE_EXPERIENCE_SOURCE=db` for DB export snapshots
     - `VITE_EXPERIENCE_SOURCE=cms` for CMS export snapshots
   - Optional: expose a preview route that shows `draft + in_review + published` entries only to internal users.

3. **Review + Sign-off**
   - Reviewer checks copy, thumbnail, shader behavior, and category consistency.
   - Reviewer updates `workflow.status` to `in_review` then `published`.

4. **Publish**
   - Merge/release only when validation passes and status is `published`.
   - Production build consumes only published entries (recommended filter in content loader or CI export step).

## Ops notes
- Keep JSON as source-of-truth fallback for local development.
- For DB/CMS integrations, export a build-time snapshot into schema-compatible JSON.
- Track content changes in changelog/PR templates for editorial auditability.
