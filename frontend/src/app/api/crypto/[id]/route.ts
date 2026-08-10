import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16 mein params ko await karna zaroori hai
    const { id } = await params;

    // Do API calls ek sath: description + prices
    const [coinRes, tickerRes] = await Promise.all([
      fetch(`https://api.coinpaprika.com/v1/coins/${id}`, { next: { revalidate: 300 } }),
      fetch(`https://api.coinpaprika.com/v1/tickers/${id}`, { next: { revalidate: 60 } })
    ]);

    if (!coinRes.ok || !tickerRes.ok) {
      throw new Error('Failed to fetch cryptocurrency details');
    }

    const coin = await coinRes.json();
    const ticker = await tickerRes.json();

    const symbol = (coin.symbol || ticker.symbol || '').toLowerCase();

    const formattedData = {
      id: coin.id,
      name: coin.name,
      symbol,
      image: {
        large: `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${symbol}.png`
      },
      description: {
        en: coin.description || 'No description available.'
      },
      homepage: {
        en: coin.links?.website?.[0] || ''
      },
      market_data: {
        current_price: { usd: ticker.quotes?.USD?.price || 0 },
        market_cap: { usd: ticker.quotes?.USD?.market_cap || 0 },
        total_volume: { usd: ticker.quotes?.USD?.volume_24h || 0 },
        high_24h: { usd: 0 },
        low_24h: { usd: 0 },
        price_change_24h: 0,
        price_change_percentage_24h: ticker.quotes?.USD?.percent_change_24h || 0,
        circulating_supply: ticker.circulating_supply || 0,
        total_supply: ticker.total_supply || 0,
        ath: { usd: ticker.quotes?.USD?.ath_price || 0 },
        atl: { usd: 0 }
      }
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching crypto details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency details' },
      { status: 500 }
    );
  }
}
