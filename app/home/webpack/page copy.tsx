import styles from "./index.module.scss";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { promises as fs } from "fs";
import path from "path";
// 1. 引入高亮组件和样式
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//这里选一款你喜欢的皮肤，比如 vscDarkPlus (VSCode 暗色风格) 或 dracula
// import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export const v2 = async () => {
  // 1. 获取文件绝对路径
  // process.cwd() 获取的是项目根目录
  const filePath = path.join(process.cwd(), "assets/md/base/css.md");
  console.log("filepath", filePath);
  // // 2. 读取文件内容 (纯文本)
  const cssMd = await fs.readFile(filePath, "utf8");
  // console.log("dda", cssMd); // 这会在服务端终端打印

  return (
    <div className={styles.containerBox}>
      <div className={styles.menuWrapper}></div>
      <div className={styles.mdContainer}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          // 2. 核心：自定义 components 属性
          components={{
            code({ node, inline, className, children, ...props }: any) {
              /** 
               * // 匹配代码语言，例如 ```js 会有 className="language-js"
              const match = /language-(\w+)/.exec(className || "");
               */

              // 1. 获取 language- 后面的一整串字符串
              // 比如 "js{11-16}" 或 "bash:no-line-numbers"
              const match = /language-(\S+)/.exec(className || "");

              // 2. 提取原始语言名，如果没匹配到则默认为 "text"
              let lang = match ? match[1] : "text";

              // 3. ✅ 核心修复：清洗语言名称
              // 如果包含 '{' (比如行高亮) 或 ':' (比如修饰符)，截取前面的部分
              // 例子: "js{11-16}" -> "js"
              // 例子: "bash:no-line-numbers" -> "bash"
              if (lang) {
                lang = lang.replace(/[:{].*/, "");
              }

              // 如果不是内联代码（即是代码块），且有语言标记，则使用高亮组件
              // && match
              return !inline ? (
                <SyntaxHighlighter
                  {...props}
                  style={dracula} // 应用样式主题
                  language={lang} // 传入语言类型
                  PreTag="div" // 外层标签
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                // 否则（内联代码 `code` 或无语言标记的代码块），使用默认渲染
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {cssMd}
        </Markdown>
      </div>
    </div>
  );
};
export default v2;
