// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();

 // Deploy the contract.
 await buyMeACoffee.getDeployedCode();
 const buyMeACoffeeAddress = await buyMeACoffee.getAddress();

  console.log("BuyMeACoffee deployed to:", buyMeACoffeeAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });