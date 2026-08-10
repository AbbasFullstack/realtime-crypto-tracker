import { NextResponse } from 'next/server';

// Binance par kaunse coins available hain, yeh list deta hai (1 ghante ke liye cached)
export async function GET() {
  try {
    const res = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
      next: { revalidate: 3600 }
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();

    const symbols = data.symbols
      .filter((s: any) => s.quoteAsset === 'USDT' && s.status === 'TRADING')
      .map((s: any) => s.baseAsset);

    return NextResponse.json([...new Set(symbols)]);
  } catch (error) {
    console.error('Error fetching Binance symbols:', error);
    return NextResponse.json([], { status: 500 });
  }
}
