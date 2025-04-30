// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VerseArenaDreamIdolNFT
 * @dev ERC721 token for Verse ArenaDream virtual idols
 */
contract VerseArenaDreamIdolNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    
    // NFT creation fee in wei
    uint256 public mintFee = 0.05 ether;
    
    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeePercentage = 250;
    
    // Creator royalty percentage for secondary sales (in basis points)
    uint256 public royaltyPercentage = 750;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public creators;
    
    // Mapping to track minting approvals
    mapping(address => bool) public approvedMinters;
    
    // Events
    event IdolCreated(uint256 indexed tokenId, address indexed creator, string tokenURI);
    event MintFeeUpdated(uint256 newFee);
    event PlatformFeeUpdated(uint256 newPercentage);
    event RoyaltyPercentageUpdated(uint256 newPercentage);
    event MinterStatusUpdated(address minter, bool status);
    
    constructor() ERC721("VerseArenaDream Idol", "VADIDOL") {
        // Grant minting approval to the deployer
        approvedMinters[msg.sender] = true;
    }
    
    /**
     * @dev Mint a new idol NFT
     * @param to The address that will own the NFT
     * @param tokenURI The IPFS URI containing the metadata
     * @return The new token ID
     */
    function mint(address to, string memory tokenURI) public payable nonReentrant returns (uint256) {
        // Check if sender is approved or is the owner
        require(
            approvedMinters[msg.sender] || msg.sender == owner(),
            "Not approved to mint"
        );
        
        // If not the owner, require the mint fee
        if (msg.sender != owner()) {
            require(msg.value >= mintFee, "Insufficient fee");
        }
        
        // Increment the token ID counter
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        
        // Mint the NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Record the creator
        creators[tokenId] = to;
        
        // Emit event
        emit IdolCreated(tokenId, to, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Get the creator of a token
     * @param tokenId The token ID
     * @return The creator's address
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return creators[tokenId];
    }
    
    /**
     * @dev Calculate royalty amount for a sale
     * @param salePrice The sale price
     * @return royaltyAmount The royalty amount
     */
    function calculateRoyalty(uint256 salePrice) public view returns (uint256) {
        return (salePrice * royaltyPercentage) / 10000;
    }
    
    /**
     * @dev Set the mint fee
     * @param newMintFee The new mint fee
     */
    function setMintFee(uint256 newMintFee) external onlyOwner {
        mintFee = newMintFee;
        emit MintFeeUpdated(newMintFee);
    }
    
    /**
     * @dev Set the platform fee percentage
     * @param newPercentage The new platform fee percentage (in basis points)
     */
    function setPlatformFeePercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 3000, "Fee too high"); // Max 30%
        platformFeePercentage = newPercentage;
        emit PlatformFeeUpdated(newPercentage);
    }
    
    /**
     * @dev Set the royalty percentage
     * @param newPercentage The new royalty percentage (in basis points)
     */
    function setRoyaltyPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 3000, "Royalty too high"); // Max 30%
        royaltyPercentage = newPercentage;
        emit RoyaltyPercentageUpdated(newPercentage);
    }
    
    /**
     * @dev Update minter approval status
     * @param minter The address to update
     * @param status The new approval status
     */
    function setMinterApproval(address minter, bool status) external onlyOwner {
        approvedMinters[minter] = status;
        emit MinterStatusUpdated(minter, status);
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Override base URI
     */
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }
    
    /**
     * @dev Override to add owner check
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        return (spender == owner() || super._isApprovedOrOwner(spender, tokenId));
    }
} 