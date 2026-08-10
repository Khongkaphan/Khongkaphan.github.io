import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "node:fs";
import { extname, join, relative, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const publicRoot = join(projectRoot, "public");
const distRoot = join(projectRoot, "dist");
const passthroughAssets = [
  "assets/avatar.jpg",
  "assets/projects/moderation-api.png",
  "assets/social-preview.png",
  "assets/resume/resume.pdf",
  "assets/transcript/transcript.pdf"
];

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(path) : [path];
  });
}

test("project assets are delivered byte-for-byte through Vite public passthrough", () => {
  for (const asset of passthroughAssets) {
    const source = join(publicRoot, asset);
    const output = join(distRoot, asset);

    assert.ok(
      existsSync(source),
      `${asset} must be stored under public/ so JS-only future URLs are deployable`
    );
    assert.ok(existsSync(output), `${asset} must be present in the production build`);
    assert.equal(
      sha256(output),
      sha256(source),
      `${asset} must pass through without transformation`
    );
  }
});

test("removed StockFlow asset is absent from source and build", () => {
  const removed = "assets/projects/stockflow-dashboard.png";
  assert.equal(existsSync(join(publicRoot, removed)), false);
  assert.equal(existsSync(join(distRoot, removed)), false);
});

test("future Resume public directory remains tracked", () => {
  const marker = "assets/resume/.gitkeep";
  assert.ok(
    existsSync(join(publicRoot, marker)),
    `public/${marker} must exist`
  );
  assert.equal(
    existsSync(join(publicRoot, "assets/certificates")),
    false,
    "the removed certificate feature must not leave a public directory"
  );
});

test("every absolute production asset reference resolves inside dist", () => {
  assert.ok(existsSync(distRoot), "run npm run build before the asset scan");

  const textFiles = walkFiles(distRoot).filter((path) =>
    [".css", ".html", ".js"].includes(extname(path))
  );
  const references = new Set();

  for (const path of textFiles) {
    const contents = readFileSync(path, "utf8");
    for (const match of contents.matchAll(
      /["'(]\/(assets\/[A-Za-z0-9._/-]+)/g
    )) {
      references.add(match[1]);
    }
  }

  assert.ok(references.size > 0, "the production build must contain asset URLs");
  for (const asset of references) {
    const target = join(distRoot, asset);
    assert.ok(
      existsSync(target) && statSync(target).isFile(),
      `/${asset} referenced by production output must resolve (scanned from ${
        textFiles.map((path) => relative(distRoot, path)).join(", ")
      })`
    );
  }
});
