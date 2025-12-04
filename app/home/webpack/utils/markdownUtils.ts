/**
 * Markdown 工具函数
 * 用于解析 Markdown 内容并生成目录结构
 */

export interface TocItem {
  id: string;
  text: string;
  level: number;
  children?: TocItem[];
}

/**
 * 从 Markdown 内容中提取标题生成目录
 */
export function generateToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string }[] = [];
  
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text });
  }

  // 构建树形结构
  const toc: TocItem[] = [];
  const stack: TocItem[] = [];

  headings.forEach(({ level, text }) => {
    const id = generateId(text);
    const item: TocItem = { id, text, level };

    // 找到合适的父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }

    if (stack.length === 0) {
      toc.push(item);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    }

    stack.push(item);
  });

  return toc;
}

/**
 * 将标题文本转换为有效的 HTML ID
 */
export function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留字母、数字、中文、空格和连字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/-+/g, '-') // 合并多个连字符
    .replace(/^-|-$/g, ''); // 移除首尾连字符
}

/**
 * 为 Markdown 内容中的标题添加 ID
 */
export function addIdsToMarkdown(markdown: string): string {
  return markdown.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    const id = generateId(text.trim());
    return `${hashes} ${text.trim()} {#${id}}`;
  });
}
