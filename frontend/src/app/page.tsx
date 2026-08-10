'use client';
import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Search, DollarSign, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/crypto/top10');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCryptos(data);
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
    } catch (err) {
      setError('Failed to load crypto data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = useMemo(() => {
    return cryptos.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [cryptos, search]);

  const stats = useMemo(() => {
    if (cryptos.length === 0) return null;
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
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
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
              const sparklineData = crypto.sparkline_in_7d?.price?.map((price, i) => ({
                value: price,
                time: i
              })) || [];

              return (
                <div
                  key={crypto.id}
                  className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 transition-all hover:scale-[1.02] backdrop-blur"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank & Image */}
                    <div className="flex items-center gap-3 min-w-[140px]">
                      <span className="text-sm text-slate-500 w-6">#{index + 1}</span>
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-sm">{crypto.name}</h3>
                        <p className="text-xs text-slate-400 uppercase">{crypto.symbol}</p>
                      </div>
                    </div>

                    {/* Sparkline Chart */}
                    <div className="hidden md:block w-32 h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? '#10b981' : '#ef4444'}
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
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
        <p>Powered by CoinGecko API • Built with Next.js</p>
        <p className="text-xs mt-1">Data refreshes every 60 seconds</p>
      </footer>
    </main>
  );
}
