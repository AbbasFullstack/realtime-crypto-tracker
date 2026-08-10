'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ab API same domain par hai, isliye empty string
    const BACKEND_URL = ''; 
    
    fetch(`${BACKEND_URL}/api/crypto/top10`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setCryptos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load crypto data');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-white text-xl">Loading crypto data...</div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-red-400 text-xl">{error}</div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-gray-900">
      <h1 className="text-4xl font-bold text-white mb-10">Top 10 Cryptocurrencies</h1>
      <div className="w-full max-w-2xl">
        {cryptos.map((crypto: any) => (
          <div key={crypto.id} className="flex justify-between items-center p-4 mb-3 bg-gray-800 rounded-lg text-white shadow-lg">
            <div className="flex items-center gap-3">
              <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
              <div>
                <span className="font-bold block">{crypto.name}</span>
                <span className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</span>
              </div>
            </div>
            <span className="font-bold text-green-400">${crypto.current_price.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
