"use client"

import { Suspense } from 'react'
import Watchlist from '@/components/dashboard/watchlist'
import MarketOverview from '@/components/dashboard/market-overview'
import TopMovers from '@/components/dashboard/top-movers'
import MarketNews from '@/components/dashboard/market-news'
import StockSearch from "@/components/dashboard/stock-search"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <StockSearch />
        <Suspense fallback={<div>Loading watchlist...</div>}>
          <Watchlist />
        </Suspense>

        <Suspense fallback={<div>Loading market overview...</div>}>
          <MarketOverview />
        </Suspense>

        <Suspense fallback={<div>Loading top movers...</div>}>
          <TopMovers />
        </Suspense>

        <Suspense fallback={<div>Loading market news...</div>}>
          <MarketNews />
        </Suspense>
      </div>
    </div>
  )
}
