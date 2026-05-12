# 🏨 Hotel Platform — Agentic Chatbot

> **Status:** 🟡 Phase 1 — Setup & Integration  
> **Last Updated:** 2026-05-12  
> **Stack:** NestJS (existing) + Python FastAPI (agent) + Next.js (existing)  
> **Channel:** Popup Chat Widget (MVP) → WhatsApp (next, nunggu Meta)  
> **LLM:** OpenRouter → `google/gemini-2.0-flash-001`

---

## 📌 Overview

Chatbot agentic untuk platform hotel. Tamu bisa booking kamar, cek ketersediaan, dan tanya info hotel langsung dari popup chat di website. Terintegrasi ke existing NestJS + PostgreSQL.

### Scope
| Fitur | User | Status |
|---|---|---|
| Popup chat widget di website | Tamu (guest/logged in) | 🎯 **MVP sekarang** |
| Booking & cek kamar via chat | Tamu | 🎯 **MVP** |
| Info hotel / FAQ | Tamu | 🎯 **MVP** |
| WhatsApp channel | Tamu | 🔲 Next (nunggu Meta) |
| Laporan operasional | Owner / Manager | 🔲 Next |
| PDF report | Owner / Manager | 🔲 Next |
| Food order | Tamu | 🔲 Future |

---

## ✅ Keputusan Teknis (Final — Locked)

| Topik | Keputusan | Alasan |
|---|---|---|
| Channel MVP | **Popup chat widget** | Lebih simpel, tidak butuh Meta/WA |
| LLM Provider | **OpenRouter** | Satu API, eksperimen semua model |
| Model aktif | **google/gemini-2.0-flash-001** | Murah, tested works |
| Backend existing | **NestJS** — tambah ChatbotModule | Tidak buat service baru |
| Agent Core | **Python + FastAPI** | Microservice, port 8000 |
| Database | **PostgreSQL existing** | Tambah 1 tabel `wa_sessions` |
| Session/Memory | **WaSession di Postgres** | Simpan context + history, tanpa Redis |
| Auth pattern | **JWT via NestJS middleware** | Widget kirim token → NestJS validasi → forward userId ke agent |
| Vector DB | **Tidak pakai (MVP)** | System prompt cukup untuk FAQ |
| WA Channel | **Standby** | Akan aktif begitu Meta email verified |

## 🔲 Keputusan yang Masih Open

| Topik | Opsi |
|---|---|
| Agent Framework | Custom ReAct (sekarang) vs LangChain/LangGraph |
| Deployment Python agent | Same VPS vs separate |
| Bahasa bot | Indonesia ✅ (sekarang) / Bilingual |

---

## 🏗️ Arsitektur Sistem

### Flow Popup Widget (MVP)

```
User buka website (Next.js)
        │
        │ klik chat widget
        ▼
┌──────────────────────────────────────────┐
│   Chat Widget (Next.js component)        │
│                                          │
│  - Tampilkan conversation UI             │
│  - Kirim: { message, history, context }  │
│  - Header: Authorization: Bearer <jwt>   │
└──────────────────────────────────────────┘
        │
        │ POST /chatbot/message
        ▼
┌──────────────────────────────────────────┐
│   NestJS — ChatbotModule                 │
│                                          │
│  AuthGuard → validasi JWT token          │
│  └── extract userId dari token           │
│                                          │
│  SessionService                          │
│  └── get/create ChatSession (by userId)  │
│                                          │
│  AgentService                            │
│  └── forward ke Python agent             │
│      { message, userId, role, history }  │
│  └── update session history              │
└──────────────────────────────────────────┘
        │
        │ HTTP internal
        ▼
┌──────────────────────────────────────────┐
│   Python Agent (FastAPI :8000)           │
│                                          │
│  - Terima userId (BUKAN token)           │
│  - ReAct loop                            │
│  - OpenRouter API call                   │
│  - Tool execution → query DB             │
│  - Return: { reply, context }            │
└──────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────┐
│   PostgreSQL (existing)                  │
│   rooms · bookings · users · wa_sessions │
└──────────────────────────────────────────┘
```

