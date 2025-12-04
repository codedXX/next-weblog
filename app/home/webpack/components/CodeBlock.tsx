'use client';

import { useState, useEffect, useRef, memo } from 'react';
import hljs from 'highlight.js';
import styles from './CodeBlock.module.scss';

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

const CodeBlock = memo(function CodeBlock({ children, className, inline }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // 从 className 中提取语言类型
  // 处理类似 "language-js{17-20}" 或 "language-:no-line-numbers" 的情况
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // 增强判断：如果是行内代码，或者（没有指定语言且内容是单行），则视为行内代码
  // 这可以防止一些短的行内代码被误渲染为代码块
  const isSingleLine = !children.includes('\n');
  const isInline = inline || (!language && isSingleLine);

  // 执行代码高亮
  useEffect(() => {
    if (codeRef.current && !isInline) {
      // 清除之前的属性，避免重复高亮导致的问题
      codeRef.current.removeAttribute('data-highlighted');
      hljs.highlightElement(codeRef.current);
    }
  }, [children, language, isInline]);

  // 如果是行内代码，直接返回 <code> 标签
  if (isInline) {
    return <code className={className}>{children}</code>;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.header}>
        <span className={styles.language}>{language || 'TEXT'}</span>
        <button
          className={styles.copyButton}
          onClick={handleCopy}
          aria-label="复制代码"
        >
          {copied ? (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
            </svg>
          )}
          <span>{copied ? '已复制' : '复制'}</span>
        </button>
      </div>
      <pre className={styles.pre}>
        <code ref={codeRef} className={`hljs ${language ? `language-${language}` : ''}`}>
          {children}
        </code>
      </pre>
    </div>
  );
});

export default CodeBlock;
