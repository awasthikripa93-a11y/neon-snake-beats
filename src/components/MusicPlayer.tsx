import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Disc } from 'lucide-react';
import { Visualizer } from './Visualizer';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber Runner",
    artist: "AI Gen: Synthcore",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/cyber/200/200"
  },
  {
    id: 2,
    title: "Midnight Neon",
    artist: "AI Gen: Vaporwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon/200/200"
  },
  {
    id: 3,
    title: "Data Stream",
    artist: "AI Gen: Glitch",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/data/200/200"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [isAudioOff, setIsAudioOff] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isAudioOff ? 0 : volume;
    }
  }, [volume, isAudioOff]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback error", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className="w-full glitch-border p-6 bg-black flex flex-col gap-6 relative overflow-hidden bg-noise">
      <div className="flex items-center gap-4 relative z-10 border-b-2 border-[#ff00ff]/40 pb-4">
        <div className="relative">
          <div className="w-16 h-16 bg-[#ff00ff] p-[2px] animate-flicker">
            <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden grayscale">
              <img 
                src={currentTrack.cover} 
                alt="ENCRYPTED_ASSET" 
                className="w-full h-full object-cover mix-blend-screen saturate-200"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden font-mono">
          <h3 className="text-lg font-bold truncate text-[#00ffff] glitch-text" data-text={currentTrack.title.toUpperCase()}>
            {currentTrack.title.toUpperCase()}
          </h3>
          <p className="text-[10px] text-[#ff00ff] tracking-[0.2em]">ORIGIN: {currentTrack.artist.toUpperCase()}</p>
        </div>
      </div>

      <Visualizer isPlaying={isPlaying} />

      <div className="space-y-4 relative z-10">
        <div className="h-6 border-2 border-[#00ffff] bg-black w-full relative overflow-hidden group">
          <div 
            className="h-full bg-[#00ffff] shadow-[4px_0_0_#ff00ff]" 
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference tracking-widest animate-pulse">
            DECRYPT_BUFFER: {Math.round(progress)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 relative z-10">
        <div className="flex justify-between items-center px-2">
            <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] font-mono text-xs">{"<<_PREV"}</button>
            <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] font-mono text-xs">{"NEXT_>>"}</button>
        </div>

        <button 
          onClick={togglePlay}
          className={`py-3 border-4 border-[#ff00ff] font-mono font-bold text-lg transition-all flex items-center justify-center ${isPlaying ? 'bg-[#ff00ff] text-black shadow-[-4px_-4px_0_#00ffff]' : 'text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black'}`}
        >
          {isPlaying ? "SUSPEND_PROCESS" : "INITIALIZE_SEQUENCE"}
        </button>
      </div>

      <div className="flex flex-col gap-2 relative z-10 px-1 font-mono">
        <div className="flex justify-between text-[10px] items-center">
            <span className="text-[#00ffff]">DECRYPTOR_GAIN</span>
            <button 
                onClick={() => setIsAudioOff(!isAudioOff)}
                className={`px-2 py-0.5 border border-current text-[8px] ${isAudioOff ? 'text-[#ff00ff] border-[#ff00ff]' : 'text-[#00ffff] opacity-50'}`}
            >
                AUDIO_DECRYPTOR: [{isAudioOff ? 'OFF' : 'ON'}]
            </button>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full accent-[#ff00ff] h-1 bg-[#00ffff]/20 appearance-none cursor-crosshair border border-[#00ffff]/30"
        />
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={onTimeUpdate}
        onEnded={handleNext}
      />
    </div>
  );
};

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
