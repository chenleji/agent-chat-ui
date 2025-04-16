"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 初始化时检查登录状态
  useEffect(() => {
    // 从localStorage中获取登录状态
    const loginState = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginState === "true");
    setIsLoading(false);
  }, []);

  // 路由保护
  useEffect(() => {
    if (!isLoading) {
      // 不需要登录就能访问的路径
      const publicPaths = ["/login"];
      
      const isPublicPath = publicPaths.some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
      );

      // 如果用户未登录且当前路径不是公共路径，则重定向到登录页面
      if (!isLoggedIn && !isPublicPath) {
        router.push("/login");
      } else if (isPublicPath && isLoggedIn) {
        // 已登录用户访问登录页时，重定向到首页并打开聊天历史
        router.push("/?chatHistoryOpen=true");
      }
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  // 登录方法
  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  // 登出方法
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 