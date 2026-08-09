const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route (Welcome Message) - YEH NAYA HAI
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 Crypto Tracker Backend API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            top10crypto: '/api/crypto/top10',
            cryptoDetails: '/api/crypto/:id'
        }
    });
});

// CoinGecko API Base URL
const API_URL = 'https://api.coingecko.com/api/v3';

// Route: Get Top 10 Cryptocurrencies
app.get('/api/crypto/top10', async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/coins/markets`, {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 10,
                page: 1,
                sparkline: false
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
    }
});

// Route: Get Single Cryptocurrency Details
app.get('/api/crypto/:id', async (req, res) => {
    try {
        const cryptoId = req.params.id;
        const response = await axios.get(`${API_URL}/coins/${cryptoId}`, {
            params: {
                localizations: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching crypto details:', error);
        res.status(500).json({ error: 'Failed to fetch cryptocurrency details' });
    }
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📊 API available at http://localhost:${PORT}/api`);
});
