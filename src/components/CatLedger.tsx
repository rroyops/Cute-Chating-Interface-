import React from 'react';
import { CatData } from '../types';
import { Heart, Sparkles, Award, Volume2, X } from 'lucide-react';
import { playMeowSound, playHeartPopSound } from '../utils/sound';

interface Props {
  cats: CatData[];
  userPetCount: number;
  onClose: () => void;
}

export const CatLedger: React.FC<Props> = ({ cats, userPetCount, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-3xl w-full max-w-xl p-5 shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-amber-200 hover:bg-amber-300 rounded-full text-[#5A3825] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-[#5A3825]">
          <Sparkles className="w-6 h-6 text-amber-500 animate-bounce" />
          <h2 className="text-xl font-black font-mono">MeowLand Cat Ledger</h2>
        </div>

        <div className="mb-4 bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 flex items-center justify-between text-xs font-bold text-[#5A3825]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Your Total Pets:</span>
          </div>
          <span className="text-lg font-black text-rose-600 bg-white px-3 py-1 rounded-xl shadow-xs">
            {userPetCount} 🐾
          </span>
        </div>

        {/* List of Cats */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {cats.map((cat) => (
            <div
              key={cat.id}
              className="bg-white border-2 border-[#8B5A2B] rounded-2xl p-3 flex items-center justify-between shadow-xs hover:bg-amber-50/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-center text-2xl shadow-inner">
                  {cat.breed === 'black' ? '🐈‍⬛' : cat.breed === 'white' ? '☁️' : '🐱'}
                </div>

                <div>
                  <div className="font-extrabold text-sm text-[#3A2417] flex items-center gap-1.5">
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full capitalize">
                      {cat.breed.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-medium">
                    Location: {cat.room === 'town_square' ? '🌿 Town Square' : '☕ Coffee Shop'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playMeowSound();
                    playHeartPopSound();
                  }}
                  className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs flex items-center gap-1 border border-amber-300"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Meow
                </button>

                <div className="text-right">
                  <span className="text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-1 rounded-xl block">
                    {cat.petCount} Pets
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cat Lover Badges */}
        <div className="mt-4 pt-3 border-t-2 border-amber-200 flex items-center justify-around text-center text-xs">
          <div className={`flex flex-col items-center ${userPetCount >= 1 ? 'text-amber-800 font-bold' : 'text-gray-400 opacity-60'}`}>
            <Award className="w-5 h-5 mb-1 text-amber-500" />
            <span>First Pet</span>
          </div>
          <div className={`flex flex-col items-center ${userPetCount >= 10 ? 'text-amber-800 font-bold' : 'text-gray-400 opacity-60'}`}>
            <Award className="w-5 h-5 mb-1 text-rose-500" />
            <span>Cat Friend (10)</span>
          </div>
          <div className={`flex flex-col items-center ${userPetCount >= 25 ? 'text-amber-800 font-bold' : 'text-gray-400 opacity-60'}`}>
            <Award className="w-5 h-5 mb-1 text-emerald-500" />
            <span>Cat Master (25)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
