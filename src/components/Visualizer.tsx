import React from 'react';
import { motion } from 'motion/react';

export const Visualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  const bars = Array.from({ length: 24 });
  
  return (
    <div className="flex items-end gap-[2px] h-12 w-full justify-center overflow-hidden">
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-cyan-500/40 rounded-t-sm"
          initial={{ height: 4 }}
          animate={{ 
            height: isPlaying ? [4, Math.random() * 40 + 8, 4] : 4,
            backgroundColor: isPlaying ? ['#06b6d4', '#d946ef', '#06b6d4'] : '#06b6d444'
          }}
          transition={{ 
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            delay: i * 0.05
          }}
        />
      ))}
    </div>
  );
};
