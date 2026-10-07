# ResQKit

ResQKit is a first-aid assistant for bystanders at an accident scene. It gets
the user to call 112 first, ranks the injured by urgency, and walks them through
age-appropriate first-aid protocols step by step, in Romanian or English. When
rescuers arrive, it produces a handoff brief and an optional AI-structured scene
report in a standard format (CEIM, EDXL-SitRep, NG112 PIDF-LO).

Everything runs locally: the AI model is self-hosted (Ollama), and nothing
leaves the user's phone unless they explicitly turn on Real data mode.

## Repository layout

| Folder | What it is | Stack |
|---|---|---|
| [`mobile/`](mobile) | The phone app, plus the AI assistant runtime (`server.mjs`) | Expo SDK 57, React Native 0.86, CopilotKit |
| [`backend/`](backend) | REST + WebSocket API: accounts, kits, incident archive, ISU sessions, AI endpoints | FastAPI, SQLAlchemy, SQLite (or PostgreSQL) |
| [`web/`](web) | Web version of the app and the **ISU dashboard** (`/dashboard`) | Vite, React, TypeScript, shadcn/ui |
| [`docs/`](docs) | Design documents: MVP flow, incident model, regulations, progress report | Markdown |

```
 Phone (Expo Go)                       This computer
┌──────────────────┐   HTTP :8001   ┌─────────────────────────┐  :11434  ┌──────────────┐
│ mobile app       │───────────────▶│ backend (FastAPI)       │─────────▶│ Ollama       │
│                  │   HTTP :8200   ├─────────────────────────┤          │ llama3.2:3b  │
│  ResQKit AI tab  │───────────────▶│ AI runtime (server.mjs) │─────────▶│              │
└──────────────────┘                └─────────────────────────┘          └──────────────┘
                                          ▲ WebSocket (live session)
 Browser ── web/ ISU dashboard :5174 ─────┘
```

## Safety and design decisions

These are deliberate, and most are enforced in code rather than just in the UI.

- **112 first.** The emergency flow opens on the 112 screen. Until the call is
  confirmed, a red banner stays on every screen. The app opens the phone dialer;
  it does not call or contact emergency services itself.
- **No login at the scene.** The whole emergency flow works without an account.
  Accounts are only for archiving incidents and syncing kits.
- **Deterministic triage, no AI.** Victims are ranked by fixed rules (not
  breathing → unresponsive → choking/bleeding), and triage answers pick the
  protocol. The AI never decides priority or treatment.
- **Age-aware protocols.** CPR and choking steps differ for infants, children
  and adults (for example, two-finger compressions for infants). Answering
  "not breathing" jumps straight to the CPR step for that age group.
- **The AI cannot overwrite life-critical facts.** In the scene report, the
  `responsive` and `breathing` fields always come from the buttons the user
  pressed, even if their free-text description says otherwise. This is covered
  by a backend test (`test_merge_extracted_never_touches_responsive_or_breathing`).
- **Simulated by default.** Institutional actions (ISU session, NG112 payload,
  voice-channel test) are simulated and logged locally unless Real data mode
  is switched on (Account → Settings → Advanced settings). Nothing is sent to real emergency
  infrastructure; the NG112 builder only produces the payload.
- **No fake hardware data.** There is no physical ResQKit device integration
  yet, so the app never shows a battery level or connection state.
- **Local-first data.** The Safety Profile and active incident stay on the
  phone. Closed incidents are deleted after the retention period the user
  chooses (default 7 days).

## Running it

### Requirements

- **Node.js** 20 or newer (tested with 24)
- **Python** 3.11 or newer (tested with 3.13)
- **Ollama** with the text model: `ollama pull llama3.2:3b`
- A phone with **Expo Go** (SDK 57) on the **same Wi-Fi** as the computer

Optional: `ollama pull moondream` enables photo recognition of kit contents.
Without it, the kit screen falls back to manual selection.

### 1. Backend (terminal 1)

```bash
cd mobile
npm install
npm run backend:setup          # creates backend/.venv and installs requirements
```

Copy `backend/.env.example` to `backend/.env` and set `JWT_SECRET_KEY` and
`ADMIN_PASSWORD` to your own values. The default database is a local SQLite
file, so nothing else needs installing. Then:

```bash
npm run backend                # http://<this-computer>:8001
```

### 2. AI assistant runtime (terminal 2)

```bash
cd mobile
npm run ai                     # http://<this-computer>:8200
```

### 3. Mobile app (terminal 3)

```bash
cd mobile
npm start
```

Scan the QR code with Expo Go. `npm start` puts the computer's Wi-Fi address
into the QR code, and the app finds the backend and AI runtime on that same
address automatically, so no IP configuration is needed. Allow Node and Python
through Windows Firewall on Private networks if prompted.

### 4. ISU dashboard (optional, terminal 4)

```bash
cd web
cp .env.example .env
npm install
npm run dev                    # http://127.0.0.1:5174/dashboard
```

To see a live session: on the phone, turn on **Account → Settings → Advanced
settings → Real-data
mode**, start an emergency, and enter the pairing code shown on the 112 screen
into the dashboard.

### Docker alternative for the backend

`docker compose up --build` runs the backend with PostgreSQL instead of SQLite.
Ollama stays on the host and is reached through `host.docker.internal`.

### Low-memory machines

If Ollama fails with "out of memory" on an integrated GPU, create a CPU-only
copy of the model and point both services at it:

```bash
ollama create llama3.2:3b-cpu -f backend/ollama/Modelfile.cpu
```

Then set `RESQKIT_TEXT_MODEL=llama3.2:3b-cpu` in `backend/.env`, and start the
AI runtime with `OLLAMA_MODEL=llama3.2:3b-cpu`.

## Tests

```bash
cd backend
.venv/Scripts/python -m pytest -q     # on macOS/Linux: .venv/bin/python
```

33 tests cover the CEIM report (including the safety rule above), the NG112
PIDF-LO builder, and EDXL-SitRep output validated against the official OASIS
schema. Tests marked `integration` call the running backend and Ollama, and are
skipped if those aren't running.

## Documentation

- [MVP screens and user flow](docs/ResQKit_MVP_Screens_and_User_Flow.md)
- [Canonical Emergency Incident Model (CEIM)](docs/ResQKit_Canonical_Incident_Model.md)
- [EU regulations and emergency data handling](docs/eu_regulations_emergency_response_data_handling_report.md)
- [Progress update and open questions](docs/ResQKit_Progress_Update.md)
- [Deferred features and backlog](docs/ResQKit_Deferred_Features_and_Backlog.md)
- [LAN mode manual](docs/ResQKit_User_Manual_LAN_mode.md)

The documents were written during development and refer to the earlier folder
layout (`app/backend`, `app/frontend`, `app/mobile`). In this repository those
are `backend/`, `web/` and `mobile/`. The mobile app here is a newer version
than the one the documents describe; the flow, safety rules and data model are
the same.
