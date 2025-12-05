// app/xxx/v2.tsx (保持原路径)
import styles from "./index.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { promises as fs } from "fs";
import path from "path";
// ✅ 引入刚才写的客户端组件
import CodeBlock from "./components/CodeBlock";

export const v2 = async () => {
  const filePath = path.join(process.cwd(), "assets/md/base/css.md");
  const cssMd = await fs.readFile(filePath, "utf8");

  return (
    <div className={styles.containerBox}>
      <div className={styles.menuWrapper}></div>
      <div className={styles.mdContainer}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            // ✅ 直接使用 CodeBlock 组件接管 code 标签的渲染
            code: CodeBlock,
            // 注意：react-markdown 会自动把 props (inline, className, children) 传给 CodeBlock
          }}
        >
          {cssMd}
        </Markdown>
      </div>
    </div>
  );
};
export default v2;
