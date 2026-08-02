import { WardrobeConfig, PlayerData, CatData, RoomType, WeatherType } from '../types';

// Map Dimensions
export const MAP_WIDTH = 960;
export const MAP_HEIGHT = 720;

// Tile size
export const TILE_SIZE = 32;

// Character dimensions
export const SPRITE_WIDTH = 32;
export const SPRITE_HEIGHT = 44;

// Obstacle / Collision Boxes for Town Square
export interface RectBox {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: string;
}

export const TOWN_COLLISIONS: RectBox[] = [
  // Top forest border
  { x: 0, y: 0, w: MAP_WIDTH, h: 80 },
  // Left border
  { x: 0, y: 0, w: 32, h: MAP_HEIGHT },
  // Right border
  { x: MAP_WIDTH - 32, y: 0, w: 32, h: MAP_HEIGHT },
  // Bottom border
  { x: 0, y: MAP_HEIGHT - 32, w: MAP_WIDTH, h: 32 },

  // Top Left House (Red Roof House)
  { x: 80, y: 100, w: 160, h: 120, type: 'house_left' },
  // Top Right House / Coffee Shop ("Meow Cafe")
  { x: 680, y: 100, w: 180, h: 130, type: 'coffee_shop' },
  // Bottom Left Cottage
  { x: 80, y: 480, w: 140, h: 110, type: 'house_bottom' },

  // Water Stream (except over bridges)
  { x: 0, y: 340, w: 380, h: 50, type: 'water' }, // Left water segment
  { x: 440, y: 340, w: 520, h: 50, type: 'water' }, // Right water segment

  // Stone Wall fence
  { x: 260, y: 220, w: 380, h: 16, type: 'fence' },
  // Lower bridge railing edges
  { x: 375, y: 335, w: 10, h: 60 },
  { x: 435, y: 335, w: 10, h: 60 },
  // Town Square Crystal Water Fountain (Interactive 6x Water Drinking)
  { x: 500, y: 245, w: 80, h: 60, type: 'fountain' },
];

export const COFFEE_SHOP_COLLISIONS: RectBox[] = [
  // Outer walls
  { x: 0, y: 0, w: MAP_WIDTH, h: 140 }, // Back wall
  { x: 0, y: 0, w: 80, h: MAP_HEIGHT }, // Left wall
  { x: MAP_WIDTH - 80, y: 0, w: 80, h: MAP_HEIGHT }, // Right wall
  { x: 0, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 40, h: 60 }, // Bottom wall left
  { x: MAP_WIDTH / 2 + 40, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 40, h: 60 }, // Bottom wall right

  // Coffee Counter & Barista Area
  { x: 175, y: 140, w: 350, h: 80, type: 'counter' },
  // Seating tables with chairs
  { x: 145, y: 395, w: 70, h: 50, type: 'table' },
  { x: 725, y: 395, w: 70, h: 50, type: 'table' },
  { x: 435, y: 435, w: 70, h: 50, type: 'table' },
];

export const SHOPPING_MALL_COLLISIONS: RectBox[] = [
  { x: 0, y: 0, w: MAP_WIDTH, h: 100 },
  { x: 0, y: 0, w: 60, h: MAP_HEIGHT },
  { x: MAP_WIDTH - 60, y: 0, w: 60, h: MAP_HEIGHT },
  { x: 0, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 40, h: 60 },
  { x: MAP_WIDTH / 2 + 40, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 40, h: 60 },
  // Racks & Display Tables
  { x: 120, y: 140, w: 220, h: 60 },
  { x: 620, y: 140, w: 220, h: 60 },
  { x: 350, y: 300, w: 260, h: 70 },
];

export const MOVIE_THEATER_COLLISIONS: RectBox[] = [
  { x: 0, y: 0, w: MAP_WIDTH, h: 180 }, // Screen Stage area
  { x: 0, y: 0, w: 80, h: MAP_HEIGHT },
  { x: MAP_WIDTH - 80, y: 0, w: 80, h: MAP_HEIGHT },
  { x: 0, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 40, h: 60 },
  { x: MAP_WIDTH / 2 + 40, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 40, h: 60 },
  // Popcorn Counter
  { x: 100, y: 200, w: 180, h: 60 },
];

export const COZY_HOUSE_COLLISIONS: RectBox[] = [
  { x: 0, y: 0, w: MAP_WIDTH, h: 120 },
  { x: 0, y: 0, w: 80, h: MAP_HEIGHT },
  { x: MAP_WIDTH - 80, y: 0, w: 80, h: MAP_HEIGHT },
  { x: 0, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 50, h: 60 },
  { x: MAP_WIDTH / 2 + 50, y: MAP_HEIGHT - 60, w: MAP_WIDTH / 2 - 50, h: 60 },

  // Top-Left Kitchen Counters & Refrigerator
  { x: 80, y: 120, w: 310, h: 55, type: 'kitchen' },
  { x: 330, y: 120, w: 60, h: 85, type: 'fridge' },

  // Bookshelf
  { x: 505, y: 120, w: 55, h: 55, type: 'bookshelf' },

  // Living Room Sofa & TV Stand (Top Right)
  { x: 640, y: 140, w: 180, h: 55, type: 'sofa' },
  { x: 640, y: 310, w: 180, h: 45, type: 'tv' },

  // Dining Room Table (Bottom Left)
  { x: 140, y: 495, w: 160, h: 75, type: 'table' },

  // Flower Racks (Bottom Right)
  { x: 580, y: 500, w: 240, h: 60, type: 'flowers' },
];

// Interactive door locations
export const TOWN_COFFEE_DOOR = { x: 760, y: 220, w: 40, h: 20 };
export const TOWN_MALL_DOOR = { x: 120, y: 200, w: 60, h: 20 };
export const TOWN_THEATER_DOOR = { x: 440, y: 200, w: 80, h: 20 };
export const TOWN_HOUSE_DOOR = { x: 120, y: 570, w: 60, h: 20 };
export const COFFEE_EXIT_DOOR = { x: MAP_WIDTH / 2 - 30, y: MAP_HEIGHT - 70, w: 60, h: 30 };
export const COMMON_EXIT_DOOR = { x: MAP_WIDTH / 2 - 30, y: MAP_HEIGHT - 70, w: 60, h: 30 };

// Draw Town Square Map
export function drawTownSquareMap(ctx: CanvasRenderingContext2D, tick: number, weather: WeatherType = 'clear') {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // 1. Base Grass with texture
  ctx.fillStyle = '#73B852';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // Grass Tuft Details & Flower Accents
  ctx.fillStyle = '#65A344';
  for (let x = 0; x < MAP_WIDTH; x += 48) {
    for (let y = 0; y < MAP_HEIGHT; y += 48) {
      const seed = (x * 13 + y * 7) % 100;
      if (seed < 40) {
        ctx.fillRect(x + 8, y + 12, 4, 8);
        ctx.fillRect(x + 12, y + 8, 4, 12);
      } else if (seed > 75) {
        // Yellow & White Flowers
        ctx.fillStyle = seed % 2 === 0 ? '#FFE066' : '#FFFFFF';
        ctx.fillRect(x + 16, y + 16, 6, 6);
        ctx.fillStyle = '#FF9900';
        ctx.fillRect(x + 18, y + 18, 2, 2);
        ctx.fillStyle = '#65A344';
      }
    }
  }

  // Dirt / Sand Paths
  ctx.fillStyle = '#EBD59B';
  // Horizontal path through town square
  ctx.fillRect(100, 240, 760, 48);
  // Vertical path to bridge
  ctx.fillRect(380, 240, 60, 280);
  // Path to Coffee Shop door
  ctx.fillRect(740, 220, 60, 70);

  // Path edge details
  ctx.fillStyle = '#D4B97B';
  ctx.fillRect(100, 238, 760, 2);
  ctx.fillRect(100, 288, 760, 2);

  // 2. Crystal Blue Winding River
  const waterOffset = Math.sin(tick * 0.05) * 2;
  ctx.fillStyle = '#3A9AD9';
  ctx.fillRect(0, 340, MAP_WIDTH, 50);

  // Water Ripple Lines
  ctx.fillStyle = '#76C7F0';
  for (let rx = 20; rx < MAP_WIDTH; rx += 60) {
    const rxAnim = (rx + waterOffset * 5) % MAP_WIDTH;
    ctx.fillRect(rxAnim, 350 + (rx % 30), 24, 4);
    ctx.fillRect(rxAnim + 10, 368 - (rx % 20), 18, 3);
  }

  // River Stone Banks
  ctx.fillStyle = '#5A636A';
  ctx.fillRect(0, 334, MAP_WIDTH, 6);
  ctx.fillRect(0, 390, MAP_WIDTH, 6);

  // 3. Wooden Bridge across River (Main Crossing)
  ctx.fillStyle = '#B07B43';
  ctx.fillRect(380, 332, 60, 66);
  ctx.fillStyle = '#805324';
  for (let py = 336; py < 396; py += 10) {
    ctx.fillRect(380, py, 60, 2);
  }
  // Bridge Red Wooden Railings (matching user reference image #2)
  ctx.fillStyle = '#B83227';
  ctx.fillRect(374, 330, 8, 70);
  ctx.fillRect(438, 330, 8, 70);
  ctx.fillStyle = '#7A1C15';
  ctx.fillRect(372, 330, 12, 6);
  ctx.fillRect(372, 394, 12, 6);
  ctx.fillRect(436, 330, 12, 6);
  ctx.fillRect(436, 394, 12, 6);

  // 4. Stone Wall Fence
  ctx.fillStyle = '#7A848D';
  ctx.fillRect(260, 220, 380, 16);
  ctx.fillStyle = '#4B5259';
  for (let fx = 260; fx < 640; fx += 20) {
    ctx.fillRect(fx, 220, 2, 16);
  }

  // 5. Dense Top Pine Trees
  for (let tx = 0; tx < MAP_WIDTH; tx += 36) {
    drawPixelTree(ctx, tx, 10);
    drawPixelTree(ctx, tx + 18, 30);
  }

  // 6. Building 1: Top Left Date Shopping Mall
  drawCozyHouse(ctx, 60, 75, '#EC4899', '#FFF0F5', '🛍️ Date Mall');

  // 7. Building 2: Center Top Movie Theater
  drawCozyHouse(ctx, 380, 75, '#8B0000', '#1F192F', '🎬 Cinema');

  // 8. Building 3: Top Right Coffee Shop "Meow Cafe"
  drawCoffeeShopExterior(ctx, 680, 75);

  // 9. Building 4: Cozy Autumn Cottage (User Custom Home - "MeowMius Palace")
  drawCozyAutumnCottageExterior(ctx, 35, 410, weather, tick);

  // Interactive Door Glow Entrance Markers
  ctx.fillStyle = '#FFE066';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('🚪 MALL', 120, 210);
  ctx.fillText('🚪 CINEMA', 440, 210);
  ctx.fillText('🚪 CAFE', 760, 210);
  ctx.fillText('🚪 HOME', 120, 590);

  // Decorative Bushes & Flower Beds
  drawFlowerBed(ctx, 280, 245);
  drawFlowerBed(ctx, 460, 245);
  drawFlowerBed(ctx, 620, 245);
  drawFlowerBed(ctx, 260, 420);

  // Town Square Crystal Water Fountain (Interactive 6x Water Goal)
  drawWaterFountain(ctx, 540, 275, tick);

  ctx.restore();
}

