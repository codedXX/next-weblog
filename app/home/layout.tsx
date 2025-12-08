"use client";
import styles from "./index.module.scss";
import { useState, useRef, useEffect, useMemo } from "react";
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
  subMenu?: SubMenuItem[];
};

// 将静态数据移出组件，或者在组件内直接定义为常量，不需要 useState
const TAG_LIST: tagListType[] = [
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
];

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 1. 删除 tagIndex 状态，只保留交互相关的 dropdown 状态
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 2. 【关键优化】直接根据 pathname 计算当前激活的 tag value
  // 使用 useMemo 是为了避免每次组件微小更新都重新遍历数组（虽然这里数组很小，性能影响不大，但习惯很好）
  const activeValue = useMemo(() => {
    const activeTag = TAG_LIST.find((item) => {
      // 如果有子菜单，检查当前路径是否匹配子菜单的路径
      if (item.subMenu) {
        return item.subMenu.some((sub) => pathname.startsWith(sub.path));
      }
      // 没有子菜单，直接匹配路径
      return pathname.startsWith(item.path);
    });
    // 如果找到了就返回对应的 value，没找到（比如在根目录）返回 0 或默认值
    return activeTag ? activeTag.value : 0;
  }, [pathname]); // 依赖项：只有当 pathname 变化时才重新计算

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

  // 处理点击
  const handleTagClick = (item: tagListType, e: React.MouseEvent) => {
    if (item.subMenu) {
      e.preventDefault();
      // 切换下拉菜单
      setOpenDropdown(openDropdown === item.value ? null : item.value);
    } else {
      // 3. 删除 setTagIndex
      // 点击普通链接时，路由会跳转 -> pathname 改变 -> activeValue 自动重新计算 -> 样式自动变
      setOpenDropdown(null);
    }
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.header}>
        <div className={styles.title}>codeYx的前端游乐场</div>
        <div className={styles.tagList} ref={dropdownRef}>
          {TAG_LIST.map((item) => (
            <div key={item.value} className={styles.tagWrapper}>
              {item.subMenu ? (
                // --- 有子菜单的情况 ---
                <>
                  <div
                    className={`${styles.tag} ${
                      // 4. 使用计算出来的 activeValue 判断样式
                      activeValue === item.value ? styles.tagActive : ""
                    }`}
                    onClick={(e) => handleTagClick(item, e)}
                  >
                    {item.label}
                    <span className={styles.arrow}>▼</span>
                  </div>

                  {openDropdown === item.value && (
                    <div className={styles.dropdown}>
                      {item.subMenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          href={subItem.path}
                          className={`${styles.dropdownItem} ${
                            // 同样直接对比 pathname
                            pathname === subItem.path
                              ? styles.dropdownItemActive
                              : ""
                          }`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                // --- 普通菜单项 ---
                <Link
                  href={item.path}
                  className={`${styles.tag} ${
                    // 4. 使用计算出来的 activeValue 判断样式
                    activeValue === item.value ? styles.tagActive : ""
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

      <div className={styles.container}>{children}</div>
    </div>
  );
}
