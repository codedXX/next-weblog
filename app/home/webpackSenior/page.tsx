import WebpackItem from "@/components/webpackItem/page";

// 目录项类型
type CatalogItem = {
  value: string;
  label: string;
};

// 目录列表：value 对应 public/md/base/ 下的文件名（不含 .md）
const catalogList: CatalogItem[] = [
  { value: "enhanceExperience", label: "介绍" },
  { value: "liftingSpeed", label: "提升开发体验" },
  { value: "reduceVolume", label: "提升打包构建速度" },
  { value: "development", label: "减少代码体积" },
  { value: "optimizePerformance", label: "优化代码运行性能" },
  { value: "summary", label: "总结" },
];
const WebpackSenior = () => {
  return <WebpackItem catalogList={catalogList} />;
};
export default WebpackSenior;
