"use client"

const POLYGON_API_KEY = process.env.NEXT_PUBLIC_POLYGON_API_KEY
const BASE_URL = 'https://api.polygon.io'

// Add rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 200; // 200ms between requests

// Helper function for API calls
async function fetchPolygonData(endpoint: string) {
  try {
    // Implement rate limiting
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => 
        setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      )
    }
    
    // Ensure apiKey is always in the URL
    const separator = endpoint.includes('?') ? '&' : '?'
    const url = `${BASE_URL}${endpoint}${separator}apiKey=${POLYGON_API_KEY}`
    console.log('Fetching from:', url)
    
    lastRequestTime = Date.now()
    const response = await fetch(url)
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('API Response:', data)
    return data
  } catch (error) {
    console.error('Polygon API Error:', error)
    return null
  }
}

// Get real-time stock price with proper typing
interface StockPriceData {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
}

// Update to use previous close endpoint (available in free tier)
export async function getStockPrice(symbol: string): Promise<StockPriceData | null> {
  // Use previous day close endpoint instead of real-time
  const endpoint = `/v2/aggs/ticker/${symbol}/prev`
  const data = await fetchPolygonData(endpoint)
  
  if (data?.results?.[0]) {
    const result = data.results[0]
    return {
      symbol: symbol,
      price: result.c, // closing price
      size: result.v, // volume
      timestamp: result.t
    }
  }
  return null
}

// Get daily stock data
export async function getDailyStockData(symbol: string) {
  const today = new Date().toISOString().split('T')[0]
  const endpoint = `/v1/open-close/${symbol}/${today}?adjusted=true`
  return await fetchPolygonData(endpoint)
}

// Get market news
export async function getMarketNews(limit: number = 10) {
  const endpoint = `/v2/reference/news?limit=${limit}&order=desc&sort=published_utc`
  const data = await fetchPolygonData(endpoint)
  
  if (data?.results) {
    return data.results.map((news: any) => ({
      title: news.title,
      author: news.author,
      published: news.published_utc,
      article_url: news.article_url,
      description: news.description,
      tickers: news.tickers
    }))
  }
  return []
}

// Get company details
export async function getCompanyDetails(symbol: string) {
  const endpoint = `/v3/reference/tickers/${symbol}`
  return await fetchPolygonData(endpoint)
}

// Get market movers
export async function getMarketMovers() {
  // You'll need a premium subscription for this endpoint
  const endpoint = `/v2/snapshot/locale/us/markets/stocks/gainers`
  const data = await fetchPolygonData(endpoint)
  
  if (data?.tickers) {
    return data.tickers.map((ticker: any) => ({
      symbol: ticker.ticker,
      price: ticker.day.c,
      change: ticker.day.cp,
      volume: ticker.day.v
    }))
  }
  return []
}

// Get aggregated bars (for charts)
export async function getAggregatedBars(
  symbol: string,
  multiplier: number = 1,
  timespan: 'minute' | 'hour' | 'day' = 'day',
  from: string,
  to: string
) {
  const endpoint = `/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}?adjusted=true&apiKey=${POLYGON_API_KEY}`
  const data = await fetchPolygonData(endpoint)
  
  if (data?.results) {
    return data.results.map((bar: any) => ({
      timestamp: bar.t,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v
    }))
  }
  return []
}

// Get previous close
export async function getPreviousClose(symbol: string) {
  const endpoint = `/v2/aggs/ticker/${symbol}/prev`
  return await fetchPolygonData(endpoint)
}

// Get technical indicators (if you have premium subscription)
export async function getTechnicalIndicators(
  symbol: string,
  indicator: string = 'sma'
) {
  const endpoint = `/v1/indicators/${indicator}/${symbol}`
  return await fetchPolygonData(endpoint)
}

// Update market overview to use daily bars
export async function getMarketOverview(symbol: string = 'SPY') {
  const today = new Date()
  const pastDate = new Date()
  pastDate.setDate(today.getDate() - 7) // Get last 7 days of data
  
  const from = pastDate.toISOString().split('T')[0]
  const to = today.toISOString().split('T')[0]
  
  const endpoint = `/v2/aggs/ticker/${symbol}/range/1/day/${from}/${to}`
  const data = await fetchPolygonData(endpoint)
  
  if (data?.results) {
    return data.results.map((bar: any) => ({
      timestamp: bar.t,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v
    }))
  }
  return []
}

// Update top movers to use gainers/losers snapshot (if available in your tier)
export async function getTopMovers() {
  const endpoint = `/v2/snapshot/locale/us/markets/stocks/gainers`
  const data = await fetchPolygonData(endpoint)
  
  if (data?.tickers) {
    return {
      topGainers: data.tickers.slice(0, 5).map((ticker: any) => ({
        symbol: ticker.ticker,
        price: ticker.day.c,
        change_percentage: ticker.todaysChangePerc
      })),
      topLosers: [] // Free tier might not have access to losers
    }
  }
  return {
    topGainers: [],
    topLosers: []
  }
}
