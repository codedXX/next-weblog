import { Suspense } from "react";
import WebpackItem from "@/components/webpackItem/page";

// 禁用静态预渲染，因为使用了 useSearchParams
export const dynamic = "force-dynamic";

// 目录项类型
type CatalogItem = {
  value: string;
  label: string;
};

// 目录列表：value 对应 public/md/senior/ 下的文件名（不含 .md）
const catalogList: CatalogItem[] = [
  { value: "README", label: "介绍" },
  { value: "enhanceExperience", label: "提升开发体验" },
  { value: "liftingSpeed", label: "提升打包构建速度" },
  { value: "reduceVolume", label: "减少代码体积" },
  { value: "optimizePerformance", label: "优化代码运行性能" },
  { value: "summary", label: "总结" },
];

export default function WebpackSenior() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <WebpackItem catalogList={catalogList} category="senior" />
    </Suspense>
  );
}

