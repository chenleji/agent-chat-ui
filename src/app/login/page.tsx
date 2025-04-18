"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 手机号验证
  const isPhoneNumberValid = /^1[3-9]\d{9}$/.test(phoneNumber);

  // 获取验证码
  const handleGetCode = async () => {
    if (!isPhoneNumberValid) {
      setErrorMessage("请输入正确的手机号码");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      
      const response = await fetch("/user/api/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        // 开始倒计时
        setCountdown(60);
        toast.success("验证码发送成功，请查收");
      } else {
        setErrorMessage(data.detail || data.message || "发送验证码失败，请稍后重试");
        toast.error(data.detail || data.message || "发送验证码失败，请稍后重试");
      }
    } catch (error) {
      console.error("获取验证码错误:", error);
      setErrorMessage("网络错误，请稍后重试");
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!isPhoneNumberValid) {
      setErrorMessage("请输入正确的手机号码");
      return;
    }

    if (!/^\d{4}$/.test(verificationCode)) {
      setErrorMessage("请输入正确的验证码");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch("/user/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 解析返回的数据
        const { access_token, token_type } = data;
        
        // 显示成功提示
        toast.success("登录成功，正在跳转...");
        
        // 使用AuthContext中的login方法，传递手机号和token
        login(phoneNumber, access_token);
        
        // 使用短延迟，确保状态更新后再跳转
        setTimeout(() => {
          // 使用window.location.href强制跳转，确保页面完全刷新
          window.location.href = "/chat";
        }, 500);
      } else {
        const errorMsg = data.detail || data.message || "登录失败，请检查手机号和验证码";
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("登录错误:", error);
      setErrorMessage("网络错误，请稍后重试");
      toast.error("网络错误，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 -mt-12 sm:px-6 lg:px-8">
      {/* 系统Logo和名称 */}
      <div className="mb-10 flex flex-col items-center">
        <img src="/insure-logo.png" alt="InsureX Logo" className="h-16 w-16 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">InsureX</h1>
        <p className="mt-2 text-center text-gray-600">
          智能保险顾问系统
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="phone">手机号码</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="请输入手机号码"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="code">验证码</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  type="text"
                  maxLength={4}
                  placeholder="请输入验证码"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <Button
                  onClick={handleGetCode}
                  disabled={!isPhoneNumberValid || countdown > 0 || isLoading}
                  className="whitespace-nowrap"
                >
                  {countdown > 0 ? `重新发送(${countdown}s)` : "获取验证码"}
                </Button>
              </div>
            </div>

            {errorMessage && (
              <div className="text-sm font-medium text-red-500">
                {errorMessage}
              </div>
            )}

            <Button
              className="w-full mt-8"
              onClick={handleLogin}
              disabled={
                !isPhoneNumberValid ||
                !/^\d{4}$/.test(verificationCode) ||
                isLoading
              }
            >
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 