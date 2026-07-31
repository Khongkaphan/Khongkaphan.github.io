import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const workflowsUrl = new URL(
  "../.github/workflows/",
  import.meta.url,
);

test("GitHub Pages deploys only through the complete check", async () => {
  const workflowNames = await readdir(workflowsUrl);
  const workflows = await Promise.all(
    workflowNames
      .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
      .map(async (name) => ({
        name,
        content: await readFile(new URL(name, workflowsUrl), "utf8"),
      })),
  );
  const deployWorkflows = workflows.filter(({ content }) =>
    /actions\/deploy-pages@/.test(content),
  );

  assert.deepEqual(
    deployWorkflows.map(({ name }) => name),
    ["deploy-pages.yml"],
  );

  const [{ content: workflow }] = deployWorkflows;

  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /playwright install --with-deps chromium/);
  assert.match(workflow, /npm run check/);
  assert.match(workflow, /path:\s*\.\/dist/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.ok(
    workflow.indexOf("npm run check") <
      workflow.indexOf("actions/upload-pages-artifact@v3"),
  );
  assert.ok(
    workflow.indexOf("npm run check") < workflow.indexOf("actions/deploy-pages@v4"),
  );
});
