import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PlayerData, CatData, RoomType, HeartParticle, CinemaState, WeatherType } from '../types';
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  TOWN_COLLISIONS,
  COFFEE_SHOP_COLLISIONS,
  SHOPPING_MALL_COLLISIONS,
  MOVIE_THEATER_COLLISIONS,
  COZY_HOUSE_COLLISIONS,
  TOWN_COFFEE_DOOR,
  TOWN_MALL_DOOR,
  TOWN_THEATER_DOOR,
  TOWN_HOUSE_DOOR,
  COMMON_EXIT_DOOR,
  drawTownSquareMap,
  drawCoffeeShopInterior,
  drawShoppingMallMap,
  drawMovieTheaterMap,
  drawCozyHouseMap,
  drawChibiCharacter,
  drawCatSprite,
  drawWeatherOverlay,
} from '../game/PixelArtRenderer';
import { playStepSound, playHeartPopSound, playMeowSound, playDoorChimeSound } from '../utils/sound';
import { CloudRain, Snowflake, Leaf, Sparkles, Sun, RefreshCw } from 'lucide-react';

interface Props {
  localPlayer: PlayerData;
  remotePlayers: PlayerData[];
  cats: CatData[];
  cinemaState?: CinemaState;
  weather?: WeatherType;
  onChangeWeather?: (newWeather: WeatherType) => void;
  onPlayerMove: (x: number, y: number, direction: 'down' | 'up' | 'left' | 'right', isMoving: boolean) => void;
  onRoomChange: (newRoom: RoomType, newX: number, newY: number) => void;
  onPetCat: (catId: string) => void;
  onRequestChat: (targetPlayer: PlayerData) => void;
  onOpenCinema?: () => void;
  onOpenCafeBar?: () => void;
  onOpenFountain?: () => void;
  isCandlelightActive?: boolean;
}

