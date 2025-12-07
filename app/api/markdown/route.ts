// app/api/markdown/route.ts
// API 路由：根据文件名和类型获取 md 文件内容
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// 类型到目录的映射
const categoryPathMap: Record<string, string> = {
  base: "public/md/base",
  senior: "public/md/senior",
  project: "public/md/project",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");
  const category = searchParams.get("category") || "base"; // 默认为 base

  if (!fileName) {
    return NextResponse.json({ error: "缺少文件名参数" }, { status: 400 });
  }

  // 获取对应的目录路径
  const mdPath = categoryPathMap[category];
  if (!mdPath) {
    return NextResponse.json({ error: "无效的类型参数" }, { status: 400 });
  }

  // 安全检查：防止路径遍历攻击
  const sanitizedFileName = path.basename(fileName);
  const filePath = path.join(process.cwd(), mdPath, `${sanitizedFileName}.md`);

  try {
    const content = await fs.readFile(filePath, "utf8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "文件不存在" }, { status: 404 });
  }
}
