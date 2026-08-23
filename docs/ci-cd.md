# CI/CD — s-erp-ui

Implements `jenkins-nb/docs/ci-cd-implementation-plan.md`. This file records what
was measured, what was decided, and what still has to happen.

---

## Pipelines

| Trigger | Pipeline | Deploys? |
|---------|----------|----------|
| PR → `master` | install → lint → typecheck → tests → coverage → Qodana → Semgrep → deps → **AI review** → gate | No |
| Push to `master` | same validation → build image → scan image → push → deploy local → **human approval** → deploy production | Yes |

The production branch is **`master`**, not `main`. Set in `.ci/config.yml`
(`deployment.branch`). Renaming to `main` is worth doing, but it is a separate
change with its own blast radius — do not fold it into this one.

A PR build never enters a stage that binds registry or deploy credentials
(plan §31). That is the entire credential isolation, so do not move a
`withCredentials` block above the `Build image` stage.

---

## ⚠️ Required before the first build

**`bun.lockb` does not include the new devDependencies.** The install stage uses
`--frozen-lockfile` and will fail until you regenerate it:

```bash
bun install          # updates bun.lockb
git add package.json bun.lockb
git commit -m "chore: add lint, typecheck, and test tooling"
```

Verified: `bun install --frozen-lockfile` currently exits with
`lockfile had changes, but lockfile is frozen`. This is the only hard blocker.

---

## What was measured

Run on 2026-08-21 against 311 files, using the ESLint config already in the repo.

| | Errors | Warnings |
|---|---|---|
| Baseline | 4,825 | 10,481 |
| After `eslint --fix` | ~109 | ~1,782 |

**~88% of the backlog is mechanically auto-fixable.** The bulk was
`prettier/prettier` (7,090 — mostly CRLF line endings) and `comma-dangle`
(4,547). Neither had a config: the repo has `.eslintrc.cjs` but had no
`.prettierrc`, so Prettier ran on defaults with `trailingComma: "all"`, directly
contradicting the repo's own `comma-dangle: never`. That is now fixed in
`.prettierrc.json`.

What survives the auto-fix is worth reading — it includes real defects, not
style:

| Rule | Count | Why it matters |
|------|-------|----------------|
| `@typescript-eslint/no-unused-vars` | 835 | Mostly dead code |
| `@typescript-eslint/no-explicit-any` | 797 | Type safety gaps |
| `vue/no-mutating-props` | 7 | **Real bug** — child mutating parent state |
| `vue/require-v-for-key` | 2 | **Real bug** — wrong row after reorder/delete |
| `vue/no-dupe-keys` | 1 | **Real bug** — silently shadowed property |

---

## Gate status and the ramp

Gates are **off** where the evidence says they would fail every PR on day one.
Plan §12 is explicit about this: a gate that blocks everything gets switched
off within a week, and then you have no gate at all.

