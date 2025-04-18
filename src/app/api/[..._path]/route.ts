import { NextRequest, NextResponse } from 'next/server';

// This file acts as a proxy for requests to your LangGraph server.
// Read the [Going to Production](https://github.com/langchain-ai/agent-chat-ui?tab=readme-ov-file#going-to-production) section for more information.

// 标记为动态路由，确保路由是动态处理的
export const dynamic = 'force-dynamic';

// 目标后端服务地址 - 从环境变量读取，提供默认值
const BACKEND_URL = process.env.LANGGRAPH_API_URL || 'http://localhost:2024';

// 添加调试日志，查看当前环境和后端URL配置
console.log(`API代理配置：使用后端服务 ${BACKEND_URL}`);

// 处理所有HTTP方法 - 先await整个params对象
export async function GET(
  request: NextRequest,
  context: { params: { _path: string[] } }
) {
  const params = await context.params;
  return proxyRequest(request, params._path, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: { _path: string[] } }
) {
  const params = await context.params;
  return proxyRequest(request, params._path, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: { _path: string[] } }
) {
  const params = await context.params;
  return proxyRequest(request, params._path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: { _path: string[] } }
) {
  const params = await context.params;
  return proxyRequest(request, params._path, 'DELETE');
}

export async function OPTIONS(
  request: NextRequest,
  context: { params: { _path: string[] } }
) {
  const params = await context.params;
  return proxyRequest(request, params._path, 'OPTIONS');
}

// 通用代理函数
async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const url = new URL(request.url);
  
  // 添加调试日志
  console.log('原始路径段:', pathSegments);
  
  // 构建目标路径 - 确保没有api前缀
  // 在App Router中，pathSegments不应该包含'api'，但为安全起见进行过滤
  const filteredSegments = pathSegments.filter(segment => segment !== 'api');
  const targetPath = filteredSegments.join('/');
  
  // 构建完整的目标URL
  const targetUrl = `${BACKEND_URL}/${targetPath}${url.search}`;
  
  // 添加调试日志
  console.log(`代理请求: ${request.url} -> ${targetUrl}`);

  try {
    // 准备转发请求头
    const headers = new Headers();
    
    // 复制原始请求头，过滤掉一些特定的头
    request.headers.forEach((value, key) => {
      // 跳过一些特定的头，这些通常会由fetch自动处理
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });
    
    // 明确设置Accept头，如果请求期望事件流
    if (request.headers.get('accept')?.includes('text/event-stream')) {
      headers.set('Accept', 'text/event-stream');
    }
    
    // 创建请求选项
    const requestInit: RequestInit = {
      method: method,
      headers: headers,
      // 如果不是GET或HEAD请求，需要包含请求体
      ...(method !== 'GET' && method !== 'HEAD' && request.body 
          ? { body: request.body } 
          : {}),
      // 禁止响应缓存
      cache: 'no-store',
      // 支持流式响应传输
      // @ts-ignore - duplex选项在某些环境中可能需要
      duplex: 'half',
    };

    // 发送请求到后端
    const response = await fetch(targetUrl, requestInit);

    // 检查响应状态
    if (!response.ok && response.status !== 101) { // 101是WebSocket的Switching Protocols
      console.error(`Backend error: ${response.status}`);
      const errorText = await response.text();
      return new NextResponse(`Backend error: ${response.status} ${errorText}`, { 
        status: response.status 
      });
    }

    // 准备响应头
    const responseHeaders = new Headers();
    
    // 复制所有的响应头
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });
    
    // 确保设置正确的流控制头
    responseHeaders.set('X-Accel-Buffering', 'no');
    
    // 如果响应是事件流，确保关键头信息存在
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('text/event-stream')) {
      if (!responseHeaders.has('Cache-Control')) {
        responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      // 添加其他流式数据所需的头
      if (!responseHeaders.has('Connection')) {
        responseHeaders.set('Connection', 'keep-alive');
      }
    }

    // 返回代理响应
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Internal Server Error during proxy', { 
      status: 500 
    });
  }
}