### Flow WhatsApp (Next — setelah Meta aktif)

```
User kirim WA → Meta webhook → NestJS WebhookController
→ cek WaSession by waNumber → Python agent → balas WA
```

### Auth & Security Pattern

```
❌ JANGAN: Bot baca token dari localStorage langsung
✅ BENAR:

Widget                NestJS              Python Agent
  │                     │                     │
  │─── POST /chatbot ──►│                     │
  │    Bearer: <jwt>    │                     │
  │                     │ validasi JWT         │
  │                     │ extract userId       │
  │                     │──── { userId } ────►│
  │                     │                     │ query DB
  │                     │◄─── { reply } ──────│
  │◄── { reply } ───────│                     │
```

Token tidak pernah keluar dari NestJS. Python agent hanya terima `userId`.

---

## 🗄️atabase

### Tabel Existing yang Dipakai

| Tabel | Dipakai Untuk |
|---|---|
| `users` | Identitas tamu (via JWT userId) |
| `bookings` + `booking_items` | Buat & cek reservasi |
| `booking_contacts` | Data kontak tamu |
| `booking_payments` | Status pembayaran |
| `rooms` + `room_availabilities` | Cek ketersediaan |
| `room_types` + `room_type_translations` | Info tipe kamar |
| `sites` | Info hotel/properti |

### Tabel Baru — `wa_sessions` (sudah di-push ✅)

```prisma
model WaSession {
  id           String   @id @default(uuid())
  waNumber     String   @unique   // userId untuk widget, waNumber untuk WA
  userId       String?
  role         String   @default("GUEST")
  context      Json?              // booking step saat ini
  history      Json?              // 10 turns terakhir
  lastActiveAt DateTime @default(now()) @updatedAt
  createdAt    DateTime @default(now())

  user User? @relation(fields: [userId], references: [id])

  @@index([waNumber])
  @@map("wa_sessions")
}
```

---

## 🤖 Agent Design

### ReAct Loop

```
User: "ada kamar 20-22 mei?"
[Thought] → cek ketersediaan dulu, jangan tanya nama dulu
[Action]  → check_room_availability(checkin="2026-05-20", checkout="2026-05-22")
[Observe] → [{"type": "Deluxe", "price": 450000}, {"type": "Suite", "price": 800000}]
[Answer]  → "Ada 2 kamar: Deluxe Rp450rb, Suite Rp800rb. Mau pilih yang mana?"
```

### Alur Booking (System Prompt)

```
1. Tamu tanya kamar → langsung cek tool (jangan tanya nama dulu)
2. Tampilkan kamar tersedia + harga
3. Tanya pilih kamar mana
4. Baru minta nama
5. Konfirmasi detail
6. Buat booking
```

### Tool Registry

| Tool | Status | Keterangan |
|---|---|---|
| `check_room_availability` | ✅ Skeleton | Query DB belum diimplementasi |
| `create_booking` | ✅ Skeleton | Query DB belum diimplementasi |
| `get_booking_detail` | ✅ Skeleton | Query DB belum diimplementasi |
| `cancel_booking` | ✅ Skeleton | Query DB belum diimplementasi |

---

## 📁 Struktur Folder

```
nest-hotels/
├── prisma/
│   └── schema.prisma         ✅ WaSession sudah ditambah
│
├── src/
│   └── chatbot/              ✅ Module sudah dibuat
│       ├── chatbot.module.ts
│       ├── controllers/
│       │   └── webhook.controller.ts
│       └── services/
│           ├── whatsapp.service.ts
│           ├── session.service.ts
│           └── agent.service.ts
│
├── agent/                    ✅ Python agent running
│   └── src/
│       ├── main.py
│       └── agent/
│           ├── core.py
│           ├── prompts.py
│           └── tools/
│               ├── __init__.py
│               └── booking.py  ← dummy data, belum query DB
│
└── [next.js app]/
    └── components/
        └── ChatWidget/       ⬜ Belum dibuat
```

