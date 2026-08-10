import { NextResponse } from 'next/server';

// Binance API se candlestick (klines) data fetch karta hai
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Symbol (jaise BTC) aur interval (1h, 1d, etc.)
    const symbol = (searchParams.get('symbol') || 'BTC').toUpperCase();
    const interval = searchParams.get('interval') || '1h';
    const limit = searchParams.get('limit') || '168'; // 168 hours = 7 days
    
    const pair = `${symbol}USDT`;
    
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${interval}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const klines = await response.json();

    if (!Array.isArray(klines)) {
      throw new Error('Invalid data format');
    }

    // Binance ka raw data array-of-arrays hota hai, hum isko clean objects mein badalte hain
    const chartData = klines.map((k: any[]) => ({
      time: k[0],                      // Open time (timestamp)
      open: parseFloat(k[1]),          // Opening price
      high: parseFloat(k[2]),          // Highest price
      low: parseFloat(k[3]),           // Lowest price
      close: parseFloat(k[4]),         // Closing price (yeh chart mein use hoga)
      volume: parseFloat(k[5])         // Trading volume
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
