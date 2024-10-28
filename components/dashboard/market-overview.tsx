"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchMarketOverview } from "@/lib/alpha-vantage"
import { AlertCircle } from "lucide-react"

interface MarketOverviewProps {
  symbol?: string;
  title?: string;
}

export default function MarketOverview({ symbol = "SPY", title = "Market Overview" }: MarketOverviewProps) {
  const [marketData, setMarketData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadMarketData() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchMarketOverview(symbol)
        
        if (!mounted) return

        if (!data || !data['Time Series (60min)']) {
          throw new Error('No market data available')
        }

        const timeSeriesData = data['Time Series (60min)']
        const chartData = Object.entries(timeSeriesData)
          .map(([timestamp, values]: [string, any]) => ({
            time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: parseFloat(values['4. close'])
          }))
          .slice(0, 8)
          .reverse()

        setMarketData(chartData)
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load market data')
          console.error('Market data error:', err)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadMarketData()
    const interval = setInterval(loadMarketData, 60000)
    
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [symbol])

  const latestValue = marketData[marketData.length - 1]?.value
  const previousValue = marketData[marketData.length - 2]?.value
  const changePercent = previousValue ? ((latestValue - previousValue) / previousValue) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{symbol}</CardDescription>
          </div>
          {!loading && !error && latestValue && (
            <div className="text-right">
              <div className="text-2xl font-bold">${latestValue.toFixed(2)}</div>
              <div className={changePercent >= 0 ? "text-green-600" : "text-red-600"}>
                {changePercent >= 0 ? "+" : ""}{changePercent.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        )}

        {error && (
          <div className="h-[200px] flex items-center justify-center text-center">
            <div className="space-y-2">
              <AlertCircle className="h-8 w-8 mx-auto text-yellow-500" />
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && marketData.length > 0 && (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  tickFormatter={(time) => time}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}