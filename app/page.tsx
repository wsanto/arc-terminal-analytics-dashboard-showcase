"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SystemHealthDashboard } from "@/components/system-health-dashboard"
import { BusinessMetricsDashboard } from "@/components/business-metrics-dashboard"
import { Activity, TrendingUp } from "lucide-react"
import Image from "next/image"

export default function ReportingDashboard() {
  const [activeTab, setActiveTab] = useState("business")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo-lotus.png" alt="Arc Terminal Logo" width={40} height={40} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Arc Terminal</h1>
                <p className="text-sm text-muted-foreground">Internal Reporting Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-1.5">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">System Operational</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Business Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="system" className="space-y-6">
            <SystemHealthDashboard />
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <BusinessMetricsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
