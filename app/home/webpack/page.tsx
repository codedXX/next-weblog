import { promises as fs } from 'fs';
import path from 'path';
import MarkdownViewer from './components/MarkdownViewer';

export default async function WebpackPage() {
  // 读取 Markdown 文件
  const filePath = path.join(process.cwd(), 'public', 'md', 'base', 'css.md');
  const content = await fs.readFile(filePath, 'utf-8');

  return <MarkdownViewer content={content} />;
}
