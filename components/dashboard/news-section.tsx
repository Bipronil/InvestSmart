"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchMarketNews } from "@/lib/alpha-vantage"

interface NewsSectionProps {
  topics?: string[];
}

export default function NewsSection({ topics }: NewsSectionProps) {
  const [newsData, setNewsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNews() {
      const news = await fetchMarketNews(topics)
      setNewsData(news.slice(0, 10))
      setLoading(false)
    }

    loadNews()
    const interval = setInterval(loadNews, 300000) // Refresh every 5 minutes
    return () => clearInterval(interval)
  }, [topics])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market News</CardTitle>
          <CardDescription>Loading latest news...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market News</CardTitle>
        <CardDescription>Latest updates and analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {newsData.map((news, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-semibold text-lg">{news.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{news.source}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(news.time_published).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">{news.summary}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}