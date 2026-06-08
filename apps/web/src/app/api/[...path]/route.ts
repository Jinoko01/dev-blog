import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

/** body 없는 상태 코드 */
const NO_BODY_STATUSES = new Set([204, 205, 304]);

/** 경로에 따라 fetch 태그를 결정한다 */
function resolveTag(segments: string[]): string | null {
  if (segments[0] === "posts") {
    if (segments.length === 1) return "posts";
    const slug = segments[1];
    return `post-${slug}`;
  }
  if (segments[0] === "algorithms") {
    if (segments.length === 1) return "algorithms";
    return `algorithm-${segments[1]}`;
  }
  if (segments[0] === "articles") return "articles";
  if (segments[0] === "tags") return "tags";
  if (segments[0] === "stats") return "stats";
  return null;
}

function buildBackendUrl(segments: string[], search: string): string {
  return `${BACKEND_URL}/api/${segments.join("/")}${search}`;
}

/**
 * 백엔드 응답을 그대로 프록시한다.
 * - 204/205/304: body 없이 상태 코드만 반환
 * - 그 외: text()로 읽어 Content-Type과 status를 원본 그대로 보존
 *   (비-JSON 응답이나 빈 body에서 res.json()이 throw되는 것을 방지)
 */
async function proxyResponse(res: Response): Promise<NextResponse> {
  if (NO_BODY_STATUSES.has(res.status)) {
    return new NextResponse(null, { status: res.status });
  }
  const text = await res.text();
  const contentType = res.headers.get("content-type") ?? "application/json";
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": contentType },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const tag = resolveTag(path);
  const url = buildBackendUrl(path, req.nextUrl.search);

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    ...(tag
      ? { next: { revalidate: 60, tags: [tag] } }
      : { cache: "no-store" }),
  });

  return proxyResponse(res);
}

async function mutate(
  req: NextRequest,
  segments: string[],
  method: "POST" | "DELETE",
): Promise<NextResponse> {
  const url = buildBackendUrl(segments, "");
  const contentType = req.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await req.text()
    : undefined;

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    ...(body ? { body } : {}),
  });

  const tag = resolveTag(segments);
  if (tag) revalidateTag(tag, "default");

  return proxyResponse(res);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return mutate(req, path, "POST");
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return mutate(req, path, "DELETE");
}
