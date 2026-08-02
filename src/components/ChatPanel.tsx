import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ChatRequest, PlayerData } from '../types';
import { Send, MessageCircle, User, ShieldCheck, Heart, Sparkles, Check, X } from 'lucide-react';
import { playChatPopSound } from '../utils/sound';

interface Props {
  localPlayer: PlayerData;
  messages: ChatMessage[];
  chatRequests: ChatRequest[];
  remotePlayers: PlayerData[];
  onSendMessage: (text: string, isPrivate: boolean, toId?: string) => void;
  onRespondToRequest: (requestId: string, status: 'accepted' | 'declined') => void;
  onRequestChatWithPlayer: (target: PlayerData) => void;
}

export const ChatPanel: React.FC<Props> = ({
  localPlayer,
  messages,
  chatRequests,
  remotePlayers,
  onSendMessage,
  onRespondToRequest,
  onRequestChatWithPlayer,
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'public' | 'private' | 'online'>('public');
  const [selectedPrivatePlayer, setSelectedPrivatePlayer] = useState<PlayerData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Filter pending chat requests targeting this player
  const pendingRequestsForMe = chatRequests.filter(
    (req) => req.toId === localPlayer.id && req.status === 'pending'
  );

  // Filter messages based on tab
  const displayedMessages = messages.filter((msg) => {
    if (activeTab === 'public') {
      return !msg.isPrivate;
    } else if (activeTab === 'private' && selectedPrivatePlayer) {
      return (
        msg.isPrivate &&
        ((msg.fromId === localPlayer.id && msg.toId === selectedPrivatePlayer.id) ||
          (msg.fromId === selectedPrivatePlayer.id && msg.toId === localPlayer.id))
      );
    }
    return false;
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playChatPopSound();
    if (activeTab === 'private' && selectedPrivatePlayer) {
      onSendMessage(inputText.trim(), true, selectedPrivatePlayer.id);
    } else {
      onSendMessage(inputText.trim(), false);
    }
    setInputText('');
  };

  const insertEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  return (
    <div className="bg-[#FFF8F0] border-4 border-[#8B5A2B] rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col h-full min-h-[380px] max-h-[500px]">
      {/* Pending Incoming Chat Requests Toast Notification */}
      {pendingRequestsForMe.length > 0 && (
        <div className="mb-3 bg-amber-100 border-2 border-amber-500 rounded-xl p-3 shadow-md animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{pendingRequestsForMe[0].fromName} wants to start a private chat!</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onRespondToRequest(pendingRequestsForMe[0].id, 'accepted')}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" /> Accept
              </button>
              <button
                onClick={() => onRespondToRequest(pendingRequestsForMe[0].id, 'declined')}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-xs"
              >
                <X className="w-3.5 h-3.5" /> Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation Header */}
      <div className="flex items-center gap-2 mb-3 border-b-2 border-[#8B5A2B] pb-2">
        <button
          onClick={() => setActiveTab('public')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'public'
              ? 'bg-[#8B5A2B] text-white shadow-xs'
              : 'bg-amber-100 text-[#5A3825] hover:bg-amber-200'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Town Chat
        </button>

        <button
          onClick={() => setActiveTab('private')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition relative ${
            activeTab === 'private'
              ? 'bg-[#8B5A2B] text-white shadow-xs'
              : 'bg-amber-100 text-[#5A3825] hover:bg-amber-200'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          Private Chat
        </button>

        <button
          onClick={() => setActiveTab('online')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
            activeTab === 'online'
              ? 'bg-[#8B5A2B] text-white shadow-xs'
              : 'bg-amber-100 text-[#5A3825] hover:bg-amber-200'
          }`}
        >
          <User className="w-4 h-4" />
          Players ({remotePlayers.length + 1})
        </button>
      </div>

      {/* TAB 1 & 2: Chat Log View */}
      {activeTab !== 'online' ? (
        <>
          {activeTab === 'private' && (
            <div className="mb-2 bg-amber-50 p-2 rounded-xl border border-amber-200 text-xs">
              <span className="font-bold text-[#5A3825] block mb-1">Select player to chat with:</span>
              <div className="flex flex-wrap gap-1.5">
                {remotePlayers.length === 0 ? (
                  <span className="text-gray-500 italic">No other players online nearby.</span>
                ) : (
                  remotePlayers.map((p, index) => (
                    <button
                      key={`${p.id}-${index}`}
                      onClick={() => setSelectedPrivatePlayer(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                        selectedPrivatePlayer?.id === p.id
                          ? 'bg-amber-700 text-white border-amber-800'
                          : 'bg-white text-gray-800 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      💬 {p.nickname}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2.5 p-2 bg-white/70 rounded-xl border-2 border-amber-200 shadow-inner mb-3 text-xs">
            {displayedMessages.length === 0 ? (
              <div className="text-center py-8 text-amber-800/60 italic font-mono">
                {activeTab === 'private' && !selectedPrivatePlayer
                  ? 'Pick a player above to start a private conversation!'
                  : 'No chat messages yet. Say hello to MeowLand! 👋'}
              </div>
            ) : (
              displayedMessages.map((msg, index) => {
                const isMe = msg.fromId === localPlayer.id;
                return (
                  <div
                    key={`${msg.id || 'msg'}-${index}`}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold mb-0.5">
                      <span>{msg.fromName}</span>
                      <span className="text-amber-600/70">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs shadow-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#8B5A2B] text-white rounded-br-none font-medium'
                          : 'bg-amber-100 text-[#3A2417] border border-amber-300 rounded-bl-none font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Quick Picker */}
          <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 text-sm">
            {['❤️', '🐾', '☕', '🐱', '✨', '👋', '🎉', '🌸'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg transition transform active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'private' && selectedPrivatePlayer
                  ? `Message ${selectedPrivatePlayer.nickname}...`
                  : 'Type a message to town chat...'
              }
              className="flex-1 px-3.5 py-2 bg-white border-2 border-[#8B5A2B] rounded-xl text-xs font-bold text-[#3A2417] focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#6E492B] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-md transition transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </button>
          </form>
        </>
      ) : (
        /* TAB 3: Online Players List */
        <div className="flex-1 overflow-y-auto p-2 bg-white/70 rounded-xl border-2 border-amber-200 space-y-2 text-xs">
          {/* Local Player */}
          <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-[#5A3825]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{localPlayer.nickname} (You)</span>
            </div>
            <span className="text-[10px] bg-amber-300 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {localPlayer.room === 'town_square' ? '🌿 Town' : '☕ Cafe'}
            </span>
          </div>

          {/* Remote Players */}
          {remotePlayers.length === 0 ? (
            <div className="text-center py-6 text-amber-800/60 italic font-mono">
              You are currently the only player in town. Open another tab or share the URL to play with friends!
            </div>
          ) : (
            remotePlayers.map((p, index) => (
              <div
                key={`${p.id}-${index}`}
                className="p-2.5 bg-white border border-amber-200 rounded-xl flex items-center justify-between hover:bg-amber-50 transition"
              >
                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{p.nickname}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {p.room === 'town_square' ? '🌿 Town' : '☕ Cafe'}
                  </span>
                  <button
                    onClick={() => onRequestChatWithPlayer(p)}
                    className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 shadow-xs"
                  >
                    💬 Request Chat
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
