/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: ['firebasestorage.googleapis.com', 'pbs.twimg.com'],
        unoptimized: true,
        remotePatterns: [
            {
              protocol: "https",
              hostname: "pbs.twimg.com", // 替换为您的图片域名
              pathname: "/profile_images/**", // 更加具体地匹配路径
            },
          ],
    },
}

module.exports = nextConfig 