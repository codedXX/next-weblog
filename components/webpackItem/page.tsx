"use client";
// app/home/webpack/page.tsx
// 优化：点击目录（catlog）时动态切换 md 文档
// 使用 URL hash 持久化当前文档状态
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./index.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import CodeBlock from "./components/CodeBlock";
import { getToc, TocItem } from "./utils/get-toc";
import Toc from "./components/Toc";

// 目录项类型
type CatalogItem = {
  value: string;
  label: string;
};
interface WebpackItemProps {
  catalogList: CatalogItem[];
}

export default function WebpackPage({ catalogList }: WebpackItemProps) {
  // 获取有效的文档名（验证是否在列表中）
  const getValidDocName = (name: string | null): string => {
    if (name && catalogList.some((item) => item.value === name)) {
      return name;
    }
    return "preface"; // 默认值
  };

  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 参数读取当前文档，如果没有则默认 "preface"
  const docFromUrl = searchParams.get("doc");
  const [currentDoc, setCurrentDoc] = useState<string>(() =>
    getValidDocName(docFromUrl)
  );
  // Markdown 内容
  const [mdContent, setMdContent] = useState<string>("");
  // 目录数据
  const [tocData, setTocData] = useState<TocItem[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  // md 容器引用，用于滚动
  const mdContainerRef = useRef<HTMLDivElement>(null);

  // 获取 md 文件内容
  const fetchMarkdown = useCallback(async (fileName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/markdown?file=${fileName}`);
      if (!response.ok) {
        throw new Error("获取文档失败");
      }
      const data = await response.json();
      setMdContent(data.content);
      // 生成目录数据
      setTocData(getToc(data.content));
      // 滚动到顶部
      if (mdContainerRef.current) {
        mdContainerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error("加载 Markdown 失败:", error);
      setMdContent("# 加载失败\n\n文档加载失败，请稍后重试。");
      setTocData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始化加载第一个文档
  useEffect(() => {
    fetchMarkdown(currentDoc);
  }, [currentDoc, fetchMarkdown]);

  // 点击目录项切换文档
  const handleCatalogClick = (value: string) => {
    if (value !== currentDoc) {
      setCurrentDoc(value);
      // 更新 URL 参数，刷新页面后保持状态
      router.push(`?doc=${value}`, { scroll: false });
    }
  };

  return (
    <div className={styles.containerBox}>
      {/* 左侧：文档内目录（Toc） */}
      <div className={styles.menuWrapper}>
        <Toc toc={tocData} />
      </div>

      {/* 中间：Markdown 内容区域 */}
      <div className={styles.mdContainer} ref={mdContainerRef}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : (
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              code: CodeBlock,
            }}
          >
            {mdContent}
          </Markdown>
        )}
      </div>

      {/* 右侧：文档列表（Catalog） */}
      <div className={styles.catalogList}>
        {catalogList.map((item) => (
          <div
            key={item.value}
            className={`${styles.catlog} ${
              currentDoc === item.value ? styles.active : ""
            }`}
            onClick={() => handleCatalogClick(item.value)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
