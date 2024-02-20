/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: false,
  images: {
    domains: ["img.clerk.com", "localhost", "127.0.0.1"],
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // webpack: (config) => {
  //     // Add a rule to handle HTML files
  //     config.module.rules.push({
  //       test: /\.html$/,
  //       use: 'html-loader',
  //     });
  //     return config;
  //   },
};

module.exports = nextConfig;
