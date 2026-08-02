import React, { useState } from 'react';
import { UserAccount } from '../types';
import { User, Lock, Heart, UserPlus, CheckCircle, Sparkles, X, LogIn } from 'lucide-react';
import { auth, db, googleProvider, signInWithPopup, signInAnonymously, handleFirestoreError, OperationType, isFirestoreQuotaExceeded } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface Props {
  currentAccount: UserAccount | null;
  onLogin: (account: UserAccount) => void;
  onClose: () => void;
}

export const UserAuthModal: React.FC<Props> = ({ currentAccount, onLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<'player' | 'girlfriend' | 'best_friend' | 'guest'>('girlfriend');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const saveUserToFirestore = async (acc: UserAccount) => {
    if (isFirestoreQuotaExceeded) return;
    try {
      const userDocRef = doc(db, 'users', acc.id);
      await setDoc(userDocRef, {
        id: acc.id,
        username: acc.username,
        nickname: acc.nickname,
        role: acc.role,
        createdAt: acc.createdAt,
        catsPetted: 0,
      }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${acc.id}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const account: UserAccount = {
        id: user.uid,
        username: user.email?.split('@')[0] || user.displayName || 'Google_User',
        nickname: user.displayName || 'Sweet Traveler',
        role: 'player',
        createdAt: Date.now(),
      };
      await saveUserToFirestore(account);
      onLogin(account);
      setSuccessMsg(`Authenticated with Google! Welcome ${account.nickname}`);
      setTimeout(() => onClose(), 1200);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user')) {
        setSuccessMsg('Google sign-in popup closed. You can try again or register below.');
        return;
      }
      console.warn('Google Auth Failed, falling back to anonymous auth', err);
      // Fallback to anonymous sign-in if popup fails or blocked
      try {
        const res = await signInAnonymously(auth);
        const user = res.user;
        const account: UserAccount = {
          id: user.uid,
          username: `guest_${user.uid.slice(0, 6)}`,
          nickname: 'Guest Traveler 🌸',
          role: 'guest',
          createdAt: Date.now(),
        };
        await saveUserToFirestore(account);
        onLogin(account);
        setSuccessMsg(`Signed in as Guest! Welcome!`);
        setTimeout(() => onClose(), 1200);
      } catch (e) {
        setSuccessMsg('Authentication failed. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !nickname.trim()) return;

    // Ensure Firebase auth state is present
    let firebaseUid = `usr-${Math.random().toString(36).substr(2, 9)}`;
    if (auth.currentUser) {
      firebaseUid = auth.currentUser.uid;
    } else {
      try {
        const cred = await signInAnonymously(auth);
        firebaseUid = cred.user.uid;
      } catch (err) {}
    }

    const newAccount: UserAccount = {
      id: firebaseUid,
      username: username.trim(),
      nickname: nickname.trim(),
      pin: pin.trim() || '1234',
      role,
      createdAt: Date.now(),
    };

    await saveUserToFirestore(newAccount);
    onLogin(newAccount);
    setSuccessMsg(`Account Saved to Firebase! Welcome ${newAccount.nickname} (${newAccount.role})`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleQuickRegisterGF = async () => {
    let firebaseUid = `usr-gf-${Math.random().toString(36).substr(2, 6)}`;
    if (!auth.currentUser) {
      try {
        const cred = await signInAnonymously(auth);
        firebaseUid = cred.user.uid;
      } catch (err) {}
    }

    const gfAccount: UserAccount = {
      id: firebaseUid,
      username: 'Special_GF',
      nickname: 'Roy\'s Princess 💖',
      pin: '5201314',
      role: 'girlfriend',
      createdAt: Date.now(),
    };

    await saveUserToFirestore(gfAccount);
    onLogin(gfAccount);
    setSuccessMsg('✨ Registered as Special GF Companion!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleQuickRegisterRoy = async () => {
    let firebaseUid = `usr-roy-01`;
    if (!auth.currentUser) {
      try {
        const cred = await signInAnonymously(auth);
        firebaseUid = cred.user.uid;
      } catch (err) {}
    }

    const royAccount: UserAccount = {
      id: firebaseUid,
      username: 'Roy_Host',
      nickname: 'Roy 👑',
      pin: '0000',
      role: 'player',
      createdAt: Date.now(),
    };

    await saveUserToFirestore(royAccount);
    onLogin(royAccount);
    setSuccessMsg('👑 Registered as Roy (World Host)!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-amber-200 hover:bg-amber-300 rounded-full text-amber-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b-2 border-amber-200 pb-3">
          <div className="p-2.5 bg-amber-200 rounded-2xl border-2 border-amber-400">
            <UserPlus className="w-6 h-6 text-amber-900" />
          </div>
          <div>
            <h2 className="text-lg font-black font-mono text-[#5A3825]">👥 User & Friend Registration</h2>
            <p className="text-[11px] text-amber-800 font-medium">
              Register yourself, your friends, or your girlfriend to play together!
            </p>
          </div>
        </div>

        {currentAccount && (
          <div className="p-3 bg-amber-100/80 border-2 border-amber-300 rounded-2xl text-xs space-y-1 text-amber-950 font-medium">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1">
                <span>Active User:</span>
                <span className="text-amber-800 font-extrabold">{currentAccount.nickname}</span>
              </span>
              <span className="px-2 py-0.5 bg-amber-300 rounded-full text-[10px] font-black uppercase text-amber-900">
                {currentAccount.role}
              </span>
            </div>
            <p className="text-[10px] text-amber-800">
              User ID: <code className="bg-white/80 px-1 rounded">{currentAccount.id}</code>
            </p>
          </div>
        )}

        {/* Quick Presets for Roy & GF & Google Auth */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-extrabold text-[#5A3825] block">⚡ Firebase Authentication & Quick Presets:</span>
          
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            className="w-full py-2.5 px-3 bg-white hover:bg-amber-50 border-2 border-amber-300 rounded-2xl text-xs font-extrabold text-gray-800 flex items-center justify-center gap-2 shadow-xs transition"
          >
            <LogIn className="w-4 h-4 text-emerald-600" />
            <span>Sign in with Google (Firebase)</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleQuickRegisterRoy}
              type="button"
              className="p-2.5 bg-amber-200 hover:bg-amber-300 border-2 border-amber-400 rounded-2xl text-xs font-black text-amber-950 flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <span>👑 Login as Roy</span>
            </button>
            <button
              onClick={handleQuickRegisterGF}
              type="button"
              className="p-2.5 bg-rose-200 hover:bg-rose-300 border-2 border-rose-400 rounded-2xl text-xs font-black text-rose-950 flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600 animate-bounce" />
              <span>💖 Register GF Companion</span>
            </button>
          </div>
        </div>

        {/* Manual Custom Form */}
        <form onSubmit={handleRegister} className="space-y-3 pt-1 border-t border-amber-200">
          <div>
            <label className="block text-xs font-bold text-[#5A3825] mb-1">Account Username / Tag:</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-amber-700" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Roy_VIP or GF_Angel"
                className="w-full pl-9 pr-3 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs text-gray-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5A3825] mb-1">Display Character Name:</label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. Cutie Pie or Roy"
              className="w-full px-3 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs text-gray-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#5A3825] mb-1">Special Role Tag:</label>
              <select
                value={role}
                onChange={(e: any) => setRole(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs font-bold text-gray-800"
              >
                <option value="girlfriend">💖 Girlfriend / GF</option>
                <option value="best_friend">⭐ Best Friend</option>
                <option value="player">🎮 World Resident</option>
                <option value="guest">🐾 Guest Visitor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5A3825] mb-1">Secret PIN (4 digits):</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-2.5 top-2.5 text-amber-700" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full pl-8 pr-2 py-2 bg-white border-2 border-amber-300 rounded-xl text-xs text-gray-800 font-bold"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#8B5A2B] hover:bg-[#6E492B] text-amber-100 font-extrabold text-xs rounded-2xl shadow-lg border-2 border-amber-400 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Complete Friend Registration</span>
          </button>
        </form>

        {successMsg && (
          <div className="p-2.5 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2 animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