// Helper: Draw Pixel Art Water Fountain
function drawWaterFountain(ctx: CanvasRenderingContext2D, fx: number, fy: number, tick: number) {
  // Shadow beneath fountain
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(fx, fy + 16, 44, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // 1. Outer Stone Basin Base
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(fx, fy + 12, 42, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#64748B';
  ctx.beginPath();
  ctx.ellipse(fx, fy + 10, 38, 17, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Crystal Blue Water Pool inside basin
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.ellipse(fx, fy + 9, 34, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Animated Water Ripples inside Pool
  const rippleOffset = Math.sin(tick * 0.08) * 3;
  ctx.fillStyle = '#38BDF8';
  ctx.beginPath();
  ctx.ellipse(fx + rippleOffset, fy + 9, 24, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#E0F2FE';
  ctx.fillRect(fx - 12 + Math.floor(rippleOffset * 2), fy + 7, 10, 2);
  ctx.fillRect(fx + 6 - Math.floor(rippleOffset * 2), fy + 11, 8, 2);

  // 3. Central Tiered Stone Pillar
  ctx.fillStyle = '#475569';
  ctx.fillRect(fx - 8, fy - 12, 16, 22);
  ctx.fillStyle = '#64748B';
  ctx.fillRect(fx - 6, fy - 12, 12, 20);

  // Middle Bowl Tier
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(fx, fy - 12, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.ellipse(fx, fy - 14, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Top Spout Column
  ctx.fillStyle = '#64748B';
  ctx.fillRect(fx - 4, fy - 26, 8, 14);

  // 4. ANIMATED WATER SPRAY JETS & DROPLETS
  const jetY1 = fy - 26 - Math.abs(Math.sin(tick * 0.12)) * 14;
  const jetY2 = fy - 26 - Math.abs(Math.cos(tick * 0.12)) * 12;

  // Spouting Upward Water Jet Lines
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(fx - 2, jetY1, 4, 12);
  ctx.fillRect(fx - 5, jetY2 + 2, 3, 10);
  ctx.fillRect(fx + 2, jetY2 + 2, 3, 10);

  // Water Droplet Sparkles & Cascades
  ctx.fillStyle = '#E0F2FE';
  ctx.fillRect(fx + Math.sin(tick * 0.15) * 12, fy - 18 + Math.floor((tick * 1.5) % 18), 3, 3);
  ctx.fillRect(fx - Math.cos(tick * 0.15) * 14, fy - 18 + Math.floor(((tick + 6) * 1.5) % 18), 3, 3);
  ctx.fillRect(fx + Math.cos(tick * 0.2) * 22, fy - 10 + Math.floor(((tick + 3) * 1.5) % 20), 2, 2);
  ctx.fillRect(fx - Math.sin(tick * 0.2) * 20, fy - 10 + Math.floor(((tick + 9) * 1.5) % 20), 2, 2);

  // 5. Interactive Floating Text Badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
  ctx.fillRect(fx - 48, fy - 44, 96, 16);
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'extrabold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⛲ Fountain (Drink Water 💧)', fx, fy - 32);
  ctx.textAlign = 'left';
}

// Helper: Draw Pixel Pine Tree
function drawPixelTree(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Trunk
  ctx.fillStyle = '#523A28';
  ctx.fillRect(x + 12, y + 32, 8, 16);
  // Tree Leaves
  ctx.fillStyle = '#2B6638';
  ctx.beginPath();
  ctx.fillRect(x + 4, y + 20, 24, 16);
  ctx.fillRect(x + 8, y + 10, 16, 14);
  ctx.fillRect(x + 12, y + 2, 8, 10);

  // Highlighting
  ctx.fillStyle = '#428C51';
  ctx.fillRect(x + 6, y + 20, 10, 4);
  ctx.fillRect(x + 10, y + 10, 6, 4);
}

// Helper: Draw Cozy House
function drawCozyHouse(ctx: CanvasRenderingContext2D, x: number, y: number, roofColor: string, wallColor: string, label: string) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x + 10, y + 100, 140, 15);

  // Walls
  ctx.fillStyle = wallColor;
  ctx.fillRect(x + 10, y + 40, 130, 65);

  // Wooden Timber Framing
  ctx.fillStyle = '#6E492B';
  ctx.fillRect(x + 10, y + 40, 6, 65);
  ctx.fillRect(x + 134, y + 40, 6, 65);
  ctx.fillRect(x + 10, y + 102, 130, 4);

  // Windows
  ctx.fillStyle = '#FFEB99';
  ctx.fillRect(x + 25, y + 55, 24, 24);
  ctx.fillRect(x + 100, y + 55, 24, 24);
  ctx.fillStyle = '#6E492B';
  ctx.fillRect(x + 36, y + 55, 2, 24);
  ctx.fillRect(x + 25, y + 66, 24, 2);
  ctx.fillRect(x + 111, y + 55, 2, 24);
  ctx.fillRect(x + 100, y + 66, 24, 2);

  // Door
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 65, y + 65, 22, 40);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x + 82, y + 84, 3, 3); // Knob

  // Roof
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + 42);
  ctx.lineTo(x + 75, y - 5);
  ctx.lineTo(x + 155, y + 42);
  ctx.fill();

  // Roof Trim
  ctx.fillStyle = '#3E1C0A';
  ctx.fillRect(x - 5, y + 40, 160, 5);

  // Chimney
  ctx.fillStyle = '#7A675B';
  ctx.fillRect(x + 115, y + 5, 16, 25);
  ctx.fillStyle = '#4D4139';
  ctx.fillRect(x + 113, y + 3, 20, 4);
}

// Helper: Coffee Shop / Baker Bakery Exterior (Matching Reference Image 2)
function drawCoffeeShopExterior(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Shadow beneath building
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 5, y + 130, 200, 15);

  // 1. Chimney on Right
  ctx.fillStyle = '#8C4638';
  ctx.fillRect(x + 155, y - 25, 22, 45);
  ctx.fillStyle = '#5C2D24';
  ctx.fillRect(x + 152, y - 28, 28, 6);
  // Chimney smoke
  ctx.fillStyle = 'rgba(240, 240, 240, 0.5)';
  ctx.fillRect(x + 162, y - 36, 8, 8);
  ctx.fillRect(x + 166, y - 46, 12, 10);

  // 2. 2-Story House Main Walls
  // 2nd Floor White Brick Facade
  ctx.fillStyle = '#F4EBE1';
  ctx.fillRect(x + 15, y + 25, 160, 55);
  ctx.fillStyle = '#E5D6C5';
  for (let bx = x + 15; bx < x + 175; bx += 16) {
    for (let by = y + 25; by < y + 80; by += 8) {
      ctx.fillRect(bx, by, 15, 1);
    }
  }

  // Ground Floor Dark Brick Facade
  ctx.fillStyle = '#6E493B';
  ctx.fillRect(x + 10, y + 80, 170, 55);
  ctx.fillStyle = '#4A3026';
  for (let bx = x + 10; bx < x + 180; bx += 14) {
    for (let by = y + 80; by < y + 135; by += 6) {
      ctx.fillRect(bx, by, 13, 1);
    }
  }

  // 3. Roof with Dark Slate Shingles
  ctx.fillStyle = '#786968';
  ctx.fillRect(x + 8, y - 10, 174, 35);
  ctx.fillStyle = '#564B4A';
  ctx.fillRect(x + 5, y + 20, 180, 6); // Eaves
  // Roof tiles pattern
  ctx.fillStyle = '#625554';
  for (let rx = x + 10; rx < x + 175; rx += 14) {
    ctx.fillRect(rx, y - 5, 12, 12);
    ctx.fillRect(rx + 6, y + 8, 12, 10);
  }

  // 3 Cute White Birds on Roof
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 40, y - 14, 6, 4);
  ctx.fillRect(x + 42, y - 16, 3, 3);
  ctx.fillRect(x + 55, y - 14, 6, 4);
  ctx.fillRect(x + 57, y - 16, 3, 3);
  ctx.fillRect(x + 110, y - 14, 6, 4);
  ctx.fillRect(x + 112, y - 16, 3, 3);
  // Beaks
  ctx.fillStyle = '#FF9900';
  ctx.fillRect(x + 45, y - 15, 2, 2);
  ctx.fillRect(x + 60, y - 15, 2, 2);
  ctx.fillRect(x + 115, y - 15, 2, 2);

  // 4. 2nd Floor Arched Windows with Flower Boxes
  const winXs = [x + 30, x + 85, x + 140];
  winXs.forEach((wx) => {
    // Window Frame
    ctx.fillStyle = '#4D3628';
    ctx.fillRect(wx - 2, y + 35 - 2, 24, 30);
    ctx.fillStyle = '#FFEAA7';
    ctx.fillRect(wx, y + 35, 20, 26);
    // Panes
    ctx.fillStyle = '#4D3628';
    ctx.fillRect(wx + 9, y + 35, 2, 26);
    ctx.fillRect(wx, y + 48, 20, 2);
    // Rose Flower Box below window
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(wx - 4, y + 61, 28, 8);
    ctx.fillStyle = '#2D5A27';
    ctx.fillRect(wx - 2, y + 58, 24, 5);
    ctx.fillStyle = '#D63031'; // Red roses
    ctx.fillRect(wx, y + 56, 4, 4);
    ctx.fillRect(wx + 8, y + 56, 4, 4);
    ctx.fillRect(wx + 16, y + 56, 4, 4);
  });

  // 5. Main Fascia Sign Board: "BAKER BAKERY"
  ctx.fillStyle = '#3A241C';
  ctx.fillRect(x + 20, y + 70, 150, 22);
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(x + 18, y + 68, 154, 3);
  ctx.fillRect(x + 18, y + 92, 154, 3);
  // Gold Text
  ctx.fillStyle = '#F1C40F';
  ctx.font = 'extrabold 11px serif';
  ctx.textAlign = 'center';
  ctx.fillText('BAKER BAKERY', x + 95, y + 84);
  ctx.font = 'bold 7px monospace';
  ctx.fillStyle = '#D4AC0D';
  ctx.fillText('Bread & Coffee', x + 95, y + 91);
  ctx.textAlign = 'left';

  // 6. Ground Floor Windows with Fresh Bread Display
  // Left Bay Window
  ctx.fillStyle = '#3A241C';
  ctx.fillRect(x + 18, y + 96, 50, 36);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(x + 21, y + 99, 44, 30);
  // Bread loaves inside window
  ctx.fillStyle = '#D4A359';
  ctx.fillRect(x + 25, y + 115, 12, 10); // Loaf
  ctx.fillRect(x + 40, y + 117, 18, 8); // Baguette
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 28, y + 116, 6, 2);

  // Right Bay Window
  ctx.fillStyle = '#3A241C';
  ctx.fillRect(x + 122, y + 96, 50, 36);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(x + 125, y + 99, 44, 30);
  ctx.fillStyle = '#E5A93C';
  ctx.fillRect(x + 128, y + 116, 14, 9);
  ctx.fillRect(x + 146, y + 114, 18, 11);

  // 7. Entrance Door
  ctx.fillStyle = '#4A2E1F';
  ctx.fillRect(x + 76, y + 95, 38, 40);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(x + 80, y + 99, 30, 18); // Glass pane
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x + 106, y + 122, 4, 4); // Handle
  // Wooden "OPEN" sign on door
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 85, y + 104, 20, 9);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 6px monospace';
  ctx.fillText('OPEN', x + 87, y + 111);

  // 8. Climbing Green Ivy Vines with Red Roses
  ctx.fillStyle = '#276738';
  ctx.fillRect(x + 10, y + 65, 12, 35);
  ctx.fillRect(x + 168, y + 65, 12, 40);
  ctx.fillRect(x + 25, y + 63, 140, 6);
  // Flowers on vines
  ctx.fillStyle = '#E74C3C';
  ctx.fillRect(x + 12, y + 70, 3, 3);
  ctx.fillRect(x + 16, y + 85, 3, 3);
  ctx.fillRect(x + 172, y + 72, 3, 3);
  ctx.fillRect(x + 175, y + 90, 3, 3);

  // 9. Left Side Props: Street Lamp + Orange Tree + Bread Sign
  // Vintage Lamp Post
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(x - 22, y + 75, 4, 60);
  ctx.fillRect(x - 28, y + 73, 16, 4);
  // Lantern glow
  ctx.fillStyle = '#F1C40F';
  ctx.fillRect(x - 25, y + 65, 10, 10);
  ctx.fillStyle = '#FFF';
  ctx.fillRect(x - 23, y + 67, 6, 6);
  // "BREAD" hanging sign
  ctx.fillStyle = '#5A3825';
  ctx.fillRect(x - 42, y + 82, 20, 14);
  ctx.fillStyle = '#F5B041';
  ctx.font = 'bold 6px monospace';
  ctx.fillText('BREAD', x - 40, y + 91);

  // Potted Orange Fruit Tree
  ctx.fillStyle = '#784212';
  ctx.fillRect(x - 18, y + 118, 16, 16); // Pot
  ctx.fillStyle = '#1E8449';
  ctx.beginPath();
  ctx.arc(x - 10, y + 108, 14, 0, Math.PI * 2);
  ctx.fill();
  // Oranges
  ctx.fillStyle = '#E67E22';
  ctx.fillRect(x - 15, y + 102, 4, 4);
  ctx.fillRect(x - 6, y + 106, 4, 4);
  ctx.fillRect(x - 12, y + 112, 4, 4);

  // 10. Right Side Props: Large Flowering Tree in White Pot
  ctx.fillStyle = '#FBFCFC';
  ctx.fillRect(x + 185, y + 115, 20, 20); // White ceramic pot
  ctx.fillStyle = '#6E492B';
  ctx.fillRect(x + 193, y + 95, 5, 20); // Trunk
  ctx.fillStyle = '#229954';
  ctx.beginPath();
  ctx.arc(x + 195, y + 85, 18, 0, Math.PI * 2);
  ctx.fill();
  // Fallen & blooming pink flowers
  ctx.fillStyle = '#F48FB1';
  ctx.fillRect(x + 188, y + 80, 4, 4);
  ctx.fillRect(x + 198, y + 78, 4, 4);
  ctx.fillRect(x + 202, y + 88, 4, 4);
  ctx.fillRect(x + 182, y + 132, 3, 3); // fallen petal 1
  ctx.fillRect(x + 206, y + 133, 3, 3); // fallen petal 2
}

// Helper: Flower Bed
function drawFlowerBed(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#5C4033';
  ctx.fillRect(x, y, 48, 16);
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(x - 2, y - 2, 52, 3);
  ctx.fillRect(x - 2, y + 15, 52, 3);

  // Flower Blossoms
  const colors = ['#FF6B8B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E9E'];
  colors.forEach((c, idx) => {
    ctx.fillStyle = c;
    ctx.fillRect(x + 4 + idx * 9, y + 4, 6, 6);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 6 + idx * 9, y + 6, 2, 2);
  });
}

