import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const appDirs = ["apps/web", "apps/admin"];
const ignoredDirs = new Set([".next", ".turbo", "node_modules", "public"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        yield* walk(path.join(dir, entry.name));
      }
      continue;
    }

    if (/\.(ts|tsx|json)$/.test(entry.name)) {
      yield path.join(dir, entry.name);
    }
  }
}

test("frontend apps do not import Supabase clients directly", async () => {
  const offenders = [];

  for (const appDir of appDirs) {
    for await (const file of walk(path.join(root, appDir))) {
      const source = await readFile(file, "utf8");
      if (source.includes("@supabase/supabase-js")) {
        offenders.push(path.relative(root, file));
      }
    }
  }

  assert.deepEqual(offenders, []);
});

test("frontend source does not hardcode the backend API origin", async () => {
  const offenders = [];

  for (const appDir of appDirs) {
    for await (const file of walk(path.join(root, appDir))) {
      const source = await readFile(file, "utf8");
      if (source.includes("dev-blog-backend-production.up.railway.app")) {
        offenders.push(path.relative(root, file));
      }
    }
  }

  assert.deepEqual(offenders, []);
});
