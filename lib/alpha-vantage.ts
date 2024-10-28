"use client"

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo'
const BASE_URL = 'https://www.alphavantage.co/query'

// Mock data for development and fallback
const MOCK_DATA = {
  marketOverview: {
    "Time Series (60min)": {
      "2024-01-01 16:00:00": { "1. open": "400.50", "2. high": "401.20", "3. low": "399.80", "4. close": "400.90", "5. volume": "1000000" },
      "2024-01-01 15:00:00": { "1. open": "399.80", "2. high": "400.50", "3. low": "399.20", "4. close": "400.50", "5. volume": "950000" }
    }
  },
  stockPrice: {
    "Global Quote": {
      "01. symbol": "DEMO",
      "02. open": "400.50",
      "03. high": "401.20",
      "04. low": "399.80",
      "05. price": "400.90",
      "06. volume": "1000000",
      "07. latest trading day": "2024-01-01",
      "08. previous close": "399.90",
      "09. change": "1.00",
      "10. change percent": "0.25%"
    }
  },
  news: [
    {
      title: "Market Update",
      source: "Financial News",
      time_published: new Date().toISOString(),
      summary: "Latest market developments and analysis."
    }
  ],
  topMovers: {
    top_gainers: [
      { ticker: "DEMO1", price: "100.00", change_percentage: "5.00" }
    ],
    top_losers: [
      { ticker: "DEMO2", price: "90.00", change_percentage: "-4.00" }
    ]
  }
}

// Add rate limiting
const CACHE = new Map()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours instead of 1 minute

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    console.log('Fetching:', url) // Debug URL
    const response = await fetch(url, {
      signal: controller.signal,
    })
    clearTimeout(id)
    
    const data = await response.json()
    console.log('API Response:', data) // Debug response
    
    // Check for API limits
    if (data.Note && data.Note.includes('API call frequency')) {
      console.error('API rate limit reached:', data.Note)
      throw new Error(data.Note)
    }
    
    // Check for API-specific error responses
    if (data['Error Message']) {
      console.error('API error:', data['Error Message'])
      throw new Error(data['Error Message'])
    }
    
    return data
  } catch (error: any) {
    clearTimeout(id)
    console.error('API Error:', error.message)
    return null
  }
}

// Add these utility functions
const getFromStorage = (key: string) => {
  if (typeof window === 'undefined') return null;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const saveToStorage = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

export async function fetchStockPrice(symbol: string) {
  const storageKey = `stock_${symbol}`;
  const cached = getFromStorage(storageKey);
  
  // Return cached data if it's less than 24 hours old
  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
    console.log(`Using cached data for ${symbol}`);
    return cached.data;
  }

  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const data = await fetchWithTimeout(url);
    
    if (data && data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
      // Cache successful responses
      saveToStorage(storageKey, {
        data: data['Global Quote'],
        timestamp: Date.now()
      });
      return data['Global Quote'];
    }
    
    // If we hit the rate limit, use cached data if available
    if (data?.Information?.includes('rate limit') && cached) {
      console.log(`Using cached data for ${symbol} due to rate limit`);
      return cached.data;
    }
    
    console.warn(`Using mock data for ${symbol}`);
    return { ...MOCK_DATA.stockPrice['Global Quote'], "01. symbol": symbol };
  } catch (error) {
    if (cached) {
      return cached.data;
    }
    console.error(`Error fetching stock price for ${symbol}:`, error);
    return { ...MOCK_DATA.stockPrice['Global Quote'], "01. symbol": symbol };
  }
}

export async function fetchMarketOverview(symbol: string = 'SPY') {
  try {
    const url = `${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`
    const data = await fetchWithTimeout(url)
    
    if (!data || !data['Time Series (60min)']) {
      console.warn(`Using mock data for market overview`)
      return MOCK_DATA.marketOverview
    }
    
    return data
  } catch (error) {
    console.error(`Error fetching market overview for ${symbol}:`, error)
    return MOCK_DATA.marketOverview
  }
}

export async function fetchTopGainers(category?: string) {
  try {
    const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
    const data = await fetchWithTimeout(url)
    
    if (!data || (!data.top_gainers && !data.top_losers)) {
      console.warn('Using mock data for top movers')
      // Return arrays instead of the topMovers object
      return {
        topGainers: MOCK_DATA.topMovers.top_gainers || [],
        topLosers: MOCK_DATA.topMovers.top_losers || []
      }
    }
    
    let gainers = data.top_gainers || []
    let losers = data.top_losers || []

    if (category) {
      gainers = gainers.filter((item: any) => item.type === category)
      losers = losers.filter((item: any) => item.type === category)
    }

    return { topGainers: gainers, topLosers: losers }
  } catch (error) {
    console.error('Error fetching top movers:', error)
    // Return arrays instead of the topMovers object
    return {
      topGainers: MOCK_DATA.topMovers.top_gainers || [],
      topLosers: MOCK_DATA.topMovers.top_losers || []
    }
  }
}

export async function fetchMarketNews(topics?: string[]) {
  try {
    const url = `${BASE_URL}?function=NEWS_SENTIMENT&apikey=${API_KEY}${topics ? `&topics=${topics.join(',')}` : ''}`
    const data = await fetchWithTimeout(url)
    
    if (!data || !data.feed) {
      console.warn('Using mock data for news')
      return MOCK_DATA.news
    }
    
    return data.feed
  } catch (error) {
    console.error('Error fetching market news:', error)
    return MOCK_DATA.news
  }
}
