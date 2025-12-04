"use client";
import { useEffect } from "react";

/**
 * @param {number} designWidth 设计稿基准宽度，通常为 1920
 * @param {number} baseSize 基准 font-size，通常为 100px (方便计算: 1rem = 100px)
 */
export const useRem = (designWidth = 1920, baseSize = 100) => {
  useEffect(() => {
    const handleResize = () => {
      // 获取当前视口宽度
      const clientWidth =
        document.documentElement.clientWidth || window.innerWidth;

      if (!clientWidth) return;

      // 核心计算公式：当前宽度 / 设计稿宽度 * 基准字号
      // 例如：3840 / 1920 * 100 = 200px (4K下 1rem = 200px)
      // 例如：1600 / 1920 * 100 = 83.33px
      let fontSize = (clientWidth / designWidth) * baseSize;

      // --- 限制范围 (可选) ---
      // 如果你不希望在小屏幕(如<1200px)太小，可以设置下限
      if (clientWidth < 1200) {
        fontSize = (1200 / designWidth) * baseSize;
      }

      // 设置根节点字体大小
      document.documentElement.style.fontSize = `${fontSize}px`;
    };

    // 初始化调用
    handleResize();

    // 监听窗口大小变化
    window.addEventListener("resize", handleResize);
    // 监听页面重新显示（兼容部分移动端行为）
    window.addEventListener("pageshow", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pageshow", handleResize);
    };
  }, [designWidth, baseSize]);
};
