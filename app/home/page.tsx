import { redirect } from "next/navigation";
export default function OverviewPage() {
  //   return (
  //     <div style={{ padding: "20px", color: "black" }}>
  //       <h2>这里是 Overview 内容区域</h2>
  //       <p>我被成功插入到了 Layout 的 container 中！</p>
  //     </div>
  //   );
  // 当用户访问 /home 时，直接在服务端重定向到 /home/overview
  redirect("/home/overview");
}