---

## 🗺️ Roadmap

### 🎯 Phase 1 — Setup & Integration
- [x] OpenRouter API key
- [x] Prisma: tambah `WaSession` model + db push
- [x] NestJS: `ChatbotModule` skeleton
- [x] Python agent: FastAPI running di port 8000
- [x] Agent: ReAct loop + OpenRouter integration works
- [x] Agent: multi-turn conversation works
- [ ] NestJS: endpoint `POST /chatbot/message` (untuk widget)
- [ ] NestJS: JWT auth guard di chatbot endpoint
- [ ] Next.js: Popup chat widget component
- [ ] E2E test: widget → NestJS → agent → reply

### 🔲 Phase 2 — Booking Flow (DB Real)
- [ ] Tool: `check_room_availability` → query `room_availabilities`
- [ ] Tool: `create_booking` → insert ke `bookings` + `booking_items`
- [ ] Tool: `get_booking_detail` → query by userId
- [ ] Tool: `cancel_booking` → update status
- [ ] Multi-turn flow sampai konfirmasi booking

### 🔲 Phase 3 — WhatsApp Channel
- [ ] Buat WA Business Account (Meta email pending)
- [ ] NestJS: `WebhookController` untuk WA
- [ ] Test echo via WA
- [ ] E2E: WA → booking → konfirmasi

### 🔲 Phase 4 — Polish
- [ ] Error handling & fallback
- [ ] Logging percakapan
- [ ] Cancel booking flow
- [ ] E2E test lengkap

### 🔲 Next — Owner Features
- [ ] Mode owner/manager
- [ ] PDF report via WA/chat

### 🔮 Future
- [ ] Food order
- [ ] RAG jika system prompt tidak cukup

---

## 💰 Estimasi Biaya

| Model (OpenRouter) | Harga/1M input | Est./bulan |
|---|---|---|
| `google/gemini-2.0-flash-001` | ~$0.10 | ~$1.5 ← aktif |
| `openai/gpt-4o-mini` | $0.15 | ~$2 |
| `anthropic/claude-haiku-3.5` | $0.80 | ~$5 |
| `anthropic/claude-sonnet-4` | $3.00 | ~$18 |

---

## 📝 Catatan Sesi

| Tanggal | Update |
|---|---|
| 2026-05-12 | Initial planning. Stack: NestJS + Python hybrid. |
| 2026-05-12 | Arsitektur confirmed: dual-role, scope guard, PDF report owner. |
| 2026-05-12 | MVP fokus: booking via chat. End goal: + WA + owner report + food. |
| 2026-05-12 | OpenRouter dipilih. Gemini Flash → nama model fix: `google/gemini-2.0-flash-001`. |
| 2026-05-12 | Existing stack: NestJS + Next.js + PostgreSQL + Prisma di VPS. |
| 2026-05-12 | Schema dianalisis — semua tabel booking ada. Tambah `WaSession` → db push ✅ |
| 2026-05-12 | Python agent running ✅ Multi-turn conversation works ✅ |
| 2026-05-12 | **Pivot MVP:** WA → Popup chat widget (Meta email pending). |
| 2026-05-12 | Auth pattern final: JWT via NestJS middleware, agent hanya terima userId. |

---

## 🔗 Referensi

- [OpenRouter Docs](https://openrouter.ai/docs)
- [OpenRouter Models](https://openrouter.ai/models)
- [WA Cloud API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api)
- [NestJS Docs](https://docs.nestjs.com)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Prisma Docs](https://www.prisma.io/docs)

---

> 💡 **Cara pakai:** Upload README ini tiap sesi baru → konfirmasi phase → update checklist → lanjut.