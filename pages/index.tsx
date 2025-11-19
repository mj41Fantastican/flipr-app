import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import FliprGame from '@/components/FliprGame';
import FloatingLeaderboard from '@/components/FloatingLeaderboard';

export default function Home() {
  return (
    <>
      <Head>
        <title>Flipr - Loser's Lounge Coin Flip</title>
        <meta name="description" content="The worse you lose, the more legendary you become. Mint your shame on Base." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://yourdomain.com/frame-image.png" />
        <meta property="fc:frame:button:1" content="Play Classic ($0.41)" />
        <meta property="fc:frame:button:2" content="Play Degen ($0.69)" />
        <meta property="fc:frame:post_url" content="https://yourdomain.com/api/frame" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Flipr - Loser's Lounge" />
        <meta property="og:description" content="The worse you lose, the more legendary you become" />
        <meta property="og:image" content="https://yourdomain.com/og-image.png" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Floating Leaderboard Widget */}
        <FloatingLeaderboard />

        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-neon-pink/30">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-neon text-neon-pink">
              FLIPR<span className="text-white">:</span> <span className="text-sm md:text-xl text-white/80">Just Flip The Damn Coin</span>
            </h1>
            <ConnectButton />
          </div>
        </header>

        {/* Main content */}
        <main className="pt-20">
          <FliprGame />
        </main>

        {/* Footer */}
        <footer className="bg-black/80 border-t border-neon-pink/30 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-white/60">
            <p className="mb-2">Built on Base • Powered by mj41.me</p>
            <p className="text-sm">All fees go to: 0x50ef...5de6</p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="/leaderboard" className="hover:text-neon-pink transition">Leaderboard</a>
              <a href="https://basescan.org/address/0x50ef686123d82e0a37bc62abcbdf1526fde85de6" target="_blank" rel="noopener" className="hover:text-neon-pink transition">Treasury</a>
              <a href="https://docs.mj41.me/flipr" target="_blank" rel="noopener" className="hover:text-neon-pink transition">How to Play</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
