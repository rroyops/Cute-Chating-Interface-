export type RoomType = 'town_square' | 'coffee_shop' | 'shopping_mall' | 'movie_theater' | 'cozy_house';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'leaves' | 'cherry_blossom';

export type GenderType = 'male' | 'female' | 'unisex';

export type HairStyle =
  | 'wavy_long'
  | 'short_crop'
  | 'cute_bun'
  | 'curly_bob'
  | 'braids'
  | 'spiky'
  | 'side_part'
  | 'messy_boy'
  | 'pompadour';

export type TopStyle =
  | 'hoodie'
  | 'wedding_dress'
  | 'graphic_tee'
  | 'cozy_sweater'
  | 'suit_jacket'
  | 'overalls'
  | 'leather_jacket'
  | 'vest_shirt';

export type BottomStyle = 'jeans' | 'skirt' | 'shorts' | 'slacks' | 'cargo';

export type AccessoryStyle =
  | 'none'
  | 'flower_crown'
  | 'cat_ears'
  | 'glasses'
  | 'bow'
  | 'coffee_cup'
  | 'boba_tea'
  | 'stubble_beard'
  | 'headphones'
  | 'cool_shades';

export interface WardrobeConfig {
  gender: GenderType;
  skinTone: string;
  hairStyle: HairStyle;
  hairColor: string;
  topStyle: TopStyle;
  topColor: string;
  bottomStyle: BottomStyle;
  bottomColor: string;
  accessory: AccessoryStyle;
  accessoryColor: string;
}

export interface PinterestRackItem {
  id: string;
  title: string;
  category: 'streetwear' | 'formal' | 'y2k' | 'gothic' | 'cozy' | 'aesthetic';
  gender: GenderType;
  imageUrl?: string;
  tags: string[];
  wardrobe: WardrobeConfig;
  description: string;
}

export interface PrincessEmotionState {
  love: number; // 0-100
  affection: number; // 0-100
  trust: number; // 0-100
  comfort: number; // 0-100
  energy: number; // 0-100
  mood: number; // 0-100
  sleepiness: number; // 0-100
  excitement: number; // 0-100
  shyness: number; // 0-100
  happiness: number; // 0-100
  embarrassment: number; // 0-100
  jealousy: number; // 0-100
  stress: number; // 0-100
  playfulness: number; // 0-100
}

export type PrincessEmote =
  | 'happy_dance'
  | 'jump'
  | 'spin'
  | 'clap'
  | 'blush'
  | 'heart_eyes'
  | 'wave'
  | 'hug'
  | 'sleep'
  | 'stretch'
  | 'excited_run'
  | 'cry'
  | 'laugh'
  | 'shy'
  | 'cat_pose'
  | 'victory_pose'
  | 'coffee_cheers'
  | 'food_celebration'
  | 'looking_around'
  | 'blowing_kiss'
  | 'kiss';

export type GiftType =
  | 'coffee'
  | 'cake'
  | 'bread'
  | 'flowers'
  | 'chocolate'
  | 'ice_cream'
  | 'plush_toy'
  | 'books'
  | 'music'
  | 'cat_toy';

export interface PlayerData {
  id: string;
  username: string;
  nickname: string;
  x: number;
  y: number;
  direction: 'down' | 'up' | 'left' | 'right';
  isMoving: boolean;
  room: RoomType;
  wardrobe: WardrobeConfig;
  currentBubble: { text: string; expiresAt: number } | null;
  action: string | null;
  lastActive: number;
  catsPetted?: number;
  emote?: PrincessEmote | null;
  emoteExpiresAt?: number;
  isStationaryIdle?: boolean;
  idleAnimation?: 'looking_around' | 'waving' | 'stretching' | 'dancing' | 'sleeping' | 'blushing' | null;
}

export interface CatData {
  id: string;
  name: string;
  breed: string;
  x: number;
  y: number;
  room: RoomType;
  direction: 'down' | 'up' | 'left' | 'right';
  state: 'idle' | 'walking' | 'sleeping' | 'petted';
  petCount: number;
}

export interface ChatMessage {
  id: string;
  fromId: string;
  fromName: string;
  text: string;
  room: RoomType;
  isPrivate: boolean;
  toId?: string;
  timestamp: number;
}

export interface ChatRequest {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
}

export interface HeartParticle {
  id: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  vy: number;
}

export interface CinemaState {
  youtubeUrl: string;
  videoId: string;
  isPlaying: boolean;
  title: string;
  updatedBy: string;
  timestamp: number;
}

export interface UserAccount {
  id: string;
  username: string;
  nickname: string;
  pin?: string;
  role: 'player' | 'girlfriend' | 'best_friend' | 'guest';
  createdAt: number;
}

export const DEFAULT_CATS: CatData[] = [
  { id: 'cat-mochi', name: 'Mochi', breed: 'orange_tabby', x: 420, y: 260, room: 'town_square', direction: 'down', state: 'idle', petCount: 12 },
  { id: 'cat-luna', name: 'Luna', breed: 'black', x: 200, y: 300, room: 'town_square', direction: 'left', state: 'sleeping', petCount: 8 },
  { id: 'cat-patches', name: 'Patches', breed: 'calico', x: 600, y: 200, room: 'town_square', direction: 'right', state: 'idle', petCount: 15 },
  { id: 'cat-boba', name: 'Boba', breed: 'white', x: 420, y: 380, room: 'coffee_shop', direction: 'down', state: 'idle', petCount: 20 },
  { id: 'cat-cocoa', name: 'Cocoa', breed: 'calico', x: 480, y: 300, room: 'shopping_mall', direction: 'down', state: 'idle', petCount: 18 },
  { id: 'cat-popcorn', name: 'Popcorn', breed: 'orange_tabby', x: 520, y: 340, room: 'movie_theater', direction: 'up', state: 'idle', petCount: 24 },
  { id: 'cat-whisker', name: 'Whiskers', breed: 'black', x: 400, y: 280, room: 'cozy_house', direction: 'right', state: 'sleeping', petCount: 30 },
];

export const DEFAULT_GF_WARDROBE: WardrobeConfig = {
  gender: 'female',
  skinTone: '#FCE0D1',
  hairStyle: 'cute_bun',
  hairColor: '#A084DC',
  topStyle: 'wedding_dress',
  topColor: '#EC4899',
  bottomStyle: 'skirt',
  bottomColor: '#F472B6',
  accessory: 'flower_crown',
  accessoryColor: '#F472B6',
};
