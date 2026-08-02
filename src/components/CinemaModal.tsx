import React, { useState } from 'react';
import { CinemaState } from '../types';
import { Film, Play, Pause, Youtube, Sparkles, X, Heart, ExternalLink } from 'lucide-react';

interface Props {
  cinemaState: CinemaState;
  onUpdateCinema: (updated: Partial<CinemaState>) => void;
  onClose: () => void;
}

export const CinemaModal: React.FC<Props> = ({ cinemaState, onUpdateCinema, onClose }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Extract YouTube ID from various link formats
  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const vId = extractVideoId(inputUrl);
    if (!vId) {
      setStatusMessage('⚠️ Invalid YouTube link. Please paste a valid YouTube URL!');
      return;
    }

    onUpdateCinema({
      videoId: vId,
      videoTitle: `YouTube Video (${vId})`,
      isPlaying: true,
      currentTime: 0,
    });

    setStatusMessage('🎬 Movie updated & broadcasting to all players!');
    setInputUrl('');
  };

  const PRESET_MOVIES = [
    { title: '🎧 Lofi Beats Study / Relax', id: 'jfKfPfyJRdk' },
    { title: '✨ Romantic Ghibli Piano OST', id: '3jWRrafhO6M' },
    { title: '💖 Cute Cat & Kitten Moments', id: 'D36JUfE2L1s' },
    { title: '🌸 Cozy Rain & Coffee Ambiance', id: 'mPZkdNFkNps' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#191124] border-4 border-rose-500 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-white relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-rose-950/80 hover:bg-rose-900 rounded-full text-rose-200 border border-rose-500 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-rose-900/60 pb-3">
          <div className="p-2.5 bg-rose-500 rounded-2xl border-2 border-rose-300">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black font-mono text-rose-200 flex items-center gap-2">
              🎬 Synchronized YouTube Cinema
              <span className="text-[10px] bg-rose-500/80 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                Multiplayer Sync
              </span>
            </h2>
            <p className="text-[11px] text-rose-300/80">
              Watch movies, music videos, and lofi streams together in real time with your girlfriend & friends!
            </p>
          </div>
        </div>

        {/* Embedded YouTube Player */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-rose-500/50 shadow-xl">
          <iframe
            src={`https://www.youtube.com/embed/${cinemaState.videoId}?autoplay=1&enablejsapi=1`}
            title="MeowLand Movie Theater"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Playback Controls & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-rose-950/60 border border-rose-800 rounded-2xl text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateCinema({ isPlaying: !cinemaState.isPlaying })}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl flex items-center gap-1 transition"
            >
              {cinemaState.isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Cinema</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Sync Play</span>
                </>
              )}
            </button>
            <span className="text-rose-200 font-bold truncate max-w-[200px] sm:max-w-xs">
              {cinemaState.videoTitle}
            </span>
          </div>

          <a
            href={`https://youtube.com/watch?v=${cinemaState.videoId}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-rose-300 hover:text-white underline flex items-center gap-1"
          >
            <span>Open in YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Paste YouTube URL Input Form */}
        <form onSubmit={handleApplyUrl} className="space-y-2">
          <label className="block text-xs font-bold text-rose-200">
            Paste YouTube URL to Watch Together:
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Youtube className="w-4 h-4 absolute left-3 top-3 text-rose-400" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full pl-9 pr-3 py-2 bg-rose-950/80 border-2 border-rose-500/60 rounded-xl text-xs text-white placeholder:text-rose-400/60 focus:outline-hidden focus:ring-2 focus:ring-rose-400 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md border border-rose-400 transition shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Video</span>
            </button>
          </div>
        </form>

        {/* Romantic Preset Movie Chips */}
        <div>
          <span className="text-[11px] font-bold text-rose-300 block mb-1">
            ✨ Fast Preset Romantic & Chill Channels:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_MOVIES.map((pm) => (
              <button
                key={pm.id}
                onClick={() =>
                  onUpdateCinema({
                    videoId: pm.id,
                    videoTitle: pm.title,
                    isPlaying: true,
                    currentTime: 0,
                  })
                }
                className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 border border-rose-500/60 text-rose-100 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
              >
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>{pm.title}</span>
              </button>
            ))}
          </div>
        </div>

        {statusMessage && (
          <div className="p-2 bg-rose-900/80 border border-rose-400 text-rose-100 font-bold text-xs rounded-xl text-center animate-pulse">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};
