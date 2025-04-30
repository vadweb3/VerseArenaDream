export interface IdolTemplate {
  id: number;
  name: string;
  image: string;
  style: string;
  description?: string;
}

export interface CustomizationOption {
  id: number;
  name: string;
  style: string;
  image?: string;
  price?: number;
}

export interface PersonalityType {
  id: number;
  name: string;
  description?: string;
  traits?: string[];
}

export interface IdolAttributes {
  template: IdolTemplate | null;
  hairStyle: CustomizationOption | null;
  outfit: CustomizationOption | null;
  accessory: CustomizationOption | null;
  personality: PersonalityType | null;
  voicePitch: number;
  stats?: IdolStats;
}

export interface IdolStats {
  charisma: number;
  intelligence: number;
  talent: number;
  energy: number;
  popularity: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  isConnected: boolean;
}

export interface TokenInfo {
  symbol: string;
  decimals: number;
  balance: string;
  address: string;
}

export enum ChainId {
  ETHEREUM = 1,
  POLYGON = 137,
  SOLANA = 999, // Custom code for Solana
}

export interface MetaverseEvent {
  id: string;
  name: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  capacity: number;
  attendees: number;
  entryFee: number;
  creatorShare: number;
}

export interface AgentTask {
  id: string;
  type: 'STREAM' | 'CONCERT' | 'COMPETITION' | 'SOCIAL';
  name: string;
  description: string;
  duration: number; // in minutes
  energy: number; // energy required
  cooldown: number; // in minutes
  reward: number; // $VAD tokens
  status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface UserProfile {
  id: string;
  username: string;
  walletAddress: string;
  avatarUrl: string;
  bio: string;
  idols: string[]; // IDs of owned idols
  $vadBalance: string;
  createdAt: Date;
  reputation: number;
} 