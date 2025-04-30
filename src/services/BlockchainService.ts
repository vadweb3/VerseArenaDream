import { ethers } from 'ethers';
import { NFTMetadata, ChainId } from '../types';

// ABI for ERC-721 NFT contract
const NFT_ABI = [
  'function mint(address to, string memory tokenURI) public returns (uint256)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

// Mock contract addresses for different networks
const CONTRACT_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x721d5c2F3edaAb5f7128A68c702Fb5F1E1f1A343',
  [ChainId.POLYGON]: '0x721d5c2F3edaAb5f7128A68c702Fb5F1E1f1A343',
};

// IPFS gateway
const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

class BlockchainService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private nftContract: ethers.Contract | null = null;
  private chainId: ChainId = ChainId.ETHEREUM;

  // Initialize the service with an Ethereum provider
  async initialize(ethereumProvider: any): Promise<void> {
    try {
      this.provider = new ethers.providers.Web3Provider(ethereumProvider);
      this.signer = this.provider.getSigner();
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId as ChainId;
      
      const contractAddress = CONTRACT_ADDRESSES[this.chainId];
      if (contractAddress) {
        this.nftContract = new ethers.Contract(contractAddress, NFT_ABI, this.signer);
      } else {
        throw new Error(`No contract found for chain ID ${this.chainId}`);
      }
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  // Connect to wallet
  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    await this.provider.send('eth_requestAccounts', []);
    const signer = this.provider.getSigner();
    return await signer.getAddress();
  }

  // Get account balance
  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    const balance = await this.provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }

  // Store metadata on IPFS
  async storeMetadataOnIPFS(metadata: NFTMetadata): Promise<string> {
    // In a real implementation, this would upload the metadata to IPFS
    // For now, we'll just simulate it
    
    // Generate a mock CID (IPFS Content Identifier)
    const mockCid = 'Qm' + Math.random().toString(36).substring(2, 30);
    console.log('Storing metadata on IPFS:', metadata);
    
    return `${IPFS_GATEWAY}${mockCid}`;
  }

  // Mint NFT
  async mintNFT(toAddress: string, metadata: NFTMetadata): Promise<string> {
    if (!this.nftContract || !this.signer) {
      throw new Error('Contract or signer not initialized');
    }
    
    try {
      // Store metadata on IPFS
      const tokenURI = await this.storeMetadataOnIPFS(metadata);
      
      // Mint the NFT
      const tx = await this.nftContract.mint(toAddress, tokenURI);
      const receipt = await tx.wait();
      
      // Get the token ID from the Transfer event
      const transferEvent = receipt.events.find((event: any) => event.event === 'Transfer');
      const tokenId = transferEvent.args.tokenId.toString();
      
      return tokenId;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  // Switch network
  async switchNetwork(chainId: ChainId): Promise<void> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }
    
    try {
      await this.provider.send('wallet_switchEthereumChain', [
        { chainId: '0x' + chainId.toString(16) },
      ]);
      
      // Update the chainId
      this.chainId = chainId;
      
      // Update the contract
      const contractAddress = CONTRACT_ADDRESSES[chainId];
      if (contractAddress && this.signer) {
        this.nftContract = new ethers.Contract(contractAddress, NFT_ABI, this.signer);
      }
    } catch (error: any) {
      // If the error code is 4902, the chain isn't added to MetaMask
      if (error.code === 4902) {
        // In a real implementation, you would add the chain to MetaMask
        throw new Error('Chain not added to wallet. Please add it manually.');
      }
      throw error;
    }
  }

  // Get NFT metadata
  async getNFTMetadata(tokenId: string): Promise<NFTMetadata> {
    if (!this.nftContract) {
      throw new Error('Contract not initialized');
    }
    
    try {
      const tokenURI = await this.nftContract.tokenURI(tokenId);
      
      // In a real implementation, this would fetch the metadata from IPFS
      // For now, we'll just simulate it
      
      // Mock metadata
      const mockMetadata: NFTMetadata = {
        name: 'VerseArenaDream Idol #' + tokenId,
        description: 'A virtual idol in the Verse ArenaDream metaverse',
        image: 'https://via.placeholder.com/500?text=Idol-' + tokenId,
        attributes: [
          { trait_type: 'Style', value: 'Cyberpunk' },
          { trait_type: 'Personality', value: 'Competitive Gamer' },
          { trait_type: 'Voice Pitch', value: 75 },
        ],
      };
      
      return mockMetadata;
    } catch (error) {
      console.error('Failed to get NFT metadata:', error);
      throw error;
    }
  }
}

// Export as singleton
export default new BlockchainService(); 