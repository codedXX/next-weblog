import { Suspense } from "react";
import WebpackItem from "@/components/webpackItem/page";

// 禁用静态预渲染，因为使用了 useSearchParams
export const dynamic = "force-dynamic";

// 目录项类型
type CatalogItem = {
  value: string;
  label: string;
};

// 目录列表：value 对应 public/md/project/ 下的文件名（不含 .md）
const catalogList: CatalogItem[] = [
  { value: "react-cli", label: "React脚手架" },
  { value: "vue-cli", label: "Vue脚手架" },
];

export default function WebpackProject() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <WebpackItem catalogList={catalogList} category="project" />
    </Suspense>
  );
}

