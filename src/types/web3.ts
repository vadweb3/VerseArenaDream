import { ethers } from 'ethers';

export interface Web3ProviderState {
  provider: ethers.providers.Web3Provider | null;
  web3Provider: any;
  address: string | null;
  network: ethers.providers.Network | null;
  connected: boolean;
  chainId: number | null;
  connecting: boolean;
  error: string | null;
}

export interface TransactionResponse {
  hash: string;
  from: string;
  to: string | null;
  value: ethers.BigNumber;
  gasLimit: ethers.BigNumber;
  gasPrice: ethers.BigNumber;
  nonce: number;
  data: string;
  chainId: number;
  wait: (confirmations?: number) => Promise<TransactionReceipt>;
}

export interface TransactionReceipt {
  to: string | null;
  from: string;
  contractAddress: string | null;
  transactionIndex: number;
  gasUsed: ethers.BigNumber;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<Log>;
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: ethers.BigNumber;
  effectiveGasPrice: ethers.BigNumber;
  status: number;
  type: number;
  byzantium: boolean;
}

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: Array<string>;
  transactionHash: string;
  logIndex: number;
}

export interface ContractCallOptions {
  value?: ethers.BigNumber | string;
  gasLimit?: ethers.BigNumber | string;
  gasPrice?: ethers.BigNumber | string;
  nonce?: number;
}

export interface NFTContractAddress {
  [chainId: number]: string;
}

export interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored
}

export interface SwitchEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
}

export interface ChainConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  symbol: string;
  decimals: number;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  logoUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface MintNFTParams {
  to: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  contractAddress: string;
  value?: string;
}

export enum Web3ConnectionStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Error = 'error',
}

export const SUPPORTED_CHAINS = {
  ETHEREUM_MAINNET: 1,
  POLYGON_MAINNET: 137,
  ETHEREUM_GOERLI: 5,
  POLYGON_MUMBAI: 80001,
}; 