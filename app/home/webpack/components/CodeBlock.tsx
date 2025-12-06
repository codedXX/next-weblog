"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./CodeBlock.module.scss";

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

  // 1. 获取代码内容并去除末尾换行
  const codeString = String(children).replace(/\n$/, "");

  // 2. 检测是否指定了语言 (例如 language-js)
  const match = /language-(\S+)/.exec(className || "");
  let lang = match ? match[1] : "";

  // 3. 🛡️【核心修复逻辑】智能判断是否为行内代码
  // 满足以下任一条件即视为行内代码：
  // A. props.inline 明确为 true
  // B. 且 (没有指定语言 AND 内容里没有换行符) -> 即使 parser 弄错了，我们也强制把它按 inline 渲染
  const isInline = inline || (!match && !codeString.includes("\n"));

  // --- 分支 A: 渲染行内代码 (针对 `css-loader` 等短语) ---
  if (isInline) {
    return (
      <code className={`${styles.inlineCode} ${className || ""}`} {...props}>
        {children}
      </code>
    );
  }

  // --- 分支 B: 渲染代码块 (针对大段代码) ---

  // 清理语言名称中的多余字符
  if (lang) {
    lang = lang.replace(/[:{].*/, "");
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <button
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label="Copy code"
      >
        {isCopied ? "Copied! ✅" : "Copy 📋"}
      </button>

      <SyntaxHighlighter
        {...props}
        style={dracula}
        language={lang || "text"} // 如果没有语言，默认为 text
        PreTag="div"
        customStyle={{ margin: 0, padding: ".2rem" }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
