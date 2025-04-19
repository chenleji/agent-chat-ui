import { useEffect, useRef } from 'react';
import { useAuth } from '@/providers/auth-provider';

/**
 * 自定义Hook，定期检查认证状态
 * 检查间隔时间从环境变量AUTH_CHECK_INTERVAL读取，单位为分钟
 * 如果认证失败，会自动登出并跳转到登录页面
 */
export function useAuthCheck() {
  const { logout, isLoggedIn } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 只有在用户已登录的情况下才启动检查
    if (!isLoggedIn) return;

    // 从环境变量读取检查间隔时间（单位：分钟）
    // 如果未设置或无效，则默认为5分钟
    const intervalMinutes = parseInt(process.env.AUTH_CHECK_INTERVAL || '5', 10);
    
    // 转换为毫秒
    const intervalMs = intervalMinutes * 60 * 1000;

    // 检查认证状态的函数
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/user/api/auth-status', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // 包含cookie
        });

        if (response.ok) {
          const data = await response.json();
          
          // 如果认证已失效，执行登出操作
          if (!data.is_authenticated) {
            console.log('认证已失效:', data.message);
            logout(); // 使用AuthProvider中的logout函数
          }
        } else {
          // 服务器响应错误，可能是网络问题或服务器错误
          console.error('认证状态检查失败，HTTP错误:', response.status);
        }
      } catch (error) {
        // 网络错误或其他异常
        console.error('认证状态检查出错:', error);
      }
    };

    // 立即执行一次检查
    checkAuthStatus();

    console.log(`认证状态检查已启动，间隔时间: ${intervalMinutes} 分钟`);
    
    // 设置定时器，按照环境变量配置的间隔执行
    intervalRef.current = setInterval(checkAuthStatus, intervalMs);

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLoggedIn, logout]);
} 