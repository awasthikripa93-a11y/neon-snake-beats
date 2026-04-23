/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Activity, Zap, HardDrive } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-8 relative crt-static overflow-hidden animate-tearing">
      <div className="scanline" />
      <div className="fixed inset-0 bg-noise opacity-5 pointer-events-none animate-flicker" />
      
      {/* HEADER_BLOCK */}
      <header className="mb-16 flex flex-col items-center z-10">
        <div className="flex items-center gap-4 mb-4">
          <Zap className="text-[#ff00ff] w-10 h-10 animate-pulse" />
          <h1 
            className="text-7xl font-mono font-bold tracking-tight glitch-text" 
            data-text="NEON_DRIVE_OS"
          >
            NEON_DRIVE_OS
          </h1>
          <Activity className="text-[#00ffff] w-10 h-10 animate-pulse" />
        </div>
        <div className="px-4 py-1 bg-[#00ffff] text-black font-bold tracking-[0.5em] text-sm flex items-center gap-4 animate-skew">
          <span>SECURE_LINK: DEGRADED</span>
          <div className="w-2 h-2 bg-black animate-ping" />
          <span>OS_REV: 0x4F92</span>
        </div>
      </header>

      {/* CORE_OPERATIONAL_GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_auto_280px] gap-12 items-start w-full max-w-screen-2xl z-10">
        
        {/* LEFT_DIAGNOSTIC_RAIL */}
        <div className="hidden lg:flex flex-col gap-8 opacity-80">
          <div className="glitch-border p-6 bg-black">
            <div className="flex items-center gap-2 mb-6 border-b border-[#00ffff]/30 pb-2">
              <Terminal size={14} />
              <h4 className="text-xs font-mono tracking-widest uppercase">DIAGNOSTIC_STREAM</h4>
            </div>
            <div className="space-y-6">
              {[
                { label: 'CORES', value: '4/4_ACTIVE', color: '#00ffff' },
                { label: 'TEMP', value: '88°C_CRITICAL', color: '#ff00ff' },
                { label: 'MEMORY', value: '0x00FF_LEAK', color: '#ff00ff' },
              ].map(stat => (
                <div key={stat.label} className="group cursor-crosshair">
                  <span className="text-[10px] text-[#00ffff]/60 block mb-1">{stat.label}</span>
                  <span className="text-sm font-mono font-bold" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-l-4 border-[#ff00ff] bg-[#ff00ff]/5">
            <p className="text-[10px] leading-relaxed opacity-60">
              WARNING: UNAUTHORIZED ACCESS DETECTED in sector_7. 
              RE-ROUTING NEURAL TRANSMISSIONS...
            </p>
          </div>
        </div>

        {/* CENTER_GAME_ENGINE */}
        <div className="flex flex-col items-center justify-center p-4">
            <SnakeGame />
        </div>

        {/* RIGHT_AUDIO_DECRYPTOR */}
        <div className="flex flex-col gap-8">
           <div className="lg:w-[320px]">
             <MusicPlayer />
           </div>
           
           <div className="glitch-border p-4 bg-black hidden lg:block">
              <div className="flex items-center gap-2 mb-4 text-[#ff00ff]">
                <HardDrive size={14} />
                <span className="text-[10px] font-bold">DISK_LOGGY</span>
              </div>
              <div className="font-mono text-[9px] text-[#00ffff]/40 space-y-1">
                <p>{">> READ_ERROR_0x44"}</p>
                <p>{">> CORRUPT_FRAGMENT_FOUND"}</p>
                <p className="text-[#ff00ff]/50">{">> OVERRIDING_PROTOCOL"}</p>
                <p>{">> RETRIEVING_HIDDEN_DATA..."}</p>
              </div>
           </div>
        </div>

      </div>

      {/* FOOTER_DECODER */}
      <footer className="mt-20 border-t border-[#00ffff]/20 pt-4 flex gap-12 text-[10px] font-mono opacity-40">
        <span>[NODE_ID: AIS-RA6KD]</span>
        <span>[TIME_CHART: 00:00:00:EX]</span>
        <span>[REDACTED_DATA_STREAM]</span>
      </footer>

      {/* STATIC_OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 mix-blend-overlay bg-[url('https://transparenttextures.com/patterns/60-lines.png')]" />
    </main>
  );
}
