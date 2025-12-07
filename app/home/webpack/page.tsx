"use client";
// app/xxx/v2.tsx (保持原路径)
import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { promises as fs } from "fs";
import path from "path";
// ✅ 引入刚才写的客户端组件
import CodeBlock from "./components/CodeBlock";

// 1. 引入新依赖和组件
import rehypeSlug from "rehype-slug";
import { getToc } from "./utils/get-toc";
import Toc from "./components/Toc";
type CatalogItem = {
  value: string;
  label: string;
};
export const V2 = async () => {
  const [catalogList, setCatalogList] = useState<CatalogItem[]>([
    {
      value: "preface",
      label: "前言",
    },
    {
      value: "base",
      label: "基本使用",
    },
    {
      value: "config",
      label: "基本配置",
    },
    {
      value: "development",
      label: "开发模式介绍",
    },
    {
      value: "css",
      label: "处理样式资源",
    },
    {
      value: "image",
      label: "处理图片资源",
    },
    {
      value: "output",
      label: "修改输出资源的名称和路径",
    },
    {
      value: "clean",
      label: "自动清空上次打包资源",
    },
    {
      value: "font",
      label: "处理字体图标资源",
    },
    {
      value: "other",
      label: "处理其他资源",
    },
    {
      value: "javascript",
      label: "处理js资源",
    },
    {
      value: "html",
      label: "处理Html资源",
    },
    {
      value: "server",
      label: "开发服务器&自动化",
    },
    {
      value: "production",
      label: "生产模式介绍",
    },
    {
      value: "optimizeCss",
      label: "CSS处理",
    },
    {
      value: "minifyHtml",
      label: "Html压缩",
    },
    {
      value: "summary",
      label: "总结",
    },
  ]);
  const filePath = path.join(process.cwd(), "assets/md/base/base.md");
  const cssMd = await fs.readFile(filePath, "utf8");

  // 2. 服务端生成目录数据
  const tocData = getToc(cssMd);

  return (
    <div className={styles.containerBox}>
      <div className={styles.menuWrapper}>
        <Toc toc={tocData} />
      </div>
      <div className={styles.mdContainer}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          // 4. 重要：rehypeSlug 自动给 h1,h2... 生成 id
          rehypePlugins={[rehypeSlug]}
          components={{
            // ✅ 直接使用 CodeBlock 组件接管 code 标签的渲染
            code: CodeBlock,
            // 注意：react-markdown 会自动把 props (inline, className, children) 传给 CodeBlock
          }}
        >
          {cssMd}
        </Markdown>
      </div>
      <div className={styles.catalogList}>
        {catalogList.map((item) => (
          <div key={item.value} className={styles.catlog}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
export default V2;
