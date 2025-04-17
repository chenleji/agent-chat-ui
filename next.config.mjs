/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    allowedDevOrigins: ['192.168.100.5', '*.192.168.100.5'],

    async rewrites() {
        return [
            {
                // 所有图片管理相关服务
                source: '/image/:path*',
                destination: 'http://localhost:8000/:path*',
            },
            {
                // 所有文件管理相关服务
                source: '/file/:path*',
                destination: 'http://localhost:8000/:path*', 
            },
            {
                // 所有用户管理相关服务
                source: '/user/:path*',
                destination: 'http://localhost:8000/:path*', 
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
        ];
    },

    async headers() {
        return [
            {
                source: '/(info|api|image|file|user/:path*)',
                headers: [
                    // 其他头...
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Api-Key' },
                ],
            },
        ];
    },
};

export default nextConfig;
