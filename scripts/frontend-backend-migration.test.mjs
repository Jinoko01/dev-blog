import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { test } from "node:test";

const root = process.cwd();
const appDirs = ["apps/web", "apps/admin"];
const ignoredDirs = new Set([".next", ".turbo", "node_modules", "public"]);
const require = createRequire(
  new URL("../apps/web/package.json", import.meta.url),
);
const ts = require("typescript");

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

test("articles page preloads initial article data from the server cache", async () => {
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
    /import \{ getArticles, getTags \} from "@\/lib\/api.server";/,
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

test("getArticles encodes filters and maps the backend response", async (t) => {
  const apiSource = await readFile(
    path.join(root, "apps/web/src/lib/api.ts"),
    "utf8",
  );

  const { outputText } = ts.transpileModule(apiSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  });
  const api = await import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
  const fetchMock = t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: [
        {
          id: "article-1",
          title: "Cache Components",
          slug: "cache-components",
          created_at: "2026-08-30T00:00:00Z",
          thumbnail_url: "/cache.png",
        },
      ],
      count: 1,
    }),
  );

  const result = await api.getArticles({
    search: "cache & suspense",
    tag: "Next.js",
    sort: "latest",
    page: 2,
  });
  const [requestUrl] = fetchMock.mock.calls[0].arguments;
  const url = new URL(requestUrl);
  assert.equal(url.pathname, "/api/articles");
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    search: "cache & suspense",
    tag: "Next.js",
    sort: "latest",
    page: "2",
  });
  assert.deepEqual(result, {
    data: [
      {
        id: "article-1",
        title: "Cache Components",
        slug: "cache-components",
        createdAt: "2026-08-30T00:00:00Z",
        thumbnailUrl: "/cache.png",
        description: "",
        views: 0,
        likes: 0,
        tags: [],
      },
    ],
    count: 1,
  });

  fetchMock.mock.mockImplementation(
    async () => new Response(null, { status: 503 }),
  );
  await assert.rejects(api.getArticles({}), { name: "ApiError", status: 503 });
});
