import { motion } from 'framer-motion';

export default function ScanLines() {
  return (
    <>
      {/* CRT scan lines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 159, 67, 0.1) 2px,
            rgba(255, 159, 67, 0.1) 4px
          )`,
        }}
      />

      {/* Moving scan line */}
      <motion.div
        className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88]/30 to-transparent pointer-events-none z-50"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)`,
        }}
      />

      {/* CRT flicker effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40 bg-[#ff9f43]/[0.01]"
        animate={{ opacity: [0.01, 0.02, 0.01, 0.015, 0.01] }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatType: 'loop',
        }}
      />
    </>
  );
}
