import React, { useState, useEffect, useRef } from 'react';
import { WardrobeConfig, PlayerData, GenderType, HairStyle, TopStyle, BottomStyle, AccessoryStyle } from '../types';
import { drawChibiCharacter } from '../game/PixelArtRenderer';
import { PINTEREST_RACK_ITEMS } from '../data/pinterestRack';
import { Sparkles, Check, RefreshCw, Wand2, Shirt, User, Tag, Search, ExternalLink, Bot } from 'lucide-react';

interface Props {
  wardrobe: WardrobeConfig;
  nickname: string;
  gfWardrobe?: WardrobeConfig;
  gfName?: string;
  onWardrobeChange: (newWardrobe: WardrobeConfig) => void;
  onNicknameChange: (name: string) => void;
  onGfWardrobeChange?: (newWardrobe: WardrobeConfig) => void;
  onGfNameChange?: (name: string) => void;
  onClose: () => void;
}

const SKIN_TONES = [
  { label: 'Peach Cream', value: '#FCE0D1' },
  { label: 'Soft Sand', value: '#F5C2A5' },
  { label: 'Warm Honey', value: '#C68642' },
  { label: 'Deep Mocha', value: '#7C4A33' },
  { label: 'Rose Blush', value: '#FAD2E1' },
];

const HAIR_STYLES = [
  { label: 'Wavy Long', value: 'wavy_long', gender: 'female' },
  { label: 'Short Crop', value: 'short_crop', gender: 'unisex' },
  { label: 'Anime Spiky', value: 'spiky', gender: 'male' },
  { label: 'Messy Boy Fringe', value: 'messy_boy', gender: 'male' },
  { label: 'Slick Pompadour', value: 'pompadour', gender: 'male' },
  { label: 'Classic Side Part', value: 'side_part', gender: 'male' },
  { label: 'Cute Double Bun', value: 'cute_bun', gender: 'female' },
  { label: 'Curly Bob', value: 'curly_bob', gender: 'unisex' },
  { label: 'Chic Braids', value: 'braids', gender: 'unisex' },
];

const HAIR_COLORS = [
  { label: 'Midnight Black', value: '#1A1A1A' },
  { label: 'Espresso Brown', value: '#5C3A21' },
  { label: 'Golden Blonde', value: '#E6C280' },
  { label: 'Sakura Pink', value: '#FFB7C5' },
  { label: 'K-Pop Violet', value: '#A084DC' },
  { label: 'Chestnut Auburn', value: '#8D5B4C' },
  { label: 'Crimson Red', value: '#EF4444' },
];

const TOP_STYLES = [
  { label: 'Leather Jacket', value: 'leather_jacket', gender: 'unisex' },
  { label: 'Suit Jacket / Tuxedo', value: 'suit_jacket', gender: 'male' },
  { label: 'Denim Vest Shirt', value: 'vest_shirt', gender: 'male' },
  { label: 'Cozy Hoodie', value: 'hoodie', gender: 'unisex' },
  { label: 'Bridal Wedding Dress', value: 'wedding_dress', gender: 'female' },
  { label: 'Graphic Tee', value: 'graphic_tee', gender: 'unisex' },
  { label: 'Knit Sweater', value: 'cozy_sweater', gender: 'unisex' },
  { label: 'Denim Overalls', value: 'overalls', gender: 'unisex' },
];

const TOP_COLORS = [
  { label: 'Ebony Black', value: '#111827' },
  { label: 'Cream White', value: '#F8FAF2' },
  { label: 'Denim Royal Blue', value: '#3B82F6' },
  { label: 'Crimson Red', value: '#EF4444' },
  { label: 'Matcha Green', value: '#10B981' },
  { label: 'Rose Quartz', value: '#F472B6' },
  { label: 'Chestnut Brown', value: '#5C3A21' },
];

const BOTTOM_STYLES = [
  { label: 'Cargo Pants', value: 'cargo', gender: 'male' },
  { label: 'Dress Slacks', value: 'slacks', gender: 'male' },
  { label: 'Denim Jeans', value: 'jeans', gender: 'unisex' },
  { label: 'Flowy Skirt', value: 'skirt', gender: 'female' },
  { label: 'Casual Shorts', value: 'shorts', gender: 'unisex' },
];

const BOTTOM_COLORS = [
  { label: 'Ebony Black', value: '#111827' },
  { label: 'Indigo Denim', value: '#1E3A8A' },
  { label: 'Charcoal Grey', value: '#374151' },
  { label: 'Pearl White', value: '#F9FAFB' },
  { label: 'Khaki Tan', value: '#D97706' },
  { label: 'Rose Pink', value: '#F472B6' },
];

