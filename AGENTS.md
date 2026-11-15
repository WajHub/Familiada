# Familiada - Interactive Game Show Application

Offline-first desktop application designed for event hosts and DJs to run "Familiada" (Family Feud) style games. Built with Electron, React, and SQLite.

---

## ⚠️ Important: Working Directory

The root repository contains project documentation and agent configurations. **All application code and scripts reside in the `/app` subdirectory.**
Always set your execution context to `/app` before running any `npm` or build commands:
```bash
cd app
```

---

## Project Structure

```text
Familiada/
├── .agents/        # Agent rules and skills
├── AGENTS.md       # Core guidelines for AI agents
├── README.md       # Project overview
└── app/            # Application root (run all commands here)
    ├── config/     # DB and packaging configurations
    ├── database/   # SQLite database and connection setup
    ├── migrations/ # Database migration scripts
    ├── models/     # Sequelize data models
    ├── public/     # HTML template
    └── src/        # Application source code (React, Electron main/preload, audio)
```

---

## Tech Stack

- **Desktop Framework:** Electron 32
- **Bundler & Tooling:** Webpack 5, Babel, Electron Forge (`@electron-forge/cli`)
- **Frontend:** React 18, React Router DOM v6, Bootstrap Icons
- **Database / ORM:** SQLite (`sqlite3`) with Sequelize v6 & `sequelize-cli`
- **Audio:** Local SFX assets (`app/src/audio/`)

---

## Architecture & Process Model

The app follows Electron's multi-process model with context isolation:

### 1. Dual-Window Setup (`app/src/main.js`)
- **Host Control Panel (`mainWindow`)**:
  - Route: `http://localhost:9000/` (dev)
  - Pages: `HomePage` (collections), `QuestionsPanelPage` (CRUD), `GamePanelPage` (live control).
- **Public Scoreboard (`boardWindow`)**:
  - Route: `http://localhost:9000/BoardPanel` (dev)
  - Displays questions, hidden/revealed answers, team scores, and strikes for projector/TV.

### 2. IPC & State Flow (`app/src/preload.js`)
- Communication between Renderer and Main process happens strictly through `window.api` exposed by `contextBridge`.
- `main.js` handles IPC events and delegates to:
  - `service.js`: Database operations (CRUD for collections, questions, answers).
  - `gameLogic.js`: In-memory game state (active teams, current question, round points).
- Main process synchronizes state to renderers via `webContents.send()`.

---

## Data Schema (SQLite + Sequelize)

Stored in `app/database/database.sqlite`.

- **`Collection`**: Grouping of questions (e.g. game sets). Fields: `id`, `title`.
- **`Question`**: Individual game prompt. Fields: `id`, `content`, `collectionId`.
- **`Answer`**: Survey answer. Fields: `id`, `content`, `points`, `questionId`.
- **`Team`** (`app/models/team.js`): In-memory object tracking team name and score during an active game.

---

## Essential Commands (Run inside `/app`)

```bash
# Install dependencies
npm install

# Run database migrations
npx sequelize db:migrate

# Start development (Requires two terminals):
# Terminal 1: Webpack Dev Server (port 9000)
npm start

# Terminal 2: Electron runtime
npm run electron

# Package / Distribute
npm run make
```

---

## Development Guidelines & Known Gotchas

1. **Security & IPC**: Do NOT enable `nodeIntegration: true`. Keep all renderer-main communication typed and exposed through `app/src/preload.js`.
2. **Hardcoded URLs**: `main.js` currently loads `http://localhost:9000`. When introducing production builds, ensure conditional loading using `loadURL` for dev and `loadFile(path.join(__dirname, '../dist/index.html'))` for production.
3. **Window Display**: Multi-monitor detection (`electron.screen.getAllDisplays()`) and fullscreen/borderless window spawning on secondary display is on the roadmap and should be implemented in `main.js`.
4. **State Management**: When updating game state in `gameLogic.js`, always trigger corresponding IPC updates to both `mainWindow` and `boardWindow` so displays stay in sync.
