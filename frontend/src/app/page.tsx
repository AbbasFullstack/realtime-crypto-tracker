'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_URL = 'https://fantastic-goldfish-qv7gxq6x5j7r29wq6-5000.app.github.dev'; 
    
    fetch(`${BACKEND_URL}/api/crypto/top10`)
      .then((res) => res.json())
      .then((data) => {
        setCryptos(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <div className="p-10 text-white text-center">Loading crypto data...</div>;

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
