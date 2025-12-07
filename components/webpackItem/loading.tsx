// app/home/webpack/loading.tsx
// Next.js 会自动使用这个文件作为页面加载时的 loading UI

import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      {/* 左侧目录骨架 */}
      <div className={styles.tocSkeleton}>
        <div className={styles.tocTitle}></div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={styles.tocItem}
            style={{ width: `${60 + Math.random() * 30}%` }}
          ></div>
        ))}
      </div>

      {/* 右侧内容骨架 */}
      <div className={styles.contentSkeleton}>
        <div className={styles.heading}></div>
        <div className={styles.paragraph}></div>
        <div className={styles.paragraph} style={{ width: "90%" }}></div>
        <div className={styles.paragraph} style={{ width: "75%" }}></div>
        <div className={styles.codeBlock}></div>
        <div className={styles.heading} style={{ width: "40%" }}></div>
        <div className={styles.paragraph}></div>
        <div className={styles.paragraph} style={{ width: "85%" }}></div>
      </div>
    </div>
  );
}
