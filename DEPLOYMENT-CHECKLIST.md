# 🎯 FLIPR DEPLOYMENT CHECKLIST

Print this out or keep it open in a separate window to track your progress!

---

## 📋 PRE-DEPLOYMENT (DO FIRST)

- [ ] Mac is charged and connected to power
- [ ] Strong internet connection verified
- [ ] VS Code is installed and working
- [ ] Node.js is installed (run `node --version` in Terminal)
- [ ] Terminal is accessible (Command + Space → Terminal)
- [ ] MetaMask or Coinbase Wallet installed
- [ ] Wallet has ~$15-20 worth of ETH on Base mainnet
- [ ] 2 hours of uninterrupted time available

---

## 🗂️ PROJECT SETUP

- [ ] Flipr project folder is on Desktop
- [ ] Opened Terminal
- [ ] Navigated to project: `cd ~/Desktop/flipr-app`
- [ ] Ran `npm install` successfully
- [ ] No error messages during install
- [ ] Can see `node_modules` folder in project

---

## 🔑 API KEYS & CONFIGURATION

- [ ] Created WalletConnect Project ID
- [ ] Got Pinata API Key
- [ ] Got Pinata Secret Key
- [ ] Got Basescan API Key (optional for verification)
- [ ] Created `.env.local` file
- [ ] Added WalletConnect Project ID to `.env.local`
- [ ] Added Pinata keys to `.env.local`
- [ ] Added private key to `.env.local` (⚠️ KEEP SECRET!)
- [ ] Added Basescan key to `.env.local`
- [ ] Saved `.env.local` file

---

## 🎵 SOUND FILES

- [ ] Downloaded coin-flip.mp3
- [ ] Downloaded coin-clink.mp3
- [ ] Downloaded sad-trombone.mp3
- [ ] Downloaded hyena-laugh.mp3
- [ ] Created `public/sounds/` folder if not exists
- [ ] All 4 MP3 files are in `public/sounds/`
- [ ] File names match EXACTLY (lowercase, no spaces)
- [ ] Tested sound files play on Mac

---

## 🔨 LOCAL TESTING

- [ ] Ran `npm run dev` in Terminal
- [ ] No error messages
- [ ] Opened browser to `http://localhost:3000`
- [ ] Flipr game loads on screen
- [ ] Can see "FLIPR" title and neon effects
- [ ] "Connect Wallet" button appears
- [ ] Connected wallet successfully
- [ ] Can select Classic or Degenerate mode
- [ ] Coin selection screen works
- [ ] (OPTIONAL) Tested flip without paying yet

---

## 📝 SMART CONTRACT DEPLOYMENT

- [ ] Installed Hardhat: `npm install --save-dev hardhat`
- [ ] Initialized Hardhat: `npx hardhat init`
- [ ] Created `hardhat.config.ts` file
- [ ] Added Base network configuration
- [ ] Private key is in `.env.local`
- [ ] Wallet has enough ETH for gas (~$5-10)
- [ ] Ran deployment: `npx hardhat run scripts/deploy.ts --network base`
- [ ] Deployment successful (got contract address)
- [ ] **SAVED CONTRACT ADDRESS**: ___________________________
- [ ] Updated `.env.local` with contract address
- [ ] Contract visible on Basescan
- [ ] (OPTIONAL) Verified contract on Basescan

---

## 🌐 PRODUCTION DEPLOYMENT (VERCEL)

- [ ] Signed up for Vercel account
- [ ] Connected GitHub (if using Git)
- [ ] Created new project in Vercel
- [ ] Uploaded/imported project files
- [ ] Added ALL environment variables from `.env.local`
- [ ] Clicked "Deploy" button
- [ ] Waited for deployment (3-5 minutes)
- [ ] Deployment successful
- [ ] **PRODUCTION URL**: ___________________________
- [ ] Opened production URL in browser
- [ ] Site loads correctly
- [ ] No console errors (press F12)

---

## 🎯 CUSTOM DOMAIN SETUP

- [ ] In Vercel, clicked "Add Domain"
- [ ] Added: `mj41.me` or subdomain
- [ ] Got DNS configuration instructions
- [ ] Updated DNS records at domain registrar
- [ ] Waited for DNS propagation (15-60 minutes)
- [ ] Verified domain works: `https://mj41.me/flip`
- [ ] SSL certificate is active (https works)

---

## 🧪 PRODUCTION TESTING

