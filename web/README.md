# Medical AI Component Market prototype

A bilingual static market prototype for reusable medical AI plugins, skills, tools, MCP servers, and CLIs.

## What this prototype is

- A high-fidelity review surface built from 20 real, public-safe GitHub records.
- A visual contract for Stable/Candidate provenance, Medical-first discovery, and entry detail pages.
- A static Vercel-ready app with no runtime GitHub requests and no embedded credentials.

It intentionally does not provide live search, downloads, a quality score, verification badges, user accounts, or a runtime API.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/zh`.

## Rebuild the fixture

The repository must have both `origin/main` and `origin/automation/github-medical-collector` available locally.

```bash
npm run data:fixture
```

The generator selects 20 representative records, applies the public field whitelist, records both source SHAs, and writes `src/data/prototype-catalog.json`.

## Verify

```bash
npm run verify
npm run e2e
```

## Preview deployment

After local verification, create a manual Vercel preview without connecting the private GitHub organization repository:

```bash
npx vercel
```

Do not deploy production or add a public domain during the prototype review stage.
