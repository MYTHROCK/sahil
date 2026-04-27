import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    title: 'Neon Drift',
    artist: 'AI Synth 1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Digital High',
    artist: 'AI Synth 2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Cyber Dreams',
    artist: 'AI Synth 3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/80 backdrop-blur border border-fuchsia-500/30 p-4 rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.2)] text-white">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-fuchsia-400 truncate">{currentTrack.title}</h3>
          <p className="text-zinc-400 text-sm">{currentTrack.artist}</p>
        </div>
        <button onClick={toggleMute} className="text-zinc-400 hover:text-fuchsia-400 transition-colors cursor-pointer">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-6 overflow-hidden">
        <div 
          className="bg-fuchsia-500 h-full rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(217,70,239,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-center gap-6">
        <button onClick={prevTrack} className="text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer">
          <SkipBack size={28} />
        </button>
        <button 
          onClick={togglePlay} 
          className="w-14 h-14 flex items-center justify-center bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full transition-colors shadow-[0_0_15px_rgba(217,70,239,0.5)] cursor-pointer"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
        </button>
        <button onClick={nextTrack} className="text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer">
          <SkipForward size={28} />
        </button>
      </div>
    </div>
  );
}
