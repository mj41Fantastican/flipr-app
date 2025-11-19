# 🎰 FLIPR - QUICK START GUIDE FOR BEGINNERS

## 🚨 READ THIS FIRST!

This guide is for someone with **ZERO coding experience**. I'll explain every single step like you've never used a computer before.

---

## ⚡ 5-MINUTE CHECKLIST

Before you do ANYTHING else, make sure you have:

✅ **Your Mac is charged** (at least 50% battery)  
✅ **Internet connection** (WiFi working)  
✅ **MetaMask wallet installed** (with some ETH on Base network)  
✅ **About 1 hour of free time** (don't rush this)  

---

## 🎯 SUPER SIMPLE VERSION

If you just want to get started FAST:

### Step 1: Open Terminal
- Press `Command + Space Bar` on your keyboard
- Type the word `Terminal`
- Press `Enter`
- You should see a white or black window open

### Step 2: Go to Desktop
Copy and paste this into Terminal (press Enter after):
```
cd ~/Desktop
```

### Step 3: Check if the folder exists
Look at your Desktop. Do you see a folder called `flipr-app`?
- **YES** → Skip to Step 5
- **NO** → Continue to Step 4

### Step 4: Get the Files
You need to move the `flipr-app` folder to your Desktop.
- Find where the files are (probably in Downloads)
- Drag the whole `flipr-app` folder to your Desktop

### Step 5: Enter the Folder
```
cd flipr-app
```

### Step 6: Install Everything
```
npm install
```
**WAIT** - This takes 3-5 minutes. You'll see lots of text. That's normal!

### Step 7: Test It Works
```
npm run dev
```
**THEN**: Open your web browser and go to: `http://localhost:3000`

You should see the Flipr game! 🎉

---

## 🆘 IF SOMETHING BREAKS

### Error: "command not found: npm"
**Solution**: You need to install Node.js
1. Go to: https://nodejs.org/
2. Download the LTS version (green button)
3. Double-click the downloaded file
4. Follow the installation steps
5. Restart Terminal and try again

### Error: "Permission denied"
**Solution**: Add `sudo` before the command
```
sudo npm install
```
(You'll need to type your Mac password)

### Error: "Port 3000 already in use"
**Solution**: Something else is using that port
- Close all browser windows
- Restart Terminal
- Try again

### Nothing happens when I type commands
**Solution**: Make sure Terminal window is selected
- Click on the Terminal window
- Try typing again

---

## 📱 WHAT EACH FILE DOES

You don't need to understand this, but here's what's in the folder:

- `package.json` = List of tools the app needs
- `pages/` = The actual website pages
- `components/` = Reusable parts of the website
- `contracts/` = The smart contract (blockchain code)
- `public/` = Images, sounds, roasts
- `styles/` = How things look (colors, fonts)
- `config/` = Settings and configuration

---

## 🎮 PLAYING THE GAME

1. **Connect Wallet**: Click the "Connect Wallet" button
2. **Choose Mode**: Classic ($0.41) or Degenerate ($0.69)
3. **Start Session**: Pay the entry fee
4. **Flip**: Click the FLIP button
5. **Lose**: Each tails = +1 to your streak
6. **Mint**: After 2+ losses, mint your shame NFT for $0.41

---

## 💰 WHERE THE MONEY GOES

Every single fee goes straight to this address:
```
0x50ef686123d82e0a37bc62abcbdf1526fde85de6
```

You can track all income here:
https://basescan.org/address/0x50ef686123d82e0a37bc62abcbdf1526fde85de6

---

## ⚙️ IMPORTANT FILES TO NEVER DELETE

- `package.json` - Breaks everything
- `contracts/Flipr.sol` - The smart contract
- `public/roasts.json` - All the savage roasts
- `.env.local` - Your secret keys (NEVER share this!)

---

## 🚫 WHAT NOT TO DO

❌ Don't delete random files "to clean up"  
❌ Don't share your `.env.local` file with anyone  
❌ Don't commit your private key to GitHub  
❌ Don't deploy without testing locally first  
❌ Don't skip the README.md instructions  

---

## 📞 GETTING HELP

1. **Read the error message** - It usually tells you what's wrong
2. **Check the README.md** - Full deployment guide
3. **Google the error** - Someone has had this problem before
4. **Ask Claude** - "Hey Claude, I got this error: [paste error]"

---

## 🎯 YOUR GOAL

By the end, you should have:

✅ Working local version (localhost:3000)  
✅ Smart contract deployed to Base  
✅ Live website (Vercel or Netlify)  
✅ Custom domain pointing to mj41.me/flip  
✅ Farcaster Frame working  
✅ First test transaction successful  

---

## ⏱️ TIME ESTIMATES

- Setting up (Steps 1-6): **10 minutes**
- Getting API keys: **15 minutes**
- Deploying smart contract: **20 minutes**
- Deploying website: **15 minutes**
- Configuring domain: **30 minutes**
- Testing everything: **20 minutes**

**Total: About 2 hours** if you've never done this before.

---

## 🎉 FINAL WORDS

You're building something genuinely hilarious and functional. Take your time, don't panic if things break, and remember:

**The only way to fail is to give up.**

Every error message is a learning opportunity. Every successful deployment is a victory.

Now go lose some coin flips and mint that shame! 🎰💀

---

**Built by:** mj41  
**For:** Degenerates and legends alike  
**Purpose:** Turning losses into NFT trophies since 2025  
