/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'pbs.twimg.com',  // Twitter profile images
            'abs.twimg.com',  // Twitter default images
        ],
    },
    reactStrictMode: false,
}

module.exports = nextConfig 