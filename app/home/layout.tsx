"use client";
import styles from "./index.module.scss";
import { useState } from "react";
import Link from "next/link"; // 推荐：引入 Link 做导航跳转

type tagListType = {
  value: number;
  label: string;
  path: string; // 建议：加一个 path 字段用于跳转
};

// 1. 接收 children 属性
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tagIndex, setTagIndex] = useState<number>(0);
  const [tagList, setTagList] = useState<tagListType[]>([
    { value: 1, label: "概述", path: "/home/overview" },
    { value: 2, label: "Vue", path: "/home/vue" }, // 假设你还有其他页面
    { value: 3, label: "Webpack", path: "/home/webpackBase" },
    { value: 4, label: "React", path: "/home/react" },
    { value: 5, label: "小程序", path: "/home/miniapp" },
    { value: 6, label: "Java", path: "/home/java" },
    { value: 7, label: "NodeJs", path: "/home/nodejs" },
  ]);

  return (
    <div className={styles.mainBox}>
      <div className={styles.header}>
        <div className={styles.title}>codeYx的前端游乐场</div>
        <div className={styles.tagList}>
          {tagList.map((item) => (
            // 建议：给 tag 加上跳转功能，点击时切换子路由
            <Link
              key={item.value}
              href={item.path}
              className={`${styles.tag} ${
                tagIndex == item.value ? `${styles.tagActive}` : ""
              }`}
              onClick={() => setTagIndex(item.value)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 2. 这里就是你的 Outlet！子路由的内容会渲染在这里 */}
      <div className={styles.container}>{children}</div>
    </div>
  );
}
