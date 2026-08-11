'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Globe, Code, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketData {
  current_price: { usd: number };
  market_cap: { usd: number };
  total_volume: { usd: number };
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: { usd: number };
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  description: { en: string };
  market_data: MarketData;
}

interface ChartPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface LiveData {
  price: number;
  changePct: number;
  high: number;
  low: number;
  volume: number;
}

const INTERVALS = [
  { label: '24H', value: '1h', limit: '24' },
  { label: '7D', value: '1h', limit: '168' },
  { label: '1M', value: '1d', limit: '30' },
  { label: '1Y', value: '1d', limit: '365' },
];

export default function CryptoDetail() {
  const params = useParams();
  const router = useRouter();
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [intervalIndex, setIntervalIndex] = useState(1);
  const [live, setLive] = useState<LiveData | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Coin details fetch
  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/crypto/${params.id}`);
        if (!res.ok) throw new Error('Failed to fetch cryptocurrency details');
        const data = await res.json();
        setCrypto(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load cryptocurrency details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  // LIVE WebSocket connection (Binance)
  useEffect(() => {
    if (!crypto) return;
    const symbol = crypto.symbol.toLowerCase();
    // data-stream.binance.vision: public market-data WebSocket (geo-block nahi hota)
    const ws = new WebSocket(`wss://data-stream.binance.vision/ws/${symbol}usdt@ticker`);

    ws.onopen = () => setWsConnected(true);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLive({
          price: parseFloat(data.c),
          changePct: parseFloat(data.P),
          high: parseFloat(data.h),
          low: parseFloat(data.l),
          volume: parseFloat(data.q),
        });
      } catch {}
    };
    ws.onclose = () => setWsConnected(false);
    ws.onerror = () => setWsConnected(false);

    return () => ws.close();
  }, [crypto]);

  // Chart data fetch (Binance)
  useEffect(() => {
    if (!crypto) return;
    const fetchChart = async () => {
      try {
        setChartLoading(true);
        const active = INTERVALS[intervalIndex];
        const res = await fetch(
          `/api/crypto/${params.id}/chart?symbol=${crypto.symbol.toUpperCase()}&interval=${active.value}&limit=${active.limit}`
        );
        if (!res.ok) throw new Error('Chart not available');
        const data = await res.json();
        setChartData(Array.isArray(data) ? data : []);
      } catch {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [crypto, intervalIndex, params.id]);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  const compactPrice = (v: number) => {
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
    if (v < 1) return `$${v.toFixed(4)}`;
    return `$${v.toFixed(2)}`;
  };

  const formatTime = (t: number) => {
    const d = new Date(t);
    if (INTERVALS[intervalIndex].value === '1h') {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </main>
    );
  }

  if (error || !crypto) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Not found'}</p>
          <button onClick={() => router.push('/')} className="px-6 py-2 bg-orange-500 rounded-lg">
            Go Back
          </button>
        </div>
      </main>
    );
  }

  const marketData = crypto.market_data;

  // LIVE values (agar WebSocket connected hai) warna static values
  const currentPrice = live?.price ?? marketData.current_price.usd;
  const changePct = live?.changePct ?? marketData.price_change_percentage_24h;
  const isPositive = changePct >= 0;
  const athPrice = marketData.ath.usd;
  const fromAth = athPrice > 0 ? ((currentPrice - athPrice) / athPrice) * 100 : 0;

  const chartUp = chartData.length > 1 ? chartData[chartData.length - 1].close >= chartData[0].close : true;
  const chartColor = chartUp ? '#10b981' : '#ef4444';

  const ChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as ChartPoint;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm shadow-xl">
          <p className="text-slate-400 text-xs mb-1">{new Date(point.time).toLocaleString()}</p>
          <p className="text-white font-bold">{formatPrice(point.close)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to List</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Coin Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={crypto.image.large} alt={crypto.name} className="w-20 h-20 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold mb-1">{crypto.name}</h1>
            <p className="text-slate-400 uppercase">{crypto.symbol}</p>
          </div>
          <div className={`ml-auto px-4 py-2 rounded-xl ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            <div className="flex items-center gap-2">
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-xl font-bold">{isPositive ? '+' : ''}{changePct.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        {/* Current Price + LIVE Indicator */}
        <div className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-orange-400" />
              <span className="text-slate-300">Current Price</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                {wsConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              <span className="text-xs font-bold text-slate-300">{wsConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>
          <p className={`text-4xl font-bold transition-colors ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {formatPrice(currentPrice)}
          </p>
        </div>

        {/* Price Chart */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h2 className="text-lg font-bold">Price Chart</h2>
            <div className="flex gap-2">
              {INTERVALS.map((int, i) => (
                <button
                  key={int.label}
                  onClick={() => setIntervalIndex(i)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                    i === intervalIndex
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {int.label}
                </button>
              ))}
            </div>
          </div>

          {chartLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatTime}
                    stroke="#475569"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={50}
                  />
                  <YAxis
                    stroke="#475569"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={compactPrice}
                    tickLine={false}
                    axisLine={false}
                    width={65}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={chartColor}
                    strokeWidth={2}
                    fill="url(#priceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              Chart not available for this coin on Binance
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300">Market Cap</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(marketData.market_cap.usd)}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-slate-300">24h Volume</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(live?.volume ?? marketData.total_volume.usd)}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-slate-300">24h High</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{live ? formatPrice(live.high) : '—'}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-slate-300">24h Low</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{live ? formatPrice(live.low) : '—'}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-300">All Time High</span>
            </div>
            <p className="text-2xl font-bold">{formatPrice(athPrice)}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-slate-300">From ATH</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{fromAth.toFixed(2)}%</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span className="text-slate-300">Circulating Supply</span>
            </div>
            <p className="text-2xl font-bold">{marketData.circulating_supply ? marketData.circulating_supply.toLocaleString() : 'N/A'} {crypto.symbol.toUpperCase()}</p>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-5 h-5 text-pink-400" />
              <span className="text-slate-300">Total Supply</span>
            </div>
            <p className="text-2xl font-bold">{marketData.total_supply ? marketData.total_supply.toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        {/* Description */}
        {crypto.description.en && (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">About {crypto.name}</h2>
            <p className="text-slate-300 leading-relaxed">{crypto.description.en}</p>
          </div>
        )}
      </div>
    </main>
  );
}
