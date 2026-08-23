#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Lint only what this branch changed — the "new code" quality policy from
# plan §12.
#
# Why: this repository carries ~1,900 pre-existing lint problems. Gating on the
# whole repo would fail every PR from day one, and the gate would be switched
# off within a week. Gating on changed files means the debt shrinks with every
# PR instead of blocking all of them.
#
# Errors block. Warnings are printed but do not fail, until the backlog of
# no-explicit-any / no-unused-vars is worked down — see docs/ci-cd.md.
# ─────────────────────────────────────────────────────────────────────────────
set -Eeuo pipefail

BASE="${CHANGE_TARGET:-${CI_DIFF_BASE:-}}"
ESLINT="node_modules/.bin/eslint"

[ -x "$ESLINT" ] || { echo "eslint not installed — run the install stage first" >&2; exit 1; }

if [ -z "$BASE" ]; then
  echo "No base branch (CHANGE_TARGET unset) — linting changed files vs HEAD~1"
  RANGE="HEAD~1...HEAD"
else
  git fetch --no-tags --depth=50 origin "$BASE" 2>/dev/null || true
  RANGE="origin/${BASE}...HEAD"
fi

# --diff-filter=ACMR: added, copied, modified, renamed. Deleted files cannot be
# linted, and including them makes eslint exit non-zero on a missing path.
mapfile -t FILES < <(
  git diff --name-only --diff-filter=ACMR "$RANGE" -- \
    '*.js' '*.ts' '*.vue' 2>/dev/null \
  | grep -vE '^(node_modules|\.nuxt|\.output|dist)/' || true
)

if [ "${#FILES[@]}" -eq 0 ]; then
  echo "No lintable files changed in $RANGE — nothing to check."
  exit 0
fi

echo "Linting ${#FILES[@]} changed file(s) against $RANGE:"
printf '  %s\n' "${FILES[@]}"
echo

# Errors fail the build; warnings are reported. Tighten by lowering
# --max-warnings once the backlog is down. Do not remove the flag entirely
# without checking the current count first.
exec "$ESLINT" "${FILES[@]}" --max-warnings=9999
