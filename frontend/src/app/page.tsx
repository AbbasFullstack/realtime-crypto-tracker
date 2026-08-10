'use client';
import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Search, DollarSign, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
  high_24h: number;
  low_24h: number;
}

export default function Home() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [listLive, setListLive] = useState(false);
  const [streamSymbols, setStreamSymbols] = useState<string[]>([]);
  const pendingRef = useRef<Record<string, Partial<Crypto>>>({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crypto/top10');
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      
      if (!Array.isArray(data)) {
        throw new Error('API Rate Limit Reached. Please wait a minute.');
      }
      
      setCryptos(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
      // Sirf pehli baar symbols save karein (WebSocket ke liye)
      setStreamSymbols(prev => prev.length === 0 ? data.map((c: Crypto) => c.symbol) : prev);
    } catch (err) {
      setError('Failed to load crypto data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // LIVE WebSocket - saare coins ek connection par
  useEffect(() => {
    if (streamSymbols.length === 0) return;
    let ws: WebSocket | null = null;
    let cancelled = false;

    const setup = async () => {
      try {
        const res = await fetch('/api/binance/symbols');
        if (!res.ok) return;
        const valid: string[] = await res.json();
        if (cancelled) return;
        
        const validSet = new Set(valid.map(v => v.toUpperCase()));
        const streams = streamSymbols
          .filter(s => validSet.has(s.toUpperCase()))
          .map(s => `${s.toLowerCase()}usdt@miniTicker`);
        
        if (streams.length === 0) return;
        
        ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`);
        ws.onopen = () => setListLive(true);
        ws.onclose = () => setListLive(false);
        ws.onerror = () => setListLive(false);
        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            const d = msg.data;
            if (!d || !d.s) return;
            const sym = d.s.replace(/USDT$/i, '').toLowerCase();
            const price = parseFloat(d.c);
            const open = parseFloat(d.o);
            pendingRef.current[sym] = {
              current_price: price,
              price_change_percentage_24h: open > 0 ? ((price - open) / open) * 100 : 0,
              total_volume: parseFloat(d.q),
            };
          } catch {}
        };
      } catch {}
    };

    setup();
    return () => { cancelled = true; ws?.close(); };
  }, [streamSymbols]);

  // Har 1 second mein pending updates ko screen par lagayein (smooth performance)
  useEffect(() => {
    const flush = setInterval(() => {
      const pending = pendingRef.current;
      if (Object.keys(pending).length === 0) return;
      pendingRef.current = {};
      setCryptos(prev => prev.map(c => pending[c.symbol] ? { ...c, ...pending[c.symbol] } : c));
    }, 1000);
    return () => clearInterval(flush);
  }, []);

  const filteredCryptos = useMemo(() => {
    if (!Array.isArray(cryptos)) return [];
    return cryptos.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [cryptos, search]);

  const stats = useMemo(() => {
    if (!Array.isArray(cryptos) || cryptos.length === 0) return null;
    const totalMarketCap = cryptos.reduce((acc, c) => acc + c.market_cap, 0);
    const totalVolume = cryptos.reduce((acc, c) => acc + c.total_volume, 0);
    const avgChange = cryptos.reduce((acc, c) => acc + c.price_change_percentage_24h, 0) / cryptos.length;
    return { totalMarketCap, totalVolume, avgChange };
  }, [cryptos]);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatPrice = (price: number) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Crypto Tracker</h1>
                <p className="text-xs text-slate-400">Real-time prices</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {listLive && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  LIVE
                </span>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search cryptocurrency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        {stats && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 border border-blue-500/30 rounded-2xl p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-300">Market Cap</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(stats.totalMarketCap)}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-500/30 rounded-2xl p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-300">24h Volume</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(stats.totalVolume)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 border border-green-500/30 rounded-2xl p-5 backdrop-blur">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-slate-300">Avg Change</span>
              </div>
              <p className={`text-2xl font-bold ${stats.avgChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
              </p>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-xs text-slate-500 mb-4">Last updated: {lastUpdated}</p>
        )}

        {/* Loading State */}
        {loading && cryptos.length === 0 && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-slate-700 rounded w-1/4" />
                  </div>
                  <div className="h-6 bg-slate-700 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchData}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Crypto List */}
        {!loading && filteredCryptos.length > 0 && (
          <div className="space-y-3">
            {filteredCryptos.map((crypto, index) => {
              const isPositive = crypto.price_change_percentage_24h >= 0;

              return (
                <Link href={`/crypto/${crypto.id}`} key={crypto.id} className="block">
                  <div className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 transition-all hover:scale-[1.02] backdrop-blur cursor-pointer">
                    <div className="flex items-center gap-4">
                      {/* Rank & Image (with smart fallback) */}
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <span className="text-sm text-slate-500 w-6">#{index + 1}</span>
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-10 h-10 rounded-full"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://placehold.co/64x64/334155/ffffff?text=${crypto.symbol.toUpperCase().slice(0, 4)}`;
                          }}
                        />
                        <div>
                          <h3 className="font-bold text-sm">{crypto.name}</h3>
                          <p className="text-xs text-slate-400 uppercase">{crypto.symbol}</p>
                        </div>
                      </div>

                      {/* Price Change */}
                      <div className="flex-1 text-right">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span className="text-sm font-semibold">
                            {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-lg">{formatPrice(crypto.current_price)}</p>
                        <p className="text-xs text-slate-400">Vol: {formatNumber(crypto.total_volume)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCryptos.length === 0 && search && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No cryptocurrency found for "{search}"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-10 py-6 text-center text-sm text-slate-500">
        <p>Powered by Binance & CoinPaprika API • Built with Next.js</p>
        <p className="text-xs mt-1">Live prices via WebSocket</p>
      </footer>
    </main>
  );
}
