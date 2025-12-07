import type { Metadata } from "next";
import "./globals.css";
// ✅ 关键点 1：必须引入 Script 组件
import Script from "next/script";

export const metadata: Metadata = {
  title: "codeYx的前端游乐场",
  description: "codeYx的前端游乐场",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ 核心修改：添加 suppressHydrationWarning 属性
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* ✅ 关键点 3：Script 标签放在 body 内部 */}
        {/* strategy="beforeInteractive" 保证在页面水合前就执行，防止字体大小跳动 */}
        <Script id="rem-script" strategy="beforeInteractive">
          {`
            (function(designWidth, baseSize) {
              function setRem() {
                var clientWidth = document.documentElement.clientWidth || window.innerWidth;
                if (!clientWidth) return;
                // 计算逻辑
                var fontSize = (clientWidth / designWidth) * baseSize;
                // 限制最小宽度 (可选)
                if (clientWidth < 1200) {
                  fontSize = (1200 / designWidth) * baseSize;
                }
                document.documentElement.style.fontSize = fontSize + 'px';
              }
              
              // 立即执行一次
              setRem();
              
              // 监听事件
              window.addEventListener('resize', setRem);
              window.addEventListener('pageshow', setRem);
            })(1920, 100); 
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
