import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LineChart, Wallet2, Calculator, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          Smart Investing Made Simple
        </h1>
        <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
          Track markets, build portfolios, and make informed investment decisions with real-time data and powerful tools.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/learn">Learn More</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        <Card className="p-6 space-y-2">
          <LineChart className="h-12 w-12 text-primary mb-2" />
          <h3 className="font-semibold text-xl">Real-Time Markets</h3>
          <p className="text-muted-foreground">Track live market data and trends across multiple asset classes.</p>
        </Card>

        <Card className="p-6 space-y-2">
          <Wallet2 className="h-12 w-12 text-primary mb-2" />
          <h3 className="font-semibold text-xl">Portfolio Builder</h3>
          <p className="text-muted-foreground">Create and manage your investment portfolio with advanced analytics.</p>
        </Card>

        <Card className="p-6 space-y-2">
          <Calculator className="h-12 w-12 text-primary mb-2" />
          <h3 className="font-semibold text-xl">Investment Calculator</h3>
          <p className="text-muted-foreground">Plan your financial future with our powerful calculation tools.</p>
        </Card>

        <Card className="p-6 space-y-2">
          <BookOpen className="h-12 w-12 text-primary mb-2" />
          <h3 className="font-semibold text-xl">Educational Resources</h3>
          <p className="text-muted-foreground">Learn investment strategies and financial concepts.</p>
        </Card>
      </div>
    </div>
  );
}