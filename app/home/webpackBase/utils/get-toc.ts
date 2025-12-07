// utils/get-toc.ts
import GithubSlugger from "github-slugger";

export interface TocItem {
  text: string;
  depth: number;
  slug: string;
}

export const getToc = (markdown: string): TocItem[] => {
  const slugger = new GithubSlugger();
  // 匹配 # 开头的行
  const regXHeader = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;

  const headings = Array.from(markdown.matchAll(regXHeader)).map(
    ({ groups }) => {
      const flag = groups?.flag;
      const content = groups?.content;
      return {
        depth: flag ? flag.length : 0, // 标题层级 h1-h6
        text: content ? content.trim() : "",
        // slugger.slug 确保生成的 id 与 rehype-slug 插件生成的一致（处理重复标题、特殊字符）
        slug: content ? slugger.slug(content) : "",
      };
    }
  );

  return headings;
};
