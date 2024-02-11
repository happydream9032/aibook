/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  images: {
    domains: ["img.clerk.com", "localhost","127.0.0.1"],
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
