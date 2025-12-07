"use client";
// app/home/template.tsx
// 页面切换动画模板 - 使用 Framer Motion
import { motion } from "framer-motion";

// 动画变体配置
const pageVariants = {
  // 初始状态：从右侧滑入，透明
  initial: {
    opacity: 0,
    x: 20,
  },
  // 进入状态：完全显示
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  // 退出状态：向左滑出，透明
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      style={{ height: "100%", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