export const GameCanvas: React.FC<Props> = ({
  localPlayer,
  remotePlayers,
  cats,
  cinemaState,
  weather = 'rain' as WeatherType,
  onChangeWeather,
  onPlayerMove,
  onRoomChange,
  onPetCat,
  onRequestChat,
  onOpenCinema,
  onOpenCafeBar,
  onOpenFountain,
  isCandlelightActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keyboard state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animFrameRef = useRef(0);
  const tickRef = useRef(0);

  // Local positions for smooth client simulation
  const localPosRef = useRef({ x: localPlayer.x, y: localPlayer.y });
  const localDirRef = useRef<'down' | 'up' | 'left' | 'right'>(localPlayer.direction);
  const isMovingRef = useRef(false);

  // Particles
  const particlesRef = useRef<HeartParticle[]>([]);

  // Proximity prompts
  const [nearbyAction, setNearbyAction] = useState<{
    type: 'door' | 'cinema' | 'cat' | 'player';
    label: string;
    target?: any;
  } | null>(null);
  const nearbyActionRef = useRef<{
    type: 'door' | 'cinema' | 'cat' | 'player';
    label: string;
    target?: any;
  } | null>(null);

  const updateNearbyAction = (action: typeof nearbyAction) => {
    nearbyActionRef.current = action;
    setNearbyAction(action);
  };

  // Interpolated position storage for remote players
  const remotePosMap = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Sync ref with prop updates if changed externally
  useEffect(() => {
    localPosRef.current = { x: localPlayer.x, y: localPlayer.y };
  }, [localPlayer.room]);

  // Collision checking
  const checkCollision = useCallback(
    (nx: number, ny: number, room: RoomType): boolean => {
      let boxes = TOWN_COLLISIONS;
      if (room === 'coffee_shop') boxes = COFFEE_SHOP_COLLISIONS;
      else if (room === 'shopping_mall') boxes = SHOPPING_MALL_COLLISIONS;
      else if (room === 'movie_theater') boxes = MOVIE_THEATER_COLLISIONS;
      else if (room === 'cozy_house') boxes = COZY_HOUSE_COLLISIONS;

      const playerRadius = 12;

      for (const box of boxes) {
        if (
          nx + playerRadius > box.x &&
          nx - playerRadius < box.x + box.w &&
          ny + playerRadius > box.y &&
          ny - playerRadius < box.y + box.h
        ) {
          return true; // Collision detected
        }
      }
      return false;
    },
    []
  );

  // Spawn heart particles
  const spawnHearts = useCallback((x: number, y: number) => {
    for (let i = 0; i < 6; i++) {
      particlesRef.current.push({
        id: `hp-${Math.random()}`,
        x: x + (Math.random() * 24 - 12),
        y: y - 10 + (Math.random() * 10 - 5),
        opacity: 1,
        scale: 0.8 + Math.random() * 0.6,
        vy: -1.2 - Math.random() * 1.6,
      });
    }
  }, []);

  // Spawn heart burst when player triggers kiss emote
  useEffect(() => {
    if (localPlayer.emote === 'kiss') {
      spawnHearts(localPlayer.x, localPlayer.y);
      spawnHearts(localPlayer.x + 16, localPlayer.y);
    }
  }, [localPlayer.emote, localPlayer.x, localPlayer.y, spawnHearts]);

  // Trigger interaction reliably with latest ref
  const triggerProximityInteraction = useCallback(() => {
    const act = nearbyActionRef.current;
    if (!act) return;

    if (act.type === 'door') {
      playDoorChimeSound();
      const targetRoom = act.target?.room;
      const targetX = act.target?.x || MAP_WIDTH / 2;
      const targetY = act.target?.y || MAP_HEIGHT - 100;
      if (targetRoom) {
        onRoomChange(targetRoom, targetX, targetY);
      }
    } else if (act.type === 'cinema') {
      if (onOpenCinema) onOpenCinema();
    } else if (act.type === 'cafe_bar') {
      if (onOpenCafeBar) onOpenCafeBar();
    } else if (act.type === 'fountain') {
      if (onOpenFountain) onOpenFountain();
    } else if (act.type === 'cat') {
      playMeowSound();
      playHeartPopSound();
      spawnHearts(act.target.x, act.target.y);
      onPetCat(act.target.id);
    } else if (act.type === 'player') {
      onRequestChat(act.target);
    }
  }, [onRoomChange, onOpenCinema, onOpenCafeBar, onPetCat, onRequestChat]);

  // Keyboard listeners for 'E' key / Space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      keysRef.current[e.key.toLowerCase()] = true;

      // 'E' key or Space key to interact
      if (e.key.toLowerCase() === 'e' || e.key === ' ') {
        e.preventDefault();
        triggerProximityInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerProximityInteraction]);

  // Main Game Loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      tickRef.current += 1;
      const ctx = canvasRef.current?.getContext('2d');

      // 1. Movement Logic
      const speed = 3.2;
      let dx = 0;
      let dy = 0;

      const keys = keysRef.current;
      if (keys['w'] || keys['arrowup']) dy -= speed;
      if (keys['s'] || keys['arrowdown']) dy += speed;
      if (keys['a'] || keys['arrowleft']) dx -= speed;
      if (keys['d'] || keys['arrowright']) dx += speed;

      let moving = false;
      let newDir = localDirRef.current;

      if (dx !== 0 || dy !== 0) {
        moving = true;
        if (Math.abs(dx) > Math.abs(dy)) {
          newDir = dx > 0 ? 'right' : 'left';
        } else {
          newDir = dy > 0 ? 'down' : 'up';
        }

        const nextX = localPosRef.current.x + dx;
        const nextY = localPosRef.current.y + dy;

        // Apply movement with collision bounds
        if (!checkCollision(nextX, localPosRef.current.y, localPlayer.room)) {
          localPosRef.current.x = Math.max(30, Math.min(MAP_WIDTH - 30, nextX));
        }
        if (!checkCollision(localPosRef.current.x, nextY, localPlayer.room)) {
          localPosRef.current.y = Math.max(30, Math.min(MAP_HEIGHT - 30, nextY));
        }

        if (tickRef.current % 12 === 0) {
          playStepSound();
          animFrameRef.current = (animFrameRef.current + 1) % 4;
        }

        // Send move event throttled
        if (tickRef.current % 3 === 0) {
          onPlayerMove(
            Math.round(localPosRef.current.x),
            Math.round(localPosRef.current.y),
            newDir,
            true
          );
        }
      } else if (isMovingRef.current) {
        // Just stopped moving
        onPlayerMove(
          Math.round(localPosRef.current.x),
          Math.round(localPosRef.current.y),
          localDirRef.current,
          false
        );
      }

      isMovingRef.current = moving;
      localDirRef.current = newDir;

      // 2. Check Proximity Action
      const px = localPosRef.current.x;
      const py = localPosRef.current.y;
      let foundAction: { type: 'door' | 'cat' | 'player' | 'cinema' | 'cafe_bar' | 'fountain'; label: string; target?: any } | null = null;

      // Check Door Proximity
      if (localPlayer.room === 'town_square') {
        if (Math.hypot(px - 540, py - 275) < 70) {
          foundAction = {
            type: 'fountain',
            label: '⛲ Royal Crystal Fountain - Drink Water (6x Goal) 🥛 [Press E]',
          };
        } else if (Math.hypot(px - TOWN_COFFEE_DOOR.x, py - TOWN_COFFEE_DOOR.y) < 55) {
          foundAction = {
            type: 'door',
            label: 'Enter Baker Bakery & Cafe ☕ [Press E]',
            target: { room: 'coffee_shop', x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 },
          };
        } else if (Math.hypot(px - TOWN_MALL_DOOR.x, py - TOWN_MALL_DOOR.y) < 55) {
          foundAction = {
            type: 'door',
            label: 'Enter Date Boutique Mall 🛍️ [Press E]',
            target: { room: 'shopping_mall', x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 },
          };
        } else if (Math.hypot(px - TOWN_THEATER_DOOR.x, py - TOWN_THEATER_DOOR.y) < 55) {
          foundAction = {
            type: 'door',
            label: 'Enter Movie Theater 🎬 [Press E]',
            target: { room: 'movie_theater', x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 },
          };
        } else if (Math.hypot(px - TOWN_HOUSE_DOOR.x, py - TOWN_HOUSE_DOOR.y) < 55) {
          foundAction = {
            type: 'door',
            label: 'Enter Cozy Romantic Home 🏡 [Press E]',
            target: { room: 'cozy_house', x: MAP_WIDTH / 2, y: MAP_HEIGHT - 100 },
          };
        }
      } else {
        // Interior rooms exit doors
        if (Math.hypot(px - COMMON_EXIT_DOOR.x, py - COMMON_EXIT_DOOR.y) < 55) {
          let exitX = 760;
          let exitY = 260;
          if (localPlayer.room === 'shopping_mall') { exitX = 120; exitY = 240; }
          else if (localPlayer.room === 'movie_theater') { exitX = 440; exitY = 240; }
          else if (localPlayer.room === 'cozy_house') { exitX = 120; exitY = 600; }

          foundAction = {
            type: 'door',
            label: 'Exit to Town Square 🌿 [Press E]',
            target: { room: 'town_square', x: exitX, y: exitY },
          };
        }
      }

      // Check Coffee Bar Counter Proximity in Coffee Shop
      if (!foundAction && localPlayer.room === 'coffee_shop' && px >= 160 && px <= 540 && py >= 110 && py <= 240) {
        foundAction = {
          type: 'cafe_bar',
          label: '☕ Make Fresh Coffee & Croissants [Press E]',
        };
      }

      // Check Movie Theater Screen Proximity
      if (!foundAction && localPlayer.room === 'movie_theater' && py < 230) {
        foundAction = {
          type: 'cinema',
          label: '🍿 Open YouTube Theater Controls [Press E]',
        };
      }

      // Check Cat Proximity
      if (!foundAction) {
        const currentCats = cats.filter((c) => c.room === localPlayer.room);
        for (const cat of currentCats) {
          const distCat = Math.hypot(px - cat.x, py - cat.y);
          if (distCat < 45) {
            foundAction = { type: 'cat', label: `Pet ${cat.name} 🐱 [Press E]`, target: cat };
            break;
          }
        }
      }

      // Check Nearby Player Proximity
      if (!foundAction) {
        const otherPlayers = remotePlayers.filter((p) => p.room === localPlayer.room);
        for (const other of otherPlayers) {
          const distP = Math.hypot(px - other.x, py - other.y);
          if (distP < 60) {
            foundAction = {
              type: 'player',
              label: `Chat with ${other.nickname} 💬 [Press E]`,
              target: other,
            };
            break;
          }
        }
      }

      updateNearbyAction(foundAction);

      // 3. Render Canvas
      if (ctx) {
        ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

        // Draw Map Background for active room
        if (localPlayer.room === 'town_square') {
          drawTownSquareMap(ctx, tickRef.current, weather);
        } else if (localPlayer.room === 'coffee_shop') {
          drawCoffeeShopInterior(ctx, tickRef.current, isCandlelightActive);
        } else if (localPlayer.room === 'shopping_mall') {
          drawShoppingMallMap(ctx, tickRef.current);
        } else if (localPlayer.room === 'movie_theater') {
          drawMovieTheaterMap(ctx, tickRef.current, cinemaState?.videoTitle, cinemaState?.isPlaying);
        } else if (localPlayer.room === 'cozy_house') {
          drawCozyHouseMap(ctx, tickRef.current);
        }

        // Draw Wandering Cats in room
        const roomCats = cats.filter((c) => c.room === localPlayer.room);
        roomCats.forEach((cat) => {
          drawCatSprite(ctx, cat, tickRef.current);
        });

        // Draw Remote Players in room with smooth lerp
        const roomRemotePlayers = remotePlayers.filter((p) => p.room === localPlayer.room);
        roomRemotePlayers.forEach((rp) => {
          let pos = remotePosMap.current.get(rp.id);
          if (!pos) {
            pos = { x: rp.x, y: rp.y };
            remotePosMap.current.set(rp.id, pos);
          } else {
            // Lerp towards true position
            pos.x += (rp.x - pos.x) * 0.25;
            pos.y += (rp.y - pos.y) * 0.25;
          }

          const rpRenderData: PlayerData = {
            ...rp,
            x: pos.x,
            y: pos.y,
          };

          drawChibiCharacter(ctx, rpRenderData, animFrameRef.current, false);
        });

        // Draw Local Player
        const currentLocalPlayer: PlayerData = {
          ...localPlayer,
          x: localPosRef.current.x,
          y: localPosRef.current.y,
          direction: localDirRef.current,
          isMoving: moving,
        };

        drawChibiCharacter(ctx, currentLocalPlayer, animFrameRef.current, true);

        // Render Real-Time Weather Overlay (Rain, Snow, Leaves, Cherry Blossom, Clear)
        const isIndoor = localPlayer.room !== 'town_square';
        drawWeatherOverlay(ctx, weather, tickRef.current, isIndoor);

        // Render Floating Heart Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const pt = particlesRef.current[i];
          pt.y += pt.vy;
          pt.opacity -= 0.02;

          if (pt.opacity <= 0) {
            particlesRef.current.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.opacity);
            ctx.fillStyle = '#FF3366';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText('❤️', pt.x, pt.y);
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [localPlayer, remotePlayers, cats, weather, checkCollision, onPlayerMove, onRoomChange]);

  // Touch controls / Click to move
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = MAP_WIDTH / rect.width;
    const scaleY = MAP_HEIGHT / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Check if in movie_theater and clicked screen area
    if (localPlayer.room === 'movie_theater' && clickY < 200 && clickX > 150 && clickX < 800) {
      if (onOpenCinema) onOpenCinema();
      return;
    }

    // Check direct click on Doors
    if (localPlayer.room === 'town_square') {
      if (Math.hypot(clickX - TOWN_COFFEE_DOOR.x, clickY - TOWN_COFFEE_DOOR.y) < 65) {
        playDoorChimeSound();
        onRoomChange('coffee_shop', MAP_WIDTH / 2, MAP_HEIGHT - 100);
        return;
      }
      if (Math.hypot(clickX - TOWN_MALL_DOOR.x, clickY - TOWN_MALL_DOOR.y) < 65) {
        playDoorChimeSound();
        onRoomChange('shopping_mall', MAP_WIDTH / 2, MAP_HEIGHT - 100);
        return;
      }
      if (Math.hypot(clickX - TOWN_THEATER_DOOR.x, clickY - TOWN_THEATER_DOOR.y) < 65) {
        playDoorChimeSound();
        onRoomChange('movie_theater', MAP_WIDTH / 2, MAP_HEIGHT - 100);
        return;
      }
      if (Math.hypot(clickX - TOWN_HOUSE_DOOR.x, clickY - TOWN_HOUSE_DOOR.y) < 65) {
        playDoorChimeSound();
        onRoomChange('cozy_house', MAP_WIDTH / 2, MAP_HEIGHT - 100);
        return;
      }
    } else {
      // Exit door in interior rooms
      if (Math.hypot(clickX - COMMON_EXIT_DOOR.x, clickY - COMMON_EXIT_DOOR.y) < 65) {
        playDoorChimeSound();
        let exitX = 760;
        let exitY = 260;
        if (localPlayer.room === 'shopping_mall') { exitX = 120; exitY = 240; }
        else if (localPlayer.room === 'movie_theater') { exitX = 440; exitY = 240; }
        else if (localPlayer.room === 'cozy_house') { exitX = 120; exitY = 600; }
        onRoomChange('town_square', exitX, exitY);
        return;
      }
    }

    // Check if clicked a cat
    const currentCats = cats.filter((c) => c.room === localPlayer.room);
    for (const cat of currentCats) {
      if (Math.hypot(clickX - cat.x, clickY - cat.y) < 40) {
        playMeowSound();
        playHeartPopSound();
        spawnHearts(cat.x, cat.y);
        onPetCat(cat.id);
        return;
      }
    }

    // Check if clicked another player
    const currentRemote = remotePlayers.filter((p) => p.room === localPlayer.room);
    for (const other of currentRemote) {
      if (Math.hypot(clickX - other.x, clickY - other.y) < 45) {
        onRequestChat(other);
        return;
      }
    }

    // Otherwise walk towards clicked location
    localPosRef.current = { x: clickX, y: clickY };
    onPlayerMove(Math.round(clickX), Math.round(clickY), localDirRef.current, false);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none overflow-hidden rounded-2xl shadow-2xl border-4 border-[#8B5A2B] bg-[#221915]">
      {/* Top HUD Bar */}
      <div className="w-full bg-[#5A3825] px-4 py-2 flex items-center justify-between text-amber-100 font-mono text-xs border-b-2 border-[#8B5A2B]">
        <div className="flex items-center gap-3">
          <span className="bg-amber-900/80 px-2.5 py-1 rounded-full border border-amber-600 font-bold flex items-center gap-1.5 text-amber-200">
            {localPlayer.room === 'town_square' ? '🌿 Town Square' : '☕ Meow Cafe Coffee Shop'}
          </span>
          <span className="hidden sm:inline-block text-amber-300/80">
            Players Online: {remotePlayers.length + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Real-time Weather HUD Badge & Switcher */}
          <button
            onClick={() => {
              const list: WeatherType[] = ['rain', 'snow', 'leaves', 'cherry_blossom', 'clear'];
              const currentIdx = list.indexOf(weather);
              const next = list[(currentIdx + 1) % list.length];
              if (onChangeWeather) onChangeWeather(next);
            }}
            className="bg-amber-950/90 hover:bg-amber-900 px-3 py-1 rounded-full border border-amber-500/80 font-bold flex items-center gap-1.5 text-amber-200 transition active:scale-95 shadow-inner"
            title="Click to cycle real-time daily weather overlay"
          >
            {weather === 'rain' && <CloudRain className="w-3.5 h-3.5 text-blue-300 animate-bounce" />}
            {weather === 'snow' && <Snowflake className="w-3.5 h-3.5 text-sky-200 animate-spin" style={{ animationDuration: '6s' }} />}
            {weather === 'leaves' && <Leaf className="w-3.5 h-3.5 text-amber-400" />}
            {weather === 'cherry_blossom' && <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />}
            {weather === 'clear' && <Sun className="w-3.5 h-3.5 text-yellow-300" />}
            <span className="capitalize text-[11px] tracking-wide">
              {weather === 'rain' ? 'Autumn Rain' : weather === 'snow' ? 'Winter Snow' : weather === 'leaves' ? 'Falling Leaves' : weather === 'cherry_blossom' ? 'Cherry Blossom' : 'Sunny Clear'}
            </span>
            <RefreshCw className="w-3 h-3 text-amber-400 opacity-70 hover:opacity-100 ml-0.5" />
          </button>

          <span className="text-amber-300 font-bold hidden sm:inline">
            🐾 Cats Petted: {localPlayer.catsPetted || 0}
          </span>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full max-w-[960px] aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair"
        />

        {/* Proximity Interaction Floating Prompt */}
        {nearbyAction && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <button
              onClick={triggerProximityInteraction}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold rounded-2xl border-2 border-amber-200 shadow-xl text-xs sm:text-sm flex items-center gap-2 tracking-wide transition active:scale-95"
            >
              <span>{nearbyAction.label}</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch D-Pad Controls for Mobile Devices */}
      <div className="sm:hidden w-full bg-[#3A2417] p-3 border-t-2 border-[#8B5A2B] flex items-center justify-between">
        <div className="grid grid-cols-3 gap-1 w-32 h-32 mx-auto">
          <div />
          <button
            onPointerDown={() => (keysRef.current['w'] = true)}
            onPointerUp={() => (keysRef.current['w'] = false)}
            className="bg-amber-800 active:bg-amber-600 text-amber-100 rounded-lg font-bold flex items-center justify-center text-lg border border-amber-600 shadow-xs"
          >
            ▲
          </button>
          <div />
          <button
            onPointerDown={() => (keysRef.current['a'] = true)}
            onPointerUp={() => (keysRef.current['a'] = false)}
            className="bg-amber-800 active:bg-amber-600 text-amber-100 rounded-lg font-bold flex items-center justify-center text-lg border border-amber-600 shadow-xs"
          >
            ◀
          </button>
          <button
            onClick={triggerProximityInteraction}
            className="bg-amber-500 active:bg-amber-400 text-amber-950 rounded-lg font-extrabold flex items-center justify-center text-xs border border-amber-200 shadow-xs"
          >
            ACTION
          </button>
          <button
            onPointerDown={() => (keysRef.current['d'] = true)}
            onPointerUp={() => (keysRef.current['d'] = false)}
            className="bg-amber-800 active:bg-amber-600 text-amber-100 rounded-lg font-bold flex items-center justify-center text-lg border border-amber-600 shadow-xs"
          >
            ▶
          </button>
          <div />
          <button
            onPointerDown={() => (keysRef.current['s'] = true)}
            onPointerUp={() => (keysRef.current['s'] = false)}
            className="bg-amber-800 active:bg-amber-600 text-amber-100 rounded-lg font-bold flex items-center justify-center text-lg border border-amber-600 shadow-xs"
          >
            ▼
          </button>
          <div />
        </div>
      </div>
    </div>
  );
};
