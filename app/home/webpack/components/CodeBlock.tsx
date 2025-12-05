// components/CodeBlock.tsx
"use client"; // ✅ 必须标记为客户端组件

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./CodeBlock.module.scss"; // 下一步我们会创建这个样式文件

interface CodeBlockProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  // 1. 如果是内联代码，直接渲染普通 code 标签
  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  // 2. 解析语言逻辑 (从你原来的代码移动到这里)
  const match = /language-(\S+)/.exec(className || "");
  let lang = match ? match[1] : "text";
  if (lang) {
    lang = lang.replace(/[:{].*/, "");
  }

  // 3. 获取代码文本
  const codeString = String(children).replace(/\n$/, "");

  // 4. 复制代码的函数
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒后恢复
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className={styles.codeBlockWrapper}>
      {/* 复制按钮 */}
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label="Copy code"
      >
        {isCopied ? "Copied! ✅" : "Copy 📋"}
      </button>

      {/* 高亮组件 */}
      <SyntaxHighlighter
        {...props}
        style={dracula}
        language={lang}
        PreTag="div"
        // 稍微调整一下样式，给右上角的按钮留点位置
        customStyle={{ margin: 0, padding: ".2rem .2rem" }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
