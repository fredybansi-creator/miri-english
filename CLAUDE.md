# Miri English – instructions for Claude

Read **PROJECT.md** first: it has the goals, Freddy's preferences, the current state, infrastructure
and the open tasks.

- Talk to Freddy in simple English (he is German; short, clear explanations). App UI text is German.
- Plain HTML/CSS/JS, no build step. Content lives in `content/m*.js`.
- After changing lesson sentences: run `tools/.venv/Scripts/python tools/make_audio.py`, commit `audio/`.
- Edge Functions are deployed via the Supabase MCP tools (project `aagbnrcsprmhcwllfmcn`);
  keep `supabase/functions/*/index.ts` in the repo in sync with what is deployed.
- Never put API keys in the repo or in chat; Freddy sets secrets in the Supabase dashboard.
- Test at iPhone size in the preview browser; clean up test data afterwards (see PROJECT.md).
- Commit messages end with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
