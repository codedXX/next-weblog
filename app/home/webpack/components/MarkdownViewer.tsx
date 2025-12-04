'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { generateToc, generateId, type TocItem } from '../utils/markdownUtils';
import CodeBlock from './CodeBlock';
import styles from './MarkdownViewer.module.scss';

interface MarkdownViewerProps {
  content: string;
}

// 自定义渲染组件，定义在组件外部以避免重复创建导致重绘
const components = {
  code({ inline, className, children, ...props }: any) {
    return (
      <CodeBlock inline={inline} className={className}>
        {String(children).replace(/\n$/, '')}
      </CodeBlock>
    );
  },
  h1: ({ children, ...props }: any) => {
    const id = generateId(String(children));
    return <h1 id={id} {...props}>{children}</h1>;
  },
  h2: ({ children, ...props }: any) => {
    const id = generateId(String(children));
    return <h2 id={id} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: any) => {
    const id = generateId(String(children));
    return <h3 id={id} {...props}>{children}</h3>;
  },
  h4: ({ children, ...props }: any) => {
    const id = generateId(String(children));
    return <h4 id={id} {...props}>{children}</h4>;
  },
  h5: ({ children, ...props }: any) => {
    const id = generateId(String(children));
    return <h5 id={id} {...props}>{children}</h5>;
  },
  h6: ({ children, ...props }: any) => {
    const id = generateId(String(children));
    return <h6 id={id} {...props}>{children}</h6>;
  },
};

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [theme, setTheme] = useState<string>('github-dark');
  const mainRef = useRef<HTMLElement>(null);

  // 动态加载主题 CSS
  useEffect(() => {
    // 移除旧的主题样式
    const oldLink = document.getElementById('highlight-theme');
    if (oldLink) {
      oldLink.remove();
    }

    // 添加新的主题样式
    const link = document.createElement('link');
    link.id = 'highlight-theme';
    link.rel = 'stylesheet';
    link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme}.min.css`;
    document.head.appendChild(link);

    return () => {
      // 清理函数：组件卸载时移除样式
      const themeLink = document.getElementById('highlight-theme');
      if (themeLink) {
        themeLink.remove();
      }
    };
  }, [theme]);

  // 生成目录
  useEffect(() => {
    const tocData = generateToc(content);
    setToc(tocData);
  }, [content]);

  // 监听滚动，高亮当前目录项
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const headings = mainElement.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6');
          const scrollTop = mainElement.scrollTop;

          let currentId = '';
          headings.forEach((heading) => {
            const element = heading as HTMLElement;
            // 获取元素相对于容器的位置
            const elementTop = element.offsetTop - mainElement.offsetTop;
            if (elementTop <= scrollTop + 100) {
              currentId = element.id;
            }
          });

          setActiveId(currentId);
          ticking = false;
        });

        ticking = true;
      }
    };

    mainElement.addEventListener('scroll', handleScroll);
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击目录项滚动到对应位置
  const handleTocClick = (id: string) => {
    const element = document.getElementById(id);
    const mainElement = mainRef.current;
    
    if (element && mainElement) {
      // 获取元素相对于容器的位置
      const elementTop = element.offsetTop - mainElement.offsetTop;
      const offset = 20; // 顶部偏移量
      
      mainElement.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      });
    }
  };

  // 渲染目录项（带编号）
  const renderTocItem = (item: TocItem, index: number, parentNumber: string = '') => {
    // 生成编号，例如：1, 1.1, 1.2, 2, 2.1
    const currentNumber = parentNumber ? `${parentNumber}.${index + 1}` : `${index + 1}`;
    
    return (
      <li key={item.id} className={styles.tocItem}>
        <a
          href={`#${item.id}`}
          className={`${styles.tocLink} ${activeId === item.id ? styles.active : ''}`}
          onClick={(e) => {
            e.preventDefault();
            handleTocClick(item.id);
          }}
          data-level={item.level}
        >
          <span className={styles.tocNumber}>{currentNumber}</span>
          <span className={styles.tocText}>{item.text}</span>
        </a>
        {item.children && item.children.length > 0 && (
          <ul className={styles.tocList}>
            {item.children.map((child, childIndex) => renderTocItem(child, childIndex, currentNumber))}
          </ul>
        )}
      </li>
    );
  };



  const themes = [
    { value: 'github-dark', label: 'GitHub Dark' },
    { value: 'github', label: 'GitHub Light' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'nord', label: 'Nord' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'atom-one-dark', label: 'Atom One Dark' },
    { value: 'atom-one-light', label: 'Atom One Light' },
    { value: 'vs2015', label: 'VS2015' },
    { value: 'tokyo-night-dark', label: 'Tokyo Night' },
  ];

  return (
    <div className={styles.container}>
      {/* 主题切换器 */}
      <div className={styles.themeSelector}>
        <label htmlFor="theme-select">主题:</label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className={styles.themeSelect}
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.content}>
        {/* 左侧目录 */}
        <aside className={styles.sidebar}>
          <div className={styles.tocHeader}>目录</div>
          <nav className={styles.toc}>
            <ul className={styles.tocList}>
              {toc.map((item, index) => renderTocItem(item, index))}
            </ul>
          </nav>
        </aside>

        {/* 右侧内容 */}
        <main ref={mainRef} className={styles.main}>
          <article className={`markdown-content ${styles.markdown}`}>
            <ReactMarkdown
              components={components}
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </article>
        </main>
      </div>
    </div>
  );
}
