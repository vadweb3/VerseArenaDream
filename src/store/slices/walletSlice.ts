import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { WalletInfo, TokenInfo, ChainId } from '../../types';

// Import ethers and Web3 in a real implementation
// This is a simplified version

interface WalletState {
  walletInfo: WalletInfo;
  isConnecting: boolean;
  error: string | null;
  provider: any; // This would be ethers.providers.Web3Provider in a real implementation
  tokenBalances: TokenInfo[];
  selectedChain: ChainId;
  supportedChains: ChainId[];
  pendingTransactions: string[];
}

const initialState: WalletState = {
  walletInfo: {
    address: '',
    balance: '0',
    network: '',
    isConnected: false,
  },
  isConnecting: false,
  error: null,
  provider: null,
  tokenBalances: [],
  selectedChain: ChainId.ETHEREUM,
  supportedChains: [ChainId.ETHEREUM, ChainId.POLYGON],
  pendingTransactions: [],
};

// Async thunks for wallet operations
export const connectWallet = createAsyncThunk(
  'wallet/connect',
  async (_, { rejectWithValue }) => {
    try {
      // In a real implementation, this would connect to MetaMask or another wallet
      // For now, we'll just simulate a connection
      const mockWalletInfo: WalletInfo = {
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        balance: '1.45',
        network: 'Ethereum Mainnet',
        isConnected: true,
      };
      return mockWalletInfo;
    } catch (error) {
      return rejectWithValue('Failed to connect wallet: ' + (error as Error).message);
    }
  }
);

export const switchChain = createAsyncThunk(
  'wallet/switchChain',
  async (chainId: ChainId, { rejectWithValue }) => {
    try {
      // In a real implementation, this would request the wallet to switch chains
      let networkName = '';
      switch (chainId) {
        case ChainId.ETHEREUM:
          networkName = 'Ethereum Mainnet';
          break;
        case ChainId.POLYGON:
          networkName = 'Polygon Mainnet';
          break;
        case ChainId.SOLANA:
          networkName = 'Solana Mainnet';
          break;
        default:
          throw new Error('Unsupported chain');
      }
      
      return { chainId, networkName };
    } catch (error) {
      return rejectWithValue('Failed to switch chain: ' + (error as Error).message);
    }
  }
);

export const mintNFT = createAsyncThunk(
  'wallet/mintNFT',
  async (metadata: any, { rejectWithValue }) => {
    try {
      // In a real implementation, this would mint an NFT on the blockchain
      // For now, we'll just simulate a transaction
      const txHash = '0x' + Math.random().toString(16).substring(2, 42);
      return { txHash, metadata };
    } catch (error) {
      return rejectWithValue('Failed to mint NFT: ' + (error as Error).message);
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
    addPendingTransaction: (state, action: PayloadAction<string>) => {
      state.pendingTransactions.push(action.payload);
    },
    removePendingTransaction: (state, action: PayloadAction<string>) => {
      state.pendingTransactions = state.pendingTransactions.filter(
        (tx) => tx !== action.payload
      );
    },
    disconnect: (state) => {
      state.walletInfo = initialState.walletInfo;
      state.provider = null;
      state.tokenBalances = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Connect wallet
      .addCase(connectWallet.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state, action) => {
        state.isConnecting = false;
        state.walletInfo = action.payload;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload as string;
      })
      // Switch chain
      .addCase(switchChain.fulfilled, (state, action) => {
        state.selectedChain = action.payload.chainId;
        state.walletInfo.network = action.payload.networkName;
      })
      .addCase(switchChain.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Mint NFT
      .addCase(mintNFT.fulfilled, (state, action) => {
        state.pendingTransactions.push(action.payload.txHash);
      })
      .addCase(mintNFT.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setProvider, addPendingTransaction, removePendingTransaction, disconnect } =
  walletSlice.actions;

export default walletSlice.reducer; 