- [ ] Opened production URL in browser
- [ ] Opened incognito/private window
- [ ] Tested on mobile device
- [ ] Connected wallet on production
- [ ] Wallet connected successfully
- [ ] Selected game mode
- [ ] **PAID ENTRY FEE** (Classic $0.41 or Degen $0.69)
- [ ] Transaction confirmed on Base
- [ ] Game session started
- [ ] Clicked FLIP button
- [ ] Coin animation played
- [ ] Sounds played correctly
- [ ] Got tails → saw roast popup
- [ ] Streak counter updated
- [ ] (After 2+ losses) "MINT THIS SHAME" button appeared
- [ ] **TESTED MINTING** (paid $0.41)
- [ ] NFT minted successfully
- [ ] NFT visible in wallet
- [ ] Can see NFT on OpenSea/Rarible

---

## 💰 VERIFY TREASURY

- [ ] Opened Basescan
- [ ] Checked treasury address: `0x50ef686123d82e0a37bc62abcbdf1526fde85de6`
- [ ] Can see test transactions
- [ ] Fees are going to correct address
- [ ] No errors in transactions

---

## 📱 FARCASTER FRAME

- [ ] Updated `NEXT_PUBLIC_URL` in Vercel env vars
- [ ] Redeployed on Vercel
- [ ] Created test Farcaster post with link
- [ ] Frame preview appears
- [ ] Frame buttons work
- [ ] Clicking leads to game
- [ ] Tested on Warpcast app

---

## 🎊 LAUNCH CHECKLIST

- [ ] Created announcement post
- [ ] Shared on Twitter/X
- [ ] Shared on Farcaster
- [ ] Posted in relevant Discord/Telegram groups
- [ ] Updated mj41.me homepage with link
- [ ] Added to portfolio/projects page
- [ ] Set up Google Analytics (optional)
- [ ] Monitoring contract on Basescan

---

## 📊 POST-LAUNCH MONITORING

- [ ] Check Basescan daily for activity
- [ ] Monitor treasury balance
- [ ] Check for any error reports
- [ ] Respond to user questions
- [ ] Track leaderboard entries
- [ ] Watch for legendary 31+ streaks!

---

## 🐛 TROUBLESHOOTING DONE

- [ ] Documented any errors encountered
- [ ] Found solutions for common issues
- [ ] Updated README if needed
- [ ] Tested all edge cases
- [ ] Confirmed everything works on different browsers
- [ ] Mobile responsive checked

---

## 🎉 CELEBRATION CHECKLIST

- [ ] First user transaction ✅
- [ ] First NFT minted ✅
- [ ] First 10+ streak ✅
- [ ] First 31+ legendary streak ✅
- [ ] $100 in fees collected ✅
- [ ] Someone complained about losing ✅
- [ ] Someone laughed at a roast ✅
- [ ] Viral post on Farcaster ✅

---

## 📝 NOTES SECTION

Use this space to write down:
- Contract address: ______________________________________
- Production URL: ______________________________________
- Any issues encountered: ______________________________________
- Solutions found: ______________________________________
- Ideas for improvements: ______________________________________

---

## ⏱️ ESTIMATED TIME PER SECTION

- Pre-deployment: 10 min
- Project Setup: 10 min
- API Keys: 15 min
- Sound Files: 15 min
- Local Testing: 15 min
- Smart Contract: 20 min
- Production Deploy: 15 min
- Custom Domain: 30 min
- Production Testing: 20 min
- Farcaster Frame: 10 min

**Total: ~2.5 hours**

---

## 🏁 FINAL SIGN-OFF

- [ ] ✅ Everything above is complete
- [ ] ✅ All tests passed
- [ ] ✅ Treasury receiving fees
- [ ] ✅ No critical bugs found
- [ ] ✅ Project is LIVE!

**Date Deployed**: _______________  
**First Transaction**: _______________  
**Total Fees Collected**: _______________  

---

**🎰 YOU'RE LIVE, BABY! 💀**

Now sit back and watch the degenerates mint their shame!

Remember to:
1. Monitor the contract regularly
2. Engage with users on social media
3. Track the leaderboard for epic streaks
4. Celebrate every milestone!

**Built by:** mj41  
**Treasury:** 0x50ef686123d82e0a37bc62abcbdf1526fde85de6  
**Made with:** Blood, sweat, tears, and terrible coin flips  
