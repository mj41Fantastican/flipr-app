import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Flipr - Losers Lounge',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'd16c0baa4e12ffe18995599014e7e43e',
  chains: [base],
  ssr: true,
});

// Contract addresses
export const FLIPR_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FLIPR_CONTRACT_ADDRESS || '0xbA0a2153B7E3a3Ce91263a9418DD7350d07E67fe';
export const USDC_CONTRACT_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base mainnet USDC

// Treasury address
export const TREASURY_ADDRESS = '0x50ef686123D82E0a37BC62AbcBdf1526FDE85DE6';

// Pricing (in smallest units)
export const CLASSIC_FEE = BigInt(410000); // $0.41 in USDC (6 decimals)
export const DEGEN_FEE = BigInt(690000); // $0.69 in USDC (6 decimals)
export const MINT_FEE = BigInt(410000); // $0.41 in USDC (6 decimals)
