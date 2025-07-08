# Layout Builder - Drag & Drop Web Application

A modern, full-stack web application for creating and managing interactive layouts with drag-and-drop functionality. Built with React, Node.js, TypeScript, and PostgreSQL.

## Architecture Notes
The backend stuff is pretty straightforward. We have validation middleware that uses Zod, but there's only one route group; layout. We have the routes and controller for that entity broken out in a scalable way.

The frontend is much juicier. Usually when I set up a project, there are more pages/features mapped out, so I already know better how to group my custom hooks and components. For now though, we have the components fairly well broken into pages/groups. As the app develops, it's easier to know how to group these things.
In the same vein, we have the services folder, (api call-related functions), utils (more helper function type functionality), and hooks (for more broken out state management). As the app grows, it will be easier to group/combine different hooks or helpers since they're pretty modular right now.
 - architecture stuff written by me, not Cursor lol

## 🚀 Features

### Core Functionality
- **Drag & Drop Interface**: Intuitive canvas-based layout builder
- **Element Types**: Text boxes, images, and buttons with inline editing
- **Real-time Preview**: See changes instantly as you build
- **Layout Management**: Save, load, and organize multiple layouts
- **Export Options**: Download layouts as static HTML files
- **Undo/Redo**: Full history management for all changes
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **Dynamic Canvas**: Automatically adjusts to window size
- **Grid Snapping**: Precise element positioning with 10px grid
- **Collision Detection**: Prevents overlapping elements
- **History Tracking**: Complete undo/redo functionality
- **Layout Sharing**: Generate shareable links for layouts
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Custom Hooks** for state management
- **ResizeObserver** for dynamic canvas sizing

### Backend
- **Node.js** with Express and TypeScript
- **Prisma ORM** with PostgreSQL
- **Zod** for request/response validation
- **Rate limiting** and security middleware
- **CORS** enabled for frontend communication

### Database
- **PostgreSQL 15** with persistent storage
- **Prisma migrations** for schema management
- **Layout Persistence** I chose to use a JSON array of objects instead of an HTML string as that is how they're represented in the UI. I didn't want to deal with potential data loss/corruption by converting the HTML string to and from JSON.

### Development
- **Docker Compose** for easy setup
- **Hot reloading** for both frontend and backend
- **TypeScript** for type safety
- **ESLint** and **Prettier** for code quality

## 📦 Quick Start

### Prerequisites
- **Docker Desktop** (Windows/macOS) or **Docker Engine** (Linux)
- **Git** for cloning the repository
- **Node.js 18+** (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hqProject
   ```

2. **Install dependencies and start the application**
   ```bash
   # Install dependencies
   npm run setup
   
   # Start the application
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: PostgreSQL on localhost:5432

### Alternative Setup (Manual)

If you prefer manual setup:

```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..

# Start with Docker
docker-compose up --build
```

## 🎯 Usage

### Creating a Layout
1. **Add Elements**: Click buttons in the element palette to add text, images, or buttons
2. **Position Elements**: Drag elements around the canvas to position them
3. **Resize Elements**: Use the resize handles to adjust element size
4. **Edit Content**: Click on text or button elements to edit their content
5. **Save Layout**: Enter a layout name and click "Save" to persist your work

### Managing Layouts
- **Dashboard**: View all your saved layouts
- **Edit**: Click "Edit" to modify existing layouts
- **Share**: Generate shareable links for read-only access
- **Download**: Export layouts as static HTML files
- **Delete**: Remove layouts you no longer need

### Advanced Features
- **Undo/Redo**: Use the toolbar buttons or keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- **Preview Mode**: Toggle preview mode to see the final layout
- **Grid Snapping**: Elements automatically snap to a 10px grid
- **Collision Prevention**: Elements can't overlap (prevents accidental overlaps)

## 🔧 Development

### Project Structure
```
hqProject/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Frontend Docker configuration
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── validation/     # Zod validation schemas
│   ├── prisma/             # Database schema and migrations
│   ├── Dockerfile          # Backend Docker configuration
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Docker orchestration
├── setup.js               # Cross-platform setup script
└── README.md              # This file
```

### Available Scripts

#### Root Level (package.json)
- `npm run setup` - Install dependencies for both frontend and backend
- `npm start` - Start the application with Docker Compose
- `npm run dev` - Start in development mode with hot reloading
- `npm run stop` - Stop all Docker containers
- `npm run clean` - Remove all Docker containers and volumes
- `npm run logs` - View application logs

#### Frontend (frontend/package.json)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend (backend/package.json)
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run test` - Run Jest tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database

### API Endpoints

#### Layout Management
- `GET /api/layouts?userId=...` - Get all layouts for a user
- `GET /api/layouts/:id` - Get a specific layout
- `POST /api/layouts` - Create or update a layout
- `DELETE /api/layouts/:id` - Delete a layout

#### System
- `GET /health` - Health check endpoint
- `GET /api/time` - Get current server time (for testing)

### Database Schema

The application uses PostgreSQL with the following main tables:

```sql
-- Layouts table
CREATE TABLE layouts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests (if configured)
cd frontend && npm test
```

### API Testing
The backend includes Jest tests for the layout API endpoints. Run them with:
```bash
cd backend && npm test
```

## 🔒 Security Features

- **Input Sanitization**: All user input is sanitized to prevent XSS attacks
- **Rate Limiting**: API endpoints are rate-limited to prevent abuse
- **CORS Protection**: Configured for secure cross-origin requests
- **Parameterized Queries**: Database queries use parameterized statements
- **Validation**: All requests are validated using Zod schemas

## 🚀 Deployment

### Docker Deployment
The application is containerized and ready for deployment:

```bash
# Build and start
docker-compose up --build -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/layoutbuilder"
PORT=3001
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Docker containers won't start:**
```bash
# Clean up and restart
npm run clean
npm start
```

**Database connection issues:**
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

**Frontend not loading:**
- Check that Docker Desktop is running
- Verify ports 3000 and 3001 are available
- Check browser console for errors

**Backend API errors:**
- Check backend logs: `docker-compose logs backend`
- Verify database is running: `docker-compose ps`

### Getting Help

If you encounter issues:
1. Check the troubleshooting section above
2. Review the application logs
3. Ensure all prerequisites are installed
4. Try the clean setup process

## 🎉 Acknowledgments

- Built with modern web technologies for optimal developer experience
- Designed for scalability and maintainability
- Includes comprehensive error handling and user feedback
- Optimized for both development and production environments