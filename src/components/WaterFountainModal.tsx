import React, { useState } from 'react';
import { Droplets, Sparkles, Trophy, Coffee, Heart, X, Check, Award } from 'lucide-react';
import { PlayerData } from '../types';

interface WaterFountainModalProps {
  localPlayer: PlayerData;
  onClose: () => void;
  onRewardCoins: (amount: number) => void;
  onGoToCafe: () => void;
  onBroadcastMessage?: (msg: string) => void;
}

export const WaterFountainModal: React.FC<WaterFountainModalProps> = ({
  localPlayer,
  onClose,
  onRewardCoins,
  onGoToCafe,
  onBroadcastMessage,
}) => {
  const [waterCount, setWaterCount] = useState<number>(() => {
    const saved = localStorage.getItem(`meowland_water_count_${new Date().toISOString().slice(0, 10)}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isDrinking, setIsDrinking] = useState<boolean>(false);
  const [hasClaimed, setHasClaimed] = useState<boolean>(() => {
    const claimed = localStorage.getItem(`meowland_water_claimed_${new Date().toISOString().slice(0, 10)}`);
    return claimed === 'true';
  });

  const isPrincess =
    localPlayer.nickname.toLowerCase().includes('princess') ||
    localPlayer.username.toLowerCase().includes('princess') ||
    localPlayer.wardrobe.gender === 'female';

  const handleDrinkGlass = () => {
    if (waterCount >= 6 || isDrinking) return;

    setIsDrinking(true);

    setTimeout(() => {
      const nextCount = waterCount + 1;
      setWaterCount(nextCount);
      localStorage.setItem(`meowland_water_count_${new Date().toISOString().slice(0, 10)}`, nextCount.toString());
      setIsDrinking(false);

      if (nextCount === 6 && !hasClaimed) {
        setHasClaimed(true);
        localStorage.setItem(`meowland_water_claimed_${new Date().toISOString().slice(0, 10)}`, 'true');
        onRewardCoins(100);
        if (onBroadcastMessage) {
          onBroadcastMessage(`💧 ${localPlayer.nickname} completed her 6x daily water goal at the Fountain & earned $100 for Cafe Coffee! 👑☕`);
        }
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-sky-50 to-blue-50 border-4 border-sky-600 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-sky-950">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-700 px-5 py-4 text-white flex items-center justify-between border-b-4 border-sky-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-400 border-2 border-cyan-200 flex items-center justify-center text-cyan-950 shadow-inner">
              <Droplets className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h2 className="font-extrabold text-base font-serif tracking-wide flex items-center gap-2">
                Royal Crystal Fountain ⛲
                <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
              </h2>
              <p className="text-xs text-cyan-100 font-mono">
                Daily Princess Hydration & Coffee Allowance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-sky-800/60 hover:bg-sky-700 text-sky-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Princess Reminder Card */}
          <div className="bg-white/80 border-2 border-sky-200 rounded-2xl p-4 text-center space-y-2 shadow-sm">
            <div className="flex items-center justify-center gap-2 text-sky-700 font-extrabold text-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
              <span>Hydration Reminder for {localPlayer.nickname}</span>
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            </div>
            <p className="text-xs text-sky-900 leading-relaxed">
              Drinking fresh water 6 times daily keeps your skin radiant, energy high, and health perfect! Drink 6 glasses today to receive <strong className="text-emerald-700 font-extrabold">$100 Gold Coins</strong> to spend on coffee & pastries at the Cafe Shop! ☕✨
            </p>
          </div>

          {/* Water Meter Progress */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-extrabold text-sky-900 px-1">
              <span className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-sky-600" /> Daily Water Intake:
              </span>
              <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-950">
                {waterCount} / 6 Glasses
              </span>
            </div>

            <div className="w-full h-4 bg-sky-200 rounded-full overflow-hidden border border-sky-400 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 transition-all duration-500"
                style={{ width: `${(waterCount / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* 6 Water Glasses Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isFilled = waterCount >= num;
              return (
                <div
                  key={num}
                  className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center justify-center gap-1 ${
                    isFilled
                      ? 'bg-cyan-100 border-cyan-500 text-cyan-950 font-bold shadow-sm'
                      : 'bg-white border-sky-200 text-sky-400'
                  }`}
                >
                  <span className={`text-2xl transition ${isFilled ? 'scale-110' : 'opacity-40'}`}>
                    {isFilled ? '🥛' : '🧊'}
                  </span>
                  <span className="text-[11px] font-bold">
                    Glass #{num}
                  </span>
                  {isFilled && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Drunk
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          {waterCount < 6 ? (
            <button
              onClick={handleDrinkGlass}
              disabled={isDrinking}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 disabled:opacity-60 text-white font-extrabold text-xs rounded-2xl border-2 border-sky-900 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              <Droplets className={`w-4 h-4 ${isDrinking ? 'animate-spin' : 'animate-bounce'}`} />
              {isDrinking ? 'Drinking Fresh Water...' : `Drink Glass #${waterCount + 1} 🥛 (+1 Glass)`}
            </button>
          ) : (
            <div className="space-y-3 pt-2 text-center animate-in zoom-in-95 duration-200">
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-950 space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Award className="w-7 h-7" />
                </div>
                <h4 className="font-extrabold text-sm text-emerald-900">
                  🎉 Hydration Goal Achieved (6/6)!
                </h4>
                <p className="text-xs text-emerald-800 font-medium">
                  You received <strong className="text-emerald-950">$100 Gold Coins</strong>! Treat yourself to coffee & pastries in the Cafe Shop! ☕🥐
                </p>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onGoToCafe();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-amber-100 font-extrabold text-xs rounded-2xl border-2 border-amber-950 transition active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <Coffee className="w-4 h-4 text-amber-300" />
                Go to Cafe Shop & Order Coffee ☕ ($100 Ready)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
