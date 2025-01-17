import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  //   images: {
  //     domains: ['firebasestorage.googleapis.com', 'pbs.twimg.com'],
  // },
  /* config options here */
  // images: {
  //   loader: 'custom',
  //   loaderFile: './my-loader.ts',
  // },
  distDir: 'dist',
  images: {
    // domains: [
    //     'pbs.twimg.com',  // Twitter profile images
    //     'abs.twimg.com',  // Twitter default images
    // ],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pbs.twimg.com", // 替换为您的图片域名
        pathname: "/profile_images/**", // 更加具体地匹配路径
      },
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
