/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3',
    NEXT_PUBLIC_PREPROD_RPC: process.env.NEXT_PUBLIC_PREPROD_RPC || 'https://rpc.preprod.midnight.network'
  }
};

module.exports = nextConfig;
