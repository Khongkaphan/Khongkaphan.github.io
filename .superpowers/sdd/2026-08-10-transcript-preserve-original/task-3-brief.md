### Task 3: Full Verification Before Final Review

**Files:**
- Verify only: all tracked files from Tasks 1 and 2

**Interfaces:**
- Consumes: verified local `main` commits.
- Produces: a fully verified feature branch ready for the required final whole-branch review.

- [ ] **Step 1: Run the complete fresh verification suite**

```powershell
npm run check
```

Expected: 10 Node tests pass, Vite production build succeeds, 6 asset tests pass, and 22 Playwright tests pass with zero failures.

- [ ] **Step 2: Inspect the exact tracked diff and working-tree boundaries**

```powershell
git status --short --branch
git log --oneline origin/main..HEAD
git diff --check origin/main..HEAD
```

Expected: only the approved design/plan, link-contract, test, README, and Transcript asset commits are included in the `origin/main..HEAD` feature range; the ignored SDD workspace and permitted untracked `tmp/` may remain uncommitted, while tracked working-tree files remain unchanged.

- [ ] **Step 3: Record verification evidence for final review**

```powershell
git rev-parse HEAD
git status --short --branch
```

Expected: the feature branch has no tracked working-tree changes and its HEAD identifies the exact revision covered by `npm run check`.

## Post-SDD Integration and Publication

After all three tasks pass their scoped reviews and the final whole-branch
review is clean:

1. Use `superpowers:finishing-a-development-branch`.
2. Merge `codex/transcript-original` into local `main`.
3. Run `npm run check` again from the exact merged `main` revision.
4. Push `main` to `origin` only after the merged verification passes.
5. Wait for the GitHub Pages workflow to complete.
6. Verify the published PDF hash and page-3 link using the checks below.

### Published-Site Checks

After the GitHub Pages workflow completes, run:

```powershell
$online = Join-Path $env:TEMP 'portfolio-transcript-online.pdf'
Invoke-WebRequest -UseBasicParsing `
  -Uri 'https://khongkaphan.github.io/assets/transcript/transcript.pdf?integrity=20260810' `
  -OutFile $online
(Get-FileHash -Algorithm SHA256 -LiteralPath $online).Hash
```

Expected: `3F6C0ED68EE478D3D4FA1B55DE61CB642813ACD274B9A03DCAE908829536C1B7`.

Open `https://khongkaphan.github.io/`, activate `Transcript`, and verify the new tab URL ends with `/assets/transcript/transcript.pdf#page=3` and initially displays page 3 with the original signature appearance.
