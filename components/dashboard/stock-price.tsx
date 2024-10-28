"use client"

import { useEffect, useState } from 'react'
import { getStockPrice } from '@/lib/polygon-api'

interface StockPriceProps {
  symbol: string
}

export default function StockPrice({ symbol }: StockPriceProps) {
  const [priceData, setPriceData] = useState<{
    price: number;
    timestamp: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    let mounted = true
    
    async function fetchPrice() {
      try {
        setLoading(true)
        const data = await getStockPrice(symbol)
        
        if (mounted && data) {
          setPriceData({
            price: data.price,
            timestamp: data.timestamp
          })
          setError(null)
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to fetch price data')
          console.error('Error fetching price:', err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchPrice()
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchPrice, 10000) // every 10 seconds

    // Cleanup
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [symbol])

  if (loading && !priceData) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <h2>{symbol}</h2>
      {priceData && (
        <>
          <p className="text-2xl font-bold">${priceData.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date(priceData.timestamp).toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  )
}
