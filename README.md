```
# 💰 Real-Time Crypto Tracker

<!-- Animated Typing Header -->
<div align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=30&duration=3000&pause=1000&color=F7931A&center=true&vCenter=true&width=600&lines=Real-Time+Crypto+Tracker;Live+Prices+%26+Charts;Powered+by+Binance+WebSocket;Built+with+Next.js+16" alt="Real-Time Crypto Tracker" />
  </a>
</div>

<br />

<!-- Title & Badges -->
<div align="center">
  <h1>🚀 Real-Time Crypto Tracker</h1>
  <p><strong>Live cryptocurrency dashboard with real-time price updates, interactive charts, and detailed coin information</strong></p>
  
  <br />
  
  <a href="https://realtime-crypto-tracker.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/LIVE_DEMO-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  
  <br />
  
  <!-- Tech Badges -->
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=recharts&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<br />

## ✨ Features

- ⚡ **Real-time Live Prices** – Binance WebSocket integration with a LIVE indicator showing price updates every second
- 📊 **Top 50 Cryptocurrencies** – View market cap, trading volume, and 24h change % at a glance
- 📈 **Interactive Price Charts** – Area charts with multiple intervals: 24H, 7D, 1M, and 1Y
- 🪙 **Detailed Coin Pages** – Comprehensive data including 24h high/low, all-time high, % from ATH, supply, and descriptions
- 🔍 **Instant Search** – Quickly find any cryptocurrency in the top 50
- 🎨 **Modern UI** – Dark glassmorphism design with full responsiveness
- 🛡️ **Smart Error Handling** – Auto-retry mechanisms for seamless user experience

<br />

## 🏗️ Architecture Overview

```

┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                        │
└─────────────────────────┬───────────────────────────────────────┘
│
┌────────────────┼────────────────┐
│                │                │
▼                ▼                ▼
┌─────────────────┐ ┌───────────────┐ ┌─────────────────────────┐
│  WebSocket      │ │  Next.js API  │ │  Next.js API            │
│  Connection     │ │  Routes       │ │  Routes                 │
│  (Client-Side)  │ │  (Serverless) │ │  (Serverless)           │
└────────┬────────┘ └───────┬───────┘ └───────────┬─────────────┘
│                  │                     │
▼                  ▼                     ▼
┌─────────────────┐ ┌───────────────┐ ┌─────────────────────────┐
│  Binance        │ │  Binance      │ │  CoinPaprika            │
│  WebSocket API  │ │  REST API     │ │  API                    │
│  (Live Streams) │ │  (Klines)     │ │  (Names, Logos, Desc)   │
└─────────────────┘ └───────────────┘ └─────────────────────────┘

```

<br />

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16 (App Router)** | Full-stack React framework with server-side rendering and API routes |
| **TypeScript** | Type-safe JavaScript for better developer experience |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **Recharts** | Composable charting library for React |
| **Binance WebSocket API** | Real-time price streaming for live updates |
| **Binance REST API** | Historical kline/candlestick data for charts |
| **CoinPaprika API** | Coin metadata (names, logos, descriptions) |
| **Next.js API Routes** | Serverless backend endpoints |
| **Vercel** | Automated deployment from GitHub with CI/CD |

<br />

## 📡 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/crypto/top10` | Get top 10 cryptocurrencies by market cap |
| `/api/crypto/[id]` | Get detailed information for a specific coin |
| `/api/crypto/[id]/chart` | Get historical chart data for a specific coin |
| `/api/binance/symbols` | Get available trading symbols from Binance |

<br />

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/AbbasFullstack/realtime-crypto-tracker.git

# Navigate to the project directory
cd realtime-crypto-tracker

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open http://localhost:3000 to view the application in your browser.

<br />

📁 Project Structure

```
realtime-crypto-tracker/
├── app/
│   ├── api/
│   │   ├── binance/
│   │   │   └── symbols/
│   │   │       └── route.ts          # Get Binance trading symbols
│   │   ├── crypto/
│   │   │   ├── [id]/
│   │   │   │   ├── chart/
│   │   │   │   │   └── route.ts      # Chart data endpoint
│   │   │   │   └── route.ts          # Single coin details
│   │   │   └── top10/
│   │   │       └── route.ts          # Top 10 coins endpoint
│   ├── coin/
│   │   └── [id]/
│   │       └── page.tsx              # Coin detail page
│   ├── components/
│   │   ├── CryptoTable.tsx           # Main table component
│   │   ├── PriceChart.tsx            # Chart component
│   │   └── SearchBar.tsx             # Search functionality
│   ├── hooks/
│   │   └── useWebSocket.ts           # WebSocket hook
│   ├── lib/
│   │   └── api.ts                    # API utilities
│   ├── types/
│   │   └── index.ts                  # TypeScript types
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── public/
│   └── favicon.ico
├── .env.local                        # Environment variables
├── next.config.js                    # Next.js configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

<br />

👨‍💻 About the Developer

<div align="center">
  <img src="https://github.com/AbbasFullstack.png" alt="Abbas Hussain" width="150" height="150" style="border-radius: 50%;" />

Abbas Hussain

Full-Stack Developer | Self-Taught Programmer

https://img.shields.io/badge/GitHub-AbbasFullstack-181717?style=for-the-badge&logo=github
https://img.shields.io/badge/Email-abbaswebdevelopers@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white

  <br />

Fun Fact: This entire project was built using only a mobile phone
with GitHub Codespaces and Termux! 📱💻

</div>

<br />

<div align="center">
  <img src="https://github-readme-stats.vercel.app/api?username=AbbasFullstack&show_icons=true&theme=tokyonight&hide_border=true" alt="GitHub Stats" />
</div>

<br />

📄 License

This project is licensed under the MIT License – see the LICENSE file for details.

<br />

---

<div align="center">
  <h3>⭐ If you found this project useful, please give it a star on GitHub! ⭐</h3>

  <br />

Made with ❤️ by Abbas Hussain

</div>

<br />

---

<div align="center">
  <sub>Built with Next.js 16, TypeScript, Tailwind CSS, and Binance WebSocket API</sub>
</div>
```