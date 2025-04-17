"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // 初始化时检查登录状态和用户ID
  useEffect(() => {
    const loginState = localStorage.getItem("isLoggedIn");
    const storedUserId = localStorage.getItem("userId");
    setIsLoggedIn(loginState === "true");
    setUserId(storedUserId);
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

  // 登录方法 - 接收并存储 userId
  const login = (userIdentifier: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userIdentifier);
    setIsLoggedIn(true);
    setUserId(userIdentifier);
  };

  // 登出方法 - 移除 userId
  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUserId(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
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