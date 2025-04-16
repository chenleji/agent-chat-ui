/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.100.5', '*.192.168.100.5'],

    async rewrites() {
        return [
            {
                source: '/image/:path*',
                destination: 'https://your-image-server.com/:path*', // 替换为图片服务器地址
            },
            {
                source: '/auth/:path*',
                destination: 'https://your-image-server.com/:path*', // 替换认证服务器地址
            },
            {
                // 添加对/info的代理
                source: '/info',
                destination: 'http://localhost:2024/info', // 指向本地LangGraph服务
            },
            {
                // 为其他LangGraph API路径添加通用代理
                source: '/api/:path*',
                destination: 'http://localhost:2024/:path*', // 指向本地LangGraph服务
            },
            {
                // 所有用户管理相关服务
                source: '/user/:path*',
                destination: 'http://localhost:8000/:path*', // 指向本地用户管理服务
            }
        ];
    },

    async headers() {
        return [
            {
                source: '/(info|api|image|auth|user/:path*)',
                headers: [
                    // 其他头...
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Api-Key' },
                ],
            },
        ];
    },
};

export default nextConfig;
