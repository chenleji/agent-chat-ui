"use client";

import { ReactNode } from 'react';
import { useAuthCheck } from '@/hooks/useAuthCheck';

/**
 * 认证状态检查的包装组件
 * 该组件会每5分钟检查一次认证状态，如果发现认证失效则自动登出跳转到登录页
 */
export function AuthCheckWrapper({ children }: { children: ReactNode }) {
  // 使用认证状态检查Hook
  useAuthCheck();
  
  // 不修改渲染内容，只添加认证检查逻辑
  return <>{children}</>;
} 