1. Scenario
Our agency often prototypes simple landing pages for clients. We'd like a tiny
internal tool—a single-page "Layout Builder"—where non-technical teammates
can drag pre-made components onto a blank canvas, position/resize them, and
save the resulting layout for later editing.
2. Your Mission
Build an MVP of this tool in 10-20 hours of focused effort. It should demonstrate
solid server-side skills while giving us a glimpse of your front-end chops.
Area Minimum Requirements

Core UI

• Blank canvas area (any size you choose).• Palette with at least three
element types: 1) Text box 2) Image placeholder 3) Button.• Pure-JS
drag-n-drop (no external DnD libs).• Users can move, resize, and delete
elements.• Clicking a text or button element opens an inline editor (just
content—no need to do things like text size and color).

Persistence

• Each layout is associated with a userId.• Requests include userId in a
header (e.g. X-User-Id ) or query param—no authentication logic is
required.• "Save layout" → persists to PostgreSQL.• "Load my layouts"
→ fetches by userId .• Persist either as an HTML string or JSON array of
elements (your choice—explain why in the README).

API & Server

• Node.js + Express (or Fastify) + TypeScript.• REST endpoints: POST
/api/layouts – create / update layout. GET /api/layouts?userId=... – list
layouts for a user. GET /api/layouts/:id – fetch single layout.• Zod for
request/response validation.• Prisma ORM ↔ PostgreSQL.• Basic error
handling & (optional) simple rate-limiting middleware.
Front-End Stack • Vite + React + TypeScript.• TailwindCSS for styling.

## Project Setup

This is a monorepo containing a Layout Builder application with the following structure:

```
hqProject/
├── frontend/          # React + Vite + TypeScript + TailwindCSS
├── backend/           # Node.js + Express + TypeScript + Prisma
├── docker-compose.yml # Docker orchestration
└── README.md
```

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hqProject
   ```

2. **Install dependencies (one-time setup)**
   ```bash
   # Using the setup script (recommended):
   chmod +x setup.sh  # Make executable (Linux/macOS only)
   ./setup.sh
   
   # Or manually:
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

3. **Verify setup (optional but recommended)**
   ```bash
   chmod +x verify-setup.sh  # Make executable (Linux/macOS only)
   ./verify-setup.sh
   ```

4. **Start the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: PostgreSQL on localhost:5432

### Git Bash Users (Windows)

If you're using Git Bash on Windows:

```bash
# Make scripts executable (Git Bash supports chmod)
chmod +x setup.sh
chmod +x verify-setup.sh

# Run setup
./setup.sh

# Verify setup
./verify-setup.sh

# Start the application
docker-compose up --build
```

**Note**: Git Bash provides a Unix-like environment, so you can use the same commands as Linux/macOS users.

### Cross-Platform Compatibility

This project is designed to work on **Windows**, **macOS**, and **Linux**:

#### Windows
- **Git Bash** (recommended): Use `./setup.sh` after making it executable
- **PowerShell**: Use `.\setup.bat` or run the manual commands
- **WSL**: Use the Linux instructions below

#### macOS
- **Terminal**: Use `./setup.sh` (make executable first with `chmod +x setup.sh`)
- **iTerm2**: Same as Terminal

#### Linux
- **Bash**: Use `./setup.sh` (make executable first with `chmod +x setup.sh`)
- **Zsh**: Same as Bash

### Prerequisites (All Platforms)

- **Docker Desktop** (Windows/macOS) or **Docker Engine** (Linux)
- **Docker Compose** (included with Docker Desktop)
- **Git** (for cloning the repository)
- **Node.js** (for local development, not required for Docker)

### What's Included

#### Backend (`/backend`)
- **Express.js** with TypeScript
- **Prisma ORM** with PostgreSQL
- **Zod** for request/response validation
- **CORS** enabled for frontend communication
- **Rate limiting** middleware
- **Health check** endpoint at `/health`
- **Time endpoint** at `/api/time` for testing frontend-backend communication
- **Layout endpoints** (GET, POST) for the layout builder functionality

#### Frontend (`/frontend`)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Hello World** landing page
- **Time display** that fetches data from the backend API
- **Error handling** and loading states

#### Database
- **PostgreSQL 15** with Alpine Linux
- **Prisma** schema with Layout model
- **Persistent volume** for data storage

### Development

The application is configured for development with:
- **Hot reloading** for both frontend and backend
- **Volume mounts** for live code changes
- **Health checks** to ensure proper startup order
- **Prisma client generation** handled in Docker build

### API Endpoints

- `GET /health` - Health check
- `GET /api/time` - Get current GMT time (for testing)
- `GET /api/layouts?userId=...` - Get layouts for a user
- `GET /api/layouts/:id` - Get a specific layout
- `POST /api/layouts` - Create/update a layout

### Troubleshooting

1. **If containers fail to start:**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

2. **If Prisma issues occur:**
   ```bash
   docker-compose exec backend npx prisma generate
   docker-compose exec backend npx prisma db push
   ```

3. **If backend shows "Cannot find module '/app/dist/index.js'":**
   - This error occurs when the TypeScript build fails
   - The fix: Use development mode with `tsx` instead of building for production
   - The Dockerfile now uses `npm run dev` which runs TypeScript directly
   - For production, use `Dockerfile.prod` which properly builds the TypeScript

4. **To view logs:**
   ```bash
   docker-compose logs -f [service-name]
   ```

5. **If database connection fails:**
   - The backend now waits for PostgreSQL to be ready using inline commands
   - Check if PostgreSQL container is healthy: `docker-compose ps`
   - Restart if needed: `docker-compose restart postgres`

6. **If you see "wait-for-db.sh: not found":**
   - This has been fixed by using inline shell commands instead of external scripts
   - The backend now uses a simpler approach that doesn't require additional files

### Development vs Production

- **Development**: Uses `tsx` for hot reloading and direct TypeScript execution
- **Production**: Use `docker-compose -f docker-compose.prod.yml up --build` (when ready)

### Next Steps

Once the basic setup is working (you should see "Hello World" and the current GMT time), you can proceed to implement:
1. Drag-and-drop canvas functionality
2. Component palette (text, image, button)
3. Layout saving and loading
4. User interface for the layout builder

The foundation is now ready for the full Layout Builder implementation!