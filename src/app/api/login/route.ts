import { NextRequest, NextResponse } from "next/server";
import { verificationCodes } from "../send-code/route";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number, code } = body;

    // 基本验证
    if (!phone_number || !code) {
      return NextResponse.json(
        { success: false, message: "手机号和验证码不能为空" },
        { status: 400 }
      );
    }

    // 验证手机号格式
    if (!/^1[3-9]\d{9}$/.test(phone_number)) {
      return NextResponse.json(
        { success: false, message: "无效的手机号码" },
        { status: 400 }
      );
    }

    // 获取存储的验证码信息
    const storedVerification = verificationCodes[phone_number];
    
    // 验证码不存在
    if (!storedVerification) {
      return NextResponse.json(
        { success: false, message: "验证码不存在或已过期，请重新获取" },
        { status: 401 }
      );
    }

    // 验证码已过期
    if (new Date() > storedVerification.expiry) {
      // 删除过期验证码
      delete verificationCodes[phone_number];
      
      return NextResponse.json(
        { success: false, message: "验证码已过期，请重新获取" },
        { status: 401 }
      );
    }

    // 验证码不匹配
    if (storedVerification.code !== code) {
      return NextResponse.json(
        { success: false, message: "验证码错误" },
        { status: 401 }
      );
    }

    // 验证成功，清除验证码
    delete verificationCodes[phone_number];

    // 这里可以生成JWT token或其他会话标识
    // 在实际应用中，应该创建用户会话并返回token
    
    return NextResponse.json(
      { 
        success: true, 
        message: "登录成功",
        // 这里可以返回用户信息和token
        // user: { id: "user_id", phone: phone_number },
        // token: "jwt_token_here"
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("登录时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
} 