// ----------------------------------------------------
// COFFEE SHOP INTERIOR DRAWING (Matching Reference Image & Candlelight Feature)
// ----------------------------------------------------
export function drawCoffeeShopInterior(ctx: CanvasRenderingContext2D, tick: number, isCandlelightActive: boolean = false) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // 1. Dark Room Border Base
  ctx.fillStyle = '#1A120C';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // 2. BACK WALL: Off-White Cream Upper Wall & Vintage Teal Wainscoting
  ctx.fillStyle = '#F5F0E6'; // Cream upper wall
  ctx.fillRect(80, 0, MAP_WIDTH - 160, 160);
  ctx.fillStyle = '#2C4447'; // Teal wainscoting wall trim
  ctx.fillRect(80, 140, MAP_WIDTH - 160, 40);
  ctx.fillStyle = '#1F3235';
  ctx.fillRect(80, 178, MAP_WIDTH - 160, 2);

  // 3. FLOOR DUAL ZONES (Checkered Tiles in Middle/Rear + Warm Wood Planks in Foreground)
  // Rear & Middle Zone: Black & Cream Checkered Tile Floor (x: 80..880, y: 180..340)
  for (let fx = 80; fx < MAP_WIDTH - 80; fx += 32) {
    for (let fy = 180; fy < 340; fy += 32) {
      const isAlt = ((fx / 32) + (fy / 32)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#24272C' : '#EDE4D8';
      ctx.fillRect(fx, fy, 32, 32);
      ctx.fillStyle = '#181A1D';
      ctx.fillRect(fx, fy, 32, 1);
      ctx.fillRect(fx, fy, 1, 32);
    }
  }

  // Foreground Zone: Warm Oak Wood Plank Floor (y: 340..560)
  ctx.fillStyle = '#C89B6D';
  ctx.fillRect(80, 340, MAP_WIDTH - 160, MAP_HEIGHT - 400);
  // Plank Lines & Grain
  ctx.fillStyle = '#9C7148';
  for (let py = 340; py < MAP_HEIGHT - 60; py += 24) {
    ctx.fillRect(80, py, MAP_WIDTH - 160, 2);
  }
  for (let px = 80; px < MAP_WIDTH - 80; px += 48) {
    ctx.fillRect(px, 340, 2, MAP_HEIGHT - 400);
  }

  // 4. UPPER LEFT MULTI-PANE WINDOW
  ctx.fillStyle = '#2A3C42';
  ctx.fillRect(110, 20, 65, 110); // Window Frame
  ctx.fillStyle = '#E0F2FE';
  ctx.fillRect(114, 24, 57, 102); // Sky Glass Panes
  // Window Pane Grids
  ctx.fillStyle = '#2A3C42';
  ctx.fillRect(141, 24, 3, 102);
  ctx.fillRect(114, 58, 57, 3);
  ctx.fillRect(114, 92, 57, 3);
  // Window Sill Plant
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(118, 116, 14, 10);
  ctx.fillStyle = '#2D6A4F';
  ctx.fillRect(115, 104, 20, 12);

  // 5. BLACKBOARD MENU BOARDS (Upper Center)
  // Board 1: COFFEE MENU
  ctx.fillStyle = '#5A3825';
  ctx.fillRect(210, 20, 75, 95); // Wooden Frame
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(214, 24, 67, 87); // Blackboard
  ctx.fillStyle = '#F5B041';
  ctx.font = 'extrabold 9px serif';
  ctx.fillText('COFFEE', 230, 37);
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '6px monospace';
  ctx.fillText('Espresso  $3', 218, 52);
  ctx.fillText('Latte     $4', 218, 64);
  ctx.fillText('Mocha     $5', 218, 76);
  ctx.fillText('Cold Brew $4', 218, 88);

  // Board 2: BAKERY MENU
  ctx.fillStyle = '#5A3825';
  ctx.fillRect(295, 20, 75, 95);
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(299, 24, 67, 87);
  ctx.fillStyle = '#F5B041';
  ctx.font = 'extrabold 9px serif';
  ctx.fillText('BAKERY', 315, 37);
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '6px monospace';
  ctx.fillText('Croissant $3', 303, 52);
  ctx.fillText('Shortcake $5', 303, 64);
  ctx.fillText('Macaron   $2', 303, 76);
  ctx.fillText('Muffin    $3', 303, 88);

  // 6. BACK WALL SHELVING & STORAGE CABINETS (Right Side - Image matching)
  // Wooden Wall Shelves (Upper Right)
  ctx.fillStyle = '#7C4A27';
  ctx.fillRect(390, 25, 140, 8); // Shelf 1
  ctx.fillRect(390, 65, 140, 8); // Shelf 2

  // Shelf 1 Items: Teapots, Coffee Beans, Jars
  ctx.fillStyle = '#2C3E50'; // Ceramic Teapot
  ctx.fillRect(400, 10, 16, 15);
  ctx.fillStyle = '#C89456'; // Kraft Coffee Bag
  ctx.fillRect(430, 8, 14, 17);
  ctx.fillStyle = '#52B788'; // Potted Plant
  ctx.fillRect(460, 5, 16, 20);
  ctx.fillStyle = '#FFF'; // Stacked Ceramic Mugs
  ctx.fillRect(495, 10, 10, 15);

  // Shelf 2 Items: Glass Syrup Bottles & Spice Jars
  const bottleColors = ['#E74C3C', '#F39C12', '#9B59B6', '#3498DB'];
  bottleColors.forEach((col, idx) => {
    ctx.fillStyle = col;
    ctx.fillRect(400 + idx * 18, 45, 10, 20);
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(402 + idx * 18, 42, 6, 3);
  });

  // Tall Wooden Cabinet & Drawers (Center Right)
  ctx.fillStyle = '#6E4323';
  ctx.fillRect(550, 40, 70, 120);
  ctx.fillStyle = '#533118';
  ctx.fillRect(555, 45, 60, 110);
  // Drawer Knobs
  ctx.fillStyle = '#F1C40F';
  ctx.fillRect(583, 75, 4, 4);
  ctx.fillRect(583, 105, 4, 4);
  ctx.fillRect(583, 135, 4, 4);

  // Double-Door Cold Display Refrigerator (Right Wall)
  ctx.fillStyle = '#334155';
  ctx.fillRect(630, 30, 85, 130);
  ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
  ctx.fillRect(635, 35, 36, 120); // Left Glass Door
  ctx.fillRect(674, 35, 36, 120); // Right Glass Door
  // Chilled Bottles Inside Refrigerator
  ctx.fillStyle = '#22C55E';
  ctx.fillRect(642, 50, 8, 25);
  ctx.fillRect(654, 50, 8, 25);
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(680, 50, 8, 25);
  ctx.fillRect(694, 50, 8, 25);

  // 7. INDUSTRIAL BLACK PENDANT LAMPS HANGING FROM CEILING
  const lampXs = [140, 250, 330, 580, 700];
  lampXs.forEach((lx) => {
    ctx.fillStyle = '#1A1817';
    ctx.fillRect(lx, 0, 2, 35); // Cord
    ctx.fillStyle = '#2A2A2A'; // Black Metal Shade
    ctx.beginPath();
    ctx.moveTo(lx - 14, 48);
    ctx.lineTo(lx, 35);
    ctx.lineTo(lx + 16, 48);
    ctx.fill();
    ctx.fillStyle = '#FFF5B8'; // Bulb
    ctx.beginPath();
    ctx.arc(lx + 1, 50, 5, 0, Math.PI * 2);
    ctx.fill();

    // Warm Light Cone
    const grad = ctx.createLinearGradient(lx, 50, lx, 250);
    grad.addColorStop(0, 'rgba(255, 220, 120, 0.22)');
    grad.addColorStop(1, 'rgba(255, 220, 120, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(lx - 10, 50);
    ctx.lineTo(lx + 12, 50);
    ctx.lineTo(lx + 55, 250);
    ctx.lineTo(lx - 53, 250);
    ctx.fill();
  });

  // 8. MAIN SERVICE BAR & PASTRY DISPLAY COUNTER
  // Counter Base
  ctx.fillStyle = '#3B2417';
  ctx.fillRect(180, 145, 340, 85);
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(175, 140, 350, 10); // Polished Oak Counter Edge

  // Espresso Machine & Coffee Grinder on Counter
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(195, 95, 38, 45); // Espresso machine body
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(199, 100, 30, 6);
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(206, 120, 8, 14); // Portafilter handle
  ctx.fillRect(218, 120, 8, 14);

  // Rising Espresso Steam
  const steamOffset = Math.floor((tick * 1.5) % 8);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(208 + Math.floor(Math.sin(tick * 0.1) * 2), 90 - steamOffset, 2, 4);

  // Pastry Glass Display Case (Matching Reference Image)
  ctx.fillStyle = '#2C1B12';
  ctx.fillRect(330, 150, 180, 75); // Wooden Frame Base
  ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
  ctx.fillRect(334, 153, 172, 69); // Glass Display Front
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(334, 185, 172, 3); // Glass Middle Shelf

  // Pastries: Golden Croissants & Shortcakes inside Glass Display
  for (let cx = 345; cx < 490; cx += 22) {
    ctx.fillStyle = '#E5A93C'; // Croissant
    ctx.beginPath();
    ctx.arc(cx + 6, 173, 7, 0, Math.PI);
    ctx.fill();
  }
  for (let bx = 345; bx < 490; bx += 28) {
    ctx.fillStyle = '#EF4444'; // Strawberry Shortcake
    ctx.fillRect(bx, 198, 18, 12);
    ctx.fillStyle = '#FFF';
    ctx.fillRect(bx, 196, 18, 3);
  }

  // 9. BARISTA GIRL NPC BEHIND COUNTER
  const baristaX = 270 + Math.sin(tick * 0.04) * 4;
  const baristaY = 125;
  ctx.fillStyle = '#3E2415';
  ctx.fillRect(baristaX - 10, baristaY + 10, 20, 25);
  ctx.fillStyle = '#FFF8DC';
  ctx.fillRect(baristaX - 6, baristaY + 10, 12, 8); // Apron
  ctx.fillStyle = '#FFE0BD';
  ctx.fillRect(baristaX - 8, baristaY - 6, 16, 16);
  ctx.fillStyle = '#6E492B';
  ctx.fillRect(baristaX - 10, baristaY - 10, 20, 12); // Hair
  ctx.fillStyle = '#1A1817';
  ctx.beginPath();
  ctx.ellipse(baristaX - 2, baristaY - 10, 14, 6, -0.2, 0, Math.PI * 2);
  ctx.fill(); // Beret

  // 10. ENHANCED SEATING TABLES & CHAIRS WITH CANDLELIGHT FEATURE (User Request)
  // Helper to draw round wooden coffee table + 4 chairs + flickering candle
  const drawCandleTable = (
    centerX: number,
    centerY: number,
    tableName: string
  ) => {
    // A. Floor Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 28, 44, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // B. Wooden Stools / Chairs surrounding Table (Top, Bottom, Left, Right)
    const chairPositions = [
      { x: centerX - 42, y: centerY }, // Left Chair
      { x: centerX + 42, y: centerY }, // Right Chair
      { x: centerX - 18, y: centerY + 26 }, // Bottom Left Chair
      { x: centerX + 18, y: centerY + 26 }, // Bottom Right Chair
    ];

    chairPositions.forEach((pos) => {
      // Chair Legs
      ctx.fillStyle = '#2C1B12';
      ctx.fillRect(pos.x - 7, pos.y + 6, 3, 14);
      ctx.fillRect(pos.x + 4, pos.y + 6, 3, 14);
      // Chair Seat Cushion
      ctx.fillStyle = '#6E4323';
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 4, 10, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8B5A2B';
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 2, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Curved Backrest for chairs
      ctx.fillStyle = '#4A2E1F';
      ctx.fillRect(pos.x - 8, pos.y - 10, 16, 4);
      ctx.fillRect(pos.x - 7, pos.y - 10, 3, 12);
      ctx.fillRect(pos.x + 4, pos.y - 10, 3, 12);
    });

    // C. Round Wooden Table Top
    // Pedestal Base Leg
    ctx.fillStyle = '#1F1510';
    ctx.fillRect(centerX - 4, centerY + 6, 8, 22);
    ctx.fillRect(centerX - 16, centerY + 24, 32, 5);
    // Table Top
    ctx.fillStyle = '#5A3825';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, 36, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8B5A2B';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 2, 33, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#A6703E';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 3, 30, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // D. Table Items: Coffee Mug & Plate
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(centerX - 16, centerY - 8, 8, 6); // Coffee Cup
    ctx.fillStyle = '#5A3825';
    ctx.fillRect(centerX - 15, centerY - 8, 6, 2); // Coffee Liquid

    // E. CANDLELIGHT FEATURE (Warm Flickering Candle & Soft Radial Aura)
    const candleX = centerX;
    const candleY = centerY - 6;

    // Brass Candle Holder Base
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(candleX - 5, candleY + 2, 10, 3);
    // White Candle Wax Body
    ctx.fillStyle = '#FFF8DC';
    ctx.fillRect(candleX - 3, candleY - 8, 6, 10);
    // Candle Wick
    ctx.fillStyle = '#1A1817';
    ctx.fillRect(candleX - 1, candleY - 11, 2, 3);

    // Flickering Flame Logic
    const flicker = Math.sin(tick * 0.18 + centerX) * 1.5;
    const flameSize = 4 + Math.cos(tick * 0.25) * 1.2;

    // Outer Orange Flame
    ctx.fillStyle = '#FF6B00';
    ctx.beginPath();
    ctx.arc(candleX + flicker * 0.3, candleY - 14, flameSize + 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner Yellow Flame
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(candleX + flicker * 0.3, candleY - 14, flameSize, 0, Math.PI * 2);
    ctx.fill();

    // Core White Hot Flame Spark
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(candleX + flicker * 0.3, candleY - 14, flameSize * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // RADIAL CANDLELIGHT AMBIENT GLOW AURA
    const glowRadius = 75 + Math.sin(tick * 0.12) * 6;
    const candleGlow = ctx.createRadialGradient(
      candleX,
      candleY - 14,
      4,
      candleX,
      candleY - 14,
      glowRadius
    );
    candleGlow.addColorStop(0, 'rgba(255, 200, 100, 0.45)');
    candleGlow.addColorStop(0.4, 'rgba(255, 170, 60, 0.22)');
    candleGlow.addColorStop(1, 'rgba(255, 150, 40, 0)');

    ctx.fillStyle = candleGlow;
    ctx.beginPath();
    ctx.arc(candleX, candleY - 14, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Floating Ember Sparkles rising from Candle
    const emberY = candleY - 16 - Math.floor((tick * 1.2 + centerX) % 16);
    ctx.fillStyle = 'rgba(255, 220, 120, 0.7)';
    ctx.fillRect(candleX - 2 + Math.sin(tick * 0.1) * 3, emberY, 2, 2);
  };

  // Render Seating Tables with Chairs & Candlelight Feature
  drawCandleTable(180, 420, 'Left Candle Table');
  drawCandleTable(760, 420, 'Right Candle Table');
  drawCandleTable(470, 460, 'Center Candle Table');

  // 11. EXIT DOOR INDICATOR TO TOWN
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(COFFEE_EXIT_DOOR.x, COFFEE_EXIT_DOOR.y, COFFEE_EXIT_DOOR.w, COFFEE_EXIT_DOOR.h);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('🚪 EXIT TO TOWN', COFFEE_EXIT_DOOR.x - 10, COFFEE_EXIT_DOOR.y - 8);

  // 12. CANDLELIGHT MODE DIM OVERLAY & ENHANCED FLICKERING GLOW
  if (isCandlelightActive) {
    // Reduce overall ambient light levels specifically within the Cafe room
    ctx.fillStyle = 'rgba(12, 6, 2, 0.52)';
    ctx.fillRect(80, 0, MAP_WIDTH - 160, MAP_HEIGHT - 60);

    // Render large glowing candlelight radial halos & floating ember sparkles over seating tables
    const candleTables = [{ x: 180, y: 414 }, { x: 760, y: 414 }, { x: 470, y: 454 }];
    candleTables.forEach((table) => {
      const flickerRadius = 135 + Math.sin(tick * 0.15 + table.x) * 12;
      const radialGlow = ctx.createRadialGradient(
        table.x,
        table.y,
        6,
        table.x,
        table.y,
        flickerRadius
      );
      radialGlow.addColorStop(0, 'rgba(255, 210, 100, 0.75)');
      radialGlow.addColorStop(0.35, 'rgba(255, 160, 50, 0.40)');
      radialGlow.addColorStop(0.7, 'rgba(255, 120, 30, 0.15)');
      radialGlow.addColorStop(1, 'rgba(255, 100, 20, 0)');

      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(table.x, table.y, flickerRadius, 0, Math.PI * 2);
      ctx.fill();

      // Floating Candle Embers
      for (let i = 0; i < 4; i++) {
        const sparkX = table.x + Math.sin(tick * 0.1 + i * 2) * 24;
        const sparkY = table.y - 12 - ((tick * 1.5 + i * 15) % 45);
        const alpha = 1 - ((tick * 1.5 + i * 15) % 45) / 45;
        ctx.fillStyle = `rgba(255, 220, 130, ${alpha})`;
        ctx.fillRect(sparkX, sparkY, 2, 2);
      }
    });

    // Candlelight Mood Tag in upper corner
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(90, 10, 175, 24);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'extrabold 10px sans-serif';
    ctx.fillText('🕯️ Candlelight Mode Active', 100, 26);
  }

  ctx.restore();
}

// Small helper for A-frame sign placement
function xSign(val: number) { return val; }



// ----------------------------------------------------
// SHOPPING MALL & BOUTIQUE MAP DRAWING
// ----------------------------------------------------
export function drawShoppingMallMap(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Dark boundary
  ctx.fillStyle = '#2A1820';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // Checkerboard Pastel Marble Floor
  for (let x = 60; x < MAP_WIDTH - 60; x += 32) {
    for (let y = 80; y < MAP_HEIGHT - 60; y += 32) {
      const isAlt = ((x / 32) + (y / 32)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#FFF0F5' : '#F8D7DA';
      ctx.fillRect(x, y, 32, 32);
    }
  }

  // Back Wall
  ctx.fillStyle = '#4A2A38';
  ctx.fillRect(60, 0, MAP_WIDTH - 120, 80);
  ctx.fillStyle = '#81415D';
  ctx.fillRect(60, 72, MAP_WIDTH - 120, 8);

  // Store Header Sign
  ctx.fillStyle = '#FFD1DC';
  ctx.fillRect(320, 15, 320, 45);
  ctx.fillStyle = '#8B263E';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🛍️ MEOW BOUTIQUE & DATE MALL', MAP_WIDTH / 2, 42);
  ctx.textAlign = 'left';

  // Clothing Racks (Left & Right Racks)
  // Left Rack (Dresses & Jackets)
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(120, 110, 220, 8);
  ctx.fillRect(130, 118, 6, 45);
  ctx.fillRect(320, 118, 6, 45);
  // Clothes on Left Rack
  const dressColors = ['#FF69B4', '#3B82F6', '#10B981', '#9333EA', '#EF4444'];
  dressColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(145 + idx * 36, 118, 24, 38);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(151 + idx * 36, 120, 12, 4); // Hanger line
  });

  // Right Rack (Suits, Vests & Overalls)
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(620, 110, 220, 8);
  ctx.fillRect(630, 118, 6, 45);
  ctx.fillRect(820, 118, 6, 45);
  const suitColors = ['#1E293B', '#334155', '#D97706', '#475569', '#1E3A8A'];
  suitColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(645 + idx * 36, 118, 24, 38);
  });

  // Full Length Mirrors with Golden Frame
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(80, 100, 32, 90);
  ctx.fillStyle = '#E0F2FE';
  ctx.fillRect(84, 104, 24, 82);
  // Glass reflection highlight
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(92, 110, 4, 70);

  ctx.fillStyle = '#FFD700';
  ctx.fillRect(840, 100, 32, 90);
  ctx.fillStyle = '#E0F2FE';
  ctx.fillRect(844, 104, 24, 82);

  // Center Fashion Display Pedestal with Plushies & Date Accessories
  ctx.fillStyle = '#8B263E';
  ctx.fillRect(350, 290, 260, 60);
  ctx.fillStyle = '#FFD1DC';
  ctx.fillRect(345, 285, 270, 10);

  // Perfume Bottles & Gift Boxes on Display
  ctx.fillStyle = '#FF4500';
  ctx.fillRect(380, 260, 24, 25);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(390, 255, 4, 5);

  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(440, 255, 30, 30);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(453, 255, 4, 30); // Ribbon

  ctx.fillStyle = '#10B981';
  ctx.fillRect(510, 262, 22, 23);

  // Heart Rug in Date Mall
  ctx.fillStyle = 'rgba(255, 105, 180, 0.3)';
  ctx.beginPath();
  ctx.arc(MAP_WIDTH / 2, 480, 80, 0, Math.PI * 2);
  ctx.fill();

  // Exit Door Indicator
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(COMMON_EXIT_DOOR.x, COMMON_EXIT_DOOR.y, COMMON_EXIT_DOOR.w, COMMON_EXIT_DOOR.h);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('🚪 EXIT TO TOWN', COMMON_EXIT_DOOR.x - 10, COMMON_EXIT_DOOR.y - 8);

  ctx.restore();
}

// ----------------------------------------------------
// MOVIE THEATER & SYNCHRONIZED CINEMA DRAWING
// ----------------------------------------------------
export function drawMovieTheaterMap(
  ctx: CanvasRenderingContext2D,
  tick: number,
  cinemaTitle: string = 'Lofi Beats / Live YouTube',
  isPlaying: boolean = true
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // Cinema Dark Ambiance
  ctx.fillStyle = '#0B0712';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // Deep Burgundy Velvet Floor
  ctx.fillStyle = '#2A0812';
  ctx.fillRect(80, 170, MAP_WIDTH - 160, MAP_HEIGHT - 230);

  // Red Carpet Center Aisle
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(MAP_WIDTH / 2 - 40, 170, 80, MAP_HEIGHT - 230);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(MAP_WIDTH / 2 - 42, 170, 2, MAP_HEIGHT - 230);
  ctx.fillRect(MAP_WIDTH / 2 + 40, 170, 2, MAP_HEIGHT - 230);

  // 🎬 GIANT MOVIE THEATER SCREEN AT TOP
  const screenX = 160;
  const screenY = 20;
  const screenW = 640;
  const screenH = 150;

  // Screen Frame
  ctx.fillStyle = '#1A1126';
  ctx.fillRect(screenX - 10, screenY - 10, screenW + 20, screenH + 20);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(screenX - 12, screenY - 12, screenW + 24, 4);

  // Screen Glowing Canvas Base
  ctx.fillStyle = '#050B1A';
  ctx.fillRect(screenX, screenY, screenW, screenH);

  // Simulated Animated Movie Visualizer on Screen
  if (isPlaying) {
    // Dynamic synth wave / movie scene bars
    const t = tick * 0.08;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.25)';
    ctx.fillRect(screenX, screenY, screenW, screenH);

    ctx.fillStyle = '#60A5FA';
    for (let i = 0; i < 20; i++) {
      const bh = 20 + Math.sin(t + i * 0.5) * 40 + Math.cos(t * 1.5 + i) * 20;
      ctx.fillRect(screenX + 30 + i * 29, screenY + screenH - bh - 20, 18, bh);
    }

    // Movie Title Badge on screen
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(screenX + 20, screenY + 15, screenW - 40, 32);
    ctx.fillStyle = '#FFE066';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`🎬 NOW PLAYING: ${cinemaTitle}`, screenX + 35, screenY + 36);
  } else {
    ctx.fillStyle = '#FF4500';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('⏸️ PAUSED - TAP SCREEN TO SYNC PLAY', screenX + 160, screenY + 80);
  }

  // Interactive Cinema Prompt Box below Screen
  ctx.fillStyle = '#E11D48';
  ctx.fillRect(screenX + 120, screenY + screenH - 24, screenW - 240, 20);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🍿 TAP CINEMA SCREEN TO WATCH YOUTUBE TOGETHER!', screenX + screenW / 2, screenY + screenH - 10);
  ctx.textAlign = 'left';

  // 🍿 Popcorn & Soda Concession Stand at Left
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(90, 190, 140, 45);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('🍿 POPCORN & BOBA', 100, 215);

  // Red Plush Cinema Seats (Rows 1 to 3)
  const rowYPositions = [260, 360, 460];
  rowYPositions.forEach((ry, rIdx) => {
    // Left Block Seats
    for (let sx = 100; sx <= 340; sx += 60) {
      drawCinemaSeat(ctx, sx, ry, rIdx);
    }
    // Right Block Seats
    for (let sx = 560; sx <= 800; sx += 60) {
      drawCinemaSeat(ctx, sx, ry, rIdx);
    }
  });

  // Soft Wall Sconces Ambient Light
  for (let ly = 200; ly < 580; ly += 120) {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(66, ly, 8, 16);
    ctx.fillRect(MAP_WIDTH - 74, ly, 8, 16);
  }

  // Exit Door Indicator
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(COMMON_EXIT_DOOR.x, COMMON_EXIT_DOOR.y, COMMON_EXIT_DOOR.w, COMMON_EXIT_DOOR.h);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('🚪 EXIT TO TOWN', COMMON_EXIT_DOOR.x - 10, COMMON_EXIT_DOOR.y - 8);

  ctx.restore();
}

