<div align="center">

# 🧬 EvoSearch Lab

**The definitive interactive educational platform for understanding Genetic Algorithms and Informed Search Algorithms**

[![CI/CD](https://github.com/ammarasad2005/Algo-Visualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/ammarasad2005/Algo-Visualizer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

</div>

---

## ✨ Features

- 🎯 **18+ Algorithms** — Genetic Algorithms (OneMax, TSP, Function Optimization, Knapsack) + Informed Search (A\*, Greedy, IDA\*, Weighted A\*, Beam Search, Hill Climbing, Simulated Annealing)
- 🎬 **Step-by-Step Visualization** — Interactive animations with play/pause/step controls
- 📊 **Live Metrics** — Real-time fitness charts, diversity tracking, node expansion counts
- 🎮 **Fully Configurable** — Adjust all parameters: population size, mutation rate, heuristics, etc.
- 🖥️ **3-Column Layout** — Controls panel + Visualization canvas + Info panel
- 📚 **7 Tutorials** — Beginner to advanced content with inline visualizations
- ⚗️ **Playground** — Write custom fitness functions and heuristics in the browser
- 🔄 **Algorithm Comparison** — Side-by-side synchronized playback
- 🌙 **Dark Theme** — Designed for clarity with a dark aesthetic
- ♿ **Accessible** — ARIA labels, keyboard navigation, focus indicators

---

## 🏗️ Architecture

```
evosearch-lab/
├── client/              # React 18 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── engine/      # Algorithm implementations (GA + Search)
│   │   ├── components/  # UI components (common, layout, visualization)
│   │   ├── pages/       # Route pages
│   │   ├── hooks/       # Custom React hooks
│   │   ├── store/       # Zustand state management
│   │   └── types/       # TypeScript types
├── server/              # Express + Socket.IO backend
│   └── src/
│       ├── routes/      # REST API routes
│       ├── config/      # Database + environment config
│       └── middleware/  # Error handling, logging
├── shared/              # Shared TypeScript types
├── .github/workflows/   # CI/CD pipeline
├── Dockerfile           # Multi-stage Docker build
└── docker-compose.yml   # Docker Compose setup
```

---

## 🚀 Quick Start

### With npm

```bash
# Clone the repository
git clone https://github.com/ammarasad2005/Algo-Visualizer.git
cd Algo-Visualizer

# Install all dependencies
npm install
npm install --workspace=client
npm install --workspace=server

# Start development servers (frontend + backend)
npm run dev
```

The app will be available at **http://localhost:5173**

### With Docker

```bash
docker-compose up
```

The app will be available at **http://localhost:3000**

---

## 🧮 Algorithm Coverage

### Genetic Algorithms

| Problem | Encoding | Operators |
|---------|----------|-----------|
| **OneMax** | Binary | Bit-flip mutation, single/two-point/uniform crossover |
| **TSP** | Permutation | OX/PMX crossover, swap/inversion mutation |
| **Function Optimization** | Real-valued | SBX/BLX-α crossover, Gaussian mutation |
| **Knapsack** | Binary | All binary operators |

**Selection:** Roulette Wheel, Tournament (k=2,3,5), Rank-based, SUS, Elitism

**Crossover:** Single-point, Two-point, Uniform, Order (OX), PMX, BLX-α, SBX

**Mutation:** Bit-flip, Swap, Insertion, Inversion, Gaussian, Creep

### Informed Search Algorithms

| Algorithm | Complete | Optimal | Description |
|-----------|----------|---------|-------------|
| **A\*** | ✅ | ✅ | f(n) = g(n) + h(n) |
| **Greedy BFS** | ✅ | ❌ | f(n) = h(n) only |
| **Weighted A\*** | ✅ | ε-opt | f(n) = g(n) + ε·h(n) |
| **Beam Search** | ❌ | ❌ | Memory-bounded, width W |
| **Hill Climbing** | ❌ | ❌ | Local search |
| **Simulated Annealing** | ❌ | ❌ | P = exp(-ΔE/T) |

**Heuristics:** Manhattan, Euclidean, Chebyshev, Octile, Diagonal, Custom

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| State Management | Zustand |
| Visualization | D3.js v7 + HTML5 Canvas |
| Charting | Recharts |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Container | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## 📖 API Documentation

```
GET  /api/health                  Health check
GET  /api/presets                 List presets (?category, ?algorithmId)
GET  /api/presets/:id             Get preset by ID
POST /api/presets                 Create preset
DELETE /api/presets/:id           Delete preset
POST /api/algorithms/ga/run       Run GA (acknowledgment only — computation is client-side)
POST /api/algorithms/search/run   Run search (acknowledgment only)
POST /api/maze/generate           Generate random maze
POST /api/share                   Create shareable config
GET  /api/share/:shareId          Get shared config
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
