import { ChainConfig } from '../types/web3';

// Smart contract addresses
export const NFT_CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  1: '0x721d5c2F3edaAb5f7128A68c702Fb5F1E1f1A343', // Ethereum Mainnet
  137: '0x721d5c2F3edaAb5f7128A68c702Fb5F1E1f1A343', // Polygon Mainnet
  5: '0x55A0dAF6f56aCfc29B0a383e8D55A0724babDf7a', // Goerli Testnet
  80001: '0x55A0dAF6f56aCfc29B0a383e8D55A0724babDf7a', // Mumbai Testnet
};

// Chain configurations
export const CHAIN_CONFIG: { [chainId: number]: ChainConfig } = {
  1: {
    chainId: 1,
    chainIdHex: '0x1',
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://mainnet.infura.io/v3/${INFURA_API_KEY}'],
    blockExplorerUrls: ['https://etherscan.io'],
    logoUrl: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  137: {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon Mainnet',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com'],
    logoUrl: 'https://polygon.technology/images/polygon-logo.svg',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  5: {
    chainId: 5,
    chainIdHex: '0x5',
    name: 'Goerli Testnet',
    symbol: 'ETH',
    decimals: 18,
    rpcUrls: ['https://goerli.infura.io/v3/${INFURA_API_KEY}'],
    blockExplorerUrls: ['https://goerli.etherscan.io'],
    logoUrl: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png',
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  80001: {
    chainId: 80001,
    chainIdHex: '0x13881',
    name: 'Mumbai Testnet',
    symbol: 'MATIC',
    decimals: 18,
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    logoUrl: 'https://polygon.technology/images/polygon-logo.svg',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://api.versearendream.com',
  NFT: {
    MINT: '/nft/mint',
    GET_BY_OWNER: '/nft/owner/',
    GET_BY_ID: '/nft/',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    AUTHENTICATE: '/user/auth',
  },
  AGENT: {
    TASKS: '/agent/tasks',
    START_TASK: '/agent/tasks/start',
    COMPLETE_TASK: '/agent/tasks/complete',
  },
};

// IPFS configuration
export const IPFS_CONFIG = {
  GATEWAY: 'https://ipfs.io/ipfs/',
  API_URL: process.env.REACT_APP_IPFS_API_URL || 'https://api.pinata.cloud/pinning',
  API_KEY: process.env.REACT_APP_IPFS_API_KEY || '',
  API_SECRET: process.env.REACT_APP_IPFS_API_SECRET || '',
};

// Application settings
export const APP_SETTINGS = {
  APP_NAME: 'Verse ArenaDream',
  COPYRIGHT_YEAR: new Date().getFullYear(),
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  DEFAULT_CHAIN_ID: 137, // Polygon Mainnet
  DEFAULT_AVATAR: 'https://via.placeholder.com/150?text=VAD',
  MIN_MINT_FEE: '0.05', // In ETH/MATIC
  GAS_LIMIT_MINT: '285000',
};

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/versearendream',
  DISCORD: 'https://discord.gg/versearendream',
  TELEGRAM: 'https://t.me/versearendream',
  GITHUB: 'https://github.com/versearendream',
  MEDIUM: 'https://medium.com/@versearendream',
};

export default {
  NFT_CONTRACT_ADDRESSES,
  CHAIN_CONFIG,
  API_ENDPOINTS,
  IPFS_CONFIG,
  APP_SETTINGS,
  SOCIAL_LINKS,
}; 