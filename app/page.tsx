import { redirect } from "next/navigation";

export default function Home() {
  // 访问根路径时重定向到 /home/overview
  redirect("/home/overview");
}
