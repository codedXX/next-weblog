// app/xxx/components/Toc.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./Toc.module.scss"; // 稍后创建样式
import { TocItem } from "../utils/get-toc";

export default function Toc({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  // 用于存储滚动容器的引用
  const scrollContainerRef = useRef<Element | null>(null);

  useEffect(() => {
    // 如果没有目录数据，直接返回
    if (!toc || toc.length === 0) return;

    // 获取实际的滚动容器 (.mdContainer)
    // 由于是 CSS Module，需要通过选择器或者类名的部分匹配来查找
    const mdContainer = document.querySelector('[class*="mdContainer"]');
    scrollContainerRef.current = mdContainer;

    // 创建 IntersectionObserver 来监听标题滚动
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        // 设置 root 为滚动容器，而非默认的 viewport
        root: mdContainer,
        // 核心技巧：调整视口判定范围。
        // "-10% 0px -80% 0px" 意味着只有当标题进入视口顶部区域时才触发
        rootMargin: "-10% 0px -80% 0px",
      }
    );

    // 延迟执行，确保 DOM 已渲染完成
    const timer = setTimeout(() => {
      // 监听 Markdown 内容区里的所有标题
      const headings = document.querySelectorAll(
        '[class*="mdContainer"] h1, [class*="mdContainer"] h2, [class*="mdContainer"] h3'
      );
      headings.forEach((h) => observer.observe(h));
    }, 100);

    // 清理函数：断开 observer 并清除定时器
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [toc]); // 依赖 toc，当目录数据改变时重新绑定

  // 处理点击平滑滚动
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    const container = scrollContainerRef.current;
    
    if (element && container) {
      // 直接操作 .mdContainer 的 scrollTop，避免 scrollIntoView 导致外层容器滚动
      // 计算目标元素相对于滚动容器的位置
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const offsetTop = elementRect.top - containerRect.top + container.scrollTop;
      
      // 平滑滚动到目标位置
      container.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // 立即设置高亮，不等滚动结束
      setActiveId(slug);
    }
  };

  if (!toc || toc.length === 0) return null;

  return (
    <nav className={styles.tocContainer}>
      <h3>目录</h3>
      <ul>
        {toc.map((item) => (
          <li
            key={item.slug}
            className={`${styles.tocItem} ${
              activeId === item.slug ? styles.active : ""
            }`}
            style={{ paddingLeft: `${(item.depth - 1) * 16}px` }}
          >
            <a
              href={`#${item.slug}`}
              onClick={(e) => handleClick(e, item.slug)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
