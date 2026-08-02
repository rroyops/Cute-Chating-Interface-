import { PrincessEmotionState, GiftType, PrincessEmote } from '../types';
import { playPrincessVoiceSound } from './sound';

export const DEFAULT_PRINCESS_EMOTIONS: PrincessEmotionState = {
  love: 94,
  affection: 92,
  trust: 95,
  comfort: 90,
  energy: 88,
  mood: 95,
  sleepiness: 15,
  excitement: 85,
  shyness: 35,
  happiness: 96,
  embarrassment: 15,
  jealousy: 8,
  stress: 5,
  playfulness: 90,
};

export interface GiftReactionResult {
  voiceSound: string;
  emote: PrincessEmote;
  message: string;
  emotionDeltas: Partial<PrincessEmotionState>;
}

export function getGiftReaction(gift: GiftType, princessName: string): GiftReactionResult {
  switch (gift) {
    case 'coffee':
      return {
        voiceSound: 'Hurraayyy!!',
        emote: 'coffee_cheers',
        message: `Hurraaaay!! ☕ Thank you so much Roy! This is my absolute favorite coffee! *sips & happy dances*`,
        emotionDeltas: { love: 5, happiness: 6, energy: 10, affection: 4 },
      };
    case 'cake':
      return {
        voiceSound: 'Yayyyyy!!',
        emote: 'food_celebration',
        message: `Yummm ❤️ Roy brought me delicious cake! *takes a sweet bite with joy*`,
        emotionDeltas: { love: 4, happiness: 8, excitement: 5 },
      };
    case 'bread':
      return {
        voiceSound: 'Ehehe~',
        emote: 'food_celebration',
        message: `Warm fresh bakery croissant! 🥐 You treat me like a true princess, Roy!`,
        emotionDeltas: { love: 3, happiness: 5, comfort: 6 },
      };
    case 'flowers':
      return {
        voiceSound: 'Ummmaahhh ❤️',
        emote: 'blush',
        message: `Awww... beautiful blooming flowers! 🌸 *blushes deeply & holds your hand*`,
        emotionDeltas: { love: 8, affection: 8, shyness: 6, happiness: 7 },
      };
    case 'chocolate':
      return {
        voiceSound: 'Mwahhh 💋',
        emote: 'heart_eyes',
        message: `Sweet chocolates! 🍫 Mwahhh 💋 You are the sweetest boyfriend ever, Roy!`,
        emotionDeltas: { love: 7, affection: 7, happiness: 6 },
      };
    case 'ice_cream':
      return {
        voiceSound: 'Yippeee!',
        emote: 'jump',
        message: `Yippeee! Cold sweet ice cream! 🍦 *spins around happily*`,
        emotionDeltas: { happiness: 7, excitement: 8, playfulness: 6 },
      };
    case 'plush_toy':
      return {
        voiceSound: 'Awww...',
        emote: 'hug',
        message: `Awww... a cute fluffy kitty plushie! 🧸 I will hug this every night and think of you!`,
        emotionDeltas: { love: 6, comfort: 9, affection: 6 },
      };
    case 'books':
      return {
        voiceSound: 'Hmmm...',
        emote: 'victory_pose',
        message: `Ooh a cozy storybook! 📖 Let me sit beside you and read it together, Roy!`,
        emotionDeltas: { trust: 5, comfort: 8, happiness: 4 },
      };
    case 'music':
      return {
        voiceSound: 'Hehehe~',
        emote: 'spin',
        message: `Hehehe~ lovely music tune! 🎶 *holds your hand and sways to the beat*`,
        emotionDeltas: { love: 5, excitement: 6, playfulness: 8 },
      };
    case 'cat_toy':
      return {
        voiceSound: 'Miu Miu~',
        emote: 'cat_pose',
        message: `Miu Miu~ 🐾 Let's play with Mochi & Boba cat together right now! *purr~*`,
        emotionDeltas: { playfulness: 10, happiness: 7, affection: 5 },
      };
  }
}

// Request Browser Web Notification API
export function requestDesktopNotificationPermission() {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().catch(() => {});
    }
  }
}

// Trigger Desktop Browser Notification for Princess Messages/Events
export function notifyRoy(title: string, body: string) {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Ignore fallback
      }
    }
  }
}

// Parse Chat Context for AI Reactions
export interface ChatContextReaction {
  reply: string;
  voiceSound: string;
  emote: PrincessEmote;
  targetRoom?: 'town_square' | 'coffee_shop' | 'shopping_mall' | 'movie_theater' | 'cozy_house';
  actionCmd?: 'follow' | 'come_here' | 'bring_coffee' | 'sit';
}

