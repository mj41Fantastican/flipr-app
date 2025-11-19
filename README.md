# FLIPR - Complete Deployment Guide

## 🎰 What You're Building

**Flipr** is a savage coin-flip game on Base where losing makes you legendary. The worse your streak, the more epic your NFT becomes.

- **Classic Mode**: $0.41 entry (Kennedy Half-Dollar)
- **Degenerate Mode**: $0.69 entry (Busty Betty coin)
- **Mint NFTs**: $0.41 for any streak (2+ losses)
- **Treasury**: `0x50ef686123d82e0a37bc62abcbdf1526fde85de6`

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] MacBook Pro (you have this ✅)
- [ ] VS Code installed (you have this ✅)
- [ ] Node.js installed (you have this ✅)
- [ ] Terminal access (you have this ✅)
- [ ] MetaMask or Coinbase Wallet (you have this ✅)
- [ ] ~$10-20 worth of ETH on Base mainnet
- [ ] Internet connection

---

## 🚀 PART 1: Setting Up Your Project

### Step 1: Open Terminal

1. Press `Command + Space` on your Mac
2. Type `Terminal` and press Enter
3. You should see a black/white window with text

### Step 2: Navigate to Desktop

```bash
cd ~/Desktop
```

**What this does**: Moves you to your Desktop folder where we'll create the project

### Step 3: Copy the Project Files

The project files are already created in `/home/claude/flipr-app`. We need to copy them to your Desktop.

**IMPORTANT**: Open Finder, navigate to the folder where the files were created, and drag the entire `flipr-app` folder to your Desktop.

OR, if you prefer Terminal:

```bash
# If files are in Downloads or somewhere else, adjust the path
# This is just an example - adjust to your actual location
cp -r /path/to/flipr-app ~/Desktop/
```

### Step 4: Enter the Project

```bash
cd ~/Desktop/flipr-app
```

**What this does**: Moves you inside the Flipr project folder

### Step 5: Install Dependencies

```bash
npm install
```

**What this does**: Downloads all the code libraries needed for the project
**How long**: 2-5 minutes
**You'll see**: Lots of text scrolling - this is normal!

**Wait until you see**: `added XXX packages` and your cursor returns

---

## 🔑 PART 2: Get Your API Keys

### Step 1: Get WalletConnect Project ID

1. Go to: https://cloud.walletconnect.com/
2. Click "Sign Up" or "Sign In"
3. Create a new project (name it "Flipr")
4. Copy the **Project ID** (looks like: `a1b2c3d4...`)

### Step 2: Get Pinata API Keys (for NFT storage)

1. Go to: https://www.pinata.cloud/
2. Sign up for free account
3. Go to "API Keys" section
4. Click "New Key"
5. Copy both:
   - API Key
   - API Secret

### Step 3: Create Environment File

```bash
cp .env.example .env.local
```

**What this does**: Creates your private configuration file

### Step 4: Edit Environment File

```bash
open .env.local
```

**This will open the file in TextEdit. Fill in your keys:**

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here
NEXT_PUBLIC_URL=https://mj41.me/flip
PINATA_API_KEY=paste_your_pinata_key_here
PINATA_SECRET_API_KEY=paste_your_pinata_secret_here
```

**Save and close the file**

---

## 📝 PART 3: Deploy the Smart Contract

### Step 1: Install Hardhat (deployment tool)

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2: Initialize Hardhat

```bash
npx hardhat init
```

**Choose**: "Create a TypeScript project"
**Press Enter** for all other questions

### Step 3: Create Hardhat Config

Create a new file called `hardhat.config.ts`:

```bash
open hardhat.config.ts
```

**Paste this code:**

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY as string,
    },
  },
};

export default config;
```

**Save and close**

### Step 4: Add Your Private Key to .env.local

**⚠️ CRITICAL SECURITY NOTE**: Never share your private key with anyone!

```bash
open .env.local
```

**Add this line** (replace with your actual private key):

```
PRIVATE_KEY=your_metamask_private_key_here
```

**To get your MetaMask private key:**
1. Open MetaMask
2. Click the three dots (⋮)
3. Account Details
4. Export Private Key
5. Enter password
6. Copy the key

**Save and close**

### Step 5: Get Basescan API Key

1. Go to: https://basescan.org/
2. Sign up for free account
3. Go to "API-KEYs"
4. Create new key
5. Add to `.env.local`:

```
BASESCAN_API_KEY=your_basescan_key_here
```

### Step 6: Deploy Contract

