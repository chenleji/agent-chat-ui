"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 根据登录状态重定向
    if (isLoggedIn) {
      router.push("/chat");
    } else {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  // 显示加载状态，等待重定向
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg">正在跳转，请稍候...</p>
    </div>
  );
}
