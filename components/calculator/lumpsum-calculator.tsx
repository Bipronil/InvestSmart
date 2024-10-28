"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function LumpSumCalculator() {
  const [investment, setInvestment] = useState(100000)
  const [years, setYears] = useState(5)
  const [expectedReturn, setExpectedReturn] = useState(12)

  const calculateLumpSum = () => {
    const futureValue = investment * Math.pow(1 + expectedReturn / 100, years)
    const wealthGained = futureValue - investment

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: investment,
      wealthGained: Math.round(wealthGained)
    }
  }

  const results = calculateLumpSum()
  
  const chartData = Array.from({ length: years + 1 }, (_, i) => ({
    year: i,
    value: Math.round(investment * Math.pow(1 + expectedReturn / 100, i))
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>Investment Amount (₹)</Label>
            <Input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              min={1000}
              max={10000000}
            />
            <Slider
              value={[investment]}
              onValueChange={([value]) => setInvestment(value)}
              min={1000}
              max={1000000}
              step={1000}
            />
          </div>

          <div className="space-y-2">
            <Label>Investment Period (Years)</Label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              min={1}
              max={30}
            />
            <Slider
              value={[years]}
              onValueChange={([value]) => setYears(value)}
              min={1}
              max={30}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Expected Return Rate (%)</Label>
            <Input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(Number(e.target.value))}
              min={1}
              max={30}
            />
            <Slider
              value={[expectedReturn]}
              onValueChange={([value]) => setExpectedReturn(value)}
              min={1}
              max={30}
              step={0.5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="text-muted-foreground">Invested Amount</Label>
              <p className="text-xl font-semibold">₹{results.totalInvestment.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Est. Returns</Label>
              <p className="text-xl font-semibold">₹{results.wealthGained.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Total Value</Label>
              <p className="text-xl font-semibold">₹{results.futureValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, "Value"]}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}