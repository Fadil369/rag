# Repository Guidelines

This repository hosts the BrainSAIT RAG demo assets under `files/`. The goal of this document is to keep contributions focused, compliant, and easy to verify before merging.

## Project Structure & Module Organization
- `files/demo.html` is the single-page entrypoint and reference for browser behavior.
- `files/app.js`, `files/app-complete.js`, and `files/services.js` contain the JavaScript implementation (ES modules only) that wires UI controls, AI provider clients, and document upload logic.
- Supporting documentation lives in `files/README.md`, `files/DEPLOYMENT.md`, and `files/PROJECT_SUMMARY.md`. Treat `files/` as the workspace: edits go directly into its files.
- Static assets (icons, localization strings, etc.) are bundled within the same directory alongside any new HTML/CSS/JS files, keeping the demo self-contained.

## Build, Test, and Development Commands
- `open files/demo.html` – launches the demo as a local file so you can validate accidental changes without a web server.
- `python -m http.server 8000` – serves `files/` over HTTP for browsers that require CORS; browse to `http://localhost:8000/demo.html`.
- `npx serve files` – alternative Node-based static server that respects ES modules and directory structure.
- `npm run lint` (if added later) would be the place for formatting checks; currently no package scripts are defined so changes are verified through browser smoke-testing only.

## Coding Style & Naming Conventions
- Follow the BrainSAIT style notes from `files/README.md`: clear bilingual labels, HIPAA-aware comments, and glass-morphism naming language.
- JavaScript files prefer 2-space indentation, modern ES module syntax, and descriptive camelCase for functions (`initProviders`, `renderMessageList`).
- Any new configuration objects should reuse existing `providers` naming patterns and keep comments in English, with Arabic translations only when user-facing.
- Keep asset filenames lowercase-with-hyphens and place new modules alongside related functionality within `files/`.

## Testing Guidelines
- There are no automated tests; use manual regression by running the demo locally in Chrome/Firefox/Safari and exercising core flows (API key entry, document upload, bilingual query, and TTS playback).
- For each change, note in PR description which provider(s) you verified and highlight any browser-specific behavior.
- Name any manually added test helpers clearly (`demoSmokeTest.md`, `manual-tps-check.js`) and document their steps in `files/README.md`.

## Commit & Pull Request Guidelines
- Follow the repository’s past commits (e.g., `chore: stabilize analytics typings`) by using Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, etc.) to keep history searchable.
- Each pull request should include a brief summary, linked issue or ticket (if available), testing steps performed, and any relevant screenshots for UI work.
- Tag reviewers in the PR description, call out any manual validation still required, and note any outstanding security considerations (e.g., API key handling).

## Security & Configuration Tips
- Never commit API keys; they are initialized at runtime via the settings panel and stored in the browser’s `localStorage`.
- When adding new providers or services, include clear instructions for encryption expectations and PDPL compliance in `files/README.md`.
