/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    
    // 设置代理超时时间，避免长连接被过早关闭
    experimental: {
        proxyTimeout: 3600000, // 1小时超时，对于流式响应非常重要
    },

    // 配置API和服务路由转发
    async rewrites() {
        const AgentExtServiceUrl = process.env.AGENT_EXT_SERVICE_URL || 'http://localhost:8000';
        return {
            // 路由转发配置，这些路由在浏览器中不可见
            beforeFiles: [
                {
                    // 所有图片管理相关服务
                    source: '/image/:path*',
                    destination: `${AgentExtServiceUrl}/image/:path*`,
                },
                {
                    // 所有文件管理相关服务
                    source: '/file/:path*',
                    destination: `${AgentExtServiceUrl}/file/:path*`,
                },
                {
                    // 所有用户管理相关服务
                    source: '/user/:path*',
                    destination: `${AgentExtServiceUrl}/:path*`, 
                }
            ],
            // 可选：fallback路由配置（如果需要的话）
            fallback: []
        };
    },

    async headers() {
        return [
            {
                // 其他需要认证的API
                source: '/(image|file|user)/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Api-Key, Authorization' },
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                ],
            }
        ];
    },
};

export default nextConfig;

