const hre = require("hardhat");

async function main() {
  console.log("🎰 Deploying Flipr contract to Base mainnet...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance < hre.ethers.parseEther("0.01")) {
    console.error("⚠️  Insufficient balance! Need at least 0.01 ETH for deployment.");
    process.exit(1);
  }

  // Deploy the contract
  console.log("\n📝 Deploying contract...");
  const Flipr = await hre.ethers.getContractFactory("Flipr");
  const flipr = await Flipr.deploy();

  await flipr.waitForDeployment();
  const address = await flipr.getAddress();

  console.log("\n✅ Flipr deployed to:", address);
  console.log("Treasury address:", await flipr.treasury());

  // Initialize the weekly leaderboard timestamp
  console.log("\n🗓️  Initializing weekly leaderboard...");
  const initTx = await flipr.initializeWeek();
  await initTx.wait();
  console.log("✅ Weekly leaderboard initialized");

  console.log("\n🎉 DEPLOYMENT COMPLETE!");
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Copy this contract address:", address);
  console.log("2. Update .env.local with: NEXT_PUBLIC_FLIPR_CONTRACT_ADDRESS=" + address);
  console.log("\n💰 All fees will automatically go to the treasury!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
