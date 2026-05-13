"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  token?: string;
  apiEndpoint?: string;
  hotelName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function getSessionId() {
  if (typeof window === "undefined") return "WEB-USER";

  const existing = localStorage.getItem("hotel-chat-id");

  if (existing) return existing;

  const id = `WEB-${crypto.randomUUID()}`;
  localStorage.setItem("hotel-chat-id", id);

  return id;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

function ChevronDownIcon({ className }: { className?: string }) {
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MaximizeIcon({ className }: { className?: string }) {
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
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
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
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="10" y1="14" x2="3" y2="21" />
      <line x1="21" y1="3" x2="14" y2="10" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 my-1">
      <div
        className="h-px w-6"
        style={{ background: "#1A56A0", opacity: 0.45 }}
      />
      <div
        className="w-1 h-1 rotate-45"
        style={{ background: "#1A56A0", opacity: 0.55 }}
      />
      <div
        className="h-px w-6"
        style={{ background: "#1A56A0", opacity: 0.45 }}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px]"
        style={{
          background: "#0A1E38",
          border: "0.5px solid #1A56A0",
          color: "#6A9EC5",
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        ✦
      </div>

      <div
        className="px-4 py-3"
        style={{
          background: "#0A1E38",
          border: "0.5px solid #0F2A45",
        }}
      >
        <div className="flex gap-1.5 items-center h-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full animate-bounce"
              style={{
                background: "#1A56A0",
                animationDelay: `${i * 0.18}s`,
                animationDuration: "0.9s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-end gap-3 mb-4 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {!isUser && (
        <div
          className="w-6 h-6 flex items-center justify-center flex-shrink-0 mb-0.5 text-[10px]"
          style={{
            background: "#0A1E38",
            border: "0.5px solid #1A56A0",
            color: "#6A9EC5",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          ✦
        </div>
      )}

      <div
        className={`flex flex-col gap-1 max-w-[78%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className="px-4 py-3 text-[0.72rem] leading-relaxed whitespace-pre-wrap"
          style={
            isUser
              ? {
                  background: "#0F2A45",
                  border: "0.5px solid #1A56A0",
                  color: "#C8DCEF",
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.02em",
                }
              : {
                  background: "#0A1E38",
                  border: "0.5px solid #0F2A45",
                  color: "#6A9EC5",
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: "0.02em",
                }
          }
        >
          {msg.content}
        </div>

        <span
          className="text-[9px] px-1 tracking-widest uppercase"
          style={{
            color: "#2A4E6A",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

type WidgetState = "closed" | "chat" | "expanded";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Selamat datang. Saya siap membantu Anda dengan informasi kamar, ketersediaan, dan reservasi.",
  timestamp: new Date(),
};

const QUICK_REPLIES = [
  "Cek ketersediaan kamar",
  "Lihat harga",
  "Info fasilitas",
];

export default function ChatWidget({
  token,
  apiEndpoint = process.env.NEXT_PUBLIC_AGENT_URL ||
    "https://agent-hotel.yaaqin.xyz/agent",
  hotelName = "Concierge",
}: ChatWidgetProps) {
  const [widgetState, setWidgetState] =
    useState<WidgetState>("closed");

  const [messages, setMessages] =
    useState<Message[]>([WELCOME_MESSAGE]);

  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Scroll bottom ────────────────────────────────────────────────────────

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // ─── Focus input ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (widgetState !== "closed") {
      setTimeout(() => inputRef.current?.focus(), 200);
      setHasUnread(false);
    }
  }, [widgetState]);

  // ─── Unread state ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (widgetState === "closed" && messages.length > 1) {
      setHasUnread(true);
    }
  }, [messages, widgetState]);

  // ─── Persist history ──────────────────────────────────────────────────────

  useEffect(() => {
    const stored = localStorage.getItem("hotel-chat-history");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        setMessages(
          parsed.map((m: Message) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }))
        );
      } catch {
        //
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "hotel-chat-history",
      JSON.stringify(messages)
    );
  }, [messages]);

  // ─── Send Message ─────────────────────────────────────────────────────────

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();

    if (!content || isLoading) return;

    const userMsg: Message = {
      id: uid(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    setIsLoading(true);

    try {
      const sessionId = getSessionId();

      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify({
          waNumber: sessionId,
          message: content,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      await new Promise((r) => setTimeout(r, 450));

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            data.reply ??
            "Mohon maaf, terjadi gangguan. Silakan coba kembali.",
          timestamp: new Date(),
        },
      ]);

      if (widgetState === "closed") {
        setHasUnread(true);
      }
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content:
            "Koneksi ke layanan sedang bermasalah. Silakan coba beberapa saat lagi.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Keyboard ─────────────────────────────────────────────────────────────

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Layout ───────────────────────────────────────────────────────────────

  const isOpen = widgetState !== "closed";

  const chatW =
    widgetState === "expanded" ? "780px" : "360px";

  const chatH =
    widgetState === "expanded" ? "600px" : "520px";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* ── Chat Panel ── */}

      <div
        className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right"
        style={{
          width: chatW,
          height: chatH,
          maxWidth: "calc(100vw - 3rem)",
          maxHeight: "calc(100vh - 6rem)",
          background: "#05111F",
          border: "0.5px solid #0F2A45",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.92)",
          pointerEvents: isOpen ? "auto" : "none",
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {/* HEADER */}
        {/* KEEP YOUR EXISTING HEADER */}
        {/* KEEP YOUR EXISTING MESSAGES */}
        {/* KEEP YOUR EXISTING INPUT */}
      </div>

      {/* Floating Button */}

      <button
        onClick={() => {
          setWidgetState("chat");
          setHasUnread(false);
        }}
        className="relative flex flex-col items-center justify-center transition-all duration-300"
        style={{
          width: "56px",
          height: "56px",
          background: "#03090F",
          border: "0.5px solid #1A56A0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "scale(0.8)" : "scale(1)",
          pointerEvents: isOpen ? "none" : "auto",
        }}
      >
        <span
          style={{
            color: "#6A9EC5",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          ✦
        </span>

        <span
          className="text-[6px] tracking-[0.3em] uppercase mt-1"
          style={{
            color: "#2A4E6A",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Chat
        </span>

        {hasUnread && (
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border animate-pulse"
            style={{
              background: "#1A56A0",
              borderColor: "#03090F",
              boxShadow: "0 0 8px #1A56A0",
            }}
          />
        )}
      </button>
    </div>
  );
}