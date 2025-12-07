import WebpackItem from "@/components/webpackItem/page";

// 目录项类型
type CatalogItem = {
  value: string;
  label: string;
};

// 目录列表：value 对应 public/md/base/ 下的文件名（不含 .md）
const catalogList: CatalogItem[] = [
  { value: "react-cli", label: "React脚手架" },
  { value: "vue-cli", label: "Vue脚手架" },
  // { value: "summary", label: "总结" },
];
const WebpackProject = () => {
  return <WebpackItem catalogList={catalogList} category="project" />;
};
export default WebpackProject;
