// app/api/markdown/route.ts
// API 路由：根据文件名获取 md 文件内容
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json({ error: "缺少文件名参数" }, { status: 400 });
  }

  // 安全检查：防止路径遍历攻击
  const sanitizedFileName = path.basename(fileName);
  const filePath = path.join(
    process.cwd(),
    "public/md/base",
    `${sanitizedFileName}.md`
  );

  try {
    const content = await fs.readFile(filePath, "utf8");
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "文件不存在" }, { status: 404 });
  }
}
