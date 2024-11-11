// scripts/withdraw.js

const hre = require('hardhat');
const abi = require('../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json');

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.formatEther(balanceBigInt);
}

async function main() {
  // Get the contract that has been deployed to Sepolia.
  const contractAddress = '0x06B40777782Ff4934819DFa3A6B185eb134feB09';
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.JsonRpcProvider(process.env.SEPOLIA_URL);

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  // Check starting balances.
  console.log(
    'current balance of owner: ',
    await getBalance(provider, signer.address),
    'ETH'
  );

  const buyMeACoffeeAddress = await buyMeACoffee.getAddress();
  const contractBalance = await getBalance(provider, buyMeACoffeeAddress);

  console.log(
    'current balance of contract: ',
    await getBalance(provider, buyMeACoffeeAddress),
    'ETH'
  );

  // Withdraw funds if there are funds to withdraw.
  if (contractBalance !== '0.0') {
    console.log('withdrawing funds..');
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log('no funds to withdraw!');
  }

  // Check ending balance.
  console.log(
    'current balance of owner: ',
    await getBalance(provider, signer.address),
    'ETH'
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
