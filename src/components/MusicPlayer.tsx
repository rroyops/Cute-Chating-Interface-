import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Youtube,
  ListMusic,
  ChevronUp,
  ChevronDown,
  Radio,
  Disc,
  ExternalLink,
  Sparkles,
  Heart,
} from 'lucide-react';

export interface Track {
  id: string; // YouTube Video ID
  title: string;
  category: string;
}

const PRESET_TRACKS: Track[] = [
  {
    id: 'jfKfPfyJRdk',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    category: '☕ Lofi & Chill',
  },
  {
    id: '5qap5aO4i9A',
    title: 'Lofi Girl - Sleep Lofi Radio',
    category: '🌙 Night & Sleep',
  },
  {
    id: 'DWCJZFZ606g',
    title: 'Cozy Coffee Shop Piano & Soft Rain',
    category: '☕ Cafe Ambience',
  },
  {
    id: '1WUE-Z1S1S0',
    title: 'Studio Ghibli Peaceful Piano Collection',
    category: '🌸 Anime & Ghibli',
  },
  {
    id: 'S4m4r6zXU3M',
    title: 'Cute Stardew Valley Cozy Village Music',
    category: '🎮 Pixel Art Cozy',
  },
  {
    id: 'TURbeWK2wwg',
    title: 'Acoustic Guitar Cozy Sunset Vibe',
    category: '🎸 Acoustic Vibe',
  },
];

interface MusicPlayerProps {
  onTogglePlaySoundEffect?: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(PRESET_TRACKS[0]);
  const [customInput, setCustomInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(80);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Helper to extract YouTube Video ID from standard URLs or direct IDs
  const extractVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regex);
    return match ? match[1] : null;
  };

  const handleAddCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(customInput);
    if (id) {
      const newTrack: Track = {
        id,
        title: `Custom YouTube Track (${id})`,
        category: '⭐ My Custom Music',
      };
      setCurrentTrack(newTrack);
      setIsPlaying(true);
      setCustomInput('');
    } else {
      alert('Please enter a valid YouTube video link or 11-character Video ID!');
    }
  };

  // Construct iframe src with parameters
  const embedUrl = `https://www.youtube-nocookie.com/embed/${currentTrack.id}?enablejsapi=1&autoplay=${
    isPlaying ? 1 : 0
  }&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentTrack.id}&controls=0&modestbranding=1`;

  return (
    <>
      {/* Hidden YouTube Background Audio Player */}
      <div className="fixed -bottom-96 -right-96 opacity-0 pointer-events-none w-1 h-1 overflow-hidden z-0">
        <iframe
          ref={iframeRef}
          key={`${currentTrack.id}-${isPlaying ? 'play' : 'pause'}-${isMuted ? 'mute' : 'unmute'}`}
          src={embedUrl}
          title="Background Music Player"
          allow="autoplay; encrypted-media"
          className="w-1 h-1"
        />
      </div>

      {/* Floating Widget Bar (Fixed at bottom right) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 selection:bg-amber-200">
        {/* Expanded Music Control Panel */}
        {isExpanded && (
          <div className="w-80 sm:w-96 bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-2xl shadow-2xl p-4 text-[#3A2417] animate-in slide-in-from-bottom-5 duration-200">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 border-2 border-amber-700 flex items-center justify-center text-white shadow-xs">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-mono flex items-center gap-1.5">
                    Royland Background Music
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  </h3>
                  <p className="text-[10px] text-amber-800/80 font-medium">
                    YouTube Live Music & Cozy Ambience
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 text-amber-800 hover:bg-amber-200 rounded-lg transition"
                title="Minimize Music Panel"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Currently Playing Card */}
            <div className="bg-amber-100/80 border-2 border-amber-300 rounded-xl p-3 mb-3 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full bg-rose-500 border-2 border-rose-300 flex items-center justify-center text-white text-lg shadow-sm ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '6s' }}
              >
                <Disc className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 block">
                  {currentTrack.category}
                </span>
                <p className="text-xs font-bold truncate text-amber-950">{currentTrack.title}</p>
                <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {isPlaying ? 'Playing live background music' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 border-2 transition transform active:scale-95 shadow-sm ${
                  isPlaying
                    ? 'bg-amber-800 text-amber-100 border-amber-950 hover:bg-amber-900'
                    : 'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-700'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" /> Pause Music
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Play Music
                  </>
                )}
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-xl border-2 transition text-xs flex items-center gap-1 font-bold ${
                  isMuted
                    ? 'bg-rose-100 text-rose-700 border-rose-300'
                    : 'bg-amber-200 text-amber-900 border-amber-400'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Presets List */}
            <div className="mb-3">
              <label className="text-[11px] font-extrabold text-amber-900 font-mono mb-1.5 flex items-center gap-1">
                <ListMusic className="w-3.5 h-3.5 text-amber-700" /> Choose Preset Radio Station
              </label>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {PRESET_TRACKS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentTrack(t);
                      setIsPlaying(true);
                      setIsMuted(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-xs font-medium border transition flex items-center justify-between ${
                      currentTrack.id === t.id
                        ? 'bg-amber-300 border-amber-500 font-bold text-amber-950 shadow-xs'
                        : 'bg-white/90 hover:bg-amber-100 border-amber-200 text-amber-900'
                    }`}
                  >
                    <span className="truncate pr-2">{t.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 font-mono shrink-0">
                      {t.category.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom YouTube Link Input */}
            <form onSubmit={handleAddCustomTrack} className="pt-2 border-t border-amber-200">
              <label className="text-[10px] font-bold text-amber-900 block mb-1 flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-600" /> Play Custom YouTube Music Link
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Paste YouTube Video URL or ID..."
                  className="flex-1 px-2.5 py-1.5 text-xs bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl border border-red-800 transition active:scale-95"
                >
                  Play
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Compact Floating Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`px-3 py-2 rounded-2xl border-3 shadow-xl font-mono text-xs font-extrabold flex items-center gap-2 transition transform hover:scale-105 active:scale-95 ${
            isPlaying
              ? 'bg-[#8B5A2B] text-white border-[#6E492B] hover:bg-[#724822]'
              : 'bg-amber-200 text-amber-900 border-amber-400 hover:bg-amber-300'
          }`}
        >
          <div className="relative">
            <Radio className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-amber-300' : ''}`} />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <span className="max-w-[130px] sm:max-w-[180px] truncate">
            {isPlaying ? `🎵 ${currentTrack.title}` : '🎵 Music Off'}
          </span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
    </>
  );
};
