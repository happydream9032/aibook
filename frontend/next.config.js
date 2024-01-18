/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    // webpack: (config) => {
    //     // Add a rule to handle HTML files
    //     config.module.rules.push({
    //       test: /\.html$/,
    //       use: 'html-loader',
    //     });
    //     return config;
    //   },
}

module.exports = nextConfig