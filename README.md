<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=28&pause=1000&color=F7931A&center=true&vCenter=true&width=850&lines=%F0%9F%9A%80+Real-Time+Crypto+Tracker;%E2%82%BF+Live+Cryptocurrency+Prices+Every+Second;%F0%9F%93%8A+Charts%2C+Markets%2C+%26+Coin+Insights;%E2%9A%A1+Powered+by+Binance+WebSocket" alt="Typing SVG" />
</a>

</div>

<div align="center">

# ₿ Real-Time Crypto Tracker

### A modern, real-time cryptocurrency dashboard for tracking the top 50 coins with live market data, interactive charts, and detailed coin analytics.

<p>
  <a href="https://realtime-crypto-tracker.vercel.app">
    <img src="https://img.shields.io/badge/%E2%82%BF%20LIVE%20DEMO-F7931A?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
  <a href="https://github.com/AbbasFullstack/realtime-crypto-tracker">
    <img src="https://img.shields.io/github/stars/AbbasFullstack/realtime-crypto-tracker?style=for-the-badge&color=F7931A&logo=github" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/AbbasFullstack/realtime-crypto-tracker/issues">
    <img src="https://img.shields.io/github/issues/AbbasFullstack/realtime-crypto-tracker?style=for-the-badge&color=blue" alt="Issues" />
  </a>
  <img src="https://img.shields.io/github/license/AbbasFullstack/realtime-crypto-tracker?style=for-the-badge&color=green" alt="License" />
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
  <img src="https://img.shields.io/badge/Binance-F0B90B?style=for-the-badge&logo=binance&logoColor=black" alt="Binance" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

</div>

---

## ✨ Features

- ⚡ **Real-time live prices** — Cryptocurrency prices update every second using Binance WebSocket streams.
- 🔴 **LIVE indicator** — Clearly shows when live market data is actively streaming.
- 🏆 **Top 50 cryptocurrencies** — Browse leading coins with market cap, volume, and 24-hour performance.
- 📈 **Interactive price charts** — Explore market movement across **24H, 7D, 1M, and 1Y** intervals.
- 🔎 **Instant search** — Quickly find cryptocurrencies without navigating through long lists.
- 💎 **Detailed coin pages** — View 24-hour high/low, all-time high, percentage from ATH, supply, descriptions, and more.
- 🌙 **Modern dark glassmorphism UI** — Designed for a clean, immersive crypto-market experience.
- 📱 **Fully responsive** — Optimized for desktop, tablet, and mobile screens.
- 🛡️ **Smart error handling** — Graceful API failures with automatic retry behavior.
- 🔄 **Hybrid data architecture** — Combines real-time WebSocket streams with REST APIs for historical and metadata-rich information.
- ☁️ **Serverless-ready** — Built with Next.js API Routes and deployed automatically through Vercel.

---

## 🏗️ Architecture

