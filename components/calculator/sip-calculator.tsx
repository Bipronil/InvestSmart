"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
  const [years, setYears] = useState(10)
  const [expectedReturn, setExpectedReturn] = useState(12)

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / (12 * 100)
    const months = years * 12
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
      (1 + monthlyRate)
    
    const totalInvestment = monthlyInvestment * months
    const wealthGained = futureValue - totalInvestment

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      wealthGained: Math.round(wealthGained)
    }
  }

  const results = calculateSIP()
  
  const chartData = Array.from({ length: years + 1 }, (_, i) => {
    const yearlyData = calculateSIP()
    return {
      year: i,
      value: Math.round(yearlyData.futureValue * (i / years))
    }
  })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label>Monthly Investment (₹)</Label>
            <Input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              min={500}
              max={1000000}
            />
            <Slider
              value={[monthlyInvestment]}
              onValueChange={([value]) => setMonthlyInvestment(value)}
              min={500}
              max={100000}
              step={500}
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