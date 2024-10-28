"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SipCalculator } from "@/components/calculator/sip-calculator"
import { LumpSumCalculator } from "@/components/calculator/lumpsum-calculator"
import { ReturnCalculator } from "@/components/calculator/return-calculator"

export default function CalculatorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Investment Calculator</h1>
        <p className="text-muted-foreground">Plan your investments and calculate potential returns</p>
      </div>

      <Tabs defaultValue="sip" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
          <TabsTrigger value="lumpsum">Lump Sum</TabsTrigger>
          <TabsTrigger value="returns">Returns Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="sip">
          <SipCalculator />
        </TabsContent>
        <TabsContent value="lumpsum">
          <LumpSumCalculator />
        </TabsContent>
        <TabsContent value="returns">
          <ReturnCalculator />
        </TabsContent>
      </Tabs>
    </div>
  )
}