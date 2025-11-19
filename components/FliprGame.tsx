import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, parseEther } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';
import useSound from 'use-sound';
import axios from 'axios';
import { FLIPR_CONTRACT_ADDRESS, CLASSIC_FEE, DEGEN_FEE, MINT_FEE } from '../config/wagmi';
import roastsData from '../public/roasts.json';

type GameMode = 'classic' | 'degenerate';
type CoinType = 'kennedy' | 'busty_betty';

interface FlipResult {
  isHeads: boolean;
  streak: number;
  roast: string;
}

export default function FliprGame() {
  const { address, isConnected } = useAccount();
  
  // Separate write contracts for flip and mint
  const { writeContract: writeFlip, data: flipHash } = useWriteContract();
  const { writeContract: writeMint, data: mintHash } = useWriteContract();
  
  // Wait for transactions
  const { isLoading: isFlipConfirming, isSuccess: isFlipSuccess } = useWaitForTransactionReceipt({ hash: flipHash });
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({ hash: mintHash });

  // Game state
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [coinType, setCoinType] = useState<CoinType | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<'heads' | 'tails' | 'edge' | null>(null);
  const [userCall, setUserCall] = useState<'heads' | 'tails' | null>(null);
  const [showCallButtons, setShowCallButtons] = useState(false);
  const [currentRoast, setCurrentRoast] = useState('');
  const [stripperRotation, setStripperRotation] = useState(0);
  const [showRoastPopup, setShowRoastPopup] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [usedRoasts, setUsedRoasts] = useState<string[]>([]);
  const [consecutiveLosses, setConsecutiveLosses] = useState(0);
  const [mintError, setMintError] = useState<string>('');
  
  // Edge landing tracking (69, 41, 69, 41 pattern per wallet)
  // Secret mechanic: Coin lands on edge at flip 69, then 110, then 179, then 220...
  // Pattern alternates between +69 and +41. Why? Because it's funny and breaks up
  // the monotony of 50/50. Users will think they're going crazy. Perfect. 🎲
  const [totalFlipCount, setTotalFlipCount] = useState(0);
  const [nextEdgeLanding, setNextEdgeLanding] = useState(69); // First edge at 69 (nice)

  // Sound effects
  // NOTE: Background music should be:
  // - Classic mode: 1970s video game music (arcade vibes)
  // - Degen mode: 1970s porn music (bow chicka wow wow)
  const [playCoinFlip] = useSound('/sounds/coin-flip.mp3');
  const [playSadTrombone] = useSound('/sounds/sad-trombone.mp3');
  const [playHyenaLaugh] = useSound('/sounds/hyena-laugh.mp3');
  const [playCoinClink] = useSound('/sounds/coin-clink.mp3');
  
  // Background music (loops continuously)
  const [playClassicBGM, { stop: stopClassicBGM }] = useSound('/sounds/classic-bgm.mp3', {
    loop: true,
    volume: 0.3,
  });
  const [playDegenBGM, { stop: stopDegenBGM }] = useSound('/sounds/degen-bgm.mp3', {
    loop: true,
    volume: 0.3,
  });

  // Handle successful mint
  useEffect(() => {
    if (isMintSuccess && mintHash) {
      alert('NFT Minted! Your shame is now on the blockchain forever! 🎉');
      // Reset session after successful mint
      setSessionActive(false);
      setGameOver(false);
      setCurrentStreak(0);
      setConsecutiveLosses(0);
      setStripperRotation(0);
      setShowCallButtons(false);
      setFlipResult(null);
      setCurrentRoast('');
      setShowRoastPopup(false);
    }
  }, [isMintSuccess, mintHash]);

  // Play appropriate background music when mode is selected
  useEffect(() => {
    if (gameMode === 'classic') {
      stopDegenBGM();
      playClassicBGM();
    } else if (gameMode === 'degenerate') {
      stopClassicBGM();
      playDegenBGM();
    }
    
    // Cleanup on unmount
    return () => {
      stopClassicBGM();
      stopDegenBGM();
    };
  }, [gameMode]);

  // Mode selection
  const selectMode = (mode: GameMode, coin: CoinType) => {
    setGameMode(mode);
    setCoinType(coin);
  };

  // Start session (FREE - payment only on mint)
  const startSession = async () => {
    if (!isConnected || !gameMode) return;

    setSessionActive(true);
    setGameOver(false);
    setCurrentStreak(0);
    setConsecutiveLosses(0);
    setStripperRotation(0);
    setUsedRoasts([]);
    setShowCallButtons(true);
  };

  // User makes their call (heads or tails)
  const makeCall = (call: 'heads' | 'tails') => {
    setUserCall(call);
    setShowCallButtons(false);
    flipCoin(call);
  };

  // Flip coin with user's call
  const flipCoin = async (call: 'heads' | 'tails') => {
    if (!sessionActive || isFlipping) return;

    setIsFlipping(true);
    setFlipResult(null);
    setShowRoastPopup(false);

    // Increment total flip count
    const newFlipCount = totalFlipCount + 1;
    setTotalFlipCount(newFlipCount);

    // Play coin flip sound
    playCoinFlip();

    // Simulate 1.8 second flip animation
    setTimeout(async () => {
      let actualResult: 'heads' | 'tails' | 'edge';

      // Check if this flip should land on edge (69, 41, 69, 41 pattern)
      if (newFlipCount === nextEdgeLanding) {
        actualResult = 'edge';
        
        // Set next edge landing (alternates between 69 and 41)
        const isCurrently69 = nextEdgeLanding % 110 === 69; // 69 or (69+41)=110, (69+41+69)=179, etc
        setNextEdgeLanding(nextEdgeLanding + (isCurrently69 ? 41 : 69));
      } else {
        // Normal flip with optional degen bias
        if (gameMode === 'degenerate') {
          // Degen mode: Heads favored by 6.9% (56.9% heads, 43.1% tails)
          // Busty Betty is big chested therefore the heads portion of the coin has more 
          // material than the tails portion. And by this logic, not to be tested, the odds 
          // have been adjusted Degenerately. Thank you.
          const random = Math.random();
          actualResult = random < 0.569 ? 'heads' : 'tails';
        } else {
          // Classic mode: Fair 50/50
          actualResult = Math.random() < 0.5 ? 'heads' : 'tails';
        }
      }
      
      // Play clink sound
      playCoinClink();

      setFlipResult(actualResult);

      // Handle edge landing (automatic loss)
      if (actualResult === 'edge') {
        const newConsecutiveLosses = consecutiveLosses + 1;
        setConsecutiveLosses(newConsecutiveLosses);

        if (newConsecutiveLosses >= 2) {
          const newStreak = newConsecutiveLosses;
          setCurrentStreak(newStreak);

          // Rotate character (90 degrees per loss in degen, cheerleader stays put in classic)
          if (gameMode === 'degenerate') {
            setStripperRotation(newStreak * 90); // 1/4 turn per loss - she's getting flipped!
          }

          const roast = getRandomRoast(newStreak);
          setCurrentRoast(roast);
          setShowRoastPopup(true);

          playSadTrombone();
          setTimeout(() => playHyenaLaugh(), 500);
        } else {
          setShowRoastPopup(true);
          setCurrentRoast("The coin landed on its EDGE! That's a loss no matter what! 🎲");
        }
      } else {
        // Check if user guessed correctly
        const guessedCorrectly = call === actualResult;

        if (!guessedCorrectly) {
          // WRONG GUESS - This builds the streak!
          const newConsecutiveLosses = consecutiveLosses + 1;
          setConsecutiveLosses(newConsecutiveLosses);
          setCurrentStreak(newConsecutiveLosses);

          // Rotate character (90 degrees per loss in degen, cheerleader stays in classic)
          if (gameMode === 'degenerate') {
            setStripperRotation(newConsecutiveLosses * 90); // She's flipping! 1/4 turn per loss
          }

          // Get roast for streaks >= 2
          if (newConsecutiveLosses >= 2) {
            const roast = getRandomRoast(newConsecutiveLosses);
            setCurrentRoast(roast);
            setShowRoastPopup(true);

            // Play sad sounds
            playSadTrombone();
            setTimeout(() => playHyenaLaugh(), 500);
          } else {
            // First loss - no roast yet, just show loss message
            setShowRoastPopup(true);
            setCurrentRoast("You lose! One down... let's see how many more! 🎲");
          }
        } else {
          // CORRECT GUESS - Streak ends, game over!
          setGameOver(true);
          setShowCallButtons(false);
          
          // Show final roast if they had a streak
          if (consecutiveLosses >= 1) {
            setShowRoastPopup(true);
            playSadTrombone();
            setTimeout(() => playHyenaLaugh(), 500);
          }
        }
      }

      setIsFlipping(false);
      if (!gameOver) {
        setShowCallButtons(true); // Ready for next flip only if game not over
      }
    }, 1800);
  };

  // Get random roast based on streak (only for streak >= 2)
  const getRandomRoast = (streak: number): string => {
    if (streak < 2) return ''; // No roast for first loss

    const mode = gameMode === 'classic' ? 'classic' : 'degenerate';
    let tier: 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';

    // Adjust tier logic since streak now starts at 2
    if (streak >= 10) tier = 'tier5';
    else if (streak >= 7) tier = 'tier4';
    else if (streak >= 5) tier = 'tier3';
    else if (streak >= 4) tier = 'tier2';
    else tier = 'tier1'; // 2-3 losses

    const roasts = roastsData[mode][tier as keyof typeof roastsData['degenerate']];
    
    // Filter out already used roasts
    const availableRoasts = roasts.filter(r => !usedRoasts.includes(r));
    
    // If all roasts used, reset (or in future, generate new ones)
    const finalRoasts = availableRoasts.length > 0 ? availableRoasts : roasts;
    
    const randomRoast = finalRoasts[Math.floor(Math.random() * finalRoasts.length)];
    setUsedRoasts([...usedRoasts, randomRoast]);
    
    return randomRoast;
  };

  // Mint NFT (THIS is where payment happens)
  const mintNFT = async () => {
    if (!gameOver || currentStreak < 1) return;

    try {
      setMintError(''); // Clear any previous errors
      console.log('🎯 Starting mint process...');
      console.log('Current streak:', currentStreak);
      console.log('Game mode:', gameMode);
      console.log('Coin type:', coinType);
      console.log('Roast:', currentRoast);
      console.log('Wallet address:', address);
      
      // Your NEW on-chain contract address (update after deploying FliprOnChain.sol)
      const FLIPR_CONTRACT = '0xc5dFAeB0aF28D52ca80Dc97b3F1fDe8cE49D962a'; // UPDATE THIS!
      
      // On-chain ABI
      const FLIPR_ABI = [
        {
          name: 'mintLoserNFT',
          type: 'function',
          stateMutability: 'payable',
          inputs: [
            { name: 'streak', type: 'uint256' },
            { name: 'mode', type: 'uint8' },  // 0 = CLASSIC, 1 = DEGEN
            { name: 'coin', type: 'uint8' },   // 0 = KENNEDY, 1 = BUSTY_BETTY
            { name: 'roast', type: 'string' }
          ],
          outputs: []
        }
      ];

      // Calculate mint fee in ETH
      const mintFeeETH = gameMode === 'classic' ? '0.00041' : '0.00069';
      
      // Map game mode to enum
      const modeEnum = gameMode === 'classic' ? 0 : 1;
      
      // Map coin type to enum
      const coinEnum = coinType === 'kennedy' ? 0 : 1;
      
      // Get roast text (or default if none)
      const roastText = currentRoast || "You lost. That's it. That's the roast.";
      
      console.log('📝 Calling mintLoserNFT on contract:', FLIPR_CONTRACT);
      console.log('💰 Mint fee:', mintFeeETH, 'ETH');
      console.log('Parameters:', { streak: currentStreak, mode: modeEnum, coin: coinEnum, roast: roastText });
      
      // Call the contract function with all parameters
      writeMint({
        address: FLIPR_CONTRACT,
        abi: FLIPR_ABI,
        functionName: 'mintLoserNFT',
        args: [BigInt(currentStreak), modeEnum, coinEnum, roastText],
        value: parseEther(mintFeeETH),
      });
      
      console.log('✅ Mint transaction sent! Waiting for confirmation...');

    } catch (error) {
      console.error('❌ Failed to mint NFT:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setMintError(errorMessage);
      alert(`Mint failed: ${errorMessage}`);
    }
  };

  // Render coin based on result
  const renderCoin = () => {
    if (!flipResult || !coinType) return null;

    // EDGE LANDING - Special visual!
    if (flipResult === 'edge') {
      return (
        <div className="relative w-48 h-48">
          {/* Coin standing on edge */}
          <div className="w-6 h-48 mx-auto bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-sm shadow-2xl transform rotate-0">
            <div className="w-full h-full flex items-center justify-center">
              <div className="writing-mode-vertical text-xs font-bold text-gray-700">
                EDGE
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-neon-pink opacity-20 blur-xl animate-pulse"></div>
          {/* Text */}
          <div className="absolute -bottom-8 left-0 right-0 text-center text-neon-pink font-bold text-sm animate-pulse">
            ON THE EDGE! 🎲
          </div>
        </div>
      );
    }

    const isHeads = flipResult === 'heads';

    if (coinType === 'kennedy') {
      return (
        <div className="w-48 h-48 relative">
          <img
            src={isHeads ? '/coins/halfdollarheads.png' : '/coins/halfdollartails.png'}
            alt={isHeads ? 'Kennedy Half-Dollar Heads (Eagle)' : 'Kennedy Half-Dollar Tails (JFK)'}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      );
    } else {
      // Busty Betty
      return (
        <div className="w-48 h-48 relative">
          <img
            src={isHeads ? '/coins/bustybettyheads.png' : '/coins/bustybettytails.png'}
            alt={isHeads ? 'Busty Betty Heads' : 'Busty Betty Tails'}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      );
    }
  };

  if (!gameMode || !coinType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-velvet-red to-black p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-neon text-neon-pink text-center mb-12 animate-neon-flicker">
            FLIPR
          </h1>
          <p className="text-white text-center mb-8 text-xl">
            Just Flip The Damn Coin
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/50 p-6 rounded-lg border-2 border-neon-pink">
              <h2 className="text-3xl font-bold text-white mb-4">Classic Mode</h2>
              <p className="text-grimy-gold text-2xl mb-4">$0.41 to Mint</p>
              <p className="text-white mb-2">Kennedy Half-Dollar (1971-present)</p>
              <p className="text-white/60 text-sm mb-4">Cheerleader with pom-poms • PG-14 roasts</p>
              <button
                onClick={() => selectMode('classic', 'kennedy')}
                className="w-full bg-neon-pink hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Play Classic (Free Start)
              </button>
            </div>

            <div className="bg-black/50 p-6 rounded-lg border-2 border-neon-blue">
              <h2 className="text-3xl font-bold text-white mb-4">Degen Mode</h2>
              <p className="text-grimy-gold text-2xl mb-4">$0.69 to Mint</p>
              <p className="text-white mb-2">Busty Betty 80s Novelty Coin</p>
              <p className="text-white/60 text-sm mb-4">Stripper visual • Savage roasts 🔥</p>
              <button
                onClick={() => selectMode('degenerate', 'busty_betty')}
                className="w-full bg-neon-blue hover:bg-cyan-700 text-black font-bold py-3 px-6 rounded-lg transition"
              >
                Play Degen 🍑 (Free Start)
              </button>
            </div>
          </div>

          <div className="text-center text-white/70">
            <p className="font-bold text-lg">🎮 Play for FREE • Pay only when you MINT your shame!</p>
            <p className="mt-2">All fees payable in USDC or ETH on Base</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-velvet-red to-black relative overflow-hidden">
      {/* Neon sign */}
      <div className="absolute top-8 right-8">
        <h2 className="text-2xl font-neon text-neon-pink animate-neon-flicker">
          HOUSE ALWAYS WINS
        </h2>
      </div>

      {/* Main game area */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Character */}
        <div className="flex justify-center mb-8">
          {gameMode === 'classic' ? (
            // Classic mode: Cheerleader - stays put, does boring supportive thing
            <div className="text-9xl">
              📣
            </div>
          ) : (
            // Degen mode: Dancer - rotates 90° per loss (she's getting flipped!)
            <motion.div
              animate={{ rotate: stripperRotation }}
              transition={{ duration: 0.5 }}
              className="text-9xl"
            >
              💃
            </motion.div>
          )}
        </div>

        {/* Velvet table */}
        <div className="relative" style={{ perspective: '1200px' }}>
          <div className="bg-velvet-red rounded-full w-full h-64 shadow-2xl flex items-center justify-center relative overflow-hidden velvet-texture">
            {/* Cigarette burns and beer stains */}
            <div className="absolute top-4 left-8 w-4 h-4 rounded-full bg-cigarette-burn"></div>
            <div className="absolute bottom-12 right-12 w-6 h-6 rounded-full bg-beer-stain opacity-40"></div>
            
            {/* Coin - KEY FIX: Adding unique keys based on totalFlipCount so animation replays */}
            <AnimatePresence mode="wait">
              {isFlipping ? (
                <motion.div
                  key={`spinning-${totalFlipCount}`}
                  initial={{ rotateY: 0, y: 0 }}
                  animate={{ rotateY: 1800, y: [-100, 0] }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  className="w-48 h-48"
                  style={{ 
                    perspective: '1000px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Show random side during spin */}
                  <img
                    src={coinType === 'kennedy' ? '/coins/halfdollarheads.png' : '/coins/bustybettyheads.png'}
                    alt="Spinning coin"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{ 
                      backfaceVisibility: 'visible',
                      transform: 'rotateY(0deg)'
                    }}
                  />
                </motion.div>
              ) : flipResult ? (
                <motion.div
                  key={`result-${totalFlipCount}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {renderCoin()}
                </motion.div>
              ) : (
                <div key="ready" className="text-white text-xl">Ready to flip?</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Game controls */}
        <div className="mt-8 text-center">
          <div className="text-white text-2xl mb-4">
            Current Losing Streak: <span className="text-neon-pink font-bold">{currentStreak}</span>
            {currentStreak >= 4 && <span className="text-grimy-gold ml-2">👑 LEGEND</span>}
          </div>

          {!sessionActive ? (
            <button
              onClick={startSession}
              disabled={!isConnected}
              className="bg-grimy-gold hover:bg-yellow-600 text-black font-bold py-4 px-12 rounded-lg text-2xl transition disabled:opacity-50"
            >
              Start Free Session
            </button>
          ) : gameOver ? (
            /* GAME OVER - Mint button ONLY appears here */
            <div className="space-y-4">
              <h2 className="text-4xl text-neon-pink font-bold mb-6 animate-pulse">GAME OVER!</h2>
              <p className="text-white text-xl mb-4">Final Streak: {currentStreak}</p>
              
              <div className="flex gap-4 justify-center flex-wrap">
                {currentStreak >= 1 && (
                  <button
                    onClick={mintNFT}
                    disabled={isMintConfirming}
                    className="bg-grimy-gold hover:bg-yellow-600 text-black font-bold py-4 px-12 rounded-lg text-xl transition animate-pulse disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMintConfirming ? 'MINTING...' : `MINT THIS SHAME ($${gameMode === 'classic' ? '0.41' : '0.69'})`}
                  </button>
                )}
                
                <button
                  onClick={startSession}
                  disabled={isMintConfirming}
                  className="bg-neon-pink hover:bg-pink-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition disabled:opacity-50"
                >
                  {currentStreak >= 1 ? 'SKIP & PLAY AGAIN' : 'PLAY AGAIN'}
                </button>
              </div>
              
              {currentStreak >= 1 && (
                <p className="text-white/60 text-sm mt-4">
                  💡 Mint to add your score to the leaderboard!
                </p>
              )}
              
              {mintError && (
                <p className="text-red-500 text-sm mt-4">
                  ❌ Error: {mintError}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Call It Buttons */}
              {showCallButtons && !isFlipping && (
                <div className="space-y-3">
                  <p className="text-white text-xl mb-4">Call It:</p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => makeCall('heads')}
                      className="bg-neon-pink hover:bg-pink-700 text-white font-bold py-6 px-16 rounded-lg text-3xl transition transform hover:scale-105"
                    >
                      HEADS
                    </button>
                    <button
                      onClick={() => makeCall('tails')}
                      className="bg-neon-blue hover:bg-cyan-700 text-white font-bold py-6 px-16 rounded-lg text-3xl transition transform hover:scale-105"
                    >
                      TAILS
                    </button>
                  </div>
                </div>
              )}

              {/* Flipping state */}
              {isFlipping && (
                <div className="text-white text-2xl animate-pulse">
                  FLIPPING...
                </div>
              )}

              {/* Result message */}
              {!isFlipping && flipResult && (
                <div className="text-white text-lg mt-4">
                  {flipResult === 'edge' ? (
                    <span className="text-neon-pink font-bold animate-pulse">
                      EDGE LANDING! Automatic loss! 🎲
                    </span>
                  ) : flipResult !== userCall ? (
                    <span className="text-neon-pink font-bold">
                      YOU LOSE! {consecutiveLosses > 1 ? `${consecutiveLosses} in a row!` : 'Streak starts...'}
                    </span>
                  ) : (
                    <span className="text-white/60">You got it right. Streak ends - Time to mint!</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Roast popup */}
        <AnimatePresence>
          {showRoastPopup && currentRoast && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 border-2 border-neon-pink p-6 rounded-lg max-w-2xl"
            >
              <p className="text-white text-xl font-bold text-center">
                {currentRoast}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