function drawCinemaSeat(ctx: CanvasRenderingContext2D, x: number, y: number, rowIdx: number) {
  // Seat Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(x, y + 30, 42, 10);

  // Seat Backrest
  ctx.fillStyle = '#991B1B';
  ctx.fillRect(x, y, 42, 24);
  ctx.fillStyle = '#DC2626';
  ctx.fillRect(x + 2, y + 2, 38, 20);

  // Cushion
  ctx.fillStyle = '#7F1D1D';
  ctx.fillRect(x - 2, y + 22, 46, 12);

  // Cup Holder Armrests
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(x - 4, y + 16, 6, 16);
  ctx.fillRect(x + 40, y + 16, 6, 16);
  ctx.fillStyle = '#0284C7';
  ctx.fillRect(x + 41, y + 18, 4, 4); // Soda cup top
}

// Helper: Draw Custom Cozy Autumn Cottage Exterior (Matching Reference Images)
export function drawCozyAutumnCottageExterior(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  weather: WeatherType = 'clear',
  tick: number = 0
) {
  // Shadow beneath fence & yard
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(x - 12, y + 175, 240, 15);

  // 1. DYNAMIC WEATHER CHERRY BLOSSOM TREES BEHIND HOUSE
  let blossomMain = '#F472B6'; // Sunny / Clear: Soft Pink
  let blossomDark = '#DB2777';
  let blossomLight = '#FCE7F3';
  let petalColor = '#FB7185';

  if (weather === 'snow') {
    // Snowy Winter: White & Ice Snow
    blossomMain = '#E2E8F0';
    blossomDark = '#94A3B8';
    blossomLight = '#FFFFFF';
    petalColor = '#F8FAFC';
  } else if (weather === 'rain') {
    // Rainy Summer: Fresh Lush Green
    blossomMain = '#22C55E';
    blossomDark = '#15803D';
    blossomLight = '#86EFAC';
    petalColor = '#4ADE80';
  } else if (weather === 'leaves') {
    // Autumn: Warm Amber & Golden Brown
    blossomMain = '#D97706';
    blossomDark = '#92400E';
    blossomLight = '#FDE047';
    petalColor = '#EA580C';
  } else if (weather === 'cherry_blossom') {
    // Spring Blooming: Vibrant Cherry Pink & Magentas
    blossomMain = '#EC4899';
    blossomDark = '#BE185D';
    blossomLight = '#FDF2F8';
    petalColor = '#F472B6';
  }

  // Function to draw a rich Pixel Art Cherry Blossom Tree
  const drawSakuraTree = (tx: number, ty: number, scale: number = 1) => {
    // Trunk & Branches
    ctx.fillStyle = '#523A28';
    ctx.fillRect(tx - 4 * scale, ty - 20 * scale, 8 * scale, 35 * scale);
    ctx.fillRect(tx - 12 * scale, ty - 32 * scale, 12 * scale, 6 * scale);
    ctx.fillRect(tx + 2 * scale, ty - 38 * scale, 10 * scale, 6 * scale);

    // Fluffy Blossom Canopy
    ctx.fillStyle = blossomMain;
    ctx.beginPath();
    ctx.arc(tx, ty - 35 * scale, 24 * scale, 0, Math.PI * 2);
    ctx.arc(tx - 16 * scale, ty - 28 * scale, 18 * scale, 0, Math.PI * 2);
    ctx.arc(tx + 16 * scale, ty - 28 * scale, 18 * scale, 0, Math.PI * 2);
    ctx.arc(tx - 10 * scale, ty - 45 * scale, 16 * scale, 0, Math.PI * 2);
    ctx.arc(tx + 10 * scale, ty - 45 * scale, 16 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Shadow & Highlight Puff Layers
    ctx.fillStyle = blossomDark;
    ctx.beginPath();
    ctx.arc(tx - 8 * scale, ty - 22 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.arc(tx + 12 * scale, ty - 22 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = blossomLight;
    ctx.beginPath();
    ctx.arc(tx - 6 * scale, ty - 44 * scale, 10 * scale, 0, Math.PI * 2);
    ctx.arc(tx + 8 * scale, ty - 42 * scale, 9 * scale, 0, Math.PI * 2);
    ctx.arc(tx, ty - 50 * scale, 11 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Dynamic Floating Petals
    ctx.fillStyle = petalColor;
    const offset = Math.sin(tick * 0.05 + tx) * 6;
    ctx.fillRect(tx - 22 + offset, ty - 15 + offset, 3, 3);
    ctx.fillRect(tx + 18 - offset, ty - 8 + offset, 4, 3);
    ctx.fillRect(tx + 28, ty + 10 + offset, 3, 2);
  };

  // Draw two Cherry Blossom Trees behind house
  drawSakuraTree(x + 10, y - 5, 0.9);
  drawSakuraTree(x + 165, y - 10, 1.0);

  // AVOCADO TREE (Behind House - Center/Right)
  const drawAvocadoTree = (ax: number, ay: number) => {
    // Trunk
    ctx.fillStyle = '#452209';
    ctx.fillRect(ax - 5, ay - 15, 10, 25);
    ctx.fillStyle = '#2C1505';
    ctx.fillRect(ax - 5, ay - 15, 3, 25);
    // Dark Emerald Foliage Canopy
    ctx.fillStyle = weather === 'snow' ? '#1E3A2B' : weather === 'cherry_blossom' ? '#16A34A' : '#14532D';
    ctx.beginPath();
    ctx.arc(ax, ay - 30, 20, 0, Math.PI * 2);
    ctx.arc(ax - 12, ay - 24, 15, 0, Math.PI * 2);
    ctx.arc(ax + 12, ay - 24, 15, 0, Math.PI * 2);
    ctx.arc(ax, ay - 40, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = weather === 'snow' ? '#2D523E' : weather === 'cherry_blossom' ? '#22C55E' : '#166534';
    ctx.beginPath();
    ctx.arc(ax - 5, ay - 32, 12, 0, Math.PI * 2);
    ctx.arc(ax + 8, ay - 28, 10, 0, Math.PI * 2);
    ctx.fill();

    // Snow cap on Avocado tree
    if (weather === 'snow') {
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.ellipse(ax, ay - 48, 14, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(ax - 12, ay - 32, 10, 4, 0, 0, Math.PI * 2);
      ctx.ellipse(ax + 12, ay - 32, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (weather === 'cherry_blossom') {
      // White/yellow flowers on Avocado Tree in Spring
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(ax - 10, ay - 38, 3, 3);
      ctx.fillRect(ax + 8, ay - 35, 3, 3);
      ctx.fillRect(ax, ay - 22, 3, 3);
    }

    // Hanging Avocados
    const avocadoLocs = [
      { x: ax - 14, y: ay - 22 },
      { x: ax + 10, y: ay - 20 },
      { x: ax - 4, y: ay - 32 },
      { x: ax + 12, y: ay - 30 },
      { x: ax - 8, y: ay - 16 },
    ];
    avocadoLocs.forEach((loc, idx) => {
      if (idx === 0) {
        ctx.fillStyle = '#15803D';
        ctx.beginPath();
        ctx.ellipse(loc.x, loc.y, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#A3E635';
        ctx.beginPath();
        ctx.ellipse(loc.x, loc.y, 3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.arc(loc.x, loc.y + 1, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#064E3B';
        ctx.beginPath();
        ctx.ellipse(loc.x, loc.y, 3.5, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#84CC16';
        ctx.fillRect(loc.x - 1, loc.y - 2, 1.5, 2);
      }
    });
  };
  drawAvocadoTree(x + 95, y - 8);

  // 2. Main Cottage House Siding Body
  ctx.fillStyle = '#FAF8F5'; // Clean white siding
  ctx.fillRect(x + 25, y + 25, 135, 80);
  // Horizontal siding plank texture lines
  ctx.fillStyle = '#E2DEDA';
  for (let sy = y + 30; sy < y + 105; sy += 8) {
    ctx.fillRect(x + 25, sy, 135, 1);
  }

  // 3. Main Gable Roof (Terracotta / Reddish-Brown)
  ctx.fillStyle = '#A3431D';
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 25);
  ctx.lineTo(x + 92, y - 20);
  ctx.lineTo(x + 170, y + 25);
  ctx.fill();

  // Roof Shading / Shingle Highlights
  ctx.fillStyle = '#C2410C';
  ctx.beginPath();
  ctx.moveTo(x + 92, y - 20);
  ctx.lineTo(x + 170, y + 25);
  ctx.lineTo(x + 160, y + 25);
  ctx.lineTo(x + 92, y - 12);
  ctx.fill();

  // White Roof Eaves & Trim
  ctx.fillStyle = '#FAF8F5';
  ctx.beginPath();
  ctx.moveTo(x + 10, y + 27);
  ctx.lineTo(x + 92, y - 23);
  ctx.lineTo(x + 175, y + 27);
  ctx.lineTo(x + 170, y + 23);
  ctx.lineTo(x + 92, y - 18);
  ctx.lineTo(x + 15, y + 23);
  ctx.fill();

  // SNOW LAYER ON ROOF (for Winter Weather)
  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 23);
    ctx.lineTo(x + 92, y - 25);
    ctx.lineTo(x + 177, y + 23);
    ctx.lineTo(x + 170, y + 27);
    ctx.lineTo(x + 92, y - 18);
    ctx.lineTo(x + 15, y + 27);
    ctx.fill();

    // Icicles hanging off eaves
    ctx.fillStyle = '#E0F2FE';
    for (let ix = x + 18; ix < x + 165; ix += 12) {
      const icicleLen = 4 + (ix % 7);
      ctx.beginPath();
      ctx.moveTo(ix, y + 27);
      ctx.lineTo(ix + 2, y + 27 + icicleLen);
      ctx.lineTo(ix + 4, y + 27);
      ctx.fill();
    }
  } else if (weather === 'cherry_blossom') {
    // Sakura petals resting on roof
    ctx.fillStyle = '#FCE7F3';
    ctx.fillRect(x + 40, y + 10, 4, 3);
    ctx.fillRect(x + 85, y - 12, 5, 3);
    ctx.fillRect(x + 130, y + 8, 4, 3);
  }

  // Square Attic Window in Gable
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 82, y - 2, 20, 18);
  ctx.fillStyle = '#4A6572';
  ctx.fillRect(x + 84, y, 16, 14);
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(x + 91, y, 2, 14);
  ctx.fillRect(x + 84, y + 6, 16, 2);

  // Snow cap on attic window
  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 80, y - 4, 24, 3);
  }

  // 4. Right Bay Window (Hexagonal Projection with Bay Roof)
  ctx.fillStyle = '#A3431D';
  ctx.beginPath();
  ctx.moveTo(x + 150, y + 55);
  ctx.lineTo(x + 170, y + 42);
  ctx.lineTo(x + 195, y + 55);
  ctx.fill();

  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(x + 148, y + 55);
    ctx.lineTo(x + 170, y + 40);
    ctx.lineTo(x + 197, y + 55);
    ctx.lineTo(x + 195, y + 57);
    ctx.lineTo(x + 170, y + 44);
    ctx.lineTo(x + 150, y + 57);
    ctx.fill();
  }

  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(x + 152, y + 55, 40, 45);
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + 156, y + 60, 32, 32);
  ctx.fillStyle = '#4A6572';
  ctx.fillRect(x + 158, y + 62, 28, 28);
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(x + 171, y + 62, 2, 28);
  ctx.fillRect(x + 158, y + 75, 28, 2);

  // 5. Front Porch with Steps & Door
  ctx.fillStyle = '#A3431D';
  ctx.fillRect(x + 28, y + 48, 75, 6);
  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + 26, y + 46, 79, 3);
  }

  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(x + 30, y + 54, 4, 38);
  ctx.fillRect(x + 97, y + 54, 4, 38);
  ctx.fillStyle = '#E2DEDA';
  ctx.fillRect(x + 30, y + 76, 70, 3);
  for (let rx = x + 34; rx < x + 96; rx += 6) {
    ctx.fillRect(rx, y + 79, 2, 13);
  }

  // Wooden Front Door with Wreath
  ctx.fillStyle = '#5C3A21';
  ctx.fillRect(x + 55, y + 58, 22, 34);
  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(x + 72, y + 74, 3, 3);
  ctx.fillStyle = weather === 'snow' ? '#15803D' : '#C2410C';
  ctx.beginPath();
  ctx.arc(x + 66, y + 68, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5C3A21';
  ctx.beginPath();
  ctx.arc(x + 66, y + 68, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = weather === 'snow' ? '#EF4444' : '#F59E0B';
  ctx.fillRect(x + 65, y + 65, 2, 2);

  // Porch Steps
  ctx.fillStyle = '#E2C799';
  ctx.fillRect(x + 50, y + 92, 32, 5);
  ctx.fillRect(x + 46, y + 97, 40, 5);
  ctx.fillRect(x + 42, y + 102, 48, 6);

  if (weather === 'snow') {
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(x + 52, y + 92, 28, 2);
    ctx.fillRect(x + 48, y + 97, 36, 2);
    ctx.fillRect(x + 44, y + 102, 44, 2);
  }

  // 6. Courtyard Green Lawn & Entry Path (DYNAMIC GROUND BY WEATHER)
  let grassColor = '#5B8C3E';
  let pathColor = '#E2C799';

  if (weather === 'snow') {
    grassColor = '#E2E8F0'; // Soft Snowy Lawn
    pathColor = '#F1F5F9';
  } else if (weather === 'cherry_blossom') {
    grassColor = '#22C55E'; // Spring Fresh Blooming Grass
    pathColor = '#FDE68A';
  } else if (weather === 'rain') {
    grassColor = '#15803D'; // Deep Wet Emerald Grass
    pathColor = '#D97706';
  } else if (weather === 'leaves') {
    grassColor = '#B45309'; // Golden Autumn Lawn
    pathColor = '#D97706';
  }

  ctx.fillStyle = grassColor;
  ctx.fillRect(x - 7, y + 108, 235, 62);
  ctx.fillStyle = pathColor;
  ctx.fillRect(x + 52, y + 108, 40, 62);

  // Snow Drifts or Spring Petals on Ground
  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(x + 20, y + 130, 25, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 180, y + 125, 30, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 140, y + 155, 35, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (weather === 'cherry_blossom') {
    ctx.fillStyle = '#FCE7F3'; // Scattered Spring Petals on Lawn
    const petalLocs = [
      { px: x + 12, py: y + 118 },
      { px: x + 35, py: y + 140 },
      { px: x + 60, py: y + 125 },
      { px: x + 110, py: y + 145 },
      { px: x + 145, py: y + 120 },
      { px: x + 185, py: y + 150 },
      { px: x + 205, py: y + 128 },
    ];
    petalLocs.forEach(({ px, py }) => {
      ctx.fillRect(px, py, 4, 3);
      ctx.fillRect(px + 2, py + 1, 3, 2);
    });
  } else if (weather === 'rain') {
    // Rain Puddles
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.ellipse(x + 25, y + 135, 12, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 175, y + 140, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. GARDEN SWING (DOLNA) ON LEFT GROUND
  const swingX = x - 5;
  const swingY = y + 112;
  const swingAngle = Math.sin(tick * 0.04) * 3;

  // A-frame Wooden Side Supports
  ctx.fillStyle = '#5C3A21';
  ctx.beginPath();
  ctx.moveTo(swingX - 12, swingY + 45);
  ctx.lineTo(swingX - 4, swingY);
  ctx.lineTo(swingX, swingY);
  ctx.lineTo(swingX - 4, swingY + 45);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(swingX + 32, swingY + 45);
  ctx.lineTo(swingX + 40, swingY);
  ctx.lineTo(swingX + 44, swingY);
  ctx.lineTo(swingX + 48, swingY + 45);
  ctx.fill();

  // Top Wooden Crossbar wrapped in Vines & Flowers
  ctx.fillStyle = '#D97706';
  ctx.fillRect(swingX - 8, swingY, 56, 5);
  ctx.fillStyle = weather === 'snow' ? '#94A3B8' : '#15803D'; // Vine leaves
  for (let vx = swingX - 6; vx < swingX + 46; vx += 8) {
    ctx.fillRect(vx, swingY - 2, 5, 4);
    ctx.fillRect(vx + 3, swingY + 3, 4, 3);
  }
  ctx.fillStyle = weather === 'snow' ? '#FFFFFF' : weather === 'cherry_blossom' ? '#F472B6' : '#EC4899';
  ctx.fillRect(swingX - 4, swingY - 1, 4, 4);
  ctx.fillRect(swingX + 16, swingY - 2, 4, 4);
  ctx.fillRect(swingX + 36, swingY + 2, 4, 4);

  // Snow cap on swing top
  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(swingX - 10, swingY - 3, 60, 3);
  }

  // Hanging Swing Ropes/Chains & Wooden Bench Seat (Swinging)
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(swingX + 4, swingY + 5);
  ctx.lineTo(swingX + 4 + swingAngle, swingY + 32);
  ctx.moveTo(swingX + 36, swingY + 5);
  ctx.lineTo(swingX + 36 + swingAngle, swingY + 32);
  ctx.stroke();

  // Wooden Bench Seat & Cushions
  const benchX = swingX + 2 + swingAngle;
  const benchY = swingY + 32;
  ctx.fillStyle = '#B45309';
  ctx.fillRect(benchX, benchY, 36, 6);
  ctx.fillStyle = '#38BDF8'; // Blue Cushion
  ctx.fillRect(benchX + 3, benchY - 4, 12, 5);
  ctx.fillStyle = '#F97316'; // Orange Cushion
  ctx.fillRect(benchX + 20, benchY - 4, 12, 5);

  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(benchX, benchY - 2, 36, 2);
  }

  // Flower bed underneath the swing
  ctx.fillStyle = weather === 'snow' ? '#E2E8F0' : '#E11D48';
  ctx.fillRect(swingX - 10, swingY + 42, 6, 5);
  ctx.fillRect(swingX + 38, swingY + 42, 6, 5);
  ctx.fillStyle = weather === 'snow' ? '#CBD5E1' : '#A855F7';
  ctx.fillRect(swingX - 4, swingY + 43, 5, 4);

  // 8. FARM HOUSE IN THE RIGHT CORNER
  const farmX = x + 165;
  const farmY = y + 105;

  // Mini Farmhouse / Barn Shed Body
  ctx.fillStyle = '#991B1B'; // Red Barn Wall
  ctx.fillRect(farmX, farmY, 48, 38);
  ctx.fillStyle = '#7C2D12'; // Pitched Roof
  ctx.beginPath();
  ctx.moveTo(farmX - 4, farmY);
  ctx.lineTo(farmX + 24, farmY - 18);
  ctx.lineTo(farmX + 52, farmY);
  ctx.fill();

  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(farmX - 6, farmY);
    ctx.lineTo(farmX + 24, farmY - 21);
    ctx.lineTo(farmX + 54, farmY);
    ctx.lineTo(farmX + 52, farmY + 2);
    ctx.lineTo(farmX + 24, farmY - 17);
    ctx.lineTo(farmX - 4, farmY + 2);
    ctx.fill();
  }

  // White Barn Door & Trim
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(farmX + 16, farmY + 14, 16, 24);
  ctx.fillStyle = '#991B1B';
  ctx.fillRect(farmX + 18, farmY + 16, 12, 22);
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(farmX + 18, farmY + 22, 12, 2);

  // Stacked Hay Bales & Crop Patch in Front
  ctx.fillStyle = '#FACC15'; // Hay Bale
  ctx.fillRect(farmX - 12, farmY + 20, 10, 14);
  ctx.fillStyle = '#EAB308';
  ctx.fillRect(farmX - 12, farmY + 25, 10, 2);

  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(farmX - 13, farmY + 18, 12, 3);
  }

  // Dark Tilled Soil Patch with Crops
  ctx.fillStyle = weather === 'snow' ? '#331B10' : '#451A03';
  ctx.fillRect(farmX - 14, farmY + 36, 62, 22);

  // Row 1: Orange Carrots with Green Tops
  for (let cx = farmX - 10; cx <= farmX + 40; cx += 10) {
    ctx.fillStyle = weather === 'snow' ? '#E2E8F0' : '#15803D';
    ctx.fillRect(cx, farmY + 38, 3, 3);
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(cx + 1, farmY + 41, 2, 3);
  }
  // Row 2: Red Strawberries & Golden Pumpkins
  for (let cx = farmX - 10; cx <= farmX + 40; cx += 12) {
    ctx.fillStyle = cx % 24 === 0 ? '#F59E0B' : '#EF4444';
    ctx.beginPath();
    ctx.arc(cx + 2, farmY + 50, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (weather === 'snow') {
    ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
    ctx.fillRect(farmX - 12, farmY + 37, 58, 20);
  }

  // 9. WHITE PICKET FENCE & GATE SURROUNDING YARD
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(x - 10, y + 35, 30, 3);
  ctx.fillRect(x + 195, y + 35, 25, 3);
  ctx.fillRect(x - 10, y + 35, 3, 140);
  ctx.fillRect(x + 222, y + 35, 3, 140);
  ctx.fillRect(x - 10, y + 172, 60, 3);
  ctx.fillRect(x + 115, y + 172, 110, 3);

  // Vertical White Pickets
  for (let px = x - 10; px <= x + 222; px += 8) {
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(px, y + 165, 4, 12);
    ctx.fillRect(px + 1, y + 163, 2, 2);
    ctx.fillStyle = '#E2DEDA';
    ctx.fillRect(px + 3, y + 165, 1, 12);

    // Snow caps on pickets
    if (weather === 'snow') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px - 1, y + 161, 6, 3);
    }
  }

  // 10. FRONT ENTRANCE BANNER BOARD: "MeowMius Palace"
  const archX = x + 32;
  const archY = y + 152;

  // Sturdy Wooden Arch Posts
  ctx.fillStyle = '#5C3A21';
  ctx.fillRect(archX, archY, 6, 22);
  ctx.fillRect(archX + 68, archY, 6, 22);

  // Arch Top Beam wrapped in Vines
  ctx.fillStyle = '#78350F';
  ctx.fillRect(archX - 4, archY - 2, 82, 6);
  ctx.fillStyle = weather === 'snow' ? '#CBD5E1' : '#16A34A'; // Ivy vines on arch
  for (let vx = archX - 2; vx < archX + 76; vx += 6) {
    ctx.fillRect(vx, archY - 4, 4, 4);
    ctx.fillRect(vx + 2, archY + 3, 3, 3);
  }

  if (weather === 'snow') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(archX - 6, archY - 5, 86, 3);
  } else if (weather === 'cherry_blossom') {
    // Pink roses on arch in spring
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(archX + 4, archY - 5, 4, 4);
    ctx.fillRect(archX + 35, archY - 5, 4, 4);
    ctx.fillRect(archX + 65, archY - 5, 4, 4);
  }

  // Hanging Wooden Sign Board with "MeowMius Palace" Banner
  ctx.fillStyle = '#94A3B8'; // Hanging Brass Chains
  ctx.fillRect(archX + 12, archY + 4, 2, 6);
  ctx.fillRect(archX + 60, archY + 4, 2, 6);

  // Wooden Banner Sign
  ctx.fillStyle = '#78350F'; // Outer Dark Border
  ctx.fillRect(archX + 6, archY + 8, 62, 18);
  ctx.fillStyle = '#FEF3C7'; // Warm Cream Wooden Board Background
  ctx.fillRect(archX + 8, archY + 10, 58, 14);

  // Text: "MeowMius Palace"
  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MeowMius Palace', archX + 37, archY + 20);
  ctx.textAlign = 'left';

  // Cute Little Crown / Paw Marker on Sign
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(archX + 10, archY + 12, 3, 3);
  ctx.fillRect(archX + 61, archY + 12, 3, 3);

  // Warm Glowing Lanterns on Archway
  ctx.fillStyle = '#FBBF24';
  ctx.fillRect(archX - 2, archY + 10, 4, 6);
  ctx.fillRect(archX + 72, archY + 10, 4, 6);

  // 11. ABUNDANT FLOWER GARDENS (PEACE LILIES, ROSES, TULIPS, FRUIT BUSHES)
  // Helper: Draw Peace Lily Cluster
  const drawPeaceLilyCluster = (plx: number, ply: number) => {
    // Dark Glossy Emerald Leaves
    ctx.fillStyle = weather === 'snow' ? '#1E3A2B' : '#14532D';
    ctx.beginPath();
    ctx.ellipse(plx, ply + 2, 7, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(plx - 5, ply + 3, 5, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(plx + 5, ply + 3, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Spathe Flowers with Yellow Spadix
    const flowers = [{ x: plx - 3, y: ply - 4 }, { x: plx + 2, y: ply - 6 }, { x: plx + 5, y: ply - 2 }];
    flowers.forEach((fl) => {
      ctx.fillStyle = weather === 'snow' ? '#E2E8F0' : '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(fl.x, fl.y, 2.5, 4, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FDE047'; // Yellow Spadix center
      ctx.fillRect(fl.x - 0.5, fl.y - 2, 1, 3);
    });

    if (weather === 'snow') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(plx - 4, ply - 8, 3, 2);
      ctx.fillRect(plx + 1, ply - 9, 3, 2);
    } else if (weather === 'cherry_blossom') {
      // Sparkling spring pollen aura
      ctx.fillStyle = '#FEF08A';
      const offset = Math.sin(tick * 0.1 + plx) * 2;
      ctx.fillRect(plx - 5, ply - 10 + offset, 2, 2);
      ctx.fillRect(plx + 6, ply - 8 - offset, 2, 2);
    }
  };

  // Helper: Draw Rose Cluster
  const drawRoseCluster = (rx: number, ry: number, color: string = '#E11D48') => {
    // Leaves
    ctx.fillStyle = weather === 'snow' ? '#1E3A2B' : '#15803D';
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.fill();

    // Rose Petals
    let roseColor = color;
    if (weather === 'cherry_blossom') {
      roseColor = color === '#E11D48' ? '#FF2D55' : color === '#F472B6' ? '#FF69B4' : '#FFFFFF';
    }
    ctx.fillStyle = roseColor;
    ctx.beginPath();
    ctx.arc(rx - 2, ry - 2, 3, 0, Math.PI * 2);
    ctx.arc(rx + 2, ry - 1, 2.5, 0, Math.PI * 2);
    ctx.arc(rx, ry + 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(rx - 1, ry - 3, 1, 1);

    if (weather === 'snow') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(rx, ry - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Helper: Draw Tulip Bed
  const drawTulipBed = (tx: number, ty: number) => {
    const tulipColors =
      weather === 'cherry_blossom'
        ? ['#FF2D55', '#FFD700', '#A855F7', '#FF69B4']
        : ['#EF4444', '#FACC15', '#A855F7', '#F97316'];
    for (let i = 0; i < 4; i++) {
      const offsetX = i * 6;
      ctx.fillStyle = weather === 'snow' ? '#1E3A2B' : '#16A34A'; // Stems
      ctx.fillRect(tx + offsetX, ty - 4, 1.5, 6);
      ctx.fillStyle = tulipColors[i % tulipColors.length]; // Cup flower
      ctx.fillRect(tx + offsetX - 1.5, ty - 7, 4, 4);
      ctx.fillRect(tx + offsetX - 0.5, ty - 8, 2, 1);

      if (weather === 'snow') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(tx + offsetX - 1.5, ty - 9, 4, 2);
      }
    }
  };

  // Helper: Draw Fruit Bush (Lemons / Oranges / Berries)
  const drawFruitBush = (bx: number, by: number, fruitColor: string = '#FACC15') => {
    ctx.fillStyle = weather === 'snow' ? '#1E3A2B' : '#15803D';
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.arc(bx - 5, by + 2, 6, 0, Math.PI * 2);
    ctx.arc(bx + 5, by + 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Hanging Fruits
    ctx.fillStyle = fruitColor;
    ctx.beginPath();
    ctx.arc(bx - 3, by - 2, 2.5, 0, Math.PI * 2);
    ctx.arc(bx + 4, by + 1, 2.5, 0, Math.PI * 2);
    ctx.arc(bx - 1, by + 4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (weather === 'snow') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bx, by - 6, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // A. Front Porch & Entrance Flowers
  drawPeaceLilyCluster(x + 28, y + 104);
  drawPeaceLilyCluster(x + 102, y + 104);
  drawPeaceLilyCluster(x + 8, y + 155);
  drawRoseCluster(x + 18, y + 102, '#E11D48'); // Red Rose
  drawRoseCluster(x + 115, y + 102, '#F472B6'); // Pink Rose
  drawRoseCluster(x + 130, y + 105, '#FFFFFF'); // White Rose

  // B. Tulips lining the Front Pathway & Fence
  drawTulipBed(x + 10, y + 130);
  drawTulipBed(x + 102, y + 132);
  drawTulipBed(x + 128, y + 152);

  // C. Fruit Bushes beside Farm House & Right Corner
  drawFruitBush(x + 155, y + 95, '#FACC15'); // Lemon Bush
  drawFruitBush(x + 215, y + 110, '#F97316'); // Orange Bush
  drawFruitBush(x + 215, y + 135, '#EF4444'); // Apple / Berry Bush

  // D. Flowers at the Back of the House
  drawRoseCluster(x + 45, y + 12, '#F472B6');
  drawRoseCluster(x + 135, y + 10, '#E11D48');
  drawPeaceLilyCluster(x + 75, y + 10);
  drawTulipBed(x + 120, y + 12);

  // 12. Pumpkins
  const pumpkinData = [
    { px: x + 40, py: y + 108, color: '#EA580C', size: 9 },
    { px: x + 105, py: y + 104, color: '#FEF3C7', size: 10 },
    { px: x + 120, py: y + 107, color: '#F59E0B', size: 8 },
  ];
  pumpkinData.forEach(({ px, py, color, size }) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(px, py, size, size * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#65A344';
    ctx.fillRect(px - 1, py - Math.floor(size * 0.75) - 2, 2, 3);

    if (weather === 'snow') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(px, py - 4, size * 0.7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 13. WEATHER PARTICLES OVER HOUSE GARDEN AREA
  if (weather === 'snow') {
    // Dynamic Falling Snowflakes over cottage garden
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 28; i++) {
      const sx = x - 20 + ((i * 19 + tick * 0.8) % 260);
      const sy = y - 30 + ((i * 13 + tick * 1.2) % 210);
      const sw = (i % 3 === 0) ? 3 : 2;
      ctx.fillRect(sx, sy, sw, sw);
    }
  } else if (weather === 'cherry_blossom') {
    // Dynamic Floating Pink Cherry Blossom Petals tumbling in spring breeze
    for (let i = 0; i < 24; i++) {
      const px = x - 20 + ((i * 23 + tick * 1.1) % 260);
      const py = y - 30 + ((i * 17 + tick * 0.7) % 210);
      const drift = Math.sin(tick * 0.05 + i) * 8;
      ctx.fillStyle = i % 2 === 0 ? '#FB7185' : '#FCE7F3';
      ctx.fillRect(px + drift, py, 4, 3);
      ctx.fillRect(px + drift + 2, py + 1, 3, 2);
    }
  } else if (weather === 'rain') {
    // Falling Rain streaks & splash ripples
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 30; i++) {
      const rx = x - 20 + ((i * 21 + tick * 3) % 260);
      const ry = y - 30 + ((i * 15 + tick * 5) % 210);
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 3, ry + 10);
      ctx.stroke();
    }
  } else if (weather === 'leaves') {
    // Autumn Leaves
    for (let i = 0; i < 18; i++) {
      const lx = x - 20 + ((i * 27 + tick * 0.9) % 260);
      const ly = y - 30 + ((i * 19 + tick * 1.3) % 210);
      const drift = Math.sin(tick * 0.04 + i) * 10;
      ctx.fillStyle = i % 2 === 0 ? '#EA580C' : '#D97706';
      ctx.fillRect(lx + drift, ly, 4, 3);
    }
  }
}

// ----------------------------------------------------
// COZY ROMANTIC HOUSE MAP DRAWING (Matching Reference Image 2)
// ----------------------------------------------------
export function drawCozyHouseMap(ctx: CanvasRenderingContext2D, tick: number) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // 1. Outer Dark Border
  ctx.fillStyle = '#1A120B';
  ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

  // 2. WALLS & BACKGROUND WALLPAPER (Matching Image 2 Warm Beige Leaf Pattern)
  ctx.fillStyle = '#E8DCBD';
  ctx.fillRect(80, 0, MAP_WIDTH - 160, 120);
  ctx.fillStyle = '#D6C7A1';
  for (let wx = 96; wx < MAP_WIDTH - 96; wx += 24) {
    ctx.fillRect(wx, 0, 2, 116);
    for (let wy = 12; wy < 110; wy += 24) {
      ctx.fillRect(wx - 3, wy, 3, 2);
      ctx.fillRect(wx + 2, wy + 8, 3, 2);
    }
  }
  ctx.fillStyle = '#A67C52';
  ctx.fillRect(80, 116, MAP_WIDTH - 160, 6);

  // Top Center Archway / Back Hallway Doorway
  ctx.fillStyle = '#8C6339';
  ctx.fillRect(435, 75, 70, 45);
  ctx.fillStyle = '#E2BA84';
  ctx.fillRect(440, 80, 60, 40);

  // 3. FLOORING ZONES
  // A. Main House Natural Honey Oak Wood Planks (Image 2)
  ctx.fillStyle = '#E2BA84';
  ctx.fillRect(80, 122, MAP_WIDTH - 160, MAP_HEIGHT - 182);
  ctx.fillStyle = '#CDA168';
  for (let py = 122; py < MAP_HEIGHT - 60; py += 24) {
    ctx.fillRect(80, py, MAP_WIDTH - 160, 2);
  }
  for (let px = 80; px < MAP_WIDTH - 80; px += 48) {
    ctx.fillRect(px, 122, 2, MAP_HEIGHT - 182);
  }

  // B. Top-Left Kitchen Sage Green & Cream Checkered Tile Floor (Image 2 Top Left)
  ctx.fillStyle = '#CFA872';
  ctx.fillRect(80, 122, 332, 238);
  for (let fx = 84; fx < 408; fx += 28) {
    for (let fy = 126; fy < 356; fy += 28) {
      const isAlt = Math.floor((fx - 84) / 28 + (fy - 126) / 28) % 2 === 0;
      ctx.fillStyle = isAlt ? '#B8C8A0' : '#E6ECD8';
      ctx.fillRect(fx, fy, 28, 28);
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(fx, fy, 28, 1);
      ctx.fillRect(fx, fy, 1, 28);
    }
  }

  // 4. TOP-LEFT KITCHEN AREA (Image 2 Top Left)
  ctx.fillStyle = '#B28753';
  ctx.fillRect(95, 128, 225, 48);
  ctx.fillStyle = '#8C6339';
  ctx.fillRect(95, 128, 225, 3);
  ctx.fillStyle = '#A8B898';
  ctx.fillRect(92, 125, 231, 6);
  ctx.fillStyle = '#9C7342';
  ctx.fillRect(100, 138, 50, 32);
  ctx.fillRect(160, 138, 50, 32);
  ctx.fillRect(220, 138, 50, 32);
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(123, 150, 4, 4);
  ctx.fillRect(183, 150, 4, 4);
  ctx.fillRect(243, 150, 4, 4);

  // Stainless Steel Sink & Faucet
  ctx.fillStyle = '#64748B';
  ctx.fillRect(105, 130, 38, 18);
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(108, 132, 32, 14);
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(122, 123, 4, 10);
  ctx.fillRect(122, 123, 8, 3);

  // Wooden Cutting Board with Veggies
  ctx.fillStyle = '#D4B07B';
  ctx.fillRect(165, 127, 24, 14);
  ctx.fillStyle = '#84CC16';
  ctx.fillRect(172, 131, 6, 5);

  // Stove Top with Simmering Cooking Pot & Steam
  ctx.fillStyle = '#334155';
  ctx.fillRect(235, 126, 45, 18);
  ctx.fillStyle = '#1E293B';
  ctx.beginPath();
  ctx.arc(247, 135, 6, 0, Math.PI * 2);
  ctx.arc(268, 135, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#64748B';
  ctx.beginPath();
  ctx.arc(247, 133, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#EF4444';
  ctx.fillRect(246, 123, 3, 3);
  const steamY = (tick * 1.5) % 12;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fillRect(246, 118 - steamY, 3, 4);

  // Stainless Steel Refrigerator
  ctx.fillStyle = '#D1D5DB';
  ctx.fillRect(328, 124, 58, 88);
  ctx.fillStyle = '#9CA3AF';
  ctx.fillRect(328, 124, 58, 3);
  ctx.fillRect(328, 160, 58, 2);
  ctx.fillStyle = '#6B7280';
  ctx.fillRect(334, 138, 4, 16);
  ctx.fillRect(334, 172, 4, 20);

  // Wall Upper Wooden Cabinets & Hanging Pans
  ctx.fillStyle = '#9C7342';
  ctx.fillRect(95, 20, 120, 42);
  ctx.fillStyle = '#B28753';
  ctx.fillRect(100, 24, 52, 34);
  ctx.fillRect(158, 24, 52, 34);
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(146, 38, 3, 5);
  ctx.fillRect(162, 38, 3, 5);

  // Wall Hanging Frying Pans
  ctx.fillStyle = '#8C6339';
  ctx.fillRect(230, 35, 50, 4);
  const panXs = [238, 255, 272];
  panXs.forEach((px) => {
    ctx.fillStyle = '#334155';
    ctx.fillRect(px, 39, 2, 8);
    ctx.beginPath();
    ctx.arc(px + 1, 52, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // Small Side Counter / Picnic Basket with Red & White Checkered Cloth (Image 2)
  ctx.fillStyle = '#8C6339';
  ctx.fillRect(330, 222, 44, 32);
  for (let cx = 330; cx < 374; cx += 8) {
    for (let cy = 222; cy < 254; cy += 8) {
      const isRed = Math.floor((cx - 330) / 8 + (cy - 222) / 8) % 2 === 0;
      ctx.fillStyle = isRed ? '#EF4444' : '#FFFFFF';
      ctx.fillRect(cx, cy, 8, 8);
    }
  }

  // 5. TOP-RIGHT LIVING ROOM AREA (Image 2 Top Right)
  // Large Beige/Tan Living Room Carpet
  ctx.fillStyle = '#ECE2C6';
  ctx.fillRect(540, 135, 320, 280);
  ctx.fillStyle = '#D8CBA7';
  ctx.fillRect(540, 135, 320, 4);
  ctx.fillRect(540, 411, 320, 4);
  ctx.fillRect(540, 135, 4, 280);
  ctx.fillRect(856, 135, 4, 280);

  // Large Plush Tan 3-Seater Sofa (Image 2 Top Right)
  const sofaX = 635;
  const sofaY = 145;
  ctx.fillStyle = '#B89B72';
  ctx.fillRect(sofaX, sofaY, 190, 24);
  ctx.fillStyle = '#D6BD96';
  ctx.fillRect(sofaX, sofaY + 22, 190, 40);
  ctx.fillStyle = '#B89B72';
  ctx.fillRect(sofaX - 8, sofaY + 12, 12, 48);
  ctx.fillRect(sofaX + 186, sofaY + 12, 12, 48);
  ctx.fillStyle = '#C5A882';
  ctx.fillRect(sofaX + 63, sofaY + 22, 2, 40);
  ctx.fillRect(sofaX + 126, sofaY + 22, 2, 40);
  ctx.fillStyle = '#A8B898';
  ctx.fillRect(sofaX + 6, sofaY + 26, 20, 20);
  ctx.fillStyle = '#E0A96D';
  ctx.fillRect(sofaX + 164, sofaY + 26, 20, 20);

  // Side Table with Potted Cactus (Left of Sofa)
  ctx.fillStyle = '#B28753';
  ctx.fillRect(580, 160, 36, 36);
  ctx.fillStyle = '#B85528';
  ctx.fillRect(591, 164, 14, 12);
  ctx.fillStyle = '#4A8B58';
  ctx.fillRect(594, 150, 8, 16);
  ctx.fillRect(590, 156, 16, 4);

  // Bookshelf (Left of Doorway)
  ctx.fillStyle = '#9C7342';
  ctx.fillRect(495, 125, 38, 70);
  ctx.fillStyle = '#7C532B';
  ctx.fillRect(498, 128, 32, 64);
  const bookColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
  bookColors.forEach((color, idx) => {
    ctx.fillStyle = color;
    ctx.fillRect(501 + idx * 6, 135, 4, 18);
    ctx.fillRect(501 + idx * 6, 162, 4, 18);
  });

  // Retro CRT Television Stand & Plants (Bottom of Living Room Rug)
  const tvX = 635;
  const tvY = 325;
  ctx.fillStyle = '#B28753';
  ctx.fillRect(tvX, tvY, 190, 35);
  ctx.fillStyle = '#8C6339';
  ctx.fillRect(tvX, tvY, 190, 3);

  ctx.fillStyle = '#5C4C3E';
  ctx.fillRect(tvX + 70, tvY - 32, 50, 34);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(tvX + 74, tvY - 28, 34, 24);
  ctx.fillStyle = '#E0F2FE';
  ctx.fillRect(tvX + 78, tvY - 24, 12, 2);

  const drawTallPlant = (px: number, py: number) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px - 7, py - 4, 14, 16);
    ctx.fillStyle = '#4A8B58';
    ctx.beginPath();
    ctx.ellipse(px, py - 18, 12, 16, 0, 0, Math.PI * 2);
    ctx.ellipse(px - 8, py - 12, 10, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(px + 8, py - 12, 10, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  drawTallPlant(tvX + 22, tvY);
  drawTallPlant(tvX + 168, tvY);

  // Coffee Table & Photo Album in Center of Rug
  ctx.fillStyle = '#B28753';
  ctx.fillRect(690, 225, 80, 40);
  ctx.fillStyle = '#D4AF37';
  ctx.fillRect(690, 225, 80, 2);
  ctx.fillStyle = '#FAF8F5';
  ctx.fillRect(718, 235, 24, 18);
  ctx.fillStyle = '#4A8B58';
  ctx.fillRect(720, 237, 8, 14);
  ctx.fillRect(732, 237, 8, 14);

  // Framed Plant Wall Art & Photo Garland (Upper Wall above sofa)
  ctx.fillStyle = '#A67C52';
  ctx.fillRect(600, 42, 220, 1);
  const photoXs = [625, 680, 735, 790];
  photoXs.forEach((px) => {
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(px, 44, 14, 16);
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(px + 2, 46, 10, 10);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(px + 5, 41, 4, 3);
  });

  const frameXs = [640, 715, 790];
  frameXs.forEach((fx) => {
    ctx.fillStyle = '#9C7342';
    ctx.fillRect(fx, 65, 30, 36);
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(fx + 3, 68, 24, 30);
    ctx.fillStyle = '#4A8B58';
    ctx.fillRect(fx + 10, 82, 10, 12);
    ctx.beginPath();
    ctx.arc(fx + 15, 78, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 6. BOTTOM-LEFT DINING ROOM AREA (Image 2 Bottom Left)
  ctx.fillStyle = '#ECE2C6';
  ctx.fillRect(100, 465, 230, 140);
  ctx.fillStyle = '#D8CBA7';
  ctx.fillRect(100, 465, 230, 3);
  ctx.fillRect(100, 602, 230, 3);

  const dinX = 135;
  const dinY = 490;
  ctx.fillStyle = '#B28753';
  ctx.fillRect(dinX, dinY, 160, 75);
  ctx.fillStyle = '#8C6339';
  ctx.fillRect(dinX, dinY, 160, 3);
  ctx.fillRect(dinX, dinY + 72, 160, 3);

  const drawDiningChair = (cx: number, cy: number) => {
    ctx.fillStyle = '#9C7342';
    ctx.fillRect(cx - 10, cy - 10, 20, 20);
    ctx.fillStyle = '#B28753';
    ctx.fillRect(cx - 8, cy - 8, 16, 16);
  };
  drawDiningChair(dinX + 35, dinY - 14);
  drawDiningChair(dinX + 125, dinY - 14);
  drawDiningChair(dinX + 35, dinY + 76);
  drawDiningChair(dinX + 125, dinY + 76);

  // 7. BOTTOM-RIGHT FLOWER NURSERY CORNER (Image 2 Bottom Right)
  const rack1X = 580;
  const rack1Y = 490;
  ctx.fillStyle = '#9C7342';
  ctx.fillRect(rack1X, rack1Y, 115, 65);
  ctx.fillStyle = '#7C532B';
  ctx.fillRect(rack1X + 4, rack1Y + 4, 107, 24);
  ctx.fillRect(rack1X + 4, rack1Y + 36, 107, 24);

  for (let fx = rack1X + 10; fx < rack1X + 105; fx += 16) {
    ctx.fillStyle = '#8B5CF6';
    ctx.beginPath();
    ctx.arc(fx, rack1Y + 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FDE047';
    ctx.fillRect(fx - 1, rack1Y + 13, 2, 2);
  }
  for (let fx = rack1X + 10; fx < rack1X + 105; fx += 16) {
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(fx, rack1Y + 46, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const rack2X = 715;
  const rack2Y = 490;
  ctx.fillStyle = '#9C7342';
  ctx.fillRect(rack2X, rack2Y, 115, 65);
  ctx.fillStyle = '#7C532B';
  ctx.fillRect(rack2X + 4, rack2Y + 4, 107, 24);
  ctx.fillRect(rack2X + 4, rack2Y + 36, 107, 24);

  for (let fx = rack2X + 12; fx < rack2X + 105; fx += 20) {
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(fx, rack2Y + 14, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(fx, rack2Y + 14, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let fx = rack2X + 10; fx < rack2X + 105; fx += 16) {
    ctx.fillStyle = '#EC4899';
    ctx.beginPath();
    ctx.arc(fx, rack2Y + 46, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 8. Exit Door Indicator to Town Square
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(COMMON_EXIT_DOOR.x, COMMON_EXIT_DOOR.y, COMMON_EXIT_DOOR.w, COMMON_EXIT_DOOR.h);
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('🚪 EXIT TO TOWN', COMMON_EXIT_DOOR.x - 10, COMMON_EXIT_DOOR.y - 8);

  ctx.restore();
}

function drawCafeTable(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Table shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x, y + 40, 60, 12);

  // Pedestal base
  ctx.fillStyle = '#3A271B';
  ctx.fillRect(x + 26, y + 20, 8, 25);

  // Round Table Top
  ctx.fillStyle = '#D4A359';
  ctx.fillRect(x, y, 60, 24);
  ctx.fillStyle = '#F5E3BD';
  ctx.fillRect(x + 2, y + 2, 56, 20);

  // Coffee cup on table
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + 22, y + 6, 12, 10);
  ctx.fillStyle = '#6E492B';
  ctx.fillRect(x + 24, y + 8, 8, 4); // coffee inside cup
  ctx.fillStyle = '#FF9900';
  ctx.fillRect(x + 34, y + 8, 3, 5); // handle

  // Wooden Chairs left & right
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(x - 22, y + 2, 18, 20);
  ctx.fillRect(x + 64, y + 2, 18, 20);
}

// ----------------------------------------------------
// CHIBI CHARACTER SPRITE CANVAS DRAWING
// ----------------------------------------------------
export function drawChibiCharacter(
  ctx: CanvasRenderingContext2D,
  player: PlayerData,
  animFrame: number,
  isSelf: boolean = false
) {
  const { x, y, direction, isMoving, wardrobe, nickname, currentBubble, emote, idleAnimation } = player;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const isDancing = emote === 'happy_dance' || idleAnimation === 'dancing' || player.action === 'dance';
  const isKissing = emote === 'kiss' || emote === 'blowing_kiss';

  // Dance sway & bounce math
  const danceSway = isDancing ? Math.round(Math.sin(Date.now() / 130) * 5) : 0;
  const danceBounceY = isDancing ? Math.round(Math.abs(Math.sin(Date.now() / 140)) * -4) : 0;

  // Bobbing animation for walking
  const bounceY = (isMoving ? (animFrame % 2 === 0 ? -2 : 0) : 0) + danceBounceY;
  const drawX = Math.round(x) + danceSway;
  const drawY = Math.round(y + bounceY);

  // 1. Soft Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(drawX, drawY + 18, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Base Body & Skin (Chibi Proportions: Large Head, Cute Legs)
  const skin = wardrobe.skinTone || '#FCE0D1';

  // Feet/Shoes
  ctx.fillStyle = '#333333';
  const legOffset = isMoving || isDancing ? (animFrame % 2 === 0 ? -3 : 3) : 0;
  if (direction === 'left' || direction === 'right') {
    ctx.fillRect(drawX - 4 + legOffset, drawY + 12, 6, 5);
    ctx.fillRect(drawX + 1 - legOffset, drawY + 12, 6, 5);
  } else {
    ctx.fillRect(drawX - 8, drawY + 13, 6, 5);
    ctx.fillRect(drawX + 2, drawY + 13, 6, 5);
  }

  // Legs/Skin
  ctx.fillStyle = skin;
  ctx.fillRect(drawX - 7, drawY + 6, 5, 8);
  ctx.fillRect(drawX + 2, drawY + 6, 5, 8);

  // 3. Outfit Bottom (Jeans, Skirt, Shorts, Slacks)
  ctx.fillStyle = wardrobe.bottomColor || '#3B82F6';
  if (wardrobe.bottomStyle === 'skirt') {
    ctx.fillRect(drawX - 10, drawY + 3, 20, 8);
  } else if (wardrobe.bottomStyle === 'shorts') {
    ctx.fillRect(drawX - 8, drawY + 4, 16, 5);
  } else {
    // Jeans / Slacks / Cargo
    ctx.fillRect(drawX - 8, drawY + 4, 7, 9);
    ctx.fillRect(drawX + 1, drawY + 4, 7, 9);
  }

  // 4. Outfit Top (Hoodie, Wedding Dress, Sweater, Tee, Suit, Leather Jacket, Vest)
  ctx.fillStyle = wardrobe.topColor || '#EF4444';
  if (wardrobe.topStyle === 'wedding_dress') {
    // Beautiful flowing dress (matching reference picture #1)
    ctx.fillRect(drawX - 11, drawY - 6, 22, 18);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(drawX - 13, drawY + 2, 26, 12);
  } else if (wardrobe.topStyle === 'hoodie') {
    ctx.fillRect(drawX - 9, drawY - 8, 18, 14);
    // Draw hoodie strings
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(drawX - 3, drawY - 2, 2, 6);
    ctx.fillRect(drawX + 1, drawY - 2, 2, 6);
  } else if (wardrobe.topStyle === 'suit_jacket') {
    ctx.fillRect(drawX - 9, drawY - 8, 18, 14);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(drawX - 2, drawY - 8, 4, 10); // Shirt collar
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(drawX - 1, drawY - 6, 2, 6); // Tie / Bowtie
  } else if (wardrobe.topStyle === 'leather_jacket') {
    ctx.fillRect(drawX - 10, drawY - 8, 20, 14);
    ctx.fillStyle = '#111827'; // Dark lapel
    ctx.fillRect(drawX - 4, drawY - 8, 8, 8);
    ctx.fillStyle = '#E5E7EB'; // Silver zipper
    ctx.fillRect(drawX - 1, drawY - 6, 2, 10);
  } else if (wardrobe.topStyle === 'vest_shirt') {
    ctx.fillStyle = '#FFFFFF'; // White inner shirt
    ctx.fillRect(drawX - 8, drawY - 8, 16, 13);
    ctx.fillStyle = wardrobe.topColor || '#3B82F6'; // Denim vest overlay
    ctx.fillRect(drawX - 9, drawY - 8, 5, 13);
    ctx.fillRect(drawX + 4, drawY - 8, 5, 13);
  } else {
    // Graphic Tee / Sweater / Overalls
    ctx.fillRect(drawX - 8, drawY - 8, 16, 13);
  }

  // Arms (Dynamic for Dance & Kiss Poses)
  ctx.fillStyle = skin;
  if (isDancing) {
    // Raised arms in cute dance pose!
    const armYOffset = (animFrame % 2 === 0 ? -4 : -8);
    ctx.fillRect(drawX - 13, drawY - 12 + armYOffset, 4, 10);
    ctx.fillRect(drawX + 9, drawY - 12 - armYOffset, 4, 10);
  } else if (isKissing) {
    // Hugging arms stretched forward for kiss
    ctx.fillRect(drawX - 13, drawY - 4, 6, 5);
    ctx.fillRect(drawX + 7, drawY - 4, 6, 5);
  } else if (direction === 'left') {
    ctx.fillRect(drawX - 11, drawY - 5, 4, 9);
  } else if (direction === 'right') {
    ctx.fillRect(drawX + 7, drawY - 5, 4, 9);
  } else {
    ctx.fillRect(drawX - 11, drawY - 5, 4, 9);
    ctx.fillRect(drawX + 7, drawY - 5, 4, 9);
  }

  // 5. Large Chibi Head
  ctx.fillStyle = skin;
  ctx.fillRect(drawX - 14, drawY - 28, 28, 22);
  // Head rounding corners
  ctx.fillRect(drawX - 13, drawY - 29, 26, 24);

  // Male facial jaw accent if male gender selected
  if (wardrobe.gender === 'male') {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(drawX - 12, drawY - 10, 24, 4);
  }

  // 6. Cute Expressive Eyes, Bright Smiles & Rosy Cheek Blush
  if (direction !== 'up' || isDancing || isKissing) {
    // Extra Rosy Blush for GF & Cute Smile
    ctx.fillStyle = isKissing || emote === 'blush' ? '#FF5588' : '#FF88AA';
    ctx.fillRect(drawX - 11, drawY - 14, 5, 3);
    ctx.fillRect(drawX + 6, drawY - 14, 5, 3);
    // White blush sparkle dots
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(drawX - 10, drawY - 14, 1, 1);
    ctx.fillRect(drawX + 7, drawY - 14, 1, 1);

    if (isKissing) {
      // Closed Happy Eyes ^ ^
      ctx.fillStyle = '#BE185D';
      ctx.fillRect(drawX - 9, drawY - 21, 5, 2);
      ctx.fillRect(drawX - 10, drawY - 20, 2, 2);
      ctx.fillRect(drawX + 4, drawY - 21, 5, 2);
      ctx.fillRect(drawX + 8, drawY - 20, 2, 2);

      // Cute Kissing Lips 💋 (Sweet pout shape)
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(drawX - 2, drawY - 14, 4, 3);
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(drawX - 1, drawY - 13, 2, 1);
    } else if (isDancing || emote === 'heart_eyes') {
      // Sparkling Happy Anime Eyes with Big Smile
      ctx.fillStyle = '#222222';
      ctx.fillRect(drawX - 9, drawY - 22, 6, 8);
      ctx.fillRect(drawX + 3, drawY - 22, 6, 8);
      // Dual Eye Catchlights (Extra Sparkle ✨)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(drawX - 8, drawY - 21, 2, 3);
      ctx.fillRect(drawX - 6, drawY - 18, 1, 1);
      ctx.fillRect(drawX + 4, drawY - 21, 2, 3);
      ctx.fillRect(drawX + 6, drawY - 18, 1, 1);

      // Sweet Open Smiling Mouth with Tongue
      ctx.fillStyle = '#991B1B';
      ctx.fillRect(drawX - 3, drawY - 13, 6, 3);
      ctx.fillStyle = '#F472B6'; // Pink tongue
      ctx.fillRect(drawX - 2, drawY - 12, 4, 1);
    } else if (direction === 'down') {
      // Bright Front View Eyes & Smile
      ctx.fillStyle = '#222222';
      ctx.fillRect(drawX - 9, drawY - 22, 6, 8);
      ctx.fillRect(drawX + 3, drawY - 22, 6, 8);
      // White Eye Catchlights (sparkle)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(drawX - 8, drawY - 21, 2, 3);
      ctx.fillRect(drawX + 4, drawY - 21, 2, 3);
      // Bright Cute Smile
      ctx.fillStyle = '#993333';
      ctx.fillRect(drawX - 3, drawY - 13, 6, 2);
      ctx.fillRect(drawX - 2, drawY - 12, 4, 1);
    } else if (direction === 'left') {
      ctx.fillStyle = '#222222';
      ctx.fillRect(drawX - 11, drawY - 22, 6, 8);
      ctx.fillRect(drawX - 2, drawY - 22, 4, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(drawX - 10, drawY - 21, 2, 3);
      ctx.fillRect(drawX - 1, drawY - 21, 1, 3);
      ctx.fillStyle = '#993333';
      ctx.fillRect(drawX - 7, drawY - 13, 4, 2);
    } else if (direction === 'right') {
      ctx.fillStyle = '#222222';
      ctx.fillRect(drawX - 2, drawY - 22, 4, 8);
      ctx.fillRect(drawX + 5, drawY - 22, 6, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(drawX - 1, drawY - 21, 1, 3);
      ctx.fillRect(drawX + 6, drawY - 21, 2, 3);
      ctx.fillStyle = '#993333';
      ctx.fillRect(drawX + 3, drawY - 13, 4, 2);
    }
  }

  // Floating Particles for Dance (Music Notes 🎵) & Kiss (Hearts 💖)
  const particleTimer = Math.floor(Date.now() / 180);
  if (isDancing) {
    const floatY = (particleTimer % 5) * 3;
    ctx.fillStyle = '#EC4899';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('🎵', drawX - 18, drawY - 32 - floatY);
    ctx.fillText('🎶', drawX + 12, drawY - 36 - ((floatY + 4) % 15));
  } else if (isKissing) {
    const floatY = (particleTimer % 6) * 3;
    ctx.fillStyle = '#F43F5E';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('💖', drawX - 16, drawY - 34 - floatY);
    ctx.fillText('💕', drawX + 10, drawY - 38 - ((floatY + 5) % 18));
  }

  // 7. Hair Layer (Expanded for Male & Female Styles)
  ctx.fillStyle = wardrobe.hairColor || '#5C3A21';
  const style = wardrobe.hairStyle;

  if (style === 'wavy_long') {
    // Long hair cascading down shoulders
    ctx.fillRect(drawX - 15, drawY - 32, 30, 10);
    ctx.fillRect(drawX - 16, drawY - 26, 7, 24);
    ctx.fillRect(drawX + 9, drawY - 26, 7, 24);
    if (direction === 'up') {
      ctx.fillRect(drawX - 15, drawY - 26, 30, 24);
    }
  } else if (style === 'cute_bun') {
    ctx.fillRect(drawX - 15, drawY - 32, 30, 10);
    // Double buns on top
    ctx.fillRect(drawX - 14, drawY - 38, 10, 8);
    ctx.fillRect(drawX + 4, drawY - 38, 10, 8);
  } else if (style === 'short_crop') {
    ctx.fillRect(drawX - 15, drawY - 32, 30, 10);
    ctx.fillRect(drawX - 15, drawY - 26, 5, 12);
    ctx.fillRect(drawX + 10, drawY - 26, 5, 12);
  } else if (style === 'spiky') {
    ctx.fillRect(drawX - 14, drawY - 30, 28, 8);
    // Cool spiky tufts on top
    ctx.fillRect(drawX - 12, drawY - 36, 6, 7);
    ctx.fillRect(drawX - 3, drawY - 38, 6, 9);
    ctx.fillRect(drawX + 6, drawY - 36, 6, 7);
  } else if (style === 'pompadour') {
    // High pompadour swoop
    ctx.fillRect(drawX - 14, drawY - 30, 28, 8);
    ctx.fillRect(drawX - 12, drawY - 38, 24, 10);
    ctx.fillRect(drawX - 8, drawY - 40, 16, 4);
  } else if (style === 'messy_boy') {
    // Textured messy fringe
    ctx.fillRect(drawX - 15, drawY - 32, 30, 10);
    ctx.fillRect(drawX - 14, drawY - 26, 8, 8);
    ctx.fillRect(drawX - 4, drawY - 24, 8, 7);
    ctx.fillRect(drawX + 6, drawY - 26, 8, 8);
  } else if (style === 'side_part') {
    ctx.fillRect(drawX - 15, drawY - 32, 30, 10);
    ctx.fillRect(drawX - 14, drawY - 26, 18, 8);
    ctx.fillRect(drawX + 8, drawY - 26, 6, 6);
  } else {
    // Curly / Braids
    ctx.fillRect(drawX - 15, drawY - 32, 30, 12);
    ctx.fillRect(drawX - 16, drawY - 24, 6, 16);
    ctx.fillRect(drawX + 10, drawY - 24, 6, 16);
  }

  // 8. Accessory Layer (Flower Crown, Cat Ears, Glasses, Coffee Cup, Boba Tea, Beard, Headphones, Shades)
  const acc = wardrobe.accessory;
  if (acc === 'flower_crown') {
    // Beautiful flower crown matching image #1
    const floralColors = ['#E63946', '#FFB703', '#FB8500', '#2A9D8F', '#E63946'];
    floralColors.forEach((fc, idx) => {
      ctx.fillStyle = fc;
      ctx.fillRect(drawX - 12 + idx * 5, drawY - 33, 4, 4);
    });
  } else if (acc === 'cat_ears') {
    ctx.fillStyle = wardrobe.accessoryColor || '#333333';
    ctx.fillRect(drawX - 13, drawY - 37, 6, 6);
    ctx.fillRect(drawX + 7, drawY - 37, 6, 6);
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(drawX - 11, drawY - 35, 2, 3);
    ctx.fillRect(drawX + 9, drawY - 35, 2, 3);
  } else if (acc === 'glasses') {
    if (direction !== 'up') {
      ctx.fillStyle = '#111111';
      ctx.fillRect(drawX - 11, drawY - 23, 8, 7);
      ctx.fillRect(drawX + 3, drawY - 23, 8, 7);
      ctx.fillRect(drawX - 3, drawY - 20, 6, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.fillRect(drawX - 10, drawY - 22, 6, 5);
      ctx.fillRect(drawX + 4, drawY - 22, 6, 5);
    }
  } else if (acc === 'stubble_beard') {
    if (direction !== 'up') {
      ctx.fillStyle = wardrobe.hairColor || '#3A2417';
      ctx.fillRect(drawX - 10, drawY - 11, 20, 4);
      ctx.fillRect(drawX - 8, drawY - 7, 16, 2);
    }
  } else if (acc === 'headphones') {
    ctx.fillStyle = wardrobe.accessoryColor || '#F472B6';
    ctx.fillRect(drawX - 16, drawY - 32, 32, 4); // Band
    ctx.fillRect(drawX - 17, drawY - 25, 4, 10); // Left ear cup
    ctx.fillRect(drawX + 13, drawY - 25, 4, 10); // Right ear cup
  } else if (acc === 'cool_shades') {
    if (direction !== 'up') {
      ctx.fillStyle = '#111827';
      ctx.fillRect(drawX - 12, drawY - 23, 10, 7);
      ctx.fillRect(drawX + 2, drawY - 23, 10, 7);
      ctx.fillRect(drawX - 2, drawY - 21, 4, 2);
      ctx.fillStyle = '#374151'; // Lens reflection
      ctx.fillRect(drawX - 10, drawY - 22, 3, 2);
      ctx.fillRect(drawX + 4, drawY - 22, 3, 2);
    }
  } else if (acc === 'coffee_cup' || acc === 'boba_tea') {
    // Player holds cafe drink in hand
    const handX = direction === 'left' ? drawX - 14 : drawX + 7;
    const handY = drawY - 3;

    // Cup shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(handX - 1, handY + 9, 8, 2);

    if (acc === 'boba_tea') {
      // Boba tea cup
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(handX, handY, 7, 9);
      ctx.fillStyle = '#6B4226'; // Milk tea liquid
      ctx.fillRect(handX + 1, handY + 2, 5, 6);
      ctx.fillStyle = '#1A1A1A'; // Boba pearls
      ctx.fillRect(handX + 1, handY + 6, 2, 2);
      ctx.fillRect(handX + 4, handY + 6, 2, 2);
      ctx.fillStyle = '#EF4444'; // Red Straw
      ctx.fillRect(handX + 3, handY - 4, 2, 5);
    } else {
      // Warm Bakery Coffee Cup ☕
      ctx.fillStyle = '#FFF8F0'; // White ceramic cup
      ctx.fillRect(handX, handY, 8, 9);
      ctx.fillStyle = '#8B5A2B'; // Brown paper heat sleeve
      ctx.fillRect(handX, handY + 3, 8, 4);
      ctx.fillStyle = '#5A3825'; // Dark espresso lid
      ctx.fillRect(handX - 1, handY - 2, 10, 3);

      // Animated Rising Coffee Steam ♨️
      const steamTimer = Math.floor(Date.now() / 150);
      const steamY1 = drawY - 6 - Math.floor((steamTimer * 1.5) % 10);
      const steamY2 = drawY - 8 - Math.floor(((steamTimer + 5) * 1.5) % 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(handX + 2 + Math.floor(Math.sin(steamTimer * 0.2) * 2), steamY1, 2, 3);
      ctx.fillRect(handX + 5 + Math.floor(Math.cos(steamTimer * 0.2) * 2), steamY2, 2, 3);
    }
  }

  // 9. Nickname Label Badge
  ctx.fillStyle = isSelf ? 'rgba(40, 110, 220, 0.85)' : 'rgba(20, 20, 20, 0.75)';
  ctx.font = 'bold 10px sans-serif';
  const nameWidth = ctx.measureText(nickname || 'Roy').width;
  const labelX = drawX - nameWidth / 2 - 4;
  const labelY = drawY - 42;

  ctx.fillRect(labelX, labelY, nameWidth + 8, 14);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.strokeRect(labelX, labelY, nameWidth + 8, 14);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(nickname || 'Roy', labelX + 4, labelY + 11);

  // Active Emote / Idle Badge Display
  const currentEmote = player.emote;
  const idleAnim = player.idleAnimation;
  const isIdle = player.isStationaryIdle;

  if (currentEmote || isIdle || idleAnim) {
    const emoteTimer = Math.floor(Date.now() / 200);
    const floatY = Math.sin(emoteTimer * 0.3) * 3;
    let emoteText = '✨';

    if (currentEmote === 'happy_dance') emoteText = '💃 HAPPY DANCE';
    else if (currentEmote === 'jump') emoteText = '🦘 JUMP!';
    else if (currentEmote === 'spin') emoteText = '🌀 SPIN!';
    else if (currentEmote === 'clap') emoteText = '👏 CLAP!';
    else if (currentEmote === 'blush') emoteText = '😳 BLUSH';
    else if (currentEmote === 'heart_eyes') emoteText = '😍 HEART EYES';
    else if (currentEmote === 'wave') emoteText = '👋 WAVE';
    else if (currentEmote === 'hug') emoteText = '🤗 HUG ❤️';
    else if (currentEmote === 'sleep') emoteText = '💤 ZZZ...';
    else if (currentEmote === 'stretch') emoteText = '🙆 STRETCH';
    else if (currentEmote === 'excited_run') emoteText = '💨 EXCITED!';
    else if (currentEmote === 'cry') emoteText = '😭 AWW...';
    else if (currentEmote === 'laugh') emoteText = '😂 HEHEHE';
    else if (currentEmote === 'shy') emoteText = '🙈 SHY...';
    else if (currentEmote === 'cat_pose') emoteText = '🐱 MIU MIU~';
    else if (currentEmote === 'victory_pose') emoteText = '✌️ VICTORY!';
    else if (currentEmote === 'coffee_cheers') emoteText = '☕ CHEERS!';
    else if (currentEmote === 'food_celebration') emoteText = '🥐 YUMMM!';
    else if (currentEmote === 'blowing_kiss') emoteText = '💋 MWAHH!';
    else if (idleAnim === 'waving') emoteText = '👋 Waving...';
    else if (idleAnim === 'stretching') emoteText = '🙆 Stretching...';
    else if (idleAnim === 'looking_around') emoteText = '👀 Looking around...';
    else if (idleAnim === 'dancing') emoteText = '🎶 Swaying...';
    else if (idleAnim === 'sleeping') emoteText = '😴 Resting...';
    else if (idleAnim === 'blushing') emoteText = '💕 Thinking of you...';
    else if (isIdle) emoteText = '💤 Resting...';

    ctx.fillStyle = '#EC4899';
    ctx.font = 'bold 9px sans-serif';
    const emoteWidth = ctx.measureText(emoteText).width;
    const ex = drawX - emoteWidth / 2 - 4;
    const ey = labelY - 18 + floatY;

    ctx.fillStyle = 'rgba(253, 242, 248, 0.95)';
    ctx.fillRect(ex, ey, emoteWidth + 8, 14);
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 1;
    ctx.strokeRect(ex, ey, emoteWidth + 8, 14);

    ctx.fillStyle = '#BE185D';
    ctx.fillText(emoteText, ex + 4, ey + 10);

    // Floating Particles for Emote
    const pOffset = (emoteTimer % 4) * 3;
    ctx.fillStyle = '#F472B6';
    ctx.fillRect(drawX - 12, ey - pOffset, 3, 3);
    ctx.fillRect(drawX + 10, ey - 4 + pOffset, 3, 3);
  }

  // Self Indicator Arrow
  if (isSelf) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(drawX - 4, labelY - 5);
    ctx.lineTo(drawX + 4, labelY - 5);
    ctx.lineTo(drawX, labelY - 1);
    ctx.fill();
  }

  // 10. Speech Bubble (if active)
  if (currentBubble && currentBubble.expiresAt > Date.now()) {
    drawSpeechBubble(ctx, drawX, labelY - 12, currentBubble.text);
  }

  ctx.restore();
}

// Draw Pixel Speech Bubble above player
function drawSpeechBubble(ctx: CanvasRenderingContext2D, x: number, y: number, text: string) {
  ctx.save();
  ctx.font = 'bold 11px sans-serif';
  const textWidth = ctx.measureText(text).width;
  const bubbleW = Math.max(textWidth + 16, 40);
  const bubbleH = 22;
  const bx = x - bubbleW / 2;
  const by = y - bubbleH;

  // White bubble with shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(bx + 2, by + 2, bubbleW, bubbleH);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(bx, by, bubbleW, bubbleH);
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(bx, by, bubbleW, bubbleH);

  // Pointer Tail
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(x - 4, by + bubbleH);
  ctx.lineTo(x + 4, by + bubbleH);
  ctx.lineTo(x, by + bubbleH + 5);
  ctx.fill();

  ctx.fillStyle = '#111111';
  ctx.fillText(text, bx + 8, by + 15);
  ctx.restore();
}

// ----------------------------------------------------
// CAT SPRITE DRAWING
// ----------------------------------------------------
export function drawCatSprite(ctx: CanvasRenderingContext2D, cat: CatData, tick: number) {
  const { x, y, direction, state, name, breed } = cat;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  const drawX = Math.round(x);
  const drawY = Math.round(y);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(drawX, drawY + 8, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cat Breed Palette
  let furColor = '#FF9933'; // Orange Tabby
  let detailColor = '#CC6600';
  if (breed === 'black') {
    furColor = '#222222';
    detailColor = '#111111';
  } else if (breed === 'calico') {
    furColor = '#FFFFFF';
    detailColor = '#FF9933';
  } else if (breed === 'white') {
    furColor = '#FDFDFD';
    detailColor = '#E8E8E8';
  }

  // Cat Body
  ctx.fillStyle = furColor;
  ctx.fillRect(drawX - 8, drawY - 4, 16, 10);

  // Cat Tail (wiggling)
  const tailWiggle = Math.sin(tick * 0.1) * 3;
  ctx.fillStyle = detailColor;
  ctx.fillRect(drawX + 7, drawY - 6 + tailWiggle, 3, 8);

  // Cat Head
  ctx.fillStyle = furColor;
  ctx.fillRect(drawX - 10, drawY - 12, 12, 10);

  // Pointed Cat Ears
  ctx.fillStyle = detailColor;
  ctx.fillRect(drawX - 10, drawY - 16, 3, 4);
  ctx.fillRect(drawX - 3, drawY - 16, 3, 4);

  // Cute Eyes & Whiskers
  if (state === 'sleeping') {
    ctx.fillStyle = '#444444';
    ctx.fillRect(drawX - 8, drawY - 8, 3, 1);
    ctx.fillRect(drawX - 3, drawY - 8, 3, 1);
    // Zzz floating text
    ctx.fillStyle = '#888888';
    ctx.font = 'bold 9px sans-serif';
    ctx.fillText('Zzz...', drawX - 2, drawY - 18 + (tick % 20 < 10 ? -2 : 0));
  } else {
    ctx.fillStyle = breed === 'black' ? '#00FF66' : '#222222';
    ctx.fillRect(drawX - 8, drawY - 9, 2, 3);
    ctx.fillRect(drawX - 3, drawY - 9, 2, 3);
    // Whiskers
    ctx.fillStyle = '#888888';
    ctx.fillRect(drawX - 13, drawY - 7, 3, 1);
    ctx.fillRect(drawX - 13, drawY - 5, 3, 1);
  }

  // Name Tag
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.font = '9px monospace';
  const nw = ctx.measureText(`🐱 ${name}`).width;
  ctx.fillRect(drawX - nw / 2 - 2, drawY - 22, nw + 4, 11);
  ctx.fillStyle = '#FFE066';
  ctx.fillText(`🐱 ${name}`, drawX - nw / 2, drawY - 13);

  // Heart animation if petted
  if (state === 'petted') {
    ctx.fillStyle = '#FF3366';
    ctx.font = '12px sans-serif';
    ctx.fillText('❤️ Meow!', drawX - 18, drawY - 28 - (tick % 15));
  }

  ctx.restore();
}

// ----------------------------------------------------
// REAL-TIME WEATHER OVERLAY SYSTEM (Rain, Snow, Leaves, Cherry Blossom, Clear)
// ----------------------------------------------------
export function drawWeatherOverlay(
  ctx: CanvasRenderingContext2D,
  weather: WeatherType = 'rain',
  tick: number,
  isIndoor: boolean = false
) {
  ctx.save();
  ctx.imageSmoothingEnabled = false;

  if (isIndoor) {
    // Indoor soft warm cozy filter
    ctx.fillStyle = 'rgba(255, 230, 200, 0.03)';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    ctx.restore();
    return;
  }

  // 1. Weather Ambient Lighting Filter
  if (weather === 'rain') {
    ctx.fillStyle = 'rgba(15, 25, 45, 0.12)';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  } else if (weather === 'snow') {
    ctx.fillStyle = 'rgba(215, 230, 250, 0.08)';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  } else if (weather === 'leaves') {
    ctx.fillStyle = 'rgba(255, 140, 0, 0.06)';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  } else if (weather === 'cherry_blossom') {
    ctx.fillStyle = 'rgba(255, 192, 203, 0.06)';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  } else if (weather === 'clear') {
    ctx.fillStyle = 'rgba(255, 223, 100, 0.04)';
    ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  }

  // 2. Weather Particles Simulation
  const particleCount = weather === 'rain' ? 85 : weather === 'snow' ? 70 : 50;

  for (let i = 0; i < particleCount; i++) {
    const seed = i * 137.5;
    
    if (weather === 'rain') {
      const rx = (seed * 11 + tick * 14) % MAP_WIDTH;
      const ry = (seed * 17 + tick * 22) % MAP_HEIGHT;
      const len = 10 + (i % 6);
      
      ctx.fillStyle = 'rgba(175, 215, 255, 0.65)';
      ctx.fillRect(rx, ry, 2, len);

      // Splash ripples at ground level
      if (ry > 240 && i % 4 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(rx - 2, ry + len, 6, 1);
      }
    } else if (weather === 'snow') {
      const sx = (seed * 19 + Math.sin(tick * 0.03 + i) * 25) % MAP_WIDTH;
      const sy = (seed * 13 + tick * 2.2) % MAP_HEIGHT;
      const size = 2 + (i % 3);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(sx, sy, size, size);
    } else if (weather === 'leaves') {
      const lx = (seed * 23 + Math.sin(tick * 0.04 + i) * 35 + tick * 1.2) % MAP_WIDTH;
      const ly = (seed * 17 + tick * 2.8) % MAP_HEIGHT;
      const colors = ['#D84315', '#E65100', '#F57C00', '#FFB74D'];
      
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(lx, ly, 5, 4);
      ctx.fillStyle = '#BF360C';
      ctx.fillRect(lx + 1, ly + 1, 3, 2);
    } else if (weather === 'cherry_blossom') {
      const px = (seed * 29 + Math.sin(tick * 0.035 + i) * 40 + tick * 1.5) % MAP_WIDTH;
      const py = (seed * 23 + tick * 2.0) % MAP_HEIGHT;
      const colors = ['#FFB7B2', '#FF80BF', '#FFD1DC', '#FF66B2'];

      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(px, py, 4, 3);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(px + 1, py + 1, 2, 1);
    } else if (weather === 'clear') {
      // Golden sunbeams & sparkles
      const cx = (seed * 31 + Math.sin(tick * 0.02 + i) * 15) % MAP_WIDTH;
      const cy = (seed * 27 + Math.cos(tick * 0.02 + i) * 15) % MAP_HEIGHT;
      const alpha = 0.2 + Math.sin(tick * 0.05 + i) * 0.15;

      ctx.fillStyle = `rgba(255, 225, 120, ${alpha})`;
      ctx.fillRect(cx, cy, 3, 3);
      ctx.fillRect(cx + 1, cy - 2, 1, 7);
      ctx.fillRect(cx - 2, cy + 1, 7, 1);
    }
  }

  ctx.restore();
}
