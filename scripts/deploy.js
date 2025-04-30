const { ethers } = require('hardhat');

async function main() {
  console.log('Deploying Verse ArenaDream Idol NFT contract...');

  // Get the contract factory
  const VerseArenaDreamIdolNFT = await ethers.getContractFactory('VerseArenaDreamIdolNFT');

  // Deploy the contract
  const verseArenaDreamIdolNFT = await VerseArenaDreamIdolNFT.deploy();

  // Wait for deployment to finish
  await verseArenaDreamIdolNFT.deployed();

  console.log('VerseArenaDreamIdolNFT deployed to:', verseArenaDreamIdolNFT.address);

  // Wait for etherscan to index the contract
  console.log('Waiting for Etherscan to index the contract...');
  await new Promise(resolve => setTimeout(resolve, 60000)); // 60 seconds

  // Verify the contract on Etherscan
  console.log('Verifying contract on Etherscan...');
  try {
    await hre.run('verify:verify', {
      address: verseArenaDreamIdolNFT.address,
      constructorArguments: [],
    });
    console.log('Contract verified on Etherscan!');
  } catch (error) {
    console.error('Error verifying contract:', error);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 