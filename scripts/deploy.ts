const hre = require("hardhat");

async function main() {
  console.log("🎰 Deploying FliprSimple contract to Base mainnet...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance < hre.ethers.parseEther("0.01")) {
    console.error("⚠️  Insufficient balance! Need at least 0.01 ETH for deployment.");
    process.exit(1);
  }

  console.log("\n📝 Deploying contract...");
  const FliprSimple = await hre.ethers.getContractFactory("FliprSimple");
  const flipr = await FliprSimple.deploy();
  
  await flipr.waitForDeployment();
  const address = await flipr.getAddress();

  console.log("\n✅ FliprSimple deployed to:", address);
  console.log("Treasury address:", await flipr.treasury());

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Copy this contract address:", address);
  console.log("2. Update config/wagmi.ts with this address");
  console.log("\n💰 All fees will automatically go to the treasury!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
