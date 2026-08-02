import React, { useState } from 'react';
import { Coffee, Sparkles, Heart, Check, Flame, Disc, Send, X, Trophy } from 'lucide-react';
import { PlayerData } from '../types';

interface CafeBarModalProps {
  localPlayer: PlayerData;
  remotePlayers: PlayerData[];
  onClose: () => void;
  onSendCoffeeToPartner: (drinkName: string, pastryName: string, message: string) => void;
  onRewardCoins: (amount: number) => void;
  isCandlelightActive?: boolean;
  onToggleCandlelight?: (active: boolean) => void;
}

export const CafeBarModal: React.FC<CafeBarModalProps> = ({
  localPlayer,
  remotePlayers,
  onClose,
  onSendCoffeeToPartner,
  onRewardCoins,
  isCandlelightActive = false,
  onToggleCandlelight,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedBean, setSelectedBean] = useState<string>('Caramel Hazelnut');
  const [grindProgress, setGrindProgress] = useState<number>(0);
  const [isGrinding, setIsGrinding] = useState<boolean>(false);
  const [selectedMilk, setSelectedMilk] = useState<string>('Oat Milk');
  const [latteArt, setLatteArt] = useState<string>('💖 Heart');
  const [selectedPastry, setSelectedPastry] = useState<string>('Butter Croissant');
  const [customNote, setCustomNote] = useState<string>('Good morning my princess 🌸 I made your favorite hot caramel latte & fresh croissant! ❤️');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Find partner or AI Princess
  const partner = remotePlayers.find((p) => p.id !== localPlayer.id) || {
    id: 'ai_princess',
    username: 'princess',
    nickname: "Roy's Princess 👑",
  };

  const handleGrindClick = () => {
    setIsGrinding(true);
    let current = grindProgress;
    const interval = setInterval(() => {
      current += 20;
      setGrindProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsGrinding(false);
        setStep(3); // move to milk step
      }
    }, 200);
  };

  const handleFinish = (target: 'self' | 'partner') => {
    setIsCompleted(true);
    const drinkName = `${selectedBean} Espresso with ${selectedMilk} (${latteArt})`;
    if (target === 'partner') {
      onSendCoffeeToPartner(drinkName, selectedPastry, customNote);
      onRewardCoins(100);
    } else {
      onRewardCoins(50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#3A2417]">
        {/* Header */}
        <div className="bg-[#5A3825] px-5 py-4 text-white flex items-center justify-between border-b-4 border-[#3A2417]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 border-2 border-amber-300 flex items-center justify-center text-amber-950 shadow-inner">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-base font-serif tracking-wide flex items-center gap-2">
                Royland Cafe & Bakery
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </h2>
              <p className="text-xs text-amber-200/90 font-mono">
                Fresh Espresso & Baked Pastry Station
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-amber-900/60 hover:bg-amber-800 text-amber-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Cafe Atmosphere & Candlelight Feature Toggle */}
          <div className="bg-amber-900/10 border-2 border-amber-800/30 rounded-2xl p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                isCandlelightActive ? 'bg-amber-500/20 text-amber-500 animate-pulse border border-amber-400' : 'bg-amber-200/50 text-amber-800'
              }`}>
                🕯️
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                  Cafe Candlelight Mood
                  {isCandlelightActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-amber-950 font-bold">
                      ACTIVE
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-amber-800/90">
                  Dim ambient light & warm flickering table candlelight
                </p>
              </div>
            </div>
            <button
              onClick={() => onToggleCandlelight && onToggleCandlelight(!isCandlelightActive)}
              className={`px-3 py-1.5 rounded-xl font-extrabold text-xs border-2 transition active:scale-95 flex items-center gap-1.5 ${
                isCandlelightActive
                  ? 'bg-amber-600 border-amber-800 text-white shadow-md'
                  : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${isCandlelightActive ? 'text-amber-200 fill-amber-200' : 'text-amber-700'}`} />
              {isCandlelightActive ? 'Candlelight ON' : 'Set Candlelight'}
            </button>
          </div>

          {/* Progress Bar */}
          {!isCompleted && (
            <div className="flex items-center justify-between gap-2 border-b-2 border-amber-200/80 pb-3">
              {[
                { s: 1, label: '1. Beans' },
                { s: 2, label: '2. Grind' },
                { s: 3, label: '3. Milk' },
                { s: 4, label: '4. Pastry' },
                { s: 5, label: '5. Serve' },
              ].map((item) => (
                <div
                  key={item.s}
                  className={`flex-1 py-1.5 rounded-xl text-center text-xs font-bold transition ${
                    step === item.s
                      ? 'bg-amber-800 text-amber-100 shadow-sm scale-105'
                      : step > item.s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-200/60 text-amber-900/60'
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: SELECT BEANS */}
          {step === 1 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
                <Disc className="w-4 h-4 text-amber-700" /> Choose Fresh Roasted Coffee Beans:
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Caramel Hazelnut', desc: 'Sweet, buttery & aromatic', icon: '🌰' },
                  { name: 'Dark Roast Arabica', desc: 'Rich, bold & intense', icon: '☕' },
                  { name: 'Matcha Green Tea', desc: 'Calming ceremonial matcha', icon: '🍵' },
                  { name: 'Rose Vanilla', desc: 'Floral, smooth & romantic', icon: '🌹' },
                ].map((b) => (
                  <button
                    key={b.name}
                    onClick={() => setSelectedBean(b.name)}
                    className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                      selectedBean === b.name
                        ? 'bg-amber-200 border-amber-800 font-bold shadow-sm'
                        : 'bg-white border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-xl">{b.icon}</span>
                    <span className="font-bold text-xs text-amber-950 mt-1">{b.name}</span>
                    <span className="text-[10px] text-amber-800/80">{b.desc}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 bg-amber-800 hover:bg-amber-900 text-amber-100 font-extrabold text-xs rounded-2xl border-2 border-amber-950 transition active:scale-95 flex items-center justify-center gap-2 shadow-md"
              >
                Next: Grind Coffee Beans & Extract Espresso ☕
              </button>
            </div>
          )}

          {/* STEP 2: GRIND BEANS & EXTRACT */}
          {step === 2 && (
            <div className="space-y-4 text-center py-2">
              <h3 className="font-extrabold text-sm text-amber-950">
                Grind {selectedBean} & Extract Espresso Shot
              </h3>
              <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-900 border-4 border-amber-700 flex items-center justify-center shadow-lg relative overflow-hidden">
                <Flame className={`w-12 h-12 text-amber-400 ${isGrinding ? 'animate-bounce' : ''}`} />
                {isGrinding && (
                  <div className="absolute inset-0 bg-amber-500/20 animate-pulse" />
                )}
              </div>
              <p className="text-xs text-amber-800 font-medium">
                Hold the button to grind fresh coffee beans!
              </p>

              {/* Progress Meter */}
              <div className="w-full h-4 bg-amber-200 rounded-full overflow-hidden border border-amber-400">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${grindProgress}%` }}
                />
              </div>

              <button
                onClick={handleGrindClick}
                disabled={isGrinding || grindProgress >= 100}
                className="w-full py-3 bg-[#8B5A2B] hover:bg-[#724822] disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl border-2 border-[#5A3825] transition active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                {grindProgress >= 100 ? 'Espresso Ready! ✨' : '⚙️ Hold to Grind & Extract Espresso'}
              </button>
            </div>
          )}

          {/* STEP 3: MILK & LATTE ART */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-amber-950">
                Select Milk & Pour Heart Latte Art
              </h3>
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1.5">Choice of Milk:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Oat Milk 🌾', 'Whole Milk 🥛', 'Almond Milk 🥜'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMilk(m)}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition ${
                        selectedMilk === m
                          ? 'bg-amber-800 text-white border-amber-950'
                          : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1.5">Latte Art Pattern:</label>
                <div className="grid grid-cols-3 gap-2">
                  {['💖 Heart', '🌿 Rosetta', '🐱 Cat Paw'].map((art) => (
                    <button
                      key={art}
                      onClick={() => setLatteArt(art)}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition ${
                        latteArt === art
                          ? 'bg-amber-800 text-white border-amber-950'
                          : 'bg-white border-amber-300 text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      {art}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(4)}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-amber-100 font-extrabold text-xs rounded-2xl border-2 border-amber-950 transition active:scale-95 flex items-center justify-center gap-2 shadow-md"
              >
                Next: Pair with Bakery Pastry 🥐
              </button>
            </div>
          )}

          {/* STEP 4: SELECT PASTRY */}
          {step === 4 && (
            <div className="space-y-3">
              <h3 className="font-extrabold text-sm text-amber-950">
                Select Baked Pastry from Glass Display:
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Butter Croissant', icon: '🥐', price: 'Golden & flaky' },
                  { name: 'Pain au Chocolat', icon: '🍫', price: 'Belgian chocolate' },
                  { name: 'Strawberry Shortcake', icon: '🍰', price: 'Fresh cream cake' },
                  { name: 'Rose Macaron Box', icon: '🧁', price: 'Romantic sweets' },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setSelectedPastry(p.name)}
                    className={`p-3 rounded-2xl border-2 text-left transition ${
                      selectedPastry === p.name
                        ? 'bg-amber-200 border-amber-800 font-bold shadow-sm'
                        : 'bg-white border-amber-200 hover:bg-amber-50'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <p className="font-bold text-xs text-amber-950 mt-1">{p.name}</p>
                    <span className="text-[10px] text-amber-800/80">{p.price}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep(5)}
                className="w-full mt-4 py-3 bg-amber-800 hover:bg-amber-900 text-amber-100 font-extrabold text-xs rounded-2xl border-2 border-amber-950 transition active:scale-95 flex items-center justify-center gap-2 shadow-md"
              >
                Next: Prepare Delivery & Custom Note 💌
              </button>
            </div>
          )}

          {/* STEP 5: SERVE & DEDICATE */}
          {step === 5 && !isCompleted && (
            <div className="space-y-4">
              <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-center space-y-1">
                <span className="text-3xl">☕ 🥐</span>
                <h4 className="font-extrabold text-sm text-amber-950">
                  {selectedBean} Coffee & {selectedPastry}
                </h4>
                <p className="text-xs text-amber-800 font-medium">
                  Made with {selectedMilk} & {latteArt}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Custom Romance Note for Partner:
                </label>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 text-xs bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-600 text-amber-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => handleFinish('self')}
                  className="py-3 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-xs rounded-2xl border-2 border-amber-400 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Coffee className="w-4 h-4 text-amber-800" /> Enjoy Myself (+50 Coins)
                </button>
                <button
                  onClick={() => handleFinish('partner')}
                  className="py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl border-2 border-rose-800 transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Heart className="w-4 h-4 fill-current text-white" /> Serve to Princess (+100 Coins)
                </button>
              </div>
            </div>
          )}

          {/* COMPLETION SCREEN */}
          {isCompleted && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-amber-950">
                  Delivered with Love! ☕💖
                </h3>
                <p className="text-xs text-amber-800 font-medium max-w-xs mx-auto mt-1">
                  You earned Gold Coins & boosted happiness! Speech bubbles broadcasted live in Royland World!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-100 font-extrabold text-xs rounded-2xl border-2 border-amber-950 transition active:scale-95"
              >
                Return to Bakery Cafe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
