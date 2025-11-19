import { useState, useEffect, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useReadContract } from 'wagmi';

// Your new FliprV3 contract address
const FLIPR_CONTRACT_ADDRESS = '0xc5dFAeB0aF28D52ca80Dc97b3F1fDe8cE49D962a';

// ABI for reading leaderboards
const FLIPR_ABI = [
  {
    name: 'getWeeklyLeaderboard',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{
      name: '',
      type: 'tuple[]',
      components: [
        { name: 'player', type: 'address' },
        { name: 'streak', type: 'uint256' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'timestamp', type: 'uint256' }
      ]
    }]
  },
  {
    name: 'getAllTimeLeaderboard',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{
      name: '',
      type: 'tuple[]',
      components: [
        { name: 'player', type: 'address' },
        { name: 'streak', type: 'uint256' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'timestamp', type: 'uint256' }
      ]
    }]
  }
] as const;

interface LeaderboardEntry {
  player: string;
  streak: bigint | number;
  tokenId: bigint | number;
  timestamp: bigint | number;
}

export default function FloatingLeaderboard() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Read weekly leaderboard from contract
  const { data: weeklyData, refetch: refetchWeekly } = useReadContract({
    address: FLIPR_CONTRACT_ADDRESS,
    abi: FLIPR_ABI,
    functionName: 'getWeeklyLeaderboard',
  });

  // Read all-time leaderboard from contract
  const { data: alltimeData, refetch: refetchAlltime } = useReadContract({
    address: FLIPR_CONTRACT_ADDRESS,
    abi: FLIPR_ABI,
    functionName: 'getAllTimeLeaderboard',
  });

  // Auto-refetch every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetchWeekly();
      refetchAlltime();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetchWeekly, refetchAlltime]);

  // Convert BigInt to Number for display
  const formatLeaderboardData = (data: any[]): LeaderboardEntry[] => {
    if (!data) return [];
    return data.map((entry: any) => ({
      player: entry.player || entry[0],
      streak: Number(entry.streak || entry[1]),
      tokenId: Number(entry.tokenId || entry[2]),
      timestamp: Number(entry.timestamp || entry[3])
    }));
  };

  const currentData = activeTab === 'weekly' 
    ? formatLeaderboardData(weeklyData as any[] || [])
    : formatLeaderboardData(alltimeData as any[] || []);

  // Auto-scroll effect
  useEffect(() => {
    if (!autoScroll || isMinimized || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollTop = scrollPosition;
    };

    const intervalId = setInterval(scroll, 30);

    return () => clearInterval(intervalId);
  }, [autoScroll, isMinimized, currentData]);

  const renderLeaderboard = () => {
    if (!currentData || currentData.length === 0) {
      return (
        <div className="text-white/60 text-center py-8 text-sm">
          No losers yet... be the first! 🎯
        </div>
      );
    }

    const sorted = [...currentData].sort((a, b) => Number(b.streak) - Number(a.streak));

    return (
      <div 
        ref={scrollRef}
        className="space-y-2 overflow-y-auto max-h-96 pr-2 scrollbar-thin scrollbar-thumb-neon-pink scrollbar-track-black/30"
        onMouseEnter={() => setAutoScroll(false)}
        onMouseLeave={() => setAutoScroll(true)}
      >
        {sorted.map((entry, index) => (
          <motion.div
            key={`${entry.player}-${entry.tokenId}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              bg-black/70 border rounded-lg p-3 flex items-center justify-between
              hover:border-neon-pink transition cursor-pointer group
              ${index === 0 ? 'border-grimy-gold shadow-lg shadow-grimy-gold/20' : 
                index === 1 ? 'border-gray-400' : 
                index === 2 ? 'border-amber-700' : 
                'border-white/20'}
            `}
          >
            {/* Rank */}
            <div className={`
              text-2xl font-bold w-12 text-center
              ${index === 0 ? 'text-grimy-gold' : 
                index === 1 ? 'text-gray-400' : 
                index === 2 ? 'text-amber-700' : 
                'text-neon-pink'}
            `}>
              {index === 0 && '👑'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${index + 1}`}
            </div>

            {/* Player Info */}
            <div className="flex-1 mx-3">
              <div className="text-white font-mono text-sm group-hover:text-neon-pink transition">
                {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
              </div>
              <div className="text-white/40 text-xs">
                NFT #{Number(entry.tokenId)}
              </div>
            </div>

            {/* Streak */}
            <div className="text-right">
              <div className={`
                text-xl font-bold
                ${Number(entry.streak) >= 7 ? 'text-grimy-gold animate-pulse' : 'text-neon-pink'}
              `}>
                {Number(entry.streak)}x
              </div>
              <div className="text-white/40 text-xs whitespace-nowrap">
                {Number(entry.streak) >= 7 ? '🔥 LEGEND' : 'losses'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      className={`
        fixed z-50 select-none
        ${isMinimized ? 'w-56' : 'w-[345px]'}
      `}
      style={{
        top: 140,
        right: 20,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-velvet-red to-black border-2 border-neon-pink rounded-lg shadow-2xl shadow-neon-pink/20 overflow-hidden backdrop-blur-sm">
        {/* Header - Draggable Handle */}
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="bg-black/80 px-4 py-3 flex items-center justify-between cursor-move border-b border-neon-pink/50"
        >
          <div className="flex items-center gap-2">
            <div className="text-2xl">🏆</div>
            <div>
              <h3 className="text-neon-pink font-bold text-sm font-retro tracking-wider">
                HALL OF SHAME
              </h3>
              <div className="text-white/60 text-xs">
                {activeTab === 'weekly' ? 'This Week' : 'All-Time Legends'}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className="text-white/60 hover:text-neon-pink transition text-xs"
              title={autoScroll ? 'Pause Scroll' : 'Auto Scroll'}
            >
              {autoScroll ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white/60 hover:text-neon-pink transition text-xs"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? '⬆️' : '⬇️'}
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('weekly')}
                className={`
                  flex-1 px-3 py-2 rounded text-xs font-bold transition
                  ${activeTab === 'weekly'
                    ? 'bg-neon-pink text-white'
                    : 'bg-black/50 text-white/60 hover:text-white'
                  }
                `}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveTab('alltime')}
                className={`
                  flex-1 px-3 py-2 rounded text-xs font-bold transition
                  ${activeTab === 'alltime'
                    ? 'bg-grimy-gold text-black'
                    : 'bg-black/50 text-white/60 hover:text-white'
                  }
                `}
              >
                7+ Legends
              </button>
            </div>

            {/* Leaderboard Entries */}
            {renderLeaderboard()}

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 text-center">
              <p className="text-white/40 text-xs">
                {activeTab === 'weekly' 
                  ? 'Resets every Monday 00:00 UTC' 
                  : 'Legendary 7+ streaks forever'}
              </p>
            </div>
          </div>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="px-4 py-2 text-center">
            <div className="text-white/60 text-xs">
              Click ⬆️ to expand
            </div>
          </div>
        )}
      </div>

      {/* Drag indicator */}
      <div className="absolute -top-2 -right-2 bg-neon-pink text-black text-xs px-2 py-1 rounded-full font-bold pointer-events-none">
        DRAG ME
      </div>
    </motion.div>
  );
}
