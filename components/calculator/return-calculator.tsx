"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ReturnCalculator() {
  const [initialAmount, setInitialAmount] = useState("")
  const [finalAmount, setFinalAmount] = useState("")
  const [years, setYears] = useState("")
  const [result, setResult] = useState<number | null>(null)

  const calculateReturn = () => {
    const initial = parseFloat(initialAmount)
    const final = parseFloat(finalAmount)
    const period = parseFloat(years)

    if (initial && final && period) {
      const rate = (Math.pow(final / initial, 1 / period) - 1) * 100
      setResult(parseFloat(rate.toFixed(2)))
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-6 max-w-md mx-auto">
          <div className="space-y-2">
            <Label>Initial Investment Amount (₹)</Label>
            <Input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="Enter initial amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Final Amount (₹)</Label>
            <Input
              type="number"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
              placeholder="Enter final amount"
            />
          </div>

          <div className="space-y-2">
            <Label>Time Period (Years)</Label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="Enter number of years"
            />
          </div>

          <Button onClick={calculateReturn}>Calculate Returns</Button>

          {result !== null && (
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">Annual Return Rate</p>
              <p className="text-3xl font-bold">{result}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}