```bash
npx hardhat run scripts/deploy.ts --network base
```

**This will**:
- Deploy your contract to Base mainnet
- Cost ~$2-5 in gas fees
- Give you a contract address

**SAVE THE CONTRACT ADDRESS!** You'll need it!

### Step 7: Update Contract Address

```bash
open .env.local
```

**Update this line:**

```
NEXT_PUBLIC_FLIPR_CONTRACT_ADDRESS=your_new_contract_address
```

**Save and close**

---

## 🎨 PART 4: Add Sound Files

You need 4 sound files in the `public/sounds/` folder:

1. `coin-flip.mp3` - Coin flipping sound
2. `coin-clink.mp3` - Coin landing sound
3. `sad-trombone.mp3` - Losing sound
4. `hyena-laugh.mp3` - Mocking laugh

**Where to get them:**
- Search "royalty free coin flip sound"
- Download from sites like freesound.org or pixabay.com
- Or use AI to generate them

**How to add them:**

```bash
mkdir -p public/sounds
```

Then drag and drop your MP3 files into the `public/sounds/` folder in Finder.

---

## 🌐 PART 5: Test Locally

### Step 1: Start Development Server

```bash
npm run dev
```

**You'll see:**

```
ready - started server on 0.0.0.0:3000
```

### Step 2: Open in Browser

Go to: http://localhost:3000

**You should see the Flipr game!**

### Step 3: Test Everything

1. Connect your wallet
2. Select a game mode
3. Start a session (costs $0.41 or $0.69)
4. Flip coins
5. Try minting an NFT

**If anything breaks**, check the browser console (press F12) for errors.

---

## 🚀 PART 6: Deploy to Production

### Option A: Deploy to Vercel (Recommended)

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import from git repository OR drag and drop your folder
5. Add environment variables:
   - Copy everything from `.env.local`
   - Paste into Vercel's environment variables section
6. Click "Deploy"
7. Wait 2-3 minutes
8. You'll get a URL like: `flipr-xyz.vercel.app`

### Option B: Deploy to Netlify

1. Go to: https://www.netlify.com
2. Drag your `flipr-app` folder to the upload area
3. Add environment variables in settings
4. Deploy!

---

## 🔗 PART 7: Add to Your Website (mj41.me/flip)

### If you use a custom domain:

1. In Vercel/Netlify settings, add custom domain: `mj41.me`
2. Add path: `/flip`
3. Update DNS records (your hosting provider will guide you)

### If you use iframe:

Add this to your existing `mj41.me` site:

```html
<iframe src="https://your-flipr-url.vercel.app" width="100%" height="800px" frameborder="0"></iframe>
```

---

## 📱 PART 8: Farcaster Frame Setup

1. Update `NEXT_PUBLIC_URL` in `.env.local` to your production URL
2. Redeploy
3. Share your URL on Farcaster
4. It will automatically show as an interactive frame!

---

## ✅ Final Checklist

- [ ] Smart contract deployed
- [ ] Contract address updated in `.env.local`
- [ ] All API keys added
- [ ] Sound files added
- [ ] Local testing successful
- [ ] Deployed to Vercel/Netlify
- [ ] Custom domain configured (optional)
- [ ] Farcaster Frame working
- [ ] First test flip completed!

---

## 🆘 Troubleshooting

### "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Transaction failed"
- Check you have enough ETH for gas
- Check you're on Base mainnet
- Check contract address is correct

### "Wallet not connecting"
- Refresh page
- Check MetaMask is on Base network
- Try different browser

### "Sounds not playing"
- Check files are in `public/sounds/`
- Check file names match exactly
- Try different browser

---

## 📞 Need Help?

If you get stuck:
1. Check the error message in Terminal or browser console (F12)
2. Make sure all environment variables are set
3. Verify you're on Base mainnet
4. Check you have enough ETH for gas

---

## 🎉 You Did It!

You now have a fully functional, deplorable degenerate coin flip game on Base!

**Treasury**: All fees go to `0x50ef686123d82e0a37bc62abcbdf1526fde85de6`

**Next steps:**
- Share on social media
- Share on Farcaster
- Watch the degenerates roll in
- Collect those fees! 💰

---

## 📊 Monitoring Your Contract

Check activity:
- Base mainnet: https://basescan.org/address/YOUR_CONTRACT_ADDRESS
- Treasury: https://basescan.org/address/0x50ef686123d82e0a37bc62abcbdf1526fde85de6

---

Built with love and chaos by mj41 🎰💀
