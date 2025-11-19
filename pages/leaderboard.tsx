import Head from 'next/head';
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useReadContract } from 'wagmi';
import { FLIPR_CONTRACT_ADDRESS } from '@/config/wagmi';

interface LeaderboardEntry {
  player: string;
  streak: number;
  tokenId: number;
  timestamp: number;
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'weekly' | 'alltime'>('weekly');
  
  // Read weekly leaderboard from contract
const { data: weeklyData } = useReadContract({
  address: FLIPR_CONTRACT_ADDRESS as `0x${string}`,
  abi: [], // Add ABI
  functionName: 'getWeeklyLeaderboard',
});

  // Read all-time leaderboard from contract
const { data: alltimeData } = useReadContract({
  address: FLIPR_CONTRACT_ADDRESS as `0x${string}`,
  abi: [], // Add ABI
  functionName: 'getAllTimeLeaderboard',
});

  const renderLeaderboard = (data: any) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-white/60 text-center py-12">
          No losers yet... be the first!
        </div>
      );
    }

    // Sort by streak descending
    const sorted = [...data].sort((a, b) => b.streak - a.streak).slice(0, 10);

    return (
      <div className="space-y-4">
        {sorted.map((entry: LeaderboardEntry, index: number) => (
          <div
            key={index}
            className="bg-black/50 border border-neon-pink/30 rounded-lg p-4 flex items-center justify-between hover:border-neon-pink transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-neon-pink w-12">
                #{index + 1}
              </div>
              <div>
                <div className="text-white font-bold">
                  {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
                </div>
                <div className="text-white/60 text-sm">
                  Token #{entry.tokenId}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-grimy-gold">
                {entry.streak}x
              </div>
              <div className="text-white/60 text-sm">
                Consecutive Losses
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Leaderboard - Flipr</title>
        <meta name="description" content="Hall of Shame: The biggest losers on Flipr" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-velvet-red to-black">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neon-pink/30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <a href="/" className="text-3xl font-neon text-neon-pink">FLIPR</a>
            <ConnectButton />
          </div>
        </header>

        {/* Main content */}
        <main className="pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-neon text-center text-neon-pink mb-4 animate-neon-flicker">
              HALL OF SHAME
            </h1>
            <p className="text-white/80 text-center mb-12 text-xl">
              The biggest losers, immortalized forever
            </p>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => setActiveTab('weekly')}
                className={`px-8 py-3 rounded-lg font-bold transition ${
                  activeTab === 'weekly'
                    ? 'bg-neon-pink text-white'
                    : 'bg-black/50 text-white/60 hover:text-white'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveTab('alltime')}
                className={`px-8 py-3 rounded-lg font-bold transition ${
                  activeTab === 'alltime'
                    ? 'bg-grimy-gold text-black'
                    : 'bg-black/50 text-white/60 hover:text-white'
                }`}
              >
                All-Time Legends (31+)
              </button>
            </div>

            {/* Leaderboard */}
            <div>
              {activeTab === 'weekly' ? renderLeaderboard(weeklyData) : renderLeaderboard(alltimeData)}
            </div>

            {/* Info */}
            <div className="mt-12 text-center text-white/60">
              <p>Weekly leaderboard resets every Monday at 00:00 UTC</p>
              <p className="mt-2">Only 31+ streaks make it to the All-Time Hall of Fame</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
