"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import { fetchTopGainers } from "@/lib/alpha-vantage"

export default function TopMovers() {
  const [topMovers, setTopMovers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTopMovers() {
      const { topGainers, topLosers } = await fetchTopGainers()
      // Ensure both arrays exist before spreading
      const gainersArray = Array.isArray(topGainers) ? topGainers : []
      const losersArray = Array.isArray(topLosers) ? topLosers : []
      
      const combinedMovers = [...gainersArray, ...losersArray]
        .sort((a, b) => Math.abs(parseFloat(b.change_percentage)) - Math.abs(parseFloat(a.change_percentage)))
        .slice(0, 4)
      
      setTopMovers(combinedMovers)
      setLoading(false)
    }

    loadTopMovers()
    const interval = setInterval(loadTopMovers, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Movers</CardTitle>
          <CardDescription>Loading market movers...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Movers</CardTitle>
        <CardDescription>Biggest price changes today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMovers.map((mover) => (
            <div key={mover.ticker} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{mover.ticker}</div>
                <div className="text-sm text-muted-foreground">{mover.price}</div>
              </div>
              <div className={`flex items-center ${parseFloat(mover.change_percentage) > 0 ? "text-green-600" : "text-red-600"}`}>
                {parseFloat(mover.change_percentage) > 0 ? 
                  <ArrowUpIcon className="h-4 w-4 mr-1" /> : 
                  <ArrowDownIcon className="h-4 w-4 mr-1" />
                }
                {Math.abs(parseFloat(mover.change_percentage)).toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
