import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PlayerData, CatData, ChatMessage, ChatRequest, RoomType, WardrobeConfig, HairStyle, TopStyle, BottomStyle, AccessoryStyle, GenderType, WeatherType } from './src/types';

const app = express();
app.use(express.json());

const PORT = 3000;
const server = http.createServer(app);

// Gemini API Client Lazy Initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({ apiKey: key });
    }
  }
  return aiClient;
}

// Procedural Outfit Fallback Helper
function generateProceduralOutfit(prompt: string, requestedGender: GenderType): WardrobeConfig {
  const p = prompt.toLowerCase();
  const isMale = requestedGender === 'male' || p.includes('male') || p.includes('boy') || p.includes('man') || p.includes('guy') || p.includes('tux');
  const gender: GenderType = isMale ? 'male' : requestedGender === 'female' ? 'female' : 'unisex';

  let hairStyle: HairStyle = isMale ? 'messy_boy' : 'wavy_long';
  if (p.includes('spiky')) hairStyle = 'spiky';
  else if (p.includes('bun')) hairStyle = 'cute_bun';
  else if (p.includes('pompadour') || p.includes('slick')) hairStyle = 'pompadour';
  else if (p.includes('side')) hairStyle = 'side_part';
  else if (p.includes('braid')) hairStyle = 'braids';
  else if (p.includes('bob')) hairStyle = 'curly_bob';
  else if (p.includes('crop') || p.includes('short')) hairStyle = 'short_crop';

  let topStyle: TopStyle = isMale ? 'leather_jacket' : 'graphic_tee';
  if (p.includes('dress') || p.includes('gown') || p.includes('wedding')) topStyle = 'wedding_dress';
  else if (p.includes('hoodie')) topStyle = 'hoodie';
  else if (p.includes('suit') || p.includes('tux') || p.includes('tie') || p.includes('formal')) topStyle = 'suit_jacket';
  else if (p.includes('sweater') || p.includes('knit')) topStyle = 'cozy_sweater';
  else if (p.includes('leather')) topStyle = 'leather_jacket';
  else if (p.includes('vest') || p.includes('denim')) topStyle = 'vest_shirt';
  else if (p.includes('overalls')) topStyle = 'overalls';

  let bottomStyle: BottomStyle = isMale ? 'cargo' : 'skirt';
  if (p.includes('jeans')) bottomStyle = 'jeans';
  else if (p.includes('slacks') || p.includes('suit')) bottomStyle = 'slacks';
  else if (p.includes('shorts')) bottomStyle = 'shorts';
  else if (p.includes('cargo')) bottomStyle = 'cargo';
  else if (p.includes('skirt')) bottomStyle = 'skirt';

  let accessory: AccessoryStyle = 'none';
  if (p.includes('beard') || p.includes('stubble')) accessory = 'stubble_beard';
  else if (p.includes('headphone')) accessory = 'headphones';
  else if (p.includes('shade') || p.includes('sunglass') || p.includes('glass')) accessory = 'cool_shades';
  else if (p.includes('flower') || p.includes('crown')) accessory = 'flower_crown';
  else if (p.includes('cat') || p.includes('ear')) accessory = 'cat_ears';
  else if (p.includes('coffee')) accessory = 'coffee_cup';
  else if (p.includes('boba') || p.includes('tea')) accessory = 'boba_tea';

  // Palette selection
  let topColor = '#1F2937';
  if (p.includes('pink') || p.includes('pastel')) topColor = '#EC4899';
  else if (p.includes('red') || p.includes('rose')) topColor = '#EF4444';
  else if (p.includes('blue') || p.includes('denim')) topColor = '#3B82F6';
  else if (p.includes('green') || p.includes('matcha')) topColor = '#10B981';
  else if (p.includes('white') || p.includes('silk')) topColor = '#F9FAFB';
  else if (p.includes('beige') || p.includes('tan')) topColor = '#D97706';

  return {
    gender,
    skinTone: '#FCE0D1',
    hairStyle,
    hairColor: p.includes('black') ? '#1A1A1A' : p.includes('blond') ? '#E6C280' : p.includes('purple') ? '#A084DC' : '#5C3A21',
    topStyle,
    topColor,
    bottomStyle,
    bottomColor: bottomStyle === 'jeans' ? '#1E3A8A' : bottomStyle === 'slacks' || bottomStyle === 'cargo' ? '#374151' : '#111827',
    accessory,
    accessoryColor: accessory === 'headphones' ? '#F472B6' : '#111111',
  };
}

