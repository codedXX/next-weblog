import WebpackItem from "@/components/webpackItem/page";

// 目录项类型
type CatalogItem = {
  value: string;
  label: string;
};

// 目录列表：value 对应 public/md/base/ 下的文件名（不含 .md）
const catalogList: CatalogItem[] = [
  { value: "preface", label: "前言" },
  { value: "base", label: "基本使用" },
  { value: "config", label: "基本配置" },
  { value: "development", label: "开发模式介绍" },
  { value: "css", label: "处理样式资源" },
  { value: "image", label: "处理图片资源" },
  { value: "output", label: "修改输出资源的名称和路径" },
  { value: "clean", label: "自动清空上次打包资源" },
  { value: "font", label: "处理字体图标资源" },
  { value: "other", label: "处理其他资源" },
  { value: "javascript", label: "处理js资源" },
  { value: "html", label: "处理Html资源" },
  { value: "server", label: "开发服务器&自动化" },
  { value: "production", label: "生产模式介绍" },
  { value: "optimizeCss", label: "CSS处理" },
  { value: "minifyHtml", label: "Html压缩" },
  { value: "summary", label: "总结" },
];
const WebpackBase = () => {
  return <WebpackItem catalogList={catalogList} category="base" />;
};
export default WebpackBase;
