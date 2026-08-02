import React, { useState } from 'react';
import { PrincessEmotionState, GiftType, PrincessEmote } from '../types';
import { playPrincessVoiceSound } from '../utils/sound';
import { Heart, Sparkles, Coffee, Gift, Volume2, ShieldCheck, UserCheck, Smile, Flame, Moon, Music, Radio, X } from 'lucide-react';

interface PrincessModalProps {
  princessName: string;
  emotions: PrincessEmotionState;
  adoreRoyMode: boolean;
  onToggleAdoreRoy: (active: boolean) => void;
  onSendGift: (gift: GiftType) => void;
  onKissPrincess: () => void;
  onTriggerEmote: (emote: PrincessEmote) => void;
  onTriggerActionCmd: (cmd: 'follow' | 'hold_hands' | 'dance' | 'sit' | 'selfie' | 'cats' | 'coffee') => void;
  onClose: () => void;
}

export const PrincessModal: React.FC<PrincessModalProps> = ({
  princessName,
  emotions,
  adoreRoyMode,
  onToggleAdoreRoy,
  onSendGift,
  onKissPrincess,
  onTriggerEmote,
  onTriggerActionCmd,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'emotions' | 'gifts' | 'voice' | 'actions'>('emotions');

  const VOICE_SOUNDS = [
    'Hurraayyy!!',
    'Yayyyyy!!',
    'Hehehe~',
    'Ehehe~',
    'Ummmaahhh ❤️',
    'Mwahhh 💋',
    'Hmmm...',
    'Awww...',
    'Ehh?',
    'Nyaa~',
    'Miu Miu~',
    'Purr~',
    'Giggle~',
    'Yippeee!',
  ];

  const GIFTS: { type: GiftType; label: string; icon: string; desc: string }[] = [
    { type: 'coffee', label: 'Bakery Coffee', icon: '☕', desc: 'Hurraaaay!! +Love & Energy' },
    { type: 'cake', label: 'Berry Cake', icon: '🍰', desc: 'Yummm ❤️ +Happiness & Joy' },
    { type: 'bread', label: 'Croissant', icon: '🥐', desc: 'Fresh bakery treat +Comfort' },
    { type: 'flowers', label: 'Flower Bouquet', icon: '🌸', desc: 'Blushing love +Affection & Trust' },
    { type: 'chocolate', label: 'Dark Chocolate', icon: '🍫', desc: 'Sweet romantic gesture +Love' },
    { type: 'ice_cream', label: 'Vanilla Cone', icon: '🍦', desc: 'Yippeee! +Excitement' },
    { type: 'plush_toy', label: 'Kitty Plushie', icon: '🧸', desc: 'Cozy fluffy hug +Comfort' },
    { type: 'books', label: 'Storybook', icon: '📖', desc: 'Read together +Trust' },
    { type: 'music', label: 'Music Tune', icon: '🎵', desc: 'Dance together +Playfulness' },
    { type: 'cat_toy', label: 'Feather Cat Toy', icon: '🐾', desc: 'Pet cats together +Miu Miu~' },
  ];

  const EMOTES: { emote: PrincessEmote; label: string; icon: string }[] = [
    { emote: 'happy_dance', label: 'Happy Dance', icon: '💃' },
    { emote: 'jump', label: 'Jump', icon: '🦘' },
    { emote: 'spin', label: 'Spin', icon: '🌀' },
    { emote: 'clap', label: 'Clap', icon: '👏' },
    { emote: 'blush', label: 'Blush', icon: '😳' },
    { emote: 'heart_eyes', label: 'Heart Eyes', icon: '😍' },
    { emote: 'wave', label: 'Wave', icon: '👋' },
    { emote: 'hug', label: 'Hug', icon: '🤗' },
    { emote: 'sleep', label: 'Sleep', icon: '💤' },
    { emote: 'stretch', label: 'Stretch', icon: '🙆' },
    { emote: 'cat_pose', label: 'Cat Pose', icon: '🐱' },
    { emote: 'victory_pose', label: 'Victory', icon: '✌️' },
    { emote: 'coffee_cheers', label: 'Coffee Cheers', icon: '☕' },
    { emote: 'food_celebration', label: 'Food Feast', icon: '🥐' },
    { emote: 'blowing_kiss', label: 'Blow Kiss', icon: '💋' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-pink-50 via-amber-50 to-rose-50 border-4 border-pink-300 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">👑</span>
            <div>
              <h2 className="text-lg font-extrabold tracking-wide flex items-center gap-1.5">
                {princessName} <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">AI Companion</span>
              </h2>
              <p className="text-[11px] text-pink-100 font-medium">Roy's Living World • Real-time Emotion & Voice Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Adoration Mode Settings Banner */}
        <div className="p-3 bg-pink-100/80 border-b border-pink-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${adoreRoyMode ? 'text-pink-600 fill-pink-600 animate-pulse' : 'text-gray-400'}`} />
            <div>
              <p className="text-xs font-bold text-pink-900">Adoration Mode (☑ Adore Roy)</p>
              <p className="text-[10px] text-pink-700">Extra affectionate, waves, follows Roy & sits beside when AFK</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onKissPrincess}
              className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-95 flex items-center gap-1 animate-pulse"
            >
              💋 Kiss {princessName}
            </button>
            <button
              onClick={() => onToggleAdoreRoy(!adoreRoyMode)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border-2 transition ${
                adoreRoyMode
                  ? 'bg-pink-600 text-white border-pink-700 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50'
              }`}
            >
              {adoreRoyMode ? '💖 ON' : '⚪ OFF'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-pink-200 bg-white/60">
          <button
            onClick={() => setActiveTab('emotions')}
            className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'emotions' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/80' : 'text-gray-600 hover:bg-pink-50/40'
            }`}
          >
            <Smile className="w-3.5 h-3.5" /> Emotion Engine
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'gifts' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/80' : 'text-gray-600 hover:bg-pink-50/40'
            }`}
          >
            <Gift className="w-3.5 h-3.5" /> Gifts & Treats
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'voice' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/80' : 'text-gray-600 hover:bg-pink-50/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" /> Voice & Sounds
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2.5 text-xs font-bold transition flex items-center justify-center gap-1 ${
              activeTab === 'actions' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/80' : 'text-gray-600 hover:bg-pink-50/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Actions & Emotes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: EMOTION ENGINE */}
          {activeTab === 'emotions' && (
            <div className="space-y-3">
              <div className="bg-white/80 p-3 rounded-2xl border border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-900 flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Overall Relationship Bond
                  </span>
                  <span className="text-xs font-extrabold text-pink-600">{emotions.love}% Love</span>
                </div>
                <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden border border-pink-200">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 transition-all duration-500"
                    style={{ width: `${emotions.love}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'Affection', val: emotions.affection, color: 'bg-rose-500' },
                  { name: 'Trust', val: emotions.trust, color: 'bg-indigo-500' },
                  { name: 'Comfort', val: emotions.comfort, color: 'bg-emerald-500' },
                  { name: 'Energy', val: emotions.energy, color: 'bg-amber-500' },
                  { name: 'Mood', val: emotions.mood, color: 'bg-pink-500' },
                  { name: 'Happiness', val: emotions.happiness, color: 'bg-yellow-500' },
                  { name: 'Excitement', val: emotions.excitement, color: 'bg-purple-500' },
                  { name: 'Playfulness', val: emotions.playfulness, color: 'bg-sky-500' },
                  { name: 'Shyness', val: emotions.shyness, color: 'bg-pink-400' },
                  { name: 'Sleepiness', val: emotions.sleepiness, color: 'bg-blue-400' },
                  { name: 'Embarrassment', val: emotions.embarrassment, color: 'bg-rose-400' },
                  { name: 'Jealousy', val: emotions.jealousy, color: 'bg-red-400' },
                  { name: 'Stress', val: emotions.stress, color: 'bg-gray-400' },
                ].map((stat) => (
                  <div key={stat.name} className="bg-white/90 p-2 rounded-xl border border-pink-100 flex flex-col gap-1">
                    <div className="flex justify-between font-semibold text-[11px] text-gray-700">
                      <span>{stat.name}</span>
                      <span className="font-bold">{stat.val}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} transition-all duration-300`} style={{ width: `${stat.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GIFTS */}
          {activeTab === 'gifts' && (
            <div className="space-y-2">
              <p className="text-xs text-pink-800 font-semibold mb-2">Give a gift to {princessName} for unique animations, sounds, and affection boosts!</p>
              <div className="grid grid-cols-2 gap-2">
                {GIFTS.map((g) => (
                  <button
                    key={g.type}
                    onClick={() => onSendGift(g.type)}
                    className="p-2.5 bg-white hover:bg-pink-100 border-2 border-pink-200 hover:border-pink-400 rounded-2xl text-left transition transform active:scale-95 flex items-start gap-2 shadow-sm"
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-gray-900">{g.label}</div>
                      <div className="text-[10px] text-pink-700 leading-tight">{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOICE & SOUNDS */}
          {activeTab === 'voice' && (
            <div className="space-y-3">
              <p className="text-xs text-pink-800 font-semibold">Click any voice sound to hear Princess react live!</p>
              <div className="grid grid-cols-2 gap-2">
                {VOICE_SOUNDS.map((vs) => (
                  <button
                    key={vs}
                    onClick={() => playPrincessVoiceSound(vs)}
                    className="p-2.5 bg-white hover:bg-rose-100 border border-pink-300 rounded-xl text-xs font-bold text-pink-900 transition flex items-center justify-between shadow-sm active:scale-95"
                  >
                    <span>{vs}</span>
                    <Volume2 className="w-3.5 h-3.5 text-pink-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIONS & EMOTES */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-pink-900 mb-1.5 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-pink-600" /> Couple Interactions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onKissPrincess}
                    className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 rounded-xl text-xs font-bold transition text-left flex items-center gap-1 shadow-sm"
                  >
                    💋 Kiss {princessName}
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('dance')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    💃 Dance Together
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('follow')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    🚶 Follow Roy
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('hold_hands')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    🤝 Hold Hands
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('dance')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    💃 Dance Together
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('sit')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    🛋️ Sit Together
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('selfie')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    📸 Take Selfie
                  </button>
                  <button
                    onClick={() => onTriggerActionCmd('coffee')}
                    className="p-2 bg-white hover:bg-pink-100 border border-pink-300 rounded-xl text-xs font-bold text-gray-800 transition text-left"
                  >
                    ☕ Coffee Date
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-pink-900 mb-1.5">Expressive Emotes</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {EMOTES.map((e) => (
                    <button
                      key={e.emote}
                      onClick={() => onTriggerEmote(e.emote)}
                      className="p-2 bg-white hover:bg-rose-100 border border-pink-200 rounded-xl text-[11px] font-semibold text-gray-800 transition flex items-center gap-1.5 active:scale-95"
                    >
                      <span>{e.icon}</span>
                      <span className="truncate">{e.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-white/80 border-t border-pink-200 text-center">
          <p className="text-[10px] text-pink-700 font-semibold">
            💖 Roy & {princessName} • Forever Connected in Royland
          </p>
        </div>
      </div>
    </div>
  );
};