const ACCESSORIES = [
  { label: 'None', value: 'none' },
  { label: 'Cool Shades 🕶️', value: 'cool_shades' },
  { label: 'Headphones 🎧', value: 'headphones' },
  { label: 'Stubble Beard 🧔', value: 'stubble_beard' },
  { label: 'Rose Flower Crown 🌸', value: 'flower_crown' },
  { label: 'Cat Ears 🐱', value: 'cat_ears' },
  { label: 'Cute Glasses 👓', value: 'glasses' },
  { label: 'Hot Coffee ☕', value: 'coffee_cup' },
  { label: 'Boba Milk Tea 🧋', value: 'boba_tea' },
];

export const WardrobePicker: React.FC<Props> = ({
  wardrobe,
  nickname,
  onWardrobeChange,
  onNicknameChange,
  onClose,
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tab State: 'pinterest' | 'ai_banana' | 'custom'
  const [activeTab, setActiveTab] = useState<'pinterest' | 'ai_banana' | 'custom'>('pinterest');

  // Pinterest Rack filter
  const [rackGenderFilter, setRackGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [rackSearch, setRackSearch] = useState('');

  // Gemini AI Nano Generator State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGender, setAiGender] = useState<GenderType>(wardrobe.gender || 'male');
  const [pinterestUrl, setPinterestUrl] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('image/jpeg');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  // Handle Gallery Photo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAiStatusMessage('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadedMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setUploadedImageBase64(result);
        setAiStatusMessage('🖼️ Dress photo loaded from gallery! Click below to generate with Gemini AI.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate outfit from uploaded gallery image
  const handleGenerateFromImage = async () => {
    if (!uploadedImageBase64) {
      setAiStatusMessage('Please select an image from your gallery first!');
      return;
    }

    setAiLoading(true);
    setAiStatusMessage('🍌 Gemini Vision is scanning your uploaded photo & styling pixel character...');

    try {
      const res = await fetch('/api/generate-outfit-from-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImageBase64,
          mimeType: uploadedMimeType,
          gender: aiGender,
        }),
      });

      const data = await res.json();
      if (data && data.success && data.wardrobe) {
        onWardrobeChange(data.wardrobe);
        setAiStatusMessage(`✨ Applied "${data.outfitName}": ${data.description}`);
      } else {
        setAiStatusMessage('Could not analyze photo. Please try another image!');
      }
    } catch (err) {
      console.error('Image AI Gen Error:', err);
      setAiStatusMessage('Failed to connect to AI server. Please try again!');
    } finally {
      setAiLoading(false);
    }
  };

  // Render live preview on canvas
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    // Draw background circle glow
    ctx.fillStyle = '#FFF5EB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFE0CC';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 + 10, 60, 0, Math.PI * 2);
    ctx.fill();

    // Scale up character by 2.5x for preview
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 + 25);
    ctx.scale(2.5, 2.5);

    const dummyPlayer: PlayerData = {
      id: 'preview',
      username: 'preview',
      nickname: nickname || 'Roy',
      x: 0,
      y: 0,
      direction: 'down',
      isMoving: false,
      room: 'town_square',
      wardrobe,
      currentBubble: null,
      action: null,
      lastActive: Date.now(),
    };

    drawChibiCharacter(ctx, dummyPlayer, 0, true);
    ctx.restore();
  }, [wardrobe, nickname]);

  // Call Gemini Nano / Flash AI Backend API
  const handleGenerateAiOutfit = async (customPromptText?: string) => {
    const promptToUse = customPromptText || aiPrompt;
    if (!promptToUse.trim()) {
      setAiStatusMessage('Please enter an outfit prompt or choose an AI preset!');
      return;
    }

    setAiLoading(true);
    setAiStatusMessage('🍌 Gemini AI is analyzing fashion styles & generating outfit...');

    try {
      const res = await fetch('/api/generate-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          gender: aiGender,
          pinterestUrl,
        }),
      });

      const data = await res.json();
      if (data && data.success && data.wardrobe) {
        onWardrobeChange(data.wardrobe);
        setAiStatusMessage(`✨ Applied "${data.outfitName}": ${data.description}`);
      } else {
        setAiStatusMessage('Could not generate outfit. Please try again!');
      }
    } catch (err) {
      console.error('AI Gen Request Error:', err);
      setAiStatusMessage('Failed to connect to AI server. Applied fallback styling.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filter Pinterest items
  const filteredRackItems = PINTEREST_RACK_ITEMS.filter((item) => {
    if (rackGenderFilter !== 'all' && item.gender !== rackGenderFilter && item.gender !== 'unisex') {
      return false;
    }
    if (rackSearch.trim()) {
      const query = rackSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query)) ||
        item.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]">
        {/* Left Column: Live Character Preview & Gender Switcher */}
        <div className="md:w-5/12 bg-[#FFF0E0] p-5 flex flex-col items-center border-b-4 md:border-b-0 md:border-r-4 border-[#8B5A2B]">
          <div className="flex items-center gap-2 mb-2 text-[#5A3825]">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-extrabold text-lg font-mono">MeowLand Wardrobe</h3>
          </div>

          <div className="relative bg-white/90 p-3 rounded-2xl border-2 border-[#D4A359] shadow-inner mb-3">
            <canvas ref={previewCanvasRef} width={220} height={220} className="rounded-xl shadow-xs" />
            <div className="absolute top-2 right-2 bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              Live Preview
            </div>
          </div>

          {/* Gender Selector Button Group */}
          <div className="w-full mb-3">
            <label className="block text-xs font-extrabold text-[#6E492B] mb-1">Character Gender & Body:</label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-amber-200/60 rounded-xl border border-amber-300">
              <button
                onClick={() => onWardrobeChange({ ...wardrobe, gender: 'male' })}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                  wardrobe.gender === 'male'
                    ? 'bg-[#8B5A2B] text-white shadow-xs'
                    : 'bg-white/70 text-[#5A3825] hover:bg-white'
                }`}
              >
                <span>👨 Male</span>
              </button>
              <button
                onClick={() => onWardrobeChange({ ...wardrobe, gender: 'female' })}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                  wardrobe.gender === 'female'
                    ? 'bg-[#8B5A2B] text-white shadow-xs'
                    : 'bg-white/70 text-[#5A3825] hover:bg-white'
                }`}
              >
                <span>👩 Female</span>
              </button>
              <button
                onClick={() => onWardrobeChange({ ...wardrobe, gender: 'unisex' })}
                className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 ${
                  wardrobe.gender === 'unisex'
                    ? 'bg-[#8B5A2B] text-white shadow-xs'
                    : 'bg-white/70 text-[#5A3825] hover:bg-white'
                }`}
              >
                <span>🧑 Unisex</span>
              </button>
            </div>
          </div>

          {/* Nickname Input */}
          <div className="w-full mb-2">
            <label className="block text-xs font-bold text-[#6E492B] mb-1">Your Username:</label>
            <input
              type="text"
              maxLength={14}
              value={nickname}
              onChange={(e) => onNicknameChange(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border-2 border-[#8B5A2B] rounded-xl font-extrabold text-center text-[#5A3825] focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-xs"
              placeholder="e.g. Roy"
            />
          </div>
        </div>

        {/* Right Column: Multi-Tab Wardrobe Studio */}
        <div className="md:w-7/12 p-4 sm:p-5 flex flex-col overflow-hidden max-h-[78vh]">
          {/* Navigation Tabs Header */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-100 rounded-2xl border-2 border-amber-300 mb-4 shrink-0">
            <button
              onClick={() => setActiveTab('pinterest')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeTab === 'pinterest'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-900 hover:bg-rose-200/50'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>📌 Pinterest Rack</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_banana')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeTab === 'ai_banana'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>🍌 Gemini Nano AI</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-[#8B5A2B] text-white shadow-md'
                  : 'text-[#5A3825] hover:bg-amber-200/50'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>🛠️ Customizer</span>
            </button>
          </div>

          {/* TAB 1: PINTEREST OUTFIT RACK */}
          {activeTab === 'pinterest' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-rose-900 flex items-center gap-1">
                    📌 Direct Pinterest Lookbook Rack
                  </span>
                  <span className="text-[10px] text-rose-700 bg-rose-200 font-bold px-2 py-0.5 rounded-full">
                    {filteredRackItems.length} Outfits
                  </span>
                </div>

                {/* Search & Gender Filter Controls */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-rose-400" />
                    <input
                      type="text"
                      placeholder="Search #MaleFashion, #Bridal, #Y2K..."
                      value={rackSearch}
                      onChange={(e) => setRackSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-rose-300 rounded-xl text-xs text-rose-900 focus:outline-hidden"
                    />
                  </div>

                  <select
                    value={rackGenderFilter}
                    onChange={(e: any) => setRackGenderFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-rose-300 rounded-xl text-xs font-bold text-rose-900 focus:outline-hidden"
                  >
                    <option value="all">All Genders</option>
                    <option value="male">👨 Male Outfits</option>
                    <option value="female">👩 Female Outfits</option>
                  </select>
                </div>
              </div>

              {/* Pinterest Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredRackItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-rose-200 rounded-2xl p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-gray-900 group-hover:text-rose-600 transition">
                          {item.title}
                        </span>
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full capitalize">
                          {item.gender === 'male' ? '👨 Male' : item.gender === 'female' ? '👩 Female' : '🧑 Unisex'}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 mb-2 leading-tight">{item.description}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, tagIdx) => (
                          <span
                            key={`${tag}-${tagIdx}`}
                            className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onWardrobeChange(item.wardrobe)}
                      className="w-full py-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Wear This Pinterest Outfit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: GEMINI NANO AI BANANA STUDIO */}
          {activeTab === 'ai_banana' && (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 border-2 border-amber-300 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center gap-2 mb-1.5 text-amber-900">
                  <Bot className="w-5 h-5 text-amber-600 animate-bounce" />
                  <h4 className="font-black text-xs uppercase tracking-wider">
                    Gemini Nano AI Outfit Generator
                  </h4>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                  Type any custom Pinterest fashion prompt or paste an image idea. Gemini will generate a matching pixel-art wardrobe in real time!
                </p>
              </div>

              {/* Gallery Image Import Box */}
              <div className="bg-amber-50/80 border-2 border-dashed border-amber-400 rounded-2xl p-3 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-900 font-extrabold text-xs">
                  <span>📸 Import Photo / Dress from Gallery</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Upload a picture of any dress, suit, or outfit from your phone or PC gallery. Gemini Nano Vision will analyze the design and style your pixel character!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-amber-200 hover:bg-amber-300 border border-amber-400 text-amber-900 font-extrabold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5">
                    <span>📁 Choose File from Gallery</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>

                  {uploadedImageBase64 && (
                    <button
                      onClick={handleGenerateFromImage}
                      disabled={aiLoading}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                      <span>Scan Photo with Gemini AI</span>
                    </button>
                  )}
                </div>

                {uploadedImageBase64 && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <img
                      src={uploadedImageBase64}
                      alt="Uploaded Gallery Dress"
                      className="w-16 h-16 object-cover rounded-xl border-2 border-amber-400 shadow-md"
                    />
                    <span className="text-[10px] text-amber-900 font-bold bg-amber-100 px-2 py-1 rounded-lg">
                      Gallery Image Selected
                    </span>
                  </div>
                )}
              </div>

              {/* Prompt Input & Controls */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-extrabold text-[#5A3825] mb-1">
                    Fashion Prompt / Pinterest Outfit Idea:
                  </label>
                  <textarea
                    rows={2}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Male K-Pop idol in black leather jacket, silver zipper, messy purple hair, dark slacks and cool shades..."
                    className="w-full p-2.5 bg-white border-2 border-amber-300 rounded-xl text-xs text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3825] mb-1">Target Gender:</label>
                    <select
                      value={aiGender}
                      onChange={(e: any) => setAiGender(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-amber-300 rounded-xl text-xs font-bold text-gray-800"
                    >
                      <option value="male">👨 Male Character</option>
                      <option value="female">👩 Female Character</option>
                      <option value="unisex">🧑 Unisex Character</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#5A3825] mb-1">Pinterest Reference URL (Optional):</label>
                    <input
                      type="text"
                      value={pinterestUrl}
                      onChange={(e) => setPinterestUrl(e.target.value)}
                      placeholder="https://pinterest.com/pin/..."
                      className="w-full p-2 bg-white border-2 border-amber-300 rounded-xl text-xs text-gray-800"
                    />
                  </div>
                </div>

                {/* AI Preset Chips */}
                <div>
                  <span className="text-[11px] font-bold text-[#6E492B] block mb-1">Try One-Tap AI Prompts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '👨 Y2K Male Leather Jacket with Spiky Hair',
                      '🤵 Male Groom Black Tuxedo with Slick Hair',
                      '🎧 K-Pop Idol Denim Vest with Headphones',
                      '🌸 Rose Bridal Wedding Dress with Flower Crown',
                      '☕ Dark Academia Cozy Sweater with Glasses',
                    ].map((promptText) => (
                      <button
                        key={promptText}
                        onClick={() => {
                          setAiPrompt(promptText);
                          handleGenerateAiOutfit(promptText);
                        }}
                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 rounded-lg text-[11px] font-bold transition text-left"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Message */}
                {aiStatusMessage && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs font-extrabold text-amber-900 animate-pulse">
                    {aiStatusMessage}
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={() => handleGenerateAiOutfit()}
                  disabled={aiLoading}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md text-xs transition flex items-center justify-center gap-2"
                >
                  <Wand2 className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
                  {aiLoading ? 'Generating Outfit...' : '🍌 Generate Outfit Real-Time with Gemini AI'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MANUAL CUSTOMIZER */}
          {activeTab === 'custom' && (
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {/* 1. Skin Tone */}
              <div>
                <span className="text-xs font-bold text-[#5A3825] uppercase tracking-wider block mb-1">
                  1. Skin Tone
                </span>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TONES.map((st) => (
                    <button
                      key={st.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, skinTone: st.value })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-medium transition ${
                        wardrobe.skinTone === st.value
                          ? 'border-[#8B5A2B] bg-amber-200 text-[#5A3825] font-bold shadow-xs'
                          : 'border-amber-200 bg-white text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: st.value }} />
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Hair Style & Color */}
              <div>
                <span className="text-xs font-bold text-[#5A3825] uppercase tracking-wider block mb-1">
                  2. Hair Style & Color
                </span>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {HAIR_STYLES.map((hs) => (
                    <button
                      key={hs.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, hairStyle: hs.value as any })}
                      className={`px-2.5 py-1.5 rounded-xl border-2 text-xs text-left transition ${
                        wardrobe.hairStyle === hs.value
                          ? 'border-[#8B5A2B] bg-amber-200 text-[#5A3825] font-bold'
                          : 'border-amber-200 bg-white text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      {hs.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, hairColor: hc.value })}
                      title={hc.label}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        wardrobe.hairColor === hc.value ? 'ring-2 ring-amber-600 scale-110 border-white' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: hc.value }}
                    />
                  ))}
                </div>
              </div>

              {/* 3. Top Outfit & Color */}
              <div>
                <span className="text-xs font-bold text-[#5A3825] uppercase tracking-wider block mb-1">
                  3. Top Outfit
                </span>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {TOP_STYLES.map((ts) => (
                    <button
                      key={ts.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, topStyle: ts.value as any })}
                      className={`px-2.5 py-1.5 rounded-xl border-2 text-xs text-left transition ${
                        wardrobe.topStyle === ts.value
                          ? 'border-[#8B5A2B] bg-amber-200 text-[#5A3825] font-bold'
                          : 'border-amber-200 bg-white text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      {ts.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {TOP_COLORS.map((tc) => (
                    <button
                      key={tc.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, topColor: tc.value })}
                      title={tc.label}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        wardrobe.topColor === tc.value ? 'ring-2 ring-amber-600 scale-110 border-white' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: tc.value }}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Bottom Outfit & Color */}
              <div>
                <span className="text-xs font-bold text-[#5A3825] uppercase tracking-wider block mb-1">
                  4. Bottom Outfit
                </span>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {BOTTOM_STYLES.map((bs) => (
                    <button
                      key={bs.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, bottomStyle: bs.value as any })}
                      className={`px-2.5 py-1.5 rounded-xl border-2 text-xs text-left transition ${
                        wardrobe.bottomStyle === bs.value
                          ? 'border-[#8B5A2B] bg-amber-200 text-[#5A3825] font-bold'
                          : 'border-amber-200 bg-white text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      {bs.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {BOTTOM_COLORS.map((bc) => (
                    <button
                      key={bc.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, bottomColor: bc.value })}
                      title={bc.label}
                      className={`w-7 h-7 rounded-full border-2 transition ${
                        wardrobe.bottomColor === bc.value ? 'ring-2 ring-amber-600 scale-110 border-white' : 'border-black/20'
                      }`}
                      style={{ backgroundColor: bc.value }}
                    />
                  ))}
                </div>
              </div>

              {/* 5. Accessories */}
              <div>
                <span className="text-xs font-bold text-[#5A3825] uppercase tracking-wider block mb-1">
                  5. Accessory
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ACCESSORIES.map((acc) => (
                    <button
                      key={acc.value}
                      onClick={() => onWardrobeChange({ ...wardrobe, accessory: acc.value as any })}
                      className={`px-2.5 py-1.5 rounded-xl border-2 text-xs text-left transition ${
                        wardrobe.accessory === acc.value
                          ? 'border-[#8B5A2B] bg-amber-200 text-[#5A3825] font-bold'
                          : 'border-amber-200 bg-white text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-3 border-t border-amber-200 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#8B5A2B] hover:bg-[#6E492B] text-white font-extrabold rounded-2xl shadow-lg border-2 border-[#5A3825] flex items-center justify-center gap-2 text-xs transition transform active:scale-98"
            >
              <Check className="w-4 h-4 text-amber-300" />
              Save Outfit & Enter MeowLand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
