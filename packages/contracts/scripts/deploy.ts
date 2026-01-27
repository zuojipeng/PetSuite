import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PetSuite contracts to Monad...");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy PetNFT
  console.log("\n1. Deploying PetNFT...");
  const PetNFT = await ethers.getContractFactory("PetNFT");
  const petNFT = await PetNFT.deploy();
  await petNFT.waitForDeployment();
  const petNFTAddress = await petNFT.getAddress();
  console.log("✅ PetNFT deployed to:", petNFTAddress);

  // Deploy RecommendationVault
  console.log("\n2. Deploying RecommendationVault...");
  const Vault = await ethers.getContractFactory("RecommendationVault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ RecommendationVault deployed to:", vaultAddress);

  // Deploy AIServicePayment
  console.log("\n3. Deploying AIServicePayment...");
  const AIService = await ethers.getContractFactory("AIServicePayment");
  const aiService = await AIService.deploy();
  await aiService.waitForDeployment();
  const aiServiceAddress = await aiService.getAddress();
  console.log("✅ AIServicePayment deployed to:", aiServiceAddress);

  // Summary
  console.log("\n=================================");
  console.log("📋 Deployment Summary:");
  console.log("=================================");
  console.log("PetNFT:", petNFTAddress);
  console.log("RecommendationVault:", vaultAddress);
  console.log("AIServicePayment:", aiServiceAddress);
  console.log("\n💡 Add these addresses to your .env file:");
  console.log(`PET_NFT_ADDRESS=${petNFTAddress}`);
  console.log(`RECOMMENDATION_VAULT_ADDRESS=${vaultAddress}`);
  console.log(`AI_SERVICE_PAYMENT_ADDRESS=${aiServiceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
