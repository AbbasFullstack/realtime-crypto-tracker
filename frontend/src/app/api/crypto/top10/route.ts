import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Sahi endpoint: /v1/tickers (prices ke sath, top 50)
    const response = await fetch(
      'https://api.coinpaprika.com/v1/tickers?quotes=USD&limit=50',
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid data format');
    }

    const formattedData = data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: (coin.symbol || '').toLowerCase(),
      image: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${(coin.symbol || '').toLowerCase()}.png`,
      current_price: coin.quotes?.USD?.price || 0,
      market_cap: coin.quotes?.USD?.market_cap || 0,
      total_volume: coin.quotes?.USD?.volume_24h || 0,
      price_change_percentage_24h: coin.quotes?.USD?.percent_change_24h || 0,
      sparkline_in_7d: { price: [] },
      high_24h: 0,
      low_24h: 0
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    );
  }
}
