const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('VerseArenaDreamIdolNFT Contract', function () {
  let VerseArenaDreamIdolNFT;
  let verseArenaDreamIdolNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get contract factory and signers
    VerseArenaDreamIdolNFT = await ethers.getContractFactory('VerseArenaDreamIdolNFT');
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy a new instance of the contract before each test
    verseArenaDreamIdolNFT = await VerseArenaDreamIdolNFT.deploy();
    await verseArenaDreamIdolNFT.deployed();
  });

  describe('Deployment', function () {
    it('Should set the right owner', async function () {
      expect(await verseArenaDreamIdolNFT.owner()).to.equal(owner.address);
    });

    it('Should have the correct name and symbol', async function () {
      expect(await verseArenaDreamIdolNFT.name()).to.equal('VerseArenaDream Idol');
      expect(await verseArenaDreamIdolNFT.symbol()).to.equal('VADIDOL');
    });

    it('Should set the initial mint fee to 0.05 ether', async function () {
      const mintFee = await verseArenaDreamIdolNFT.mintFee();
      expect(mintFee).to.equal(ethers.utils.parseEther('0.05'));
    });

    it('Should approve the deployer as a minter', async function () {
      expect(await verseArenaDreamIdolNFT.approvedMinters(owner.address)).to.equal(true);
    });
  });

  describe('Minting', function () {
    it('Should allow the owner to mint without a fee', async function () {
      const tokenURI = 'ipfs://QmXdZJZ8VNXZsUW3iAP3NCQQcHJGrxTZVDnTJkDnuh9ZQx';
      
      await expect(verseArenaDreamIdolNFT.mint(addr1.address, tokenURI))
        .to.emit(verseArenaDreamIdolNFT, 'IdolCreated')
        .withArgs(1, addr1.address, tokenURI);
      
      expect(await verseArenaDreamIdolNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await verseArenaDreamIdolNFT.getCreator(1)).to.equal(addr1.address);
      expect(await verseArenaDreamIdolNFT.tokenURI(1)).to.equal(tokenURI);
    });

    it('Should require a mint fee for non-owners', async function () {
      const tokenURI = 'ipfs://QmXdZJZ8VNXZsUW3iAP3NCQQcHJGrxTZVDnTJkDnuh9ZQx';
      
      // Approve addr1 as a minter
      await verseArenaDreamIdolNFT.setMinterApproval(addr1.address, true);
      
      // Try to mint with insufficient fee
      await expect(
        verseArenaDreamIdolNFT.connect(addr1).mint(addr1.address, tokenURI, { value: ethers.utils.parseEther('0.04') })
      ).to.be.revertedWith('Insufficient fee');
      
      // Mint with correct fee
      await expect(
        verseArenaDreamIdolNFT.connect(addr1).mint(addr1.address, tokenURI, { value: ethers.utils.parseEther('0.05') })
      ).to.emit(verseArenaDreamIdolNFT, 'IdolCreated');
    });

    it('Should not allow non-approved addresses to mint', async function () {
      const tokenURI = 'ipfs://QmXdZJZ8VNXZsUW3iAP3NCQQcHJGrxTZVDnTJkDnuh9ZQx';
      
      await expect(
        verseArenaDreamIdolNFT.connect(addr1).mint(addr1.address, tokenURI, { value: ethers.utils.parseEther('0.05') })
      ).to.be.revertedWith('Not approved to mint');
    });
    
    it('Should increment token IDs correctly', async function () {
      const tokenURI1 = 'ipfs://QmXdZJZ8VNXZsUW3iAP3NCQQcHJGrxTZVDnTJkDnuh9ZQx';
      const tokenURI2 = 'ipfs://QmYdZJZ8VNXZsUW3iAP3NCQQcHJGrxTZVDnTJkDnuh9ZQy';
      
      await verseArenaDreamIdolNFT.mint(addr1.address, tokenURI1);
      await verseArenaDreamIdolNFT.mint(addr2.address, tokenURI2);
      
      expect(await verseArenaDreamIdolNFT.ownerOf(1)).to.equal(addr1.address);
      expect(await verseArenaDreamIdolNFT.ownerOf(2)).to.equal(addr2.address);
    });
  });

  describe('Fee Management', function () {
    it('Should allow the owner to update the mint fee', async function () {
      await verseArenaDreamIdolNFT.setMintFee(ethers.utils.parseEther('0.1'));
      expect(await verseArenaDreamIdolNFT.mintFee()).to.equal(ethers.utils.parseEther('0.1'));
    });

    it('Should not allow non-owners to update the mint fee', async function () {
      await expect(
        verseArenaDreamIdolNFT.connect(addr1).setMintFee(ethers.utils.parseEther('0.1'))
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should allow the owner to update the platform fee percentage', async function () {
      await verseArenaDreamIdolNFT.setPlatformFeePercentage(500); // 5%
      expect(await verseArenaDreamIdolNFT.platformFeePercentage()).to.equal(500);
    });

    it('Should not allow platform fee percentage above 30%', async function () {
      await expect(
        verseArenaDreamIdolNFT.setPlatformFeePercentage(3100) // 31%
      ).to.be.revertedWith('Fee too high');
    });
  });

  describe('Royalty Management', function () {
    it('Should calculate royalties correctly', async function () {
      // Default royalty is 7.5%
      expect(await verseArenaDreamIdolNFT.calculateRoyalty(ethers.utils.parseEther('1'))).to.equal(
        ethers.utils.parseEther('0.075')
      );
      
      // Update royalty to 10%
      await verseArenaDreamIdolNFT.setRoyaltyPercentage(1000);
      
      expect(await verseArenaDreamIdolNFT.calculateRoyalty(ethers.utils.parseEther('1'))).to.equal(
        ethers.utils.parseEther('0.1')
      );
    });

    it('Should not allow royalty percentage above 30%', async function () {
      await expect(
        verseArenaDreamIdolNFT.setRoyaltyPercentage(3100) // 31%
      ).to.be.revertedWith('Royalty too high');
    });
  });

  describe('Minter Management', function () {
    it('Should allow the owner to approve minters', async function () {
      expect(await verseArenaDreamIdolNFT.approvedMinters(addr1.address)).to.equal(false);
      
      await verseArenaDreamIdolNFT.setMinterApproval(addr1.address, true);
      
      expect(await verseArenaDreamIdolNFT.approvedMinters(addr1.address)).to.equal(true);
    });

    it('Should allow the owner to revoke minter approval', async function () {
      await verseArenaDreamIdolNFT.setMinterApproval(addr1.address, true);
      expect(await verseArenaDreamIdolNFT.approvedMinters(addr1.address)).to.equal(true);
      
      await verseArenaDreamIdolNFT.setMinterApproval(addr1.address, false);
      expect(await verseArenaDreamIdolNFT.approvedMinters(addr1.address)).to.equal(false);
    });

    it('Should not allow non-owners to manage minters', async function () {
      await expect(
        verseArenaDreamIdolNFT.connect(addr1).setMinterApproval(addr2.address, true)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('Withdrawal', function () {
    it('Should allow the owner to withdraw funds', async function () {
      // Approve addr1 as a minter
      await verseArenaDreamIdolNFT.setMinterApproval(addr1.address, true);
      
      // Mint with fee
      await verseArenaDreamIdolNFT.connect(addr1).mint(
        addr1.address, 
        'ipfs://QmXdZJZ8VNXZsUW3iAP3NCQQcHJGrxTZVDnTJkDnuh9ZQx',
        { value: ethers.utils.parseEther('0.05') }
      );
      
      // Check contract balance
      const contractBalance = await ethers.provider.getBalance(verseArenaDreamIdolNFT.address);
      expect(contractBalance).to.equal(ethers.utils.parseEther('0.05'));
      
      // Get owner balance before withdrawal
      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      // Withdraw funds
      const tx = await verseArenaDreamIdolNFT.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      
      // Get owner balance after withdrawal
      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      
      // Check that owner received the funds (accounting for gas)
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.add(contractBalance).sub(gasUsed)
      );
      
      // Check that contract balance is now zero
      expect(await ethers.provider.getBalance(verseArenaDreamIdolNFT.address)).to.equal(0);
    });

    it('Should not allow non-owners to withdraw funds', async function () {
      await expect(
        verseArenaDreamIdolNFT.connect(addr1).withdraw()
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should not allow withdrawal if balance is zero', async function () {
      await expect(
        verseArenaDreamIdolNFT.withdraw()
      ).to.be.revertedWith('No balance to withdraw');
    });
  });
}); 