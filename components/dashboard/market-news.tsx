"use client"

import { useEffect, useState } from 'react'
import { getMarketNews } from '@/lib/polygon-api'

interface NewsItem {
  title: string
  author: string
  published: string
  article_url: string
  description: string
  tickers: string[]
}

export default function MarketNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchNews() {
      try {
        setLoading(true)
        const data = await getMarketNews(5) // Fetch 5 news items
        
        if (mounted && data) {
          setNews(data)
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch news')
          console.error('Error fetching news:', err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchNews()
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (loading && news.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Market News</h2>
        <div>Loading news...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Market News</h2>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Market News</h2>
      <div className="space-y-4">
        {news.map((item, index) => (
          <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
            <a 
              href={item.article_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{item.author} • </span>
              <span>{new Date(item.published).toLocaleString()}</span>
              {item.tickers && item.tickers.length > 0 && (
                <span> • Related: {item.tickers.join(', ')}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
