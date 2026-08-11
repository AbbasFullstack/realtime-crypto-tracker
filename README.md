![Header](https://capsule-render.vercel.app/api?type=waving&height=230&section=header&text=Real-Time%20Crypto%20Tracker&fontSize=46&fontColor=ffffff&animation=twinkling&desc=Live%20Prices%20%E2%80%A2%20Interactive%20Charts%20%E2%80%A2%20Binance%20WebSocket&descAlignY=72&color=gradient&customColorList=10)

<div align="center">

<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=24&pause=1000&color=F7931A&center=true&vCenter=true&width=700&lines=Live+Prices+via+Binance+WebSocket;Interactive+Charts+%26+Market+Data;Built+Entirely+on+a+Mobile+Phone" alt="Typing SVG"/>

**Live cryptocurrency dashboard — real-time prices, interactive charts & detailed market data**

[![LIVE DEMO](https://img.shields.io/badge/🚀_LIVE_DEMO-realtime--crypto--tracker.vercel.app-orange?style=for-the-badge&logo=vercel&logoColor=white)](https://realtime-crypto-tracker.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-Charts-0088FE?style=for-the-badge)](https://recharts.org)
[![Binance](https://img.shields.io/badge/Binance-WebSocket-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](https://binance.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ Features

<div align="center">

[![⚡ Real-Time Live Prices](https://img.shields.io/badge/⚡_Real_Time_Live_Prices-Binance_WebSocket-green?style=for-the-badge)](#)
[![📊 Interactive Charts](https://img.shields.io/badge/📊_Interactive_Charts-24H_7D_1M_1Y-blue?style=for-the-badge)](#)
[![💰 Top 50 Coins](https://img.shields.io/badge/💰_Top_50_Coins-MarketCap_Volume-orange?style=for-the-badge)](#)

[![🔍 Instant Search](https://img.shields.io/badge/🔍_Instant_Search-Fast_Filter-purple?style=for-the-badge)](#)
[![🪙 Coin Detail Pages](https://img.shields.io/badge/🪙_Coin_Details-ATH_High_Low-red?style=for-the-badge)](#)
[![🎨 Modern Dark UI](https://img.shields.io/badge/🎨_Modern_UI-Glassmorphism-teal?style=for-the-badge)](#)

</div>

---

## 🏗️ Architecture

```text
        WebSocket (live every second)
Browser ───────────────────────────► Binance Stream
   │
   │ REST
   ▼
Next.js API Routes ──cached fetch──► Binance REST + CoinPaprika
```

---

## 🛠️ Tech Stack

<div align="center">

[![Next.js 16](https://img.shields.io/badge/Next.js_16-App_Router_+_API_Routes-black?style=for-the-badge&logo=next.js)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Type_Safety-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Rapid_UI-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Recharts](https://img.shields.io/badge/Recharts-Area_Charts-0088FE?style=for-the-badge)](#)
[![Binance WebSocket](https://img.shields.io/badge/Binance_WebSocket-Live_Streams-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](#)
[![CoinPaprika](https://img.shields.io/badge/CoinPaprika-Names_+_Descriptions-822250?style=for-the-badge)](#)
[![Vercel](https://img.shields.io/badge/Vercel-Auto_Deploy-black?style=for-the-badge&logo=vercel)](#)

</div>

---

## 🌐 API Endpoints

```text
GET /api/crypto/top10        → Top 50 coins (live market data)
GET /api/crypto/[id]         → Coin details (price, supply, description)
GET /api/crypto/[id]/chart   → Candlestick data (?symbol=BTC&interval=1h)
GET /api/binance/symbols     → Active Binance USDT pairs
```

---

## 📦 Installation

```bash
git clone https://github.com/AbbasFullstack/realtime-crypto-tracker.git
cd realtime-crypto-tracker/frontend
npm install
npm run dev
```

> 🚀 Open **http://localhost:3000** and enjoy live crypto data!

---

## 📁 Project Structure

```text
realtime-crypto-tracker/
└── frontend/
    └── src/app/
        ├── api/
        │   ├── crypto/
        │   │   ├── top10/route.ts         # Top 50 coins
        │   │   ├── [id]/route.ts          # Coin details
        │   │   └── [id]/chart/route.ts    # Binance klines
        │   └── binance/symbols/route.ts   # Valid pairs
        ├── crypto/[id]/page.tsx           # Detail page + live WS
        └── page.tsx                       # Main list + live WS
```

---

## 👨‍💻 About the Developer

<div align="center">

<img src="https://github.com/AbbasFullstack.png" width="120" height="120" alt="Abbas Hussain"/>

### **Abbas Hussain**
*Full-Stack Web Developer*

[![GitHub](https://img.shields.io/badge/GitHub-AbbasFullstack-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AbbasFullstack)
[![Email](https://img.shields.io/badge/abbaswebdevelopers@gmail.com-Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:abbaswebdevelopers@gmail.com)

> 🎯 Self-taught developer building production-ready full-stack apps
> 💻 Next.js • TypeScript • Tailwind • REST & WebSocket APIs
> 📱 **Fun fact:** this entire project was built using only a mobile phone (GitHub Codespaces + Termux)!

### 📊 Development Activity

![Contribution Graph](https://ghchart.rshah.org/F7931A/AbbasFullstack)

</div>

---

## 📄 License

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#)

**Made with ❤️ by Abbas Hussain**

⭐ *Star this repo if you find it helpful!*

</div>

![Footer](https://capsule-render.vercel.app/api?type=wave&height=110&section=footer&color=gradient&customColorList=10)