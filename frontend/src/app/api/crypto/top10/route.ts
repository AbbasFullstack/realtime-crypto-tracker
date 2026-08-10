import { NextResponse } from 'next/server';

   export async function GET() {
     try {
       // CoinGecko API se data fetch kar rahe hain
       const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
       
       const data = await response.json();
       
       // Data ko wapis bhej rahe hain
       return NextResponse.json(data);
     } catch (error) {
       console.error('Error fetching crypto data:', error);
       return NextResponse.json({ error: 'Failed to fetch cryptocurrency data' }, { status: 500 });
     }
   }