| Gate | Now | Turn on when |
|------|-----|--------------|
| `lint` | ❌ off | After the `eslint --fix` normalisation commit lands |
| `typecheck` | ❌ off | After `bun run typecheck` is run once and the count is known |
| `test` | ✅ on | On, and now enforcing a real suite — 54 tests, see [Tests](#tests) |
| `coverage` | ❌ off | Measured every build. Ramp 0 → 30 → 50 → 70 as ChatStore and the fetch composables get tests |
| `qodana_critical` | ✅ on | Baselined, so only new critical issues block |
| `semgrep_high` | ✅ on | Security findings block from day one — this is the one gate worth the friction |
| `dependency_high` | ❌ off | After the existing CVE backlog is triaged |
| `ai_critical` | ❌ off | Advisory. Plan §20 — never the only merge protection |

### Turning lint on

```bash
bun run lint:fix                                   # ~88% disappears
bun run lint                                       # review what is left
git commit -am "style: normalise formatting"       # one big, mechanical commit
```

Then set `gates.lint: true` in `.ci/config.yml`. Do the normalisation in its
own PR with no logic changes, so reviewers can skip it safely.

Until then, `commands.lint` runs `.ci/lint-changed.sh`, which lints **only the
files a PR changes** — the new-code policy from plan §12. The debt shrinks with
each PR instead of blocking all of them.

---

## Container

Nuxt is configured `ssr: false`, so the output is a static SPA served by nginx —
no Node runtime in production, and nothing to patch for CVEs it never uses.
Final image: **~102 MB**.

Two things that were wrong and are now fixed, both found by actually running it:

1. **`nuxt build` emits no `index.html`** when `ssr: false` — nitro renders the
   shell at runtime, so nginx served a 403 on `/`. The build command is
   `nuxt generate`, which prerenders the shell.
2. **`read_only: true` with plain tmpfs mounts breaks nginx** — the tmpfs comes
   up root-owned and nginx (uid 101) cannot create `/var/cache/nginx/client_temp`.
   The mounts carry `uid=101,gid=101`.

Verified running: health `healthy`, `/` → 200, `/healthz` → 200, deep client
routes → 200 via SPA fallback, missing assets → 404, hashed assets
`immutable`, `index.html` `no-store`, redirects relative (`absolute_redirect
off`) so nothing leaks the internal port behind Cloudflare.

---

## Tests

The first suite: **54 tests** over the code carrying the most risk, plus the
security properties the PR #6 AI review questioned.

| File | Covers |
|------|--------|
| `utils/security.test.ts` | URL scheme allowlist — `javascript:`, `data:`, `vbscript:`, control-character and whitespace obfuscation, casing |
| `utils/messageTokens.test.ts` | Chat tokenizer — links, @mentions, regex `lastIndex` reuse, and that no dangerous scheme can ever become a `url` token |
| `composables/useMarkdown.test.ts` | That `v-html` on AI output is safe: raw HTML escaped, `javascript:`/`vbscript:` hrefs dropped, `rel="noopener noreferrer"` applied |
| `composables/useAuth.test.ts` | `jwtVerify`, `isTokenExpired`, `permit` (incl. superadmin and array forms) |
| `stores/AuthStore.test.ts` | `refreshAuth`: returns null rather than throwing, and coalesces concurrent callers into one request |

Two of these exist specifically as **regression tests for false positives**. The
AI review flagged the chat page's `v-html` and `:href` as XSS. Neither was
exploitable — markdown-it runs with `html: false`, and the tokenizer only
matches `https?://` — but nothing tested either property, so a later change
could have made the finding true. Now it would go red.

Three real issues were fixed alongside:

- **`jwtVerify` accepted a token with no `exp` claim.** The check was
  `decoded.exp < currentTime`, which is `false` when `exp` is `undefined`, so
  such a token was treated as valid indefinitely. It is now rejected.
- **URL safety was implicit.** `utils/security.ts` makes the scheme allowlist a
  named, tested function, and strips control characters first — `java\tscript:`
  and `&nbsp;javascript:` are stripped by browsers before resolution and would
  defeat a naive `startsWith` check.
- **The tokenizer was untestable**, living inline in a 1,900-line `.vue` file
  several hundred lines from the template that trusted it. It is now
  `utils/messageTokens.ts`.

### Running them

```bash
bun run test              # 54 tests
bun run test:coverage     # + cobertura/lcov for the pipeline
```

---

## Deployment

Production for s-erp-ui **is this host**. A merge to `master` runs Pipeline B,
which builds the image, scans it, pushes it to `ghcr.io/nibroos/s-erp-ui`, and
hands it to `deploy.sh`, which brings the container up behind a health gate and
rolls back automatically if it never answers.

### Ports

| What | Port | Owned by |
|------|------|----------|
| Nuxt dev server (`bun dev`) | 3002 | `PORT` in `.env` |
| **Production container** | **3012** | `deployment.port` in `.ci/config.yml` |

The split is the point: deploying to production must never evict the dev
server. Both run on this box at the same time.

`deployment.port` is the single source of truth. The Jenkinsfile exports it as
`APP_PORT`, which `docker-compose.yml` reads when `deploy.sh` brings the stack
up. `docker-compose.yml` carries a matching `3012` fallback so a by-hand
`docker compose up` outside Jenkins lands on the same port rather than on the
dev server. Change one, change the other.

The `s-erp-ui.nibros.space` Cloudflare tunnel points at the production port.

### Targets

`deployment.targets` drives which deploy stages run. With `[local]` the
`Approve production` and `Deploy — production host` stages are skipped
entirely — there is no second box today. Adding `remote` to that list turns
both back on, along with the manual approval gate; nothing in the pipeline is
hard-coded to one topology.

### Build-time config

`deployment.build_args` supplies the public URLs compiled into the SPA bundle
(`API_URL`, `AUTH_URL`, `IMG_BASE_URL`, `TITLE`). With `ssr: false` these are
baked at **build** time — a running container cannot be re-pointed with an env
var, so changing one means a rebuild.

Everything in that block is readable by any user who loads the app. It is not a
place for secrets.

---

## Files

| File | Purpose |
|------|---------|
| `.ci/config.yml` | The CI contract — commands and gates. Jenkins reads this, not hard-coded steps |
| `.ci/lint-changed.sh` | New-code lint policy |
| `Jenkinsfile` | Both pipelines |
| `Dockerfile` · `docker/nginx.conf` · `.dockerignore` | Static SPA image |
| `docker-compose.yml` | Deploy target definition, consumed by `deploy.sh` |
| `qodana.yaml` · `.semgrepignore` | Analysis scope |
| `vitest.config.ts` | Test harness (no suite yet) |
| `.prettierrc.json` · `.prettierignore` | Formatting, aligned with the existing ESLint rules |

---

## Still to do

- [ ] Regenerate `bun.lockb` (**blocker**)
- [ ] Branch protection on `master`: require `CI / PR Quality Gate` (plan §21) — Jenkins reporting a failure does not prevent a merge on its own
- [x] Write the first tests — 54 of them, over `useAuth`, `AuthStore.refreshAuth`, the markdown renderer and the chat tokenizer
- [ ] Test `stores/supports/ChatStore.ts` (1,290 lines, currently 0% covered) and the fetch composables, then ramp `gates.coverage` back on
- [ ] Fix the 10 real defects listed above
- [ ] Normalisation commit, then enable `lint`
- [x] Set the production deploy port — `deployment.port: 3012` in `.ci/config.yml`, kept clear of the dev server's 3002. `PROD_HOST` is not needed while production is this host (`deployment.targets: [local]`).
- [ ] Baseline Qodana on `master` once, so the gate sees only new issues