```text
                         ┌─────────────────────────┐
                         │        Browser          │
                         │                         │
                         │  Live Prices            │
                         │  Charts                  │
                         │  Search                  │
                         │  Coin Details            │
                         └───────────┬─────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    │ WebSocket                      │ HTTP
                    ▼                                 ▼
          ┌───────────────────┐             ┌──────────────────────┐
          │ Binance WebSocket │             │   Next.js API Routes │
          │                   │             │                      │
          │ Live price stream │             │ /api/crypto/*        │
          │ Every second      │             │ /api/binance/*       │
          └─────────┬─────────┘             └──────────┬───────────┘
                    │                                  │
                    │                                  │
                    ▼                         ┌────────┴─────────┐
          ┌───────────────────┐               │                  │
          │      Binance      │               ▼                  ▼
          │                   │       ┌───────────────┐  ┌────────────────┐
          │ Live Streams      │       │    Binance    │  │  CoinPaprika   │
          │ Klines / Candles  │       │  REST API     │  │      API       │
          └───────────────────┘       │               │  │                │
                                      │ Klines/Candles│  │ Names/Logos    │
                                      └───────────────┘  │ Descriptions   │
                                                         └────────────────┘

🧰 Tech Stack
Technology	Purpose
Next.js 16	Full-stack React framework using the App Router
TypeScript	Type-safe application development
Tailwind CSS	Responsive, utility-first styling
Recharts	Interactive cryptocurrency price charts
Binance WebSocket API	Real-time cryptocurrency price streams
Binance REST API	Historical market data and kline/candle data
CoinPaprika API	Coin names, logos, descriptions, and metadata
Next.js API Routes	Serverless backend/API layer
Vercel	Production hosting and automatic GitHub deployments
🔌 API Endpoints
Endpoint	Method	Description
/api/crypto/top10	GET	Retrieves the leading cryptocurrency market data
/api/crypto/[id]	GET	Retrieves detailed information for a specific cryptocurrency
/api/crypto/[id]/chart	GET	Retrieves historical kline/candle data for chart rendering
/api/binance/symbols	GET	Retrieves supported Binance trading symbols

Note: Live price updates are delivered directly through Binance WebSocket streams, while API Routes provide server-side access to market, chart, and metadata information.

🚀 Installation
Prerequisites

Make sure you have installed:

Node.js 18+
npm
Git
Clone the repository
git clone https://github.com/AbbasFullstack/realtime-crypto-tracker.git
cd realtime-crypto-tracker/frontend

Install dependencies
npm install

Start the development server
npm run dev


Open your browser and visit:

http://localhost:3000

Production build
npm run build
npm start

📁 Project Structure
realtime-crypto-tracker/
│
├── frontend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── binance/
│   │   │   │   └── symbols/
│   │   │   └── crypto/
│   │   │       ├── top10/
│   │   │       └── [id]/
│   │   │           └── chart/
│   │   │
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── charts/
│   │   ├── crypto/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── binance/
│   │   ├── coinpaprika/
│   │   └── utils/
│   │
│   ├── public/
│   │   └── ...
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   └── ...
│
├── .gitignore
├── README.md
└── LICENSE

👨‍💻 About the Developer
<div align="center"> <img src="https://github.com/AbbasFullstack.png" width="120" height="120" alt="Abbas Hussain" style="border-radius: 50%;" />
Abbas Hussain
Self-Taught Full-Stack Developer
<p> <a href="https://github.com/AbbasFullstack"> <img src="https://img.shields.io/badge/GitHub-%40AbbasFullstack-181717?style=for-the-badge&logo=github" alt="GitHub" /> </a> <a href="mailto:abbaswebdevelopers@gmail.com"> <img src="https://img.shields.io/badge/Email-abbaswebdevelopers%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /> </a> </p> <p> Passionate about building modern, scalable, and real-world web applications. </p>
💡 Fun Fact

This entire project was built using only a mobile phone 📱

Built with:

🐙 GitHub Codespaces
🖥️ Termux
☕ A lot of persistence
</div> <div align="center"> <img src="https://github-readme-stats.vercel.app/api?username=AbbasFullstack&show_icons=true&theme=tokyonight&hide_border=true&border_radius=12" alt="Abbas Hussain GitHub Stats" /> <br /> <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=AbbasFullstack&layout=compact&theme=tokyonight&hide_border=true&border_radius=12" alt="Top Languages" /> </div>
📜 License

This project is licensed under the MIT License.

You are free to use, modify, distribute, and build upon this project in accordance with the terms of the license.

See the LICENSE file for details.

<div align="center">
⭐ Like This Project?

If Real-Time Crypto Tracker helped you, inspired you, or you simply like the project:

⭐ Give the repository a star!
<a href="https://github.com/AbbasFullstack/realtime-crypto-tracker"> <img src="https://img.shields.io/badge/⭐%20Star%20on%20GitHub-F7931A?style=for-the-badge&logo=github&logoColor=white" alt="Star on GitHub" /> </a> <br /> <br />

Made with ❤️ by Abbas Hussain

</div> ```