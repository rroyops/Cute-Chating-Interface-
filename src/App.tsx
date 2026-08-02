/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PlayerData, CatData, ChatMessage, ChatRequest, WardrobeConfig, RoomType, UserAccount, CinemaState, WeatherType, DEFAULT_CATS, DEFAULT_GF_WARDROBE, PrincessEmotionState, GiftType, PrincessEmote } from './types';
import { GameCanvas } from './components/GameCanvas';
import { WardrobePicker } from './components/WardrobePicker';
import { ChatPanel } from './components/ChatPanel';
import { CatLedger } from './components/CatLedger';
import { UserAuthModal } from './components/UserAuthModal';
import { CinemaModal } from './components/CinemaModal';
import { MusicPlayer } from './components/MusicPlayer';
import { CafeBarModal } from './components/CafeBarModal';
import { WaterFountainModal } from './components/WaterFountainModal';
import { PrincessModal } from './components/PrincessModal';
import { Shirt, Cat, Volume2, VolumeX, HelpCircle, Sparkles, Coffee, Heart, UserPlus, Film, ShoppingBag, Home, Compass, Share2, Check, Radio, Gift } from 'lucide-react';
import { toggleMute, isMuted, playChatPopSound, playDoorChimeSound, playPrincessVoiceSound, playHeartPopSound } from './utils/sound';
import {
  DEFAULT_PRINCESS_EMOTIONS,
  getGiftReaction,
  getKissReaction,
  parsePrincessChatContext,
  RANDOM_AFFECTION_LINES,
  requestDesktopNotificationPermission,
  notifyRoy,
} from './utils/princessAI';
import { db, auth, signInAnonymously, handleFirestoreError, OperationType, isFirestoreQuotaExceeded } from './lib/firebase';
import { collection, doc, setDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// Initial default wardrobe (Rose Bride / Chibi Hoodie style)
const DEFAULT_WARDROBE: WardrobeConfig = {
  gender: 'male',
  skinTone: '#FCE0D1',
  hairStyle: 'messy_boy',
  hairColor: '#5C3A21',
  topStyle: 'suit_jacket',
  topColor: '#111827',
  bottomStyle: 'slacks',
  bottomColor: '#1E3A8A',
  accessory: 'headphones',
  accessoryColor: '#F472B6',
};

export default function App() {
  // Generate or retrieve persistent local user ID
  const [userId] = useState(() => {
    const saved = localStorage.getItem('meowland_uid');
    if (saved) return saved;
    const newId = `user-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('meowland_uid', newId);
    return newId;
  });

  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('meowland_nickname') || 'Roy 👑';
  });

  const [wardrobe, setWardrobe] = useState<WardrobeConfig>(() => {
    const saved = localStorage.getItem('meowland_wardrobe');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_WARDROBE;
  });

  // Girlfriend Companion Cartoon State (Always on same screen!)
  const [gfActive, setGfActive] = useState<boolean>(() => {
    return localStorage.getItem('meowland_gf_active') !== 'false';
  });

  const [gfName, setGfName] = useState<string>(() => {
    return localStorage.getItem('meowland_gf_name') || 'Princess 🌸';
  });

  const [gfWardrobe, setGfWardrobe] = useState<WardrobeConfig>(() => {
    const saved = localStorage.getItem('meowland_gf_wardrobe');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_GF_WARDROBE;
  });

  const [gfBubble, setGfBubble] = useState<{ text: string; expiresAt: number } | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Princess AI Emotion Engine & Adoration Mode State
  const [princessEmotions, setPrincessEmotions] = useState<PrincessEmotionState>(() => {
    const saved = localStorage.getItem('meowland_princess_emotions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PRINCESS_EMOTIONS;
  });

  const [adoreRoyMode, setAdoreRoyMode] = useState<boolean>(() => {
    return localStorage.getItem('meowland_adore_roy') !== 'false';
  });

  const [showPrincessModal, setShowPrincessModal] = useState(false);
  const [gfEmote, setGfEmote] = useState<PrincessEmote | null>(null);
  const [gfEmoteExpiresAt, setGfEmoteExpiresAt] = useState<number>(0);
  const [gfIdleAnim, setGfIdleAnim] = useState<'looking_around' | 'waving' | 'stretching' | 'dancing' | 'sleeping' | 'blushing' | null>(null);
  const [gfIsStationaryIdle, setGfIsStationaryIdle] = useState(false);

  // GF Position State (Dynamic follow & position beside Roy)
  const [gfPos, setGfPos] = useState({
    x: 518,
    y: 282,
    direction: 'down' as 'down' | 'up' | 'left' | 'right',
    isMoving: false,
  });

  // Timers for stationary idle detection
  const lastPlayerMoveTimeRef = useRef<number>(Date.now());
  const lastGfMoveTimeRef = useRef<number>(Date.now());
  const isRemotePrincessUpdateRef = useRef<boolean>(false);
  const lastPrincessWriteTimeRef = useRef<number>(0);

  // Save Princess emotion state & Adoration setting + Throttled Firestore Sync
  useEffect(() => {
    localStorage.setItem('meowland_princess_emotions', JSON.stringify(princessEmotions));

    // Skip writing back to Firestore if this state change originated from a remote snapshot
    if (isRemotePrincessUpdateRef.current) {
      isRemotePrincessUpdateRef.current = false;
      return;
    }

    // If Firestore daily write quota is reached, skip remote database write (seamless local storage fallback)
    if (isFirestoreQuotaExceeded) {
      return;
    }

    // Throttle writes to at most once every 10 seconds to protect free tier write quota
    const now = Date.now();
    if (now - lastPrincessWriteTimeRef.current < 10000) {
      return;
    }
    lastPrincessWriteTimeRef.current = now;

    try {
      const docRef = doc(db, 'princess', 'state');
      setDoc(docRef, { id: 'state', ...princessEmotions, updatedAt: now }, { merge: true }).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, 'princess/state');
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'princess/state');
    }
  }, [princessEmotions]);

  useEffect(() => {
    localStorage.setItem('meowland_adore_roy', adoreRoyMode ? 'true' : 'false');
  }, [adoreRoyMode]);

  useEffect(() => {
    requestDesktopNotificationPermission();

    // Ensure user is authenticated in Firebase
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(() => {});
    }

    // Subscribe to Firestore Chat Messages
    const qMessages = query(collection(db, 'messages'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeMessages = onSnapshot(
      qMessages,
      (snapshot) => {
        const fetched: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          fetched.push({
            id: docSnap.id,
            fromId: d.fromId || '',
            fromName: d.fromName || 'Traveler',
            text: d.text || '',
            room: d.room || 'town_square',
            isPrivate: !!d.isPrivate,
            toId: d.toId,
            timestamp: d.timestamp || Date.now(),
          });
        });
        setMessages((prev) => {
          const map = new Map<string, ChatMessage>();
          prev.forEach((m) => map.set(m.id, m));
          fetched.forEach((m) => map.set(m.id, m));
          return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
        });
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'messages');
      }
    );

    // Subscribe to Firestore Cats Count
    const unsubscribeCats = onSnapshot(
      collection(db, 'cats'),
      (snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            setCats((prevCats) =>
              prevCats.map((cat) => (cat.id === docSnap.id ? { ...cat, petCount: data.petCount ?? cat.petCount } : cat))
            );
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'cats');
      }
    );

    // Subscribe to Firestore Princess State
    const unsubscribePrincess = onSnapshot(
      doc(db, 'princess', 'state'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPrincessEmotions((prev) => {
            // Check if values actually changed to prevent unneeded re-renders & loops
            if (
              prev.love === data.love &&
              prev.happiness === data.happiness &&
              prev.affection === data.affection &&
              prev.shyness === data.shyness &&
              prev.jealousy === data.jealousy &&
              prev.energy === data.energy &&
              prev.fullness === data.fullness
            ) {
              return prev;
            }
            isRemotePrincessUpdateRef.current = true;
            return {
              ...prev,
              ...data,
            };
          });
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, 'princess/state');
      }
    );

    return () => {
      unsubscribeMessages();
      unsubscribeCats();
      unsubscribePrincess();
    };
  }, []);

  // Local player state
  const [localPlayer, setLocalPlayer] = useState<PlayerData>({
    id: userId,
    username: nickname,
    nickname: nickname,
    x: 480,
    y: 280,
    direction: 'down',
    isMoving: false,
    room: 'town_square',
    wardrobe: wardrobe,
    currentBubble: null,
    action: null,
    lastActive: Date.now(),
    catsPetted: 0,
    isStationaryIdle: false,
    idleAnimation: null,
  });

  // GF Companion Character Object with dynamic position, emotes & idle animation
  const gfPlayer: PlayerData = useMemo(() => {
    const activeEmote = gfEmote && gfEmoteExpiresAt > Date.now() ? gfEmote : null;
    return {
      id: 'usr-gf-companion',
      username: 'GF_Companion',
      nickname: gfName,
      x: gfPos.x,
      y: gfPos.y,
      direction: gfPos.direction,
      isMoving: gfPos.isMoving,
      room: localPlayer.room,
      wardrobe: gfWardrobe,
      currentBubble: gfBubble,
      action: null,
      lastActive: Date.now(),
      catsPetted: 10,
      emote: activeEmote,
      emoteExpiresAt: gfEmoteExpiresAt,
      isStationaryIdle: gfIsStationaryIdle,
      idleAnimation: gfIdleAnim,
    };
  }, [gfName, gfPos, localPlayer.room, gfWardrobe, gfBubble, gfEmote, gfEmoteExpiresAt, gfIsStationaryIdle, gfIdleAnim]);

  // Game World State - Initialized with default 7 cats so they are never missing!
  const [remotePlayers, setRemotePlayers] = useState<PlayerData[]>([]);
  const [cats, setCats] = useState<CatData[]>(DEFAULT_CATS);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [cinemaState, setCinemaState] = useState<CinemaState>({
    youtubeUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    videoId: 'jfKfPfyJRdk',
    isPlaying: true,
    title: 'Lofi Hip Hop Radio 🎧 Beats to Relax / Study to',
    updatedBy: 'Host',
    timestamp: Date.now(),
  });

  // Display remote players combining GF Companion + live WebSocket remote players
  const displayRemotePlayers = useMemo(() => {
    if (gfActive) {
      const filtered = remotePlayers.filter((p) => p.id !== 'usr-gf-companion');
      return [gfPlayer, ...filtered];
    }
    return remotePlayers;
  }, [gfActive, gfPlayer, remotePlayers]);

  // User Account State
  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('meowland_user_account');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // UI Modals
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showCatLedger, setShowCatLedger] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCinemaModal, setShowCinemaModal] = useState(false);
  const [showCafeModal, setShowCafeModal] = useState(false);
  const [showFountainModal, setShowFountainModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [muted, setMuted] = useState(isMuted());

  // Real-time Weather & Cafe Candlelight state
  const [weather, setWeather] = useState<WeatherType>('rain');
  const [isCandlelightActive, setIsCandlelightActive] = useState(false);

  // WebSocket Ref
  const wsRef = useRef<WebSocket | null>(null);

  const handleChangeWeather = useCallback((newWeather: WeatherType) => {
    setWeather(newWeather);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'change_weather',
          weather: newWeather,
        })
      );
    }
  }, []);

  const handleToggleCandlelight = useCallback((active: boolean) => {
    setIsCandlelightActive(active);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'change_candlelight',
          active,
        })
      );
    }
  }, []);

  // Sync nickname & wardrobe updates
  useEffect(() => {
    localStorage.setItem('meowland_nickname', nickname);
    localStorage.setItem('meowland_wardrobe', JSON.stringify(wardrobe));

    setLocalPlayer((prev) => {
      const updated = { ...prev, nickname, wardrobe };
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'wardrobe_update',
            id: userId,
            wardrobe,
          })
        );
      }
      return updated;
    });
  }, [nickname, wardrobe, userId]);

  // Connect to WebSocket server
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    let socket: WebSocket;
    let reconnectTimer: any;

    const connectWS = () => {
      socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        console.log('Connected to MeowLand WebSocket Server!');
        // Send join packet
        socket.send(
          JSON.stringify({
            type: 'join',
            player: {
              id: userId,
              username: nickname,
              nickname,
              x: localPlayer.x,
              y: localPlayer.y,
              direction: localPlayer.direction,
              isMoving: false,
              room: localPlayer.room,
              wardrobe,
              currentBubble: null,
              action: null,
              lastActive: Date.now(),
            },
          })
        );
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data || !data.type) return;

          switch (data.type) {
            case 'init': {
              if (data.players) {
                setRemotePlayers(data.players.filter((p: PlayerData) => p.id !== userId));
              }
              if (data.cats) setCats(data.cats);
              if (data.chatMessages) setMessages(data.chatMessages);
              if (data.chatRequests) setChatRequests(data.chatRequests);
              if (data.cinemaState) setCinemaState(data.cinemaState);
              if (data.weather) setWeather(data.weather);
              if (data.isCandlelightActive !== undefined) setIsCandlelightActive(data.isCandlelightActive);
              break;
            }

            case 'weather_changed': {
              if (data.weather) setWeather(data.weather);
              break;
            }

            case 'candlelight_changed': {
              if (data.active !== undefined) setIsCandlelightActive(data.active);
              break;
            }

            case 'player_joined': {
              if (data.player && data.player.id !== userId) {
                setRemotePlayers((prev) => {
                  const filtered = prev.filter((p) => p.id !== data.player.id);
                  return [...filtered, data.player];
                });
              }
              break;
            }

            case 'player_moved': {
              if (data.id !== userId) {
                setRemotePlayers((prev) =>
                  prev.map((p) =>
                    p.id === data.id
                      ? {
                          ...p,
                          x: data.x,
                          y: data.y,
                          direction: data.direction,
                          isMoving: data.isMoving,
                          room: data.room || p.room,
                        }
                      : p
                  )
                );
              }
              break;
            }

            case 'player_left': {
              setRemotePlayers((prev) => prev.filter((p) => p.id !== data.id));
              break;
            }

            case 'player_wardrobe_updated': {
              if (data.id !== userId) {
                setRemotePlayers((prev) =>
                  prev.map((p) => (p.id === data.id ? { ...p, wardrobe: data.wardrobe } : p))
                );
              }
              break;
            }

            case 'chat_message': {
              playChatPopSound();
              setMessages((prev) => [...prev, data.message]);

              // If from remote player, update speech bubble
              if (data.message.fromId !== userId) {
                setRemotePlayers((prev) =>
                  prev.map((p) =>
                    p.id === data.message.fromId
                      ? {
                          ...p,
                          currentBubble: {
                            text: data.message.text,
                            expiresAt: Date.now() + 5000,
                          },
                        }
                      : p
                  )
                );
              }
              break;
            }

            case 'chat_request': {
              setChatRequests((prev) => {
                const filtered = prev.filter((r) => r.id !== data.request.id);
                return [...filtered, data.request];
              });
              break;
            }

            case 'chat_request_updated': {
              setChatRequests((prev) =>
                prev.map((r) => (r.id === data.request.id ? data.request : r))
              );
              break;
            }

            case 'cat_petted': {
              setCats((prev) =>
                prev.map((c) =>
                  c.id === data.catId ? { ...c, petCount: data.petCount, state: 'petted' } : c
                )
              );
              break;
            }

            case 'cat_state_reset': {
              setCats((prev) =>
                prev.map((c) => (c.id === data.catId ? { ...c, state: 'idle' } : c))
              );
              break;
            }

            case 'cat_moved': {
              setCats((prev) =>
                prev.map((c) => (c.id === data.cat.id ? { ...c, ...data.cat } : c))
              );
              break;
            }

            case 'player_room_changed': {
              if (data.id !== userId) {
                setRemotePlayers((prev) =>
                  prev.map((p) =>
                    p.id === data.id ? { ...p, room: data.room, x: data.x, y: data.y } : p
                  )
                );
              }
              break;
            }

            case 'cinema_updated': {
              if (data.cinemaState) {
                setCinemaState(data.cinemaState);
              }
              break;
            }
          }
        } catch (err) {
          console.error('WS Parse Error:', err);
        }
      };

      socket.onclose = () => {
        reconnectTimer = setTimeout(connectWS, 3000);
      };
    };

    connectWS();

    return () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userId]);

  // Network Sync Polling Fallback for Vercel and non-WebSocket networks
  useEffect(() => {
    let isMounted = true;

    const doSync = async () => {
      try {
        const res = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player: localPlayer }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted || !data.success) return;

        if (data.players) {
          const others = data.players.filter((p: PlayerData) => p.id !== userId);
          setRemotePlayers(others);
        }

        if (data.cats && data.cats.length > 0) {
          setCats(data.cats);
        } else {
          setCats((prev) => (prev.length > 0 ? prev : DEFAULT_CATS));
        }

        if (data.chatMessages) {
          setMessages((prev) => {
            const map = new Map<string, ChatMessage>();
            prev.forEach((m) => map.set(m.id, m));
            data.chatMessages.forEach((m: ChatMessage) => map.set(m.id, m));
            return Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
          });
        }

        if (data.chatRequests) {
          setChatRequests(data.chatRequests);
        }

        if (data.cinemaState) {
          setCinemaState(data.cinemaState);
        }
      } catch (err) {
        // Silently catch network errors
      }
    };

    doSync();
    const interval = setInterval(doSync, 1200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userId, localPlayer]);

  // Last REST movement timestamp
  const lastRestMoveRef = useRef<number>(0);

  // Handle local player movement broadcast
  const handleLocalMove = useCallback(
    (x: number, y: number, direction: 'down' | 'up' | 'left' | 'right', isMoving: boolean) => {
      if (isMoving) {
        lastPlayerMoveTimeRef.current = Date.now();
      }
      setLocalPlayer((prev) => ({ ...prev, x, y, direction, isMoving }));

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'move',
            id: userId,
            x,
            y,
            direction,
            isMoving,
            room: localPlayer.room,
          })
        );
      }

      // Throttled REST player movement so users on Vercel stay synced live
      const now = Date.now();
      if (now - lastRestMoveRef.current > 300) {
        lastRestMoveRef.current = now;
        fetch('/api/player/move', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            x,
            y,
            direction,
            isMoving,
            room: localPlayer.room,
            wardrobe,
            nickname,
          }),
        }).catch(() => {});
      }
    },
    [userId, localPlayer.room, wardrobe, nickname]
  );

  // GF Companion Dynamic Position & Stationary Idle Animation Loop (>10s)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const playerIdleTime = now - lastPlayerMoveTimeRef.current;

      // 1. Local Player Stationary Idle (>10s)
      if (playerIdleTime > 10000) {
        setLocalPlayer((prev) => {
          if (!prev.isStationaryIdle) {
            const idleAnims: ('looking_around' | 'waving' | 'stretching' | 'dancing')[] = [
              'looking_around',
              'waving',
              'stretching',
              'dancing',
            ];
            const nextAnim = idleAnims[Math.floor(Math.random() * idleAnims.length)];
            return { ...prev, isStationaryIdle: true, idleAnimation: nextAnim };
          }
          return prev;
        });
      } else {
        setLocalPlayer((prev) => (prev.isStationaryIdle ? { ...prev, isStationaryIdle: false, idleAnimation: null } : prev));
      }

      // 2. GF Companion Follow & Stationary Idle
      if (gfActive) {
        const targetX = localPlayer.x + 36;
        const targetY = localPlayer.y + 2;

        setGfPos((prev) => {
          const dx = targetX - prev.x;
          const dy = targetY - prev.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 8) {
            lastGfMoveTimeRef.current = now;
            setGfIsStationaryIdle(false);
            setGfIdleAnim(null);

            const speed = Math.min(dist * 0.2, 5);
            const moveX = prev.x + (dx / dist) * speed;
            const moveY = prev.y + (dy / dist) * speed;

            let dir: 'down' | 'up' | 'left' | 'right' = prev.direction;
            if (Math.abs(dx) > Math.abs(dy)) {
              dir = dx > 0 ? 'right' : 'left';
            } else {
              dir = dy > 0 ? 'down' : 'up';
            }

            return {
              x: Math.round(moveX),
              y: Math.round(moveY),
              direction: dir,
              isMoving: true,
            };
          } else {
            // Stationary
            const gfIdleTime = now - lastGfMoveTimeRef.current;
            if (gfIdleTime > 10000) {
              setGfIsStationaryIdle(true);
              const idleAnims: ('looking_around' | 'waving' | 'stretching' | 'dancing' | 'blushing' | 'sleeping')[] = [
                'looking_around',
                'waving',
                'stretching',
                'dancing',
                'blushing',
                'sleeping',
              ];
              if (Math.random() < 0.3) {
                const nextAnim = idleAnims[Math.floor(Math.random() * idleAnims.length)];
                setGfIdleAnim(nextAnim);
              }
            }
            return { ...prev, isMoving: false };
          }
        });
      }
    }, 200);

    return () => clearInterval(timer);
  }, [gfActive, localPlayer.x, localPlayer.y]);

  // Spontaneous Random Affection in Adoration Mode
  useEffect(() => {
    if (!adoreRoyMode || !gfActive) return;

    const interval = setInterval(() => {
      // 35% chance every 22 seconds to trigger an affection moment
      if (Math.random() < 0.35) {
        const pick = RANDOM_AFFECTION_LINES[Math.floor(Math.random() * RANDOM_AFFECTION_LINES.length)];
        playPrincessVoiceSound(pick.voice);
        setGfEmote(pick.emote);
        setGfEmoteExpiresAt(Date.now() + 5000);
        setGfBubble({ text: pick.text, expiresAt: Date.now() + 5500 });
        notifyRoy(`👑 ${gfName}`, pick.text);

        // Boost love & affection
        setPrincessEmotions((prev) => ({
          ...prev,
          love: Math.min(100, prev.love + 2),
          affection: Math.min(100, prev.affection + 2),
          happiness: Math.min(100, prev.happiness + 2),
        }));
      }
    }, 22000);

    return () => clearInterval(interval);
  }, [adoreRoyMode, gfActive, gfName]);

  // Handle local room transition
  const handleRoomChange = (newRoom: RoomType, newX: number, newY: number) => {
    playDoorChimeSound();
    setLocalPlayer((prev) => ({ ...prev, room: newRoom, x: newX, y: newY }));

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'room_change',
          id: userId,
          room: newRoom,
          x: newX,
          y: newY,
        })
      );
    }

    fetch('/api/player/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: userId,
        x: newX,
        y: newY,
        room: newRoom,
        direction: 'down',
        isMoving: false,
        wardrobe,
        nickname,
      }),
    }).catch(() => {});
  };

  // Copy Game Link for Girlfriend
  const handleShareGameLink = () => {
    const currentUrl = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setShareToast('🔗 Live Game Link Copied! Send this link to your Girlfriend so she can join your screen!');
        setTimeout(() => setShareToast(null), 6000);
      }).catch(() => {
        setShareToast(`🔗 Share URL: ${currentUrl}`);
        setTimeout(() => setShareToast(null), 6000);
      });
    } else {
      setShareToast(`🔗 Share URL: ${currentUrl}`);
      setTimeout(() => setShareToast(null), 6000);
    }
  };

  // Handle Gifting Princess
  const handleSendGiftToPrincess = (giftType: GiftType) => {
    const reaction = getGiftReaction(giftType, gfName);
    playPrincessVoiceSound(reaction.voiceSound);
    setGfEmote(reaction.emote);
    setGfEmoteExpiresAt(Date.now() + 5000);
    setGfBubble({ text: reaction.message, expiresAt: Date.now() + 5500 });
    notifyRoy(`🎁 ${gfName} received ${giftType}!`, reaction.message);

    // Apply emotion deltas
    setPrincessEmotions((prev) => {
      const next = { ...prev };
      Object.entries(reaction.emotionDeltas).forEach(([key, val]) => {
        const k = key as keyof PrincessEmotionState;
        next[k] = Math.min(100, Math.max(0, (next[k] || 0) + (val || 0)));
      });
      return next;
    });

    handleSendMessage(`🎁 Gives ${giftType} to ${gfName}`, false);
  };

  // Handle Kissing Princess
  const handleKissPrincess = () => {
    const reaction = getKissReaction(gfName);
    playPrincessVoiceSound(reaction.voiceSound);
    playHeartPopSound();

    // 1. Transition Roy into front-facing kissing pose
    setLocalPlayer((prev) => ({
      ...prev,
      direction: 'down',
      isMoving: false,
      emote: 'kiss',
      emoteExpiresAt: Date.now() + 6000,
      action: 'kiss',
    }));

    // 2. Transition Princess NPC directly beside Roy in front-facing kissing pose
    setGfPos((prev) => ({
      ...prev,
      x: localPlayer.x + 16,
      y: localPlayer.y,
      direction: 'down',
      isMoving: false,
    }));

    setGfEmote('kiss');
    setGfEmoteExpiresAt(Date.now() + 6000);
    setGfBubble({ text: reaction.message, expiresAt: Date.now() + 6000 });
    notifyRoy(`💋 Kissed ${gfName}!`, reaction.message);

    setPrincessEmotions((prev) => ({
      ...prev,
      love: Math.min(100, prev.love + 5),
      affection: Math.min(100, prev.affection + 6),
      happiness: Math.min(100, prev.happiness + 6),
      shyness: Math.min(100, prev.shyness + 5),
    }));

    handleSendMessage(`💋 Kisses ${gfName} sweet & tenderly ❤️`, false);
  };

  // Handle Action Command (Follow, Hold Hands, Dance, Sit, Selfie, Coffee Date, etc.)
  const handleTriggerActionCmd = (cmd: 'follow' | 'hold_hands' | 'dance' | 'sit' | 'selfie' | 'cats' | 'coffee') => {
    if (cmd === 'follow') {
      setGfEmote('excited_run');
      setGfEmoteExpiresAt(Date.now() + 4000);
      setGfBubble({ text: '💬 Walking right beside you, Roy! ❤️', expiresAt: Date.now() + 5000 });
      playPrincessVoiceSound('Yayyyyy!!');
    } else if (cmd === 'hold_hands') {
      setGfEmote('hug');
      setGfEmoteExpiresAt(Date.now() + 4000);
      setGfBubble({ text: '🤝 Holding hands together under the warm sun... 💖', expiresAt: Date.now() + 5000 });
      playPrincessVoiceSound('Ummmaahhh ❤️');
    } else if (cmd === 'dance') {
      setGfEmote('happy_dance');
      setGfEmoteExpiresAt(Date.now() + 5000);
      setGfBubble({ text: '💃 Happy dance! Swaying to the music with Roy!', expiresAt: Date.now() + 5000 });
      playPrincessVoiceSound('Hurraayyy!!');
    } else if (cmd === 'sit') {
      setGfEmote('sleep');
      setGfEmoteExpiresAt(Date.now() + 5000);
      setGfBubble({ text: '🛋️ Sitting quietly beside you... cozy & safe ❤️', expiresAt: Date.now() + 5000 });
      playPrincessVoiceSound('Awww...');
    } else if (cmd === 'selfie') {
      setGfEmote('heart_eyes');
      setGfEmoteExpiresAt(Date.now() + 4000);
      setGfBubble({ text: '📸 Say cheese! Perfect couple selfie! ✨', expiresAt: Date.now() + 5000 });
      playPrincessVoiceSound('Hehehe~');
    } else if (cmd === 'coffee') {
      handleRoomChange('coffee_shop', 480, 480);
      setShowCafeModal(true);
      setGfEmote('coffee_cheers');
      setGfEmoteExpiresAt(Date.now() + 5000);
      setGfBubble({ text: '☕ Coffee date at Baker’s Cafe! Hurraaaay!!', expiresAt: Date.now() + 5000 });
      playPrincessVoiceSound('Hurraayyy!!');
    }
  };

  // Trigger Princess Emote
  const handleTriggerEmote = (emote: PrincessEmote) => {
    setGfEmote(emote);
    setGfEmoteExpiresAt(Date.now() + 5000);
    playPrincessVoiceSound('Ehehe~');
  };

  // Quick talk prompt with Girlfriend Companion
  const handleQuickGfTalk = (customText?: string) => {
    const defaultQuotes = [
      "I love you so much Princess! 🌸💖",
      "Let's go drink Boba Milk Tea together! 🧋",
      "Want to pet Mochi cat with me? 🐱 meow!",
      "You look so cute in that dress today! ✨",
      "Let me hold your hand while we walk around town! 💕",
    ];
    const textToSend = customText || defaultQuotes[Math.floor(Math.random() * defaultQuotes.length)];
    handleSendMessage(textToSend, false);
  };

  // Send Chat Message across Network (WS + REST)
  const handleSendMessage = (text: string, isPrivate: boolean, toId?: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      fromId: userId,
      fromName: nickname,
      text,
      room: localPlayer.room,
      isPrivate,
      toId,
      timestamp: Date.now(),
    };

    // Update local player speech bubble
    setLocalPlayer((prev) => ({
      ...prev,
      currentBubble: { text, expiresAt: Date.now() + 5000 },
    }));

    // If GF Companion is active and no real GF network user is in room, trigger AI response
    if (gfActive && !remotePlayers.some((p) => p.id !== 'usr-gf-companion' && p.room === localPlayer.room)) {
      setTimeout(() => {
        const parsed = parsePrincessChatContext(text, localPlayer.room);
        let reply = "I love exploring Royland with you Roy! 💖";
        let voiceSound = 'Yayyyyy!!';
        let emote: PrincessEmote = 'blush';

        if (parsed) {
          reply = parsed.reply;
          voiceSound = parsed.voiceSound;
          emote = parsed.emote;

          if (parsed.actionCmd === 'come_here') {
            setGfPos({
              x: localPlayer.x + 10,
              y: localPlayer.y + 2,
              direction: 'left',
              isMoving: true,
            });
          } else if (parsed.actionCmd === 'bring_coffee') {
            setGfEmote('coffee_cheers');
          }

          if (parsed.targetRoom) {
            setTimeout(() => {
              handleRoomChange(parsed.targetRoom!, 480, 480);
            }, 1200);
          }
        } else {
          const lower = text.toLowerCase();
          if (lower.includes('love') || lower.includes('miss') || lower.includes('cute') || lower.includes('princess') || lower.includes('sweet')) {
            reply = "I love you so much Roy! You are my favorite person 💖";
            voiceSound = 'Ummmaahhh ❤️';
            emote = 'blush';
          } else if (lower.includes('coffee') || lower.includes('cafe') || lower.includes('tea') || lower.includes('boba')) {
            reply = "Yay! Let's get a boba tea together at Meow Cafe! 🧋";
            voiceSound = 'Hurraayyy!!';
            emote = 'coffee_cheers';
          } else if (lower.includes('movie') || lower.includes('cinema') || lower.includes('watch') || lower.includes('youtube')) {
            reply = "Ooh let's watch music videos at the Cinema! 🎬🍿";
            voiceSound = 'Yayyyyy!!';
            emote = 'jump';
          } else if (lower.includes('cat') || lower.includes('pet') || lower.includes('mochi') || lower.includes('boba')) {
            reply = "Mochi and Boba cat are so cute! Let me pet them! 🐱 meow!";
            voiceSound = 'Miu Miu~';
            emote = 'cat_pose';
          } else if (lower.includes('shop') || lower.includes('dress') || lower.includes('outfit')) {
            reply = "Let's try on cute dresses at the Shopping Mall! 🛍️✨";
            voiceSound = 'Hehehe~';
            emote = 'spin';
          } else if (lower.includes('home') || lower.includes('cozy') || lower.includes('house')) {
            reply = "Cozy home is so warm with you Roy! 🏡💕";
            voiceSound = 'Awww...';
            emote = 'hug';
          }
        }

        playPrincessVoiceSound(voiceSound);
        setGfEmote(emote);
        setGfEmoteExpiresAt(Date.now() + 5000);
        setGfBubble({ text: reply, expiresAt: Date.now() + 5500 });
        notifyRoy(`👑 ${gfName}`, reply);

        // Boost affection & happiness
        setPrincessEmotions((prev) => ({
          ...prev,
          love: Math.min(100, prev.love + 2),
          affection: Math.min(100, prev.affection + 2),
          happiness: Math.min(100, prev.happiness + 2),
        }));

        const gfMsg: ChatMessage = {
          id: `msg-gf-${Date.now()}`,
          fromId: 'usr-gf-companion',
          fromName: gfName,
          text: reply,
          room: localPlayer.room,
          isPrivate: false,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, gfMsg]);
      }, 700);
    }

    // Always append locally
    setMessages((prev) => [...prev, newMsg]);

    // Save message to Firestore for real-time cloud sync & persistence
    if (!isFirestoreQuotaExceeded) {
      try {
        const msgDocRef = doc(collection(db, 'messages'));
        setDoc(msgDocRef, { ...newMsg, id: msgDocRef.id }).catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, 'messages');
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'messages');
      }
    }

    // Send over WebSocket if open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat_message',
          message: newMsg,
        })
      );
    }

    // ALWAYS post to REST endpoint so network clients (e.g. Vercel) receive messages
    fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: newMsg }),
    }).catch(() => {});
  };

  // Pet Cat action over Network
  const handlePetCat = (catId: string) => {
    setLocalPlayer((prev) => ({
      ...prev,
      catsPetted: (prev.catsPetted || 0) + 1,
    }));

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'pet_cat',
          catId,
          playerId: userId,
        })
      );
    }

    fetch('/api/cat/pet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catId, playerId: userId }),
    }).catch(() => {});
  };

  // Send Chat Request to nearby player
  const handleRequestChatWithPlayer = (target: PlayerData) => {
    const newReq: ChatRequest = {
      id: `req-${Math.random().toString(36).substr(2, 9)}`,
      fromId: userId,
      fromName: nickname,
      toId: target.id,
      toName: target.nickname,
      status: 'pending',
      createdAt: Date.now(),
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat_request',
          request: newReq,
        })
      );
    }
  };

  // Respond to Chat Request
  const handleRespondToRequest = (requestId: string, status: 'accepted' | 'declined') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat_request_response',
          requestId,
          status,
        })
      );
    }
  };

  // Synchronized Cinema Update
  const handleUpdateCinema = (updated: Partial<CinemaState>) => {
    const newState: CinemaState = {
      ...cinemaState,
      ...updated,
      lastUpdated: Date.now(),
    };
    setCinemaState(newState);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'update_cinema',
          cinemaState: newState,
        })
      );
    }
  };

  // Login / Register Account
  const handleLoginAccount = (account: UserAccount) => {
    setUserAccount(account);
    setNickname(account.nickname);
    localStorage.setItem('meowland_user_account', JSON.stringify(account));
  };

  return (
    <div className="min-h-screen bg-[#FDF6ED] text-[#3A2417] flex flex-col font-sans selection:bg-amber-200">
      {/* Top Navbar Header */}
      <header className="bg-[#8B5A2B] text-white px-4 py-3 shadow-lg border-b-4 border-[#6E492B] flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-200 border-2 border-amber-400 rounded-2xl flex items-center justify-center text-xl shadow-xs">
            🐾
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl font-mono leading-tight tracking-wide flex items-center gap-2">
              Royland <span className="text-amber-300 text-xs font-normal">World</span>
            </h1>
            <p className="text-[11px] text-amber-200/90 font-medium hidden sm:block">
              A cozy pixel-art social world with live multiplayer & wandering cats
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleShareGameLink}
            className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl border-2 border-rose-300 shadow-xs text-xs flex items-center gap-1.5 transition transform active:scale-95 animate-bounce"
            title="Send this live game link to your girlfriend so she can join your screen!"
          >
            <Share2 className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">🔗 Share Link with Girlfriend</span>
          </button>

          <button
            onClick={() => setShowAuthModal(true)}
            className="px-2.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-[#5A3825] font-extrabold rounded-xl border-2 border-amber-400 shadow-xs text-xs flex items-center gap-1.5 transition transform active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-amber-800" />
            <span className="hidden sm:inline">
              {userAccount ? `👤 ${userAccount.username}` : '👥 Register / Friend Login'}
            </span>
          </button>

          <button
            onClick={() => setShowCinemaModal(true)}
            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl border-2 border-purple-300 shadow-xs text-xs flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Film className="w-4 h-4 text-purple-100" />
            <span className="hidden sm:inline">🎬 Cinema</span>
          </button>

          <button
            onClick={() => setShowWardrobe(true)}
            className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-[#5A3825] font-extrabold rounded-xl border-2 border-amber-300 shadow-xs text-xs flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Shirt className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Wardrobe</span>
          </button>

          <button
            onClick={() => setShowCatLedger(true)}
            className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-[#5A3825] font-extrabold rounded-xl border-2 border-amber-300 shadow-xs text-xs flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Cat className="w-4 h-4 text-amber-700" />
            <span className="hidden sm:inline">Cats</span>
          </button>

          <button
            onClick={() => setMuted(toggleMute())}
            className="p-2 bg-amber-900/50 hover:bg-amber-900/80 rounded-xl text-amber-200 transition"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowHelp(true)}
            className="p-2 bg-amber-900/50 hover:bg-amber-900/80 rounded-xl text-amber-200 transition"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {shareToast && (
        <div className="bg-rose-600 text-white font-extrabold text-xs py-2 px-4 text-center shadow-md animate-fade-in flex items-center justify-center gap-2 border-b-2 border-rose-800">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Center Column: 2D Interactive Pixel Map */}
        <div className="lg:col-span-8 flex flex-col items-center w-full space-y-3">
          {/* Quick Map Location Travel Bar & Companion Controls */}
          <div className="w-full bg-[#5A3825] p-2 rounded-2xl border-2 border-[#8B5A2B] shadow-md flex items-center justify-between gap-1 overflow-x-auto text-xs font-mono">
            <span className="text-amber-200 font-bold px-2 flex items-center gap-1 shrink-0">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>City Travel:</span>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleRoomChange('town_square', 480, 280)}
                className={`px-2.5 py-1 rounded-xl font-extrabold transition ${
                  localPlayer.room === 'town_square'
                    ? 'bg-amber-400 text-amber-950 border border-amber-200 shadow-xs'
                    : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100'
                }`}
              >
                🌿 Town Square
              </button>
              <button
                onClick={() => handleRoomChange('coffee_shop', 480, 600)}
                className={`px-2.5 py-1 rounded-xl font-extrabold transition ${
                  localPlayer.room === 'coffee_shop'
                    ? 'bg-amber-400 text-amber-950 border border-amber-200 shadow-xs'
                    : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100'
                }`}
              >
                ☕ Meow Cafe
              </button>
              <button
                onClick={() => handleRoomChange('shopping_mall', 480, 600)}
                className={`px-2.5 py-1 rounded-xl font-extrabold transition ${
                  localPlayer.room === 'shopping_mall'
                    ? 'bg-amber-400 text-amber-950 border border-amber-200 shadow-xs'
                    : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100'
                }`}
              >
                🛍️ Date Mall
              </button>
              <button
                onClick={() => handleRoomChange('movie_theater', 480, 600)}
                className={`px-2.5 py-1 rounded-xl font-extrabold transition ${
                  localPlayer.room === 'movie_theater'
                    ? 'bg-amber-400 text-amber-950 border border-amber-200 shadow-xs'
                    : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100'
                }`}
              >
                🎬 Cinema
              </button>
              <button
                onClick={() => handleRoomChange('cozy_house', 480, 600)}
                className={`px-2.5 py-1 rounded-xl font-extrabold transition ${
                  localPlayer.room === 'cozy_house'
                    ? 'bg-amber-400 text-amber-950 border border-amber-200 shadow-xs'
                    : 'bg-amber-900/70 hover:bg-amber-800 text-amber-100'
                }`}
              >
                🏡 Cozy Home
              </button>
            </div>
          </div>

          <GameCanvas
            localPlayer={localPlayer}
            remotePlayers={displayRemotePlayers}
            cats={cats}
            cinemaState={cinemaState}
            weather={weather}
            onChangeWeather={handleChangeWeather}
            onPlayerMove={handleLocalMove}
            onRoomChange={handleRoomChange}
            onPetCat={handlePetCat}
            onRequestChat={handleRequestChatWithPlayer}
            onOpenCinema={() => setShowCinemaModal(true)}
            onOpenCafeBar={() => setShowCafeModal(true)}
            onOpenFountain={() => setShowFountainModal(true)}
            isCandlelightActive={isCandlelightActive}
          />

          {/* Quick Girlfriend Cartoon Interaction Bar */}
          <div className="w-full bg-gradient-to-r from-pink-100 via-rose-100 to-amber-100 border-2 border-pink-300 rounded-2xl p-2.5 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-pink-900 flex items-center gap-1">
                <Heart className="w-4 h-4 text-pink-600 fill-pink-500 animate-pulse" />
                <span>{gfName}:</span>
              </span>

              <button
                onClick={() => setGfActive(!gfActive)}
                className={`px-2.5 py-1 rounded-xl font-extrabold text-[11px] transition ${
                  gfActive
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {gfActive ? '💖 Cartoon GF Visible' : '🙈 Cartoon GF Hidden'}
              </button>

              {gfActive && (
                <>
                  <button
                    onClick={() => setShowPrincessModal(true)}
                    className="px-2.5 py-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition flex items-center gap-1 transform active:scale-95"
                  >
                    👑 Roy's Princess ({princessEmotions.love}% Love)
                  </button>

                  <button
                    onClick={() => setAdoreRoyMode(!adoreRoyMode)}
                    className={`px-2 py-1 rounded-xl font-bold text-[11px] border transition flex items-center gap-1 ${
                      adoreRoyMode
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {adoreRoyMode ? '💖 Adore Roy: ON' : '⚪ Adore Roy: OFF'}
                  </button>
                </>
              )}
            </div>

            {gfActive && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={handleKissPrincess}
                  className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold rounded-lg shadow-sm transition flex items-center gap-1 transform active:scale-95 animate-pulse"
                >
                  💋 Kiss
                </button>
                <button
                  onClick={() => handleTriggerActionCmd('dance')}
                  className="px-2.5 py-1 bg-white hover:bg-pink-50 border border-pink-300 text-pink-900 font-bold rounded-lg transition"
                >
                  💃 Dance
                </button>
                <button
                  onClick={() => setShowPrincessModal(true)}
                  className="px-2.5 py-1 bg-white hover:bg-pink-50 border border-pink-300 text-pink-900 font-bold rounded-lg transition flex items-center gap-1"
                >
                  <Gift className="w-3.5 h-3.5 text-pink-500" /> Gifts
                </button>
                <button
                  onClick={() => handleTriggerActionCmd('coffee')}
                  className="px-2 py-1 bg-white hover:bg-pink-50 border border-pink-300 text-pink-900 font-bold rounded-lg transition"
                >
                  ☕ Coffee Date
                </button>
                <button
                  onClick={() => handleQuickGfTalk('I love you so much Princess! 🌸💖')}
                  className="px-2 py-1 bg-white hover:bg-pink-50 border border-pink-300 text-pink-900 font-bold rounded-lg transition"
                >
                  💬 "I love you!"
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Proximity Chat & Online Players */}
        <div className="lg:col-span-4 w-full">
          <ChatPanel
            localPlayer={localPlayer}
            messages={messages}
            chatRequests={chatRequests}
            remotePlayers={displayRemotePlayers}
            onSendMessage={handleSendMessage}
            onRespondToRequest={handleRespondToRequest}
            onRequestChatWithPlayer={handleRequestChatWithPlayer}
          />
        </div>
      </main>

      {/* User Registration & Login Modal */}
      {showAuthModal && (
        <UserAuthModal
          currentAccount={userAccount}
          onLogin={handleLoginAccount}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Princess AI Companion Dashboard Modal */}
      {showPrincessModal && (
        <PrincessModal
          princessName={gfName}
          emotions={princessEmotions}
          adoreRoyMode={adoreRoyMode}
          onToggleAdoreRoy={setAdoreRoyMode}
          onSendGift={handleSendGiftToPrincess}
          onKissPrincess={handleKissPrincess}
          onTriggerEmote={handleTriggerEmote}
          onTriggerActionCmd={handleTriggerActionCmd}
          onClose={() => setShowPrincessModal(false)}
        />
      )}

      {/* YouTube Cinema Synchronized Movie Modal */}
      {showCinemaModal && (
        <CinemaModal
          cinemaState={cinemaState}
          onUpdateCinema={handleUpdateCinema}
          onClose={() => setShowCinemaModal(false)}
        />
      )}

      {/* Wardrobe Modal */}
      {showWardrobe && (
        <WardrobePicker
          wardrobe={wardrobe}
          nickname={nickname}
          gfWardrobe={gfWardrobe}
          gfName={gfName}
          onWardrobeChange={setWardrobe}
          onNicknameChange={setNickname}
          onGfWardrobeChange={(newW) => {
            setGfWardrobe(newW);
            localStorage.setItem('meowland_gf_wardrobe', JSON.stringify(newW));
          }}
          onGfNameChange={(newName) => {
            setGfName(newName);
            localStorage.setItem('meowland_gf_name', newName);
          }}
          onClose={() => setShowWardrobe(false)}
        />
      )}

      {/* Cafe Bar Mini-game Modal */}
      {showCafeModal && (
        <CafeBarModal
          localPlayer={localPlayer}
          remotePlayers={displayRemotePlayers}
          onClose={() => setShowCafeModal(false)}
          isCandlelightActive={isCandlelightActive}
          onToggleCandlelight={handleToggleCandlelight}
          onSendCoffeeToPartner={(drinkName, pastryName, message) => {
            const announcement = `☕ Serves ${drinkName} & ${pastryName} to ${gfName}! "${message}"`;
            handleSendMessage(announcement, false);
            setGfWardrobe((prev) => ({
              ...prev,
              accessory: 'coffee_cup',
            }));
            setGfBubble({ text: `💖 "Aww thank you so much Roy! Holding this warm ${drinkName} & ${pastryName}! ☕✨"`, expiresAt: Date.now() + 10000 });
            setShareToast(`☕ Delivered ${drinkName} & ${pastryName} to ${gfName}! Girlfriend is now holding her warm coffee cup! (+100 Gold Coins)`);
            setTimeout(() => setShareToast(null), 4000);
          }}
          onRewardCoins={(amount) => {
            setWardrobe((prev) => ({
              ...prev,
              accessory: 'coffee_cup',
            }));
            setShareToast(`✨ Bakery Reward: Earned +${amount} Gold Coins! Now holding warm coffee! 🪙☕`);
            setTimeout(() => setShareToast(null), 3000);
          }}
        />
      )}

      {/* Royal Water Fountain Modal (6x Water Goal for $100 Coffee) */}
      {showFountainModal && (
        <WaterFountainModal
          localPlayer={localPlayer}
          onClose={() => setShowFountainModal(false)}
          onRewardCoins={(amount) => {
            setWardrobe((prev) => ({
              ...prev,
              accessory: 'coffee_cup',
            }));
            setShareToast(`💧 Hydration Goal Reward: Received +$${amount} Gold Coins! Ready for Cafe Coffee! 🪙☕`);
            setTimeout(() => setShareToast(null), 4000);
          }}
          onGoToCafe={() => {
            handleRoomChange('coffee_shop', 480, 480);
            setShowCafeModal(true);
          }}
          onBroadcastMessage={(msgText) => {
            handleSendMessage(msgText, false);
          }}
        />
      )}

      {/* Cat Ledger Modal */}
      {showCatLedger && (
        <CatLedger
          cats={cats}
          userPetCount={localPlayer.catsPetted || 0}
          onClose={() => setShowCatLedger(false)}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h2 className="text-lg font-black font-mono text-[#5A3825] mb-3 flex items-center gap-2">
              🐾 How to Play MeowLand
            </h2>
            <div className="text-xs space-y-2 text-[#3A2417] leading-relaxed">
              <p>
                <strong>Movement:</strong> Use <strong>WASD</strong> or <strong>Arrow Keys</strong> on keyboard, or tap/click on the canvas map to walk!
              </p>
              <p>
                <strong>Interactions:</strong> Walk up to a door, cat, or another player and press <strong>[E]</strong> or <strong>[Space]</strong> or tap the action button.
              </p>
              <p>
                <strong>City Locations:</strong> Explore 🌿 Town Square, ☕ Meow Cafe, 🛍️ Date Mall, 🎬 Movie Cinema, and 🏡 Cozy Home!
              </p>
              <p>
                <strong>YouTube Movie Cinema:</strong> Enter the Cinema room or click the screen to paste YouTube URLs and watch movies together synchronously with your friends!
              </p>
              <p>
                <strong>Friends & Registration:</strong> Click 👥 <strong>Register / Friend Login</strong> in the top header to register account tags for yourself & your girlfriend!
              </p>
              <p>
                <strong>Cats:</strong> Pet Mochi, Luna, Patches, or Boba to trigger floating hearts and real formant-synthesized meows!
              </p>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2.5 bg-[#8B5A2B] text-white font-bold rounded-xl text-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#5A3825] text-amber-200/80 text-[11px] text-center py-2.5 font-mono border-t-2 border-[#8B5A2B]">
        Royland World By Roy © 2026 — Cozy pixel-art social world with live multiplayer
      </footer>

      {/* Background YouTube Music Player Section */}
      <MusicPlayer />
    </div>
  );
}
