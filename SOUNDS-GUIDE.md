# 🔊 SOUND FILES GUIDE

## What You Need

You need **6 sound files** in MP3 format:

### Sound Effects:
1. **coin-flip.mp3** - Coin spinning sound (1-2 seconds)
2. **coin-clink.mp3** - Coin landing on table (0.5 seconds)
3. **sad-trombone.mp3** - Losing sound effect (2-3 seconds)
4. **hyena-laugh.mp3** - Mocking laugh (1-2 seconds)

### Background Music:
5. **classic-bgm.mp3** - 1970s video game music (arcade vibes) - Loops
6. **degen-bgm.mp3** - 1970s porn music (bow chicka wow wow) - Loops

---

## 📥 Where to Download FREE Sounds

### Option 1: Freesound.org (BEST)
1. Go to: https://freesound.org/
2. Search for each sound (e.g., "coin flip")
3. Filter by "CC0" license (completely free)
4. Download MP3 format

### Option 2: Pixabay
1. Go to: https://pixabay.com/sound-effects/
2. Search for each sound
3. Download (all are free)

### Option 3: Zapsplat
1. Go to: https://www.zapsplat.com/
2. Create free account
3. Search and download

### Option 4: Use AI to Generate
1. Go to: https://elevenlabs.io/sound-effects
2. Generate custom sounds with AI
3. Download MP3

### Option 5: 1970s Style Music (For Background)
**For classic-bgm.mp3 (Video Game Music):**
- Search: "retro arcade music", "8-bit music", "chiptune", "space invaders style"
- Keywords: Atari, arcade, retro gaming, bleeps and bloops

**For degen-bgm.mp3 (Porn Music):**
- Search: "funky 70s music", "70s groove", "wah wah guitar"
- Keywords: Funky, groovy, bass guitar, wah pedal, "bow chicka"
- Try searching for "royalty free funk instrumental"

**Good sites for 70s music:**
- YouTube Audio Library (search "funk" or "retro")
- Free Music Archive (fma.org)
- Incompetech (search "funk" or "groove")

---

## 📂 How to Add Sounds to Your Project

### Method 1: Drag and Drop (EASIEST)

1. Download all 6 sound files
2. Open Finder
3. Navigate to: `Desktop/flipr-app/public/sounds/`
4. Drag all 6 MP3 files into that folder
5. Make sure the names match EXACTLY:
   - `coin-flip.mp3`
   - `coin-clink.mp3`
   - `sad-trombone.mp3`
   - `hyena-laugh.mp3`
   - `classic-bgm.mp3`
   - `degen-bgm.mp3`

### Method 2: Terminal (FOR PROS)

```bash
cd ~/Desktop/flipr-app
mkdir -p public/sounds
# Then drag files into the folder OR use:
cp ~/Downloads/coin-flip.mp3 public/sounds/
cp ~/Downloads/coin-clink.mp3 public/sounds/
cp ~/Downloads/sad-trombone.mp3 public/sounds/
cp ~/Downloads/hyena-laugh.mp3 public/sounds/
```

---

## ✅ Verify Files Are There

Run this in Terminal:

```bash
cd ~/Desktop/flipr-app
ls -la public/sounds/
```

You should see all 6 files listed!

---

## 🎵 Recommended Sound Characteristics

For best results:

### coin-flip.mp3
- Length: 1.5 seconds
- Metallic spinning sound
- Medium volume

### coin-clink.mp3
- Length: 0.3-0.5 seconds
- Sharp metallic clink
- Louder than coin-flip

### sad-trombone.mp3
- Length: 2-3 seconds
- Classic "wah wah wah" sound
- Comedic timing

### hyena-laugh.mp3
- Length: 1-2 seconds
- Mocking, high-pitched
- Not too loud

---

## 🔧 If Sounds Don't Play

### Check File Names
Make sure they're EXACTLY:
- `coin-flip.mp3` (not `Coin-Flip.MP3` or `coin_flip.mp3`)
- All lowercase
- No spaces
- `.mp3` extension

### Check File Location
Files MUST be in:
```
flipr-app/
  └── public/
      └── sounds/
          ├── coin-flip.mp3
          ├── coin-clink.mp3
          ├── sad-trombone.mp3
          └── hyena-laugh.mp3
```

### Check Browser
- Try Chrome or Safari
- Check browser console (press F12)
- Look for audio errors

### Check Permissions
- Make sure browser can play audio
- Check if sound is muted
- Try clicking the screen first (browsers require user interaction)

---

## 🎨 OPTIONAL: Create Custom Sounds

Want something unique?

### AI Sound Generation:
1. **ElevenLabs Sound Effects**: https://elevenlabs.io/sound-effects
2. **Soundraw**: https://soundraw.io/
3. **AIVA**: https://www.aiva.ai/

### Record Your Own:
1. Use QuickTime Player on Mac (File → New Audio Recording)
2. Record your sound
3. Export as MP3
4. Add to project

---

## 📊 File Size Recommendations

Keep files small for fast loading:
- coin-flip.mp3: ~30-50 KB
- coin-clink.mp3: ~10-20 KB
- sad-trombone.mp3: ~50-80 KB
- hyena-laugh.mp3: ~40-60 KB

**Total: Under 200 KB for all sounds**

---

## 🚨 Common Mistakes

❌ **Wrong file format** (WAV, AAC, etc.) → Convert to MP3  
❌ **Wrong names** → Must match exactly  
❌ **Wrong location** → Must be in `public/sounds/`  
❌ **Files too big** → Compress to under 100 KB each  

---

## ✅ Final Check

Before deploying, test locally:

1. Run `npm run dev`
2. Go to `http://localhost:3000`
3. Connect wallet
4. Start a game
5. Click FLIP
6. Listen for sounds!
7. Background music should play based on mode

If you hear all 6 sounds during gameplay, you're good! 🎉

**Testing background music:**
- Classic mode should play retro game music
- Degen mode should play funky 70s groove music
- Music should loop continuously during gameplay

---

## 🆘 Still Not Working?

Check browser console:
1. Open the game
2. Press `F12` (or `Command + Option + I` on Mac)
3. Click "Console" tab
4. Look for red errors about audio files
5. The error will tell you what's wrong

Common errors:
- "404 Not Found" = File not in right location
- "Failed to load" = Wrong file format
- "autoplay blocked" = Need user interaction first

---

**Remember**: Sounds make the game 10x better! Take the time to get these right! 🔊🎰
