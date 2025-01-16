/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            'pbs.twimg.com',  // Twitter profile images
            'abs.twimg.com',  // Twitter default images
        ],
    },
    reactStrictMode: true,
}

module.exports = nextConfig 