export function getKissReaction(princessName: string): GiftReactionResult {
  const responses = [
    `Mwahhh 💋 *blushes deeply & holds Roy close* I love you so much Roy! You make my heart flutter! ❤️`,
    `*steals a sweet romantic kiss* 💋 Roy, you are my favorite person in the whole wide world! ✨`,
    `Mwahhh 💋 *cheeks turn bright pink & smiles softly* Another kiss for my sweet boyfriend Roy!`,
  ];
  const msg = responses[Math.floor(Math.random() * responses.length)];

  return {
    voiceSound: 'Mwahhh 💋',
    emote: 'kiss',
    message: msg,
    emotionDeltas: { love: 8, affection: 10, happiness: 10, shyness: 8, trust: 6, comfort: 5 },
  };
}

export function parsePrincessChatContext(text: string, currentRoom: string): ChatContextReaction | null {
  const lower = text.toLowerCase();

  if (lower.includes('kiss') || lower.includes('mwah') || lower.includes('muah') || lower.includes('umma')) {
    return {
      reply: 'Mwahhh 💋 *blushes deeply & hugs Roy close* I love you so much Roy! ❤️',
      voiceSound: 'Mwahhh 💋',
      emote: 'kiss',
    };
  }

  if (lower.includes('come here') || lower.includes('come to me') || lower.includes('where are you')) {
    return {
      reply: '💬 Coming~~ ❤️ *runs toward Roy*',
      voiceSound: 'Yayyyyy!!',
      emote: 'excited_run',
      actionCmd: 'come_here',
    };
  }

  if (lower.includes('tired') || lower.includes('exhausted') || lower.includes('sleepy')) {
    return {
      reply: 'Sit here ❤️ *brings warm coffee & sits right beside Roy*',
      voiceSound: 'Awww...',
      emote: 'hug',
      actionCmd: 'bring_coffee',
    };
  }

  if (lower.includes('hungry') || lower.includes('eat') || lower.includes('food') || lower.includes('bread')) {
    return {
      reply: "Let me take you to Baker's Bakery for warm croissants & cakes! 🥐🍰",
      voiceSound: 'Hehehe~',
      emote: 'food_celebration',
      targetRoom: 'coffee_shop',
    };
  }

  if (lower.includes('movie') || lower.includes('cinema') || lower.includes('watch') || lower.includes('film')) {
    return {
      reply: "Yay! Let's watch music videos at the Cinema! 🎬🍿",
      voiceSound: 'Hurraayyy!!',
      emote: 'jump',
      targetRoom: 'movie_theater',
    };
  }

  if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('tea') || lower.includes('boba')) {
    return {
      reply: "I love coffee dates with you Roy! Let's go to the Cafe! ☕🧋",
      voiceSound: 'Yayyyyy!!',
      emote: 'coffee_cheers',
      targetRoom: 'coffee_shop',
    };
  }

  if (lower.includes('love') || lower.includes('miss') || lower.includes('cute') || lower.includes('princess') || lower.includes('sweet') || lower.includes('beautiful')) {
    return {
      reply: 'I love you so much Roy! You make my world feel warm & perfect 💖',
      voiceSound: 'Ummmaahhh ❤️',
      emote: 'blush',
    };
  }

  if (lower.includes('cat') || lower.includes('pet') || lower.includes('mochi') || lower.includes('boba')) {
    return {
      reply: 'Miu Miu~ 🐱 Mochi and Boba cat are so cute! Let us pet them together!',
      voiceSound: 'Miu Miu~',
      emote: 'cat_pose',
    };
  }

  return null;
}

// Spontaneous Random Affection Lines
export const RANDOM_AFFECTION_LINES = [
  { text: 'I missed you so much Roy ❤️', voice: 'Ummmaahhh ❤️', emote: 'blush' as PrincessEmote },
  { text: 'You look extra cute today! ✨', voice: 'Hehehe~', emote: 'heart_eyes' as PrincessEmote },
  { text: 'Coffee date together? ☕', voice: 'Yayyyyy!!', emote: 'coffee_cheers' as PrincessEmote },
  { text: 'Let’s hold hands and walk under the stars 🌟', voice: 'Mwahhh 💋', emote: 'hug' as PrincessEmote },
  { text: 'Miu Miu~ 🐱 purr~', voice: 'Purr~', emote: 'cat_pose' as PrincessEmote },
  { text: 'I love being in Royland with you! 💕', voice: 'Yippeee!', emote: 'happy_dance' as PrincessEmote },
];
