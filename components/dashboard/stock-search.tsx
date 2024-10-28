"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getStockPrice } from "@/lib/polygon-api"

interface SearchResult {
  symbol: string
  price: number
  timestamp: number
}

export default function StockSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery) return

    setLoading(true)
    setError(null)
    
    try {
      const symbol = searchQuery.toUpperCase()
      const result = await getStockPrice(symbol)
      
      if (result) {
        setSearchResult({
          symbol: result.symbol,
          price: result.price,
          timestamp: result.timestamp
        })
        setError(null)
      } else {
        setSearchResult(null)
        setError("Stock not found. Please check the symbol and try again.")
      }
    } catch (err) {
      setSearchResult(null)
      setError("Failed to fetch stock data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stock Search</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Searching..."
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        {searchResult && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {searchResult.symbol}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {new Date(searchResult.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${searchResult.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
