"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  token?: string;
  hotelName?: string;
  apiEndpoint?: string;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─────────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────────

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// DEFAULTS
// ─────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Selamat datang. Saya siap membantu Anda dengan informasi kamar, fasilitas, dan reservasi hotel.",
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  "Cek ketersediaan kamar",
  "Info fasilitas hotel",
  "Berapa harga kamar?",
];

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function ChatWidget({
  token,
  hotelName = "Hotel Assistant",
  apiEndpoint = "https://agent-hotel.yaaqin.xyz/agent",
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    WELCOME_MESSAGE,
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // autofocus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // ───────────────────────────────────────────────────────────
  // SEND MESSAGE
  // ───────────────────────────────────────────────────────────

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();

    if (!content || loading) return;

    const userMessage: Message = {
      id: uid(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify({
          waNumber: "628123456789",
          message: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: uid(),
        role: "assistant",
        content:
          data.reply ??
          "Mohon maaf, terjadi kesalahan pada server.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "Koneksi ke server gagal. Silakan coba kembali.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // ENTER SEND
  // ───────────────────────────────────────────────────────────

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ───────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────

  return (
    <>
      {/* CHAT PANEL */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-24
            right-6
            z-[999999]
            flex
            flex-col
            overflow-hidden
            rounded-2xl
            border
            shadow-2xl
            bg-[#05111F]
            border-[#12304A]
          "
          style={{
            width: 380,
            height: 580,
            maxWidth: "calc(100vw - 24px)",
            maxHeight: "calc(100vh - 32px)",
          }}
        >
          {/* HEADER */}

          <div className="border-b border-[#12304A] bg-[#071726] px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#5D8AB1]">
                  Virtual Assistant
                </p>

                <h2 className="mt-1 text-xl text-white">
                  {hotelName}
                </h2>

                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />

                  <span className="text-xs text-[#7CA6C9]">
                    Online
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-white
                  hover:bg-[#12304A]
                "
              >
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      max-w-[80%]
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      leading-relaxed
                      whitespace-pre-wrap
                    `}
                    style={{
                      background: isUser
                        ? "#12304A"
                        : "#0B1F33",
                      color: "#FFFFFF",
                      border: "1px solid #173A57",
                    }}
                  >
                    <p>{msg.content}</p>

                    <div
                      className={`
                        mt-2
                        text-[10px]
                        ${
                          isUser
                            ? "text-right"
                            : "text-left"
                        }
                      `}
                      style={{
                        color: "#8AA9C2",
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* LOADING */}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="
                    rounded-2xl
                    border
                    border-[#173A57]
                    bg-[#0B1F33]
                    px-4
                    py-3
                    text-white
                  "
                >
                  mengetik...
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* QUICK REPLIES */}

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-[#12304A] px-4 py-3">
              {QUICK_REPLIES.map((item) => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  className="
                    rounded-full
                    border
                    border-[#1C4A6B]
                    px-3
                    py-2
                    text-xs
                    text-[#A5C4DE]
                    transition
                    hover:bg-[#12304A]
                  "
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}

          <div className="border-t border-[#12304A] bg-[#071726] p-4">
            <div className="flex items-end gap-3">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                disabled={loading}
                placeholder="Ketik pesan..."
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setInput(e.target.value);

                  const t = e.target;

                  t.style.height = "auto";
                  t.style.height = `${Math.min(
                    t.scrollHeight,
                    120
                  )}px`;
                }}
                className="
                  min-h-[44px]
                  max-h-[120px]
                  flex-1
                  resize-none
                  overflow-y-auto
                  rounded-xl
                  border
                  border-[#173A57]
                  bg-[#0B1F33]
                  px-4
                  py-3
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-[#6D8AA3]
                "
              />

              <button
                disabled={!input.trim() || loading}
                onClick={() => sendMessage()}
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#1C4A6B]
                  bg-[#12304A]
                  text-white
                  transition
                  hover:bg-[#173A57]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOAT BUTTON */}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          fixed
          bottom-6
          right-6
          z-[999999]
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          border
          border-[#1C4A6B]
          bg-[#05111F]
          shadow-2xl
          transition
          hover:scale-105
        "
      >
        <span className="text-2xl text-white">✦</span>
      </button>
    </>
  );
}