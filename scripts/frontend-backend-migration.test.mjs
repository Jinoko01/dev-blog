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

test("articles page preloads initial article data for ISR", async () => {
  const pageSource = await readFile(
    path.join(root, "apps/web/src/app/articles/page.tsx"),
    "utf8",
  );
  const clientSource = await readFile(
    path.join(root, "apps/web/src/components/articles-client.tsx"),
    "utf8",
  );

  assert.match(
    pageSource,
    /import \{ getArticles, getTags \} from "@\/lib\/api";/,
  );
  assert.match(
    pageSource,
    /getArticles\(\{\s*sort: "latest",\s*page: 1,?\s*\}\)/s,
  );
  assert.match(pageSource, /initialArticles=\{initialArticles\}/);
  assert.match(pageSource, /initialTotalCount=\{articlesData\.count\}/);
  assert.match(clientSource, /initialArticles/);
  assert.doesNotMatch(clientSource, /useState<Article\[\]>\(\[\]\)/);
});

test("getArticles uses the same ISR revalidation window as getTags", async () => {
  const apiSource = await readFile(
    path.join(root, "apps/web/src/lib/api.ts"),
    "utf8",
  );

  assert.match(
    apiSource,
    /`\/api\/articles\$\{suffix\}`,\s*\{\s*next: \{\s*revalidate: 60\s*\},\s*\}/s,
  );
});
