import { NextRequest, NextResponse } from "next/server";

// 模拟数据库存储验证码
// 在实际应用中，这应该存储在数据库中
const verificationCodes: Record<string, { code: string; expiry: Date }> = {};

// 模拟白名单手机号，实际应用中应从数据库中获取
const whitelistedPhones = ["13800138000", "13900139000"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone_number } = body;

    // 基本验证
    if (!phone_number || !/^1[3-9]\d{9}$/.test(phone_number)) {
      return NextResponse.json(
        { success: false, message: "无效的手机号码" },
        { status: 400 }
      );
    }

    // 白名单验证
    // 注释掉下面的代码以便测试，实际应用中可以取消注释
    /* 
    if (!whitelistedPhones.includes(phone_number)) {
      return NextResponse.json(
        { success: false, message: "该手机号未在白名单中" },
        { status: 403 }
      );
    }
    */

    // 生成4位数验证码
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    // 设置5分钟有效期
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 5);
    
    // 存储验证码
    verificationCodes[phone_number] = { code, expiry };
    
    // 在实际应用中，这里应该调用短信服务发送验证码
    console.log(`向 ${phone_number} 发送验证码: ${code}`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "验证码已发送",
        // 仅在开发环境中返回验证码，生产环境应移除
        ...(process.env.NODE_ENV === "development" && { code })
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("发送验证码时出错:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}

// 导出验证码存储，以便登录API可以访问
export { verificationCodes }; 