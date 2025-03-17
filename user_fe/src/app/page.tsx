'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { WarpBackground } from '@/components/magicui/warp-background';
import { AuroraText } from '@/components/magicui/aurora-text';
import { ShimmerButton } from '@/components/magicui/shimmer-button';

export default function LandingPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center">
      <WarpBackground 
        className="h-full w-full border-none p-0" 
        gridColor="rgba(255,255,255,0.2)"
        beamsPerSide={4}
        beamDuration={5}
      >
        <div className="flex flex-col items-center justify-center h-full w-full space-y-12 mt-[15%]">
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <AuroraText 
                className="text-5xl md:text-6xl font-bold"
                colors={["#FF0080", "#7928CA", "#0070F3", "#38bdf8", "#a855f7", "#2dd4bf"]}
                speed={0.7}
              >
                Exclusive Coupons Await You
              </AuroraText>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center"
          >
            <Link href="/coupons" className="transform transition-transform hover:scale-105">
              <ShimmerButton 
                shimmerColor="rgba(255, 255, 255, 0.8)"
                shimmerSize="0.08em"
                shimmerDuration="2.5s"
                background="linear-gradient(135deg, rgba(109, 40, 217, 0.9) 0%, rgba(147, 51, 234, 0.9) 50%, rgba(226, 0, 255, 0.8) 100%)"
                className="px-8 py-4 text-lg font-semibold tracking-wider shadow-lg shadow-purple-500/30 border-2 border-white/20"
              >
                <span className="flex items-center bg-clip-text bg-gradient-to-r from-white to-purple-100">
                  Browse Coupons
                </span>
              </ShimmerButton>
            </Link>
          </motion.div>
        </div>
      </WarpBackground>
    </div>
  );
}