// API endpoint for Gemini Nano / Flash AI Wardrobe Generator
app.post('/api/generate-outfit', async (req, res) => {
  const { prompt, gender = 'unisex', pinterestUrl } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt string is required' });
  }

  try {
    const ai = getAIClient();
    if (!ai) {
      const fallbackConfig = generateProceduralOutfit(prompt, gender as GenderType);
      return res.json({
        success: true,
        isFallback: true,
        outfitName: `Custom ${gender === 'male' ? 'Male' : 'Female'} Look`,
        description: `Procedurally generated based on: "${prompt}"`,
        wardrobe: fallbackConfig,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert anime/pixel-art character stylist for a cozy 2D multiplayer game called MeowLand.
Analyze the user's Pinterest outfit prompt / fashion description: "${prompt}" (Preferred Gender: ${gender}, Pinterest Reference: ${pinterestUrl || 'none'}).

Select the BEST matching values strictly from these allowed options:
- gender: "male" | "female" | "unisex"
- skinTone: Hex color code (e.g. "#FCE0D1", "#F5C2A5", "#C68642", "#8D5524", "#FAD2E1")
- hairStyle: "wavy_long" | "short_crop" | "cute_bun" | "curly_bob" | "braids" | "spiky" | "side_part" | "messy_boy" | "pompadour"
- hairColor: Hex color code (e.g. "#5C3A21", "#1A1A1A", "#E6C280", "#A084DC", "#D97706", "#EF4444")
- topStyle: "hoodie" | "wedding_dress" | "graphic_tee" | "cozy_sweater" | "suit_jacket" | "overalls" | "leather_jacket" | "vest_shirt"
- topColor: Hex color code (e.g. "#111827", "#F8FAF2", "#3B82F6", "#10B981", "#D97706", "#5C3A21")
- bottomStyle: "jeans" | "skirt" | "shorts" | "slacks" | "cargo"
- bottomColor: Hex color code (e.g. "#1E3A8A", "#111827", "#F9FAFB", "#374151")
- accessory: "none" | "flower_crown" | "cat_ears" | "glasses" | "bow" | "coffee_cup" | "boba_tea" | "stubble_beard" | "headphones" | "cool_shades"
- accessoryColor: Hex color code (e.g. "#000000", "#F472B6", "#EF4444", "#D97706")

Return ONLY a valid JSON object matching this schema without markdown formatting:
{
  "outfitName": "Title of Outfit",
  "description": "Short 1-sentence fashion description",
  "wardrobe": {
    "gender": "male|female|unisex",
    "skinTone": "#hex",
    "hairStyle": "style",
    "hairColor": "#hex",
    "topStyle": "style",
    "topColor": "#hex",
    "bottomStyle": "style",
    "bottomColor": "#hex",
    "accessory": "style",
    "accessoryColor": "#hex"
  }
}`,
    });

    const rawText = response.text || '';
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    return res.json({
      success: true,
      isFallback: false,
      outfitName: parsed.outfitName || 'Gemini Styled Outfit',
      description: parsed.description || 'Generated by Gemini AI',
      wardrobe: parsed.wardrobe,
    });
  } catch (err) {
    console.error('Gemini Outfit Gen Error:', err);
    const fallbackConfig = generateProceduralOutfit(prompt, gender as GenderType);
    return res.json({
      success: true,
      isFallback: true,
      outfitName: `Custom ${gender === 'male' ? 'Male' : 'Female'} Look`,
      description: `Styled based on: "${prompt}"`,
      wardrobe: fallbackConfig,
    });
  }
});

// API endpoint for Gallery Image Upload -> Gemini Nano Vision Outfit Generator
app.post('/api/generate-outfit-from-image', async (req, res) => {
  const { imageBase64, mimeType = 'image/jpeg', gender = 'unisex' } = req.body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'imageBase64 string is required' });
  }

  try {
    const ai = getAIClient();
    if (!ai) {
      const fallbackConfig = generateProceduralOutfit('stylish uploaded outfit', gender as GenderType);
      return res.json({
        success: true,
        isFallback: true,
        outfitName: 'Uploaded Gallery Outfit',
        description: 'Generated pixel style from your image upload!',
        wardrobe: fallbackConfig,
      });
    }

    // Strip data prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64,
          },
        },
        `You are an expert anime/pixel-art character stylist for a cozy 2D game called MeowLand.
Analyze this photo of a dress, suit, or outfit uploaded by the user from their gallery (Preferred Gender: ${gender}).

Extract the visual style, colors, top/bottom pattern, and accessories.
Select the BEST matching values strictly from these allowed options:
- gender: "male" | "female" | "unisex"
- skinTone: Hex color code (e.g. "#FCE0D1", "#F5C2A5", "#C68642", "#8D5524", "#FAD2E1")
- hairStyle: "wavy_long" | "short_crop" | "cute_bun" | "curly_bob" | "braids" | "spiky" | "side_part" | "messy_boy" | "pompadour"
- hairColor: Hex color code (e.g. "#5C3A21", "#1A1A1A", "#E6C280", "#A084DC", "#D97706")
- topStyle: "hoodie" | "wedding_dress" | "graphic_tee" | "cozy_sweater" | "suit_jacket" | "overalls" | "leather_jacket" | "vest_shirt"
- topColor: Hex color code matching the uploaded top
- bottomStyle: "jeans" | "skirt" | "shorts" | "slacks" | "cargo"
- bottomColor: Hex color code matching the uploaded bottom
- accessory: "none" | "flower_crown" | "cat_ears" | "glasses" | "bow" | "coffee_cup" | "boba_tea" | "stubble_beard" | "headphones" | "cool_shades"
- accessoryColor: Hex color code

Return ONLY a valid JSON object matching this schema without markdown formatting:
{
  "outfitName": "Title matching uploaded image",
  "description": "1-sentence description of the analyzed outfit",
  "wardrobe": {
    "gender": "male|female|unisex",
    "skinTone": "#hex",
    "hairStyle": "style",
    "hairColor": "#hex",
    "topStyle": "style",
    "topColor": "#hex",
    "bottomStyle": "style",
    "bottomColor": "#hex",
    "accessory": "style",
    "accessoryColor": "#hex"
  }
}`,
      ],
    });

    const rawText = response.text || '';
    const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    return res.json({
      success: true,
      isFallback: false,
      outfitName: parsed.outfitName || 'Gallery Inspired Outfit',
      description: parsed.description || 'Generated by Gemini Vision from your uploaded photo',
      wardrobe: parsed.wardrobe,
    });
  } catch (err) {
    console.error('Gemini Vision Outfit Gen Error:', err);
    const fallbackConfig = generateProceduralOutfit('stylish gallery outfit', gender as GenderType);
    return res.json({
      success: true,
      isFallback: true,
      outfitName: 'Gallery Inspired Look',
      description: 'Styled based on uploaded photo analysis',
      wardrobe: fallbackConfig,
    });
  }
});

// In-Memory Realtime Cinema State
let cinemaState = {
  youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  videoId: 'jfKfPfyJRdk',
  isPlaying: true,
  title: 'Lofi Hip Hop Radio ☕ Beats to Relax/Study to',
  updatedBy: 'Host',
  timestamp: Date.now(),
};

// Real-Time Weather State (Random Daily Selection from Backend)
const AVAILABLE_WEATHERS: WeatherType[] = ['rain', 'snow', 'leaves', 'cherry_blossom', 'clear'];
let weatherState: WeatherType = AVAILABLE_WEATHERS[Math.floor(Math.random() * AVAILABLE_WEATHERS.length)];
let isCandlelightActiveState: boolean = false;

// In-Memory Realtime Game State
const players = new Map<string, PlayerData>();
const chatMessages: ChatMessage[] = [
  {
    id: 'msg-welcome',
    fromId: 'system',
    fromName: '🌟 MeowLand Host',
    text: 'Welcome to MeowLand By Roy! Explore the town square, pet cats, visit the coffee shop, and chat with friends!',
    room: 'town_square',
    isPrivate: false,
    timestamp: Date.now(),
  },
];
const chatRequests = new Map<string, ChatRequest>();

// 4 Initial Wandering Cats
const cats: CatData[] = [
  {
    id: 'cat-mochi',
    name: 'Mochi',
    breed: 'orange_tabby',
    x: 420,
    y: 260,
    room: 'town_square',
    direction: 'down',
    state: 'idle',
    petCount: 12,
  },
  {
    id: 'cat-luna',
    name: 'Luna',
    breed: 'black',
    x: 200,
    y: 300,
    room: 'town_square',
    direction: 'left',
    state: 'sleeping',
    petCount: 8,
  },
  {
    id: 'cat-patches',
    name: 'Patches',
    breed: 'calico',
    x: 600,
    y: 200,
    room: 'town_square',
    direction: 'right',
    state: 'idle',
    petCount: 15,
  },
  {
    id: 'cat-boba',
    name: 'Boba',
    breed: 'white',
    x: 420,
    y: 380,
    room: 'coffee_shop',
    direction: 'down',
    state: 'idle',
    petCount: 20,
  },
  {
    id: 'cat-cocoa',
    name: 'Cocoa',
    breed: 'calico',
    x: 480,
    y: 300,
    room: 'shopping_mall',
    direction: 'down',
    state: 'idle',
    petCount: 18,
  },
  {
    id: 'cat-popcorn',
    name: 'Popcorn',
    breed: 'orange_tabby',
    x: 520,
    y: 340,
    room: 'movie_theater',
    direction: 'up',
    state: 'idle',
    petCount: 24,
  },
  {
    id: 'cat-whisker',
    name: 'Whiskers',
    breed: 'black',
    x: 400,
    y: 280,
    room: 'cozy_house',
    direction: 'right',
    state: 'sleeping',
    petCount: 30,
  },
];

// WebSocket Connections
const clients = new Map<WebSocket, { playerId?: string }>();

const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

function broadcast(data: object, excludeWs?: WebSocket) {
  const payload = JSON.stringify(data);
  for (const [ws] of clients) {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

wss.on('connection', (ws) => {
  clients.set(ws, {});

  // Send initial state snapshot to new client
  ws.send(
    JSON.stringify({
      type: 'init',
      players: Array.from(players.values()),
      cats,
      chatMessages: chatMessages.slice(-50),
      chatRequests: Array.from(chatRequests.values()),
      cinemaState,
      weather: weatherState,
      isCandlelightActive: isCandlelightActiveState,
    })
  );

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (!msg || !msg.type) return;

      switch (msg.type) {
        case 'join': {
          const p: PlayerData = msg.player;
          players.set(p.id, {
            ...p,
            lastActive: Date.now(),
          });
          const clientData = clients.get(ws);
          if (clientData) clientData.playerId = p.id;

          broadcast({ type: 'player_joined', player: p });
          break;
        }

        case 'move': {
          const { id, x, y, direction, isMoving, room } = msg;
          const player = players.get(id);
          if (player) {
            player.x = x;
            player.y = y;
            player.direction = direction;
            player.isMoving = isMoving;
            if (room) player.room = room;
            player.lastActive = Date.now();

            broadcast({ type: 'player_moved', id, x, y, direction, isMoving, room }, ws);
          }
          break;
        }

        case 'wardrobe_update': {
          const { id, wardrobe } = msg;
          const player = players.get(id);
          if (player) {
            player.wardrobe = wardrobe;
            player.lastActive = Date.now();
            broadcast({ type: 'player_wardrobe_updated', id, wardrobe });
          }
          break;
        }

        case 'chat_message': {
          const chatMsg: ChatMessage = msg.message;
          chatMessages.push(chatMsg);
          if (chatMessages.length > 200) chatMessages.shift();

          // Also attach speech bubble to sender player
          const sender = players.get(chatMsg.fromId);
          if (sender) {
            sender.currentBubble = {
              text: chatMsg.text,
              expiresAt: Date.now() + 5000,
            };
          }

          broadcast({ type: 'chat_message', message: chatMsg });
          break;
        }

        case 'chat_request': {
          const req: ChatRequest = msg.request;
          chatRequests.set(req.id, req);
          broadcast({ type: 'chat_request', request: req });
          break;
        }

        case 'chat_request_response': {
          const { requestId, status } = msg;
          const req = chatRequests.get(requestId);
          if (req) {
            req.status = status;
            broadcast({ type: 'chat_request_updated', request: req });
          }
          break;
        }

        case 'pet_cat': {
          const { catId, playerId } = msg;
          const cat = cats.find((c) => c.id === catId);
          if (cat) {
            cat.petCount += 1;
            cat.state = 'petted';
            const player = players.get(playerId);
            if (player) {
              player.catsPetted = (player.catsPetted || 0) + 1;
            }
            broadcast({ type: 'cat_petted', catId, petCount: cat.petCount, playerId });

            setTimeout(() => {
              if (cat.state === 'petted') {
                cat.state = 'idle';
                broadcast({ type: 'cat_state_reset', catId });
              }
            }, 3000);
          }
          break;
        }

        case 'room_change': {
          const { id, room, x, y } = msg;
          const player = players.get(id);
          if (player) {
            player.room = room;
            player.x = x;
            player.y = y;
            broadcast({ type: 'player_room_changed', id, room, x, y });
          }
          break;
        }

        case 'update_cinema': {
          if (msg.cinemaState) {
            cinemaState = {
              ...msg.cinemaState,
              timestamp: Date.now(),
            };
            broadcast({ type: 'cinema_updated', cinemaState });
          }
          break;
        }

        case 'change_weather': {
          if (msg.weather && AVAILABLE_WEATHERS.includes(msg.weather)) {
            weatherState = msg.weather;
            broadcast({ type: 'weather_changed', weather: weatherState });
          }
          break;
        }

        case 'change_candlelight': {
          isCandlelightActiveState = !!msg.active;
          broadcast({ type: 'candlelight_changed', active: isCandlelightActiveState });
          break;
        }
      }
    } catch (err) {
      console.error('WS Message parsing error:', err);
    }
  });

  ws.on('close', () => {
    const clientData = clients.get(ws);
    if (clientData && clientData.playerId) {
      const pid = clientData.playerId;
      players.delete(pid);
      broadcast({ type: 'player_left', id: pid });
    }
    clients.delete(ws);
  });
});

// Periodic Cat Wandering AI Tick on Server
setInterval(() => {
  cats.forEach((cat) => {
    if (cat.state === 'petted') return;

    // 40% chance cat moves
    if (Math.random() < 0.4) {
      const directions: ('down' | 'up' | 'left' | 'right')[] = ['down', 'up', 'left', 'right'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
      cat.direction = dir;
      cat.state = Math.random() < 0.2 ? 'sleeping' : 'walking';

      const dist = 15 + Math.floor(Math.random() * 25);
      if (dir === 'left') cat.x = Math.max(120, cat.x - dist);
      if (dir === 'right') cat.x = Math.min(840, cat.x + dist);
      if (dir === 'up') cat.y = Math.max(120, cat.y - dist);
      if (dir === 'down') cat.y = Math.min(580, cat.y + dist);

      broadcast({ type: 'cat_moved', cat });
    }
  });
}, 3000);

// Cleanup inactive players (older than 3 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [id, player] of players.entries()) {
    if (now - player.lastActive > 180000) {
      players.delete(id);
      broadcast({ type: 'player_left', id });
    }
  }
}, 30000);

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', playersCount: players.size, clientsCount: clients.size });
});

app.get('/api/players', (req, res) => {
  res.json(Array.from(players.values()));
});

app.get('/api/cats', (req, res) => {
  res.json(cats);
});

app.get('/api/chat', (req, res) => {
  res.json(chatMessages.slice(-50));
});

app.get('/api/weather', (req, res) => {
  res.json({ weather: weatherState, availableWeathers: AVAILABLE_WEATHERS });
});

app.post('/api/weather', (req, res) => {
  const { weather } = req.body;
  if (weather && AVAILABLE_WEATHERS.includes(weather)) {
    weatherState = weather;
    broadcast({ type: 'weather_changed', weather: weatherState });
    return res.json({ success: true, weather: weatherState });
  }
  return res.status(400).json({ error: 'Invalid weather type' });
});

// Full Network Realtime Sync Fallback Endpoint
app.post('/api/sync', (req, res) => {
  const { player } = req.body;
  if (player && player.id) {
    const existing = players.get(player.id);
    players.set(player.id, {
      ...(existing || {}),
      ...player,
      lastActive: Date.now(),
    });
  }

  res.json({
    success: true,
    players: Array.from(players.values()),
    cats,
    chatMessages: chatMessages.slice(-50),
    chatRequests: Array.from(chatRequests.values()),
    cinemaState,
  });
});

// Realtime Network Chat Endpoint
app.post('/api/chat/send', (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    chatMessages.push(message);
    if (chatMessages.length > 200) chatMessages.shift();

    let sender = players.get(message.fromId);
    if (sender) {
      sender.currentBubble = {
        text: message.text,
        expiresAt: Date.now() + 5000,
      };
      sender.lastActive = Date.now();
    } else {
      sender = {
        id: message.fromId,
        username: message.fromName || 'Player',
        nickname: message.fromName || 'Player',
        x: 400,
        y: 400,
        direction: 'down',
        isMoving: false,
        room: message.room || 'town_square',
        wardrobe: generateProceduralOutfit('Roy', 'female'),
        currentBubble: { text: message.text, expiresAt: Date.now() + 5000 },
        action: null,
        lastActive: Date.now(),
      };
      players.set(message.fromId, sender);
    }

    broadcast({ type: 'chat_message', message });
    return res.json({ success: true, message });
  }
  res.status(400).json({ error: 'Invalid message' });
});

// Realtime Network Player Position Endpoint
app.post('/api/player/move', (req, res) => {
  const { id, x, y, direction, isMoving, room, wardrobe, nickname } = req.body;
  if (id) {
    let player = players.get(id);
    if (!player) {
      player = {
        id,
        username: nickname || 'Player',
        nickname: nickname || 'Player',
        x: x || 400,
        y: y || 400,
        direction: direction || 'down',
        isMoving: !!isMoving,
        room: room || 'town_square',
        wardrobe: wardrobe || generateProceduralOutfit('Player', 'female'),
        currentBubble: null,
        action: null,
        lastActive: Date.now(),
      };
      players.set(id, player);
    } else {
      player.x = x;
      player.y = y;
      player.direction = direction;
      player.isMoving = isMoving;
      if (room) player.room = room;
      if (wardrobe) player.wardrobe = wardrobe;
      if (nickname) player.nickname = nickname;
      player.lastActive = Date.now();
    }

    broadcast({ type: 'player_moved', id, x, y, direction, isMoving, room }, undefined);
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid player data' });
});

// Realtime Network Cat Pet Endpoint
app.post('/api/cat/pet', (req, res) => {
  const { catId, playerId } = req.body;
  const cat = cats.find((c) => c.id === catId);
  if (cat) {
    cat.petCount += 1;
    cat.state = 'petted';
    const player = players.get(playerId);
    if (player) {
      player.catsPetted = (player.catsPetted || 0) + 1;
    }
    broadcast({ type: 'cat_petted', catId, petCount: cat.petCount, playerId });

    setTimeout(() => {
      if (cat.state === 'petted') {
        cat.state = 'idle';
        broadcast({ type: 'cat_state_reset', catId });
      }
    }, 3000);

    return res.json({ success: true, cat });
  }
  res.status(404).json({ error: 'Cat not found' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🐱 MeowLand Server running on http://localhost:${PORT}`);
  });
}

startServer();
