import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const prettyCodePlugin: [typeof rehypePrettyCode, { theme: "github-dark" }] = [
  rehypePrettyCode,
  { theme: "github-dark" },
];

export const mdxRemoteOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, prettyCodePlugin],
  },
};
