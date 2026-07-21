/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xac1b8cf244467604f60ff7a15f05edb779157c03',
    NEXT_PUBLIC_PREPROD_RPC: process.env.NEXT_PUBLIC_PREPROD_RPC || 'https://rpc.preprod.midnight.network'
  }
};

module.exports = nextConfig;
