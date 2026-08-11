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
  "assets/projects/moderation-api-result.png",
  "assets/social-preview.png",
  "assets/transcript/transcript.pdf"
];
const flattenedTranscript = {
  bytes: 955635,
  sha256: "f37e0cc24c86ecb093e92a1671a5cbb27d5381119f8e425d0b48ab8db71d04d3"
};
const approvedModerationResult = {
  bytes: 288079,
  sha256: "1e477125ed4533e364f25ec198536defd005826a6b1ece3d42a341a91e8347d2"
};

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

test("Objexify result screenshot is the approved real test capture", () => {
  const path = join(
    publicRoot,
    "assets/projects/moderation-api-result.png"
  );
  const contents = readFileSync(path);

  assert.equal(contents.length, approvedModerationResult.bytes);
  assert.equal(sha256(path), approvedModerationResult.sha256);
});

test("Transcript is the approved single-page flattened PDF", () => {
  const path = join(publicRoot, "assets/transcript/transcript.pdf");
  const contents = readFileSync(path);

  assert.equal(contents.length, flattenedTranscript.bytes);
  assert.equal(sha256(path), flattenedTranscript.sha256);
});

test("removed StockFlow asset is absent from source and build", () => {
  const removed = "assets/projects/stockflow-dashboard.png";
  assert.equal(existsSync(join(publicRoot, removed)), false);
  assert.equal(existsSync(join(distRoot, removed)), false);
});

test("removed Resume assets are absent from source and build", () => {
  for (const removed of [
    "assets/resume/resume.pdf",
    "assets/resume/.gitkeep"
  ]) {
    assert.equal(existsSync(join(publicRoot, removed)), false);
    assert.equal(existsSync(join(distRoot, removed)), false);
  }
});

test("the removed certificate feature leaves no public directory", () => {
  assert.equal(existsSync(join(publicRoot, "assets/certificates")), false);
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
