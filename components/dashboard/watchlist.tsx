"use client"

import { useEffect, useState } from "react"
import { getStockPrice } from "@/lib/polygon-api"

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  timestamp: number;
}

// Cache implementation
const CACHE: { [key: string]: { data: WatchlistItem; timestamp: number } } = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN']

  useEffect(() => {
    let mounted = true
    let retryTimeout: NodeJS.Timeout

    async function fetchStockWithCache(symbol: string): Promise<WatchlistItem | null> {
      // Check cache first
      const cached = CACHE[symbol]
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
      }

      try {
        const data = await getStockPrice(symbol)
        if (data) {
          const watchlistItem = {
            symbol: data.symbol,
            price: data.price,
            change: 0,
            timestamp: data.timestamp
          }
          // Update cache
          CACHE[symbol] = {
            data: watchlistItem,
            timestamp: Date.now()
          }
          return watchlistItem
        }
        return null
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error)
        // Return cached data if available, even if expired
        return cached?.data || null
      }
    }

    async function fetchWatchlistData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch with delay between requests
        const results = []
        for (const symbol of symbols) {
          const result = await fetchStockWithCache(symbol)
          if (result) {
            results.push(result)
          }
          // Add a small delay between requests
          await new Promise(resolve => setTimeout(resolve, 200))
        }

        if (mounted) {
          setWatchlist(results)
          setError(null)
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error)
        if (mounted) {
          setError('Failed to fetch watchlist data')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchWatchlistData()
    // Refresh every minute instead of every 10 seconds
    const interval = setInterval(fetchWatchlistData, 60000)

    return () => {
      mounted = false
      clearInterval(interval)
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [])

  if (loading && watchlist.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Watchlist</h2>
        <div className="animate-pulse">Loading watchlist...</div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Watchlist</h2>
      {error && (
        <div className="text-red-500 mb-4 text-sm">{error}</div>
      )}
      <div className="space-y-4">
        {watchlist.map(item => (
          <div key={item.symbol} className="flex justify-between items-center">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{item.symbol}</span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last: ${item.price.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(item.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
