# Quick Setup Guide

## 🚀 Get Started in 2 Minutes

### Prerequisites
- **Docker Desktop** (Windows/macOS) or **Docker Engine** (Linux)
- **Node.js 18+** and **npm**
- **Git**

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd hqProject
   npm run setup
   ```

2. **Start the application**
   ```bash
   npm start
   ```

3. **Open your browser**
   - Visit: http://localhost:3000
   - Start building layouts!

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install dependencies and verify setup |
| `npm start` | Start the application |
| `npm run dev` | Start in development mode |
| `npm run stop` | Stop all containers |
| `npm run clean` | Remove all containers and volumes |
| `npm run logs` | View application logs |
| `npm test` | Run backend tests |

## 🆘 Troubleshooting

### Common Issues

**Docker not running:**
- Start Docker Desktop
- Wait for it to fully load
- Try `npm start` again

**Port conflicts:**
- Stop other services using ports 3000 or 3001
- Or modify ports in `docker-compose.yml`

**Setup fails:**
```bash
npm run clean
npm run setup
npm start
```

### Getting Help

1. Check the main [README.md](README.md) for detailed documentation
2. Run `npm run logs` to see application logs
3. Ensure Docker Desktop is running
4. Verify all prerequisites are installed

## 🎯 Next Steps

After successful setup:
1. Create your first layout
2. Explore the drag-and-drop interface
3. Try saving and loading layouts
4. Export layouts as HTML files

Happy building! 🎉 