"use client";
import styles from "./index.module.scss";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SubMenuItem = {
  label: string;
  path: string;
};

type tagListType = {
  value: number;
  label: string;
  path: string;
  // 子菜单（可选）
  subMenu?: SubMenuItem[];
};

// 1. 接收 children 属性
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [tagIndex, setTagIndex] = useState<number>(0);
  // 控制下拉菜单显示
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [tagList] = useState<tagListType[]>([
    { value: 1, label: "概述", path: "/home/overview" },
    { value: 2, label: "Vue", path: "/home/vue" },
    {
      value: 3,
      label: "Webpack",
      path: "/home/webpackBase",
      subMenu: [
        { label: "基础", path: "/home/webpackBase" },
        { label: "高级", path: "/home/webpackSenior" },
        { label: "项目", path: "/home/webpackProject" },
      ],
    },
    { value: 4, label: "React", path: "/home/react" },
    { value: 5, label: "小程序", path: "/home/miniapp" },
    { value: 6, label: "Java", path: "/home/java" },
    { value: 7, label: "NodeJs", path: "/home/nodejs" },
  ]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 根据当前路径设置激活的 tag
  useEffect(() => {
    const activeTag = tagList.find((item) => {
      if (item.subMenu) {
        return item.subMenu.some((sub) => pathname.startsWith(sub.path));
      }
      return pathname.startsWith(item.path);
    });
    if (activeTag) {
      setTagIndex(activeTag.value);
    }
  }, [pathname, tagList]);

  // 处理 tag 点击
  const handleTagClick = (item: tagListType, e: React.MouseEvent) => {
    if (item.subMenu) {
      // 有子菜单时，切换下拉菜单显示
      e.preventDefault();
      setOpenDropdown(openDropdown === item.value ? null : item.value);
    } else {
      setTagIndex(item.value);
      setOpenDropdown(null);
    }
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.header}>
        <div className={styles.title}>codeYx的前端游乐场</div>
        <div className={styles.tagList} ref={dropdownRef}>
          {tagList.map((item) => (
            <div key={item.value} className={styles.tagWrapper}>
              {item.subMenu ? (
                // 有子菜单的项
                <>
                  <div
                    className={`${styles.tag} ${
                      tagIndex === item.value ? styles.tagActive : ""
                    }`}
                    onClick={(e) => handleTagClick(item, e)}
                  >
                    {item.label}
                    <span className={styles.arrow}>▼</span>
                  </div>
                  {/* 下拉菜单 */}
                  {openDropdown === item.value && (
                    <div className={styles.dropdown}>
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`${styles.dropdownItem} ${
                            pathname === subItem.path
                              ? styles.dropdownItemActive
                              : ""
                          }`}
                          onClick={() => {
                            setTagIndex(item.value);
                            setOpenDropdown(null);
                          }}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // 没有子菜单的普通项
                <Link
                  href={item.path}
                  className={`${styles.tag} ${
                    tagIndex === item.value ? styles.tagActive : ""
                  }`}
                  onClick={(e) => handleTagClick(item, e)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2. 这里就是你的 Outlet！子路由的内容会渲染在这里 */}
      <div className={styles.container}>{children}</div>
    </div>
  );
}
