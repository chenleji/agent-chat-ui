"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (userId: string, token?: string) => void;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
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
    const storedToken = getStoredToken();
    
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
      
      // 首页单独处理，通过首页的useEffect重定向
      const isHomePage = pathname === "/";

      // 如果用户未登录且当前路径不是公共路径且不是首页，则重定向到登录页面
      if (!isLoggedIn && !isPublicPath && !isHomePage) {
        router.push("/login");
      } else if (isPublicPath && isLoggedIn) {
        // 已登录用户访问登录页时，重定向到聊天页面
        router.push("/chat");
      }
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  // 从localStorage获取token的函数
  const getStoredToken = (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  };

  // 更新login函数定义和实现
  const login = (userId: string, token?: string) => {
    // 设置登录状态
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    setIsLoggedIn(true);
    setUserId(userId);
    
    // 存储token（如果提供）
    if (token) {
      localStorage.setItem('auth_token', token);
      console.log('Token已存储到localStorage');
    }
  };

  // 更新logout函数，清除所有凭据
  const logout = () => {
    // 清除所有本地存储的身份信息
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem('auth_token');
    
    // 更新状态
    setIsLoggedIn(false);
    setUserId(null);
    
    // 强制跳转到登录页，完全刷新页面
    window.location.href = "/login";
  };

  // 在请求API时包含token
  const getAuthHeaders = () => {
    const token = getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        login,
        logout,
        getAuthHeaders,
      }}
    >
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