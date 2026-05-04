"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Fraud alert volume over time"

const chartData = [
  { date: "2024-04-01", alerts: 42, confirmed: 8 },
  { date: "2024-04-02", alerts: 37, confirmed: 5 },
  { date: "2024-04-03", alerts: 55, confirmed: 11 },
  { date: "2024-04-04", alerts: 61, confirmed: 14 },
  { date: "2024-04-05", alerts: 73, confirmed: 18 },
  { date: "2024-04-06", alerts: 68, confirmed: 15 },
  { date: "2024-04-07", alerts: 52, confirmed: 9 },
  { date: "2024-04-08", alerts: 89, confirmed: 22 },
  { date: "2024-04-09", alerts: 34, confirmed: 6 },
  { date: "2024-04-10", alerts: 61, confirmed: 13 },
  { date: "2024-04-11", alerts: 77, confirmed: 17 },
  { date: "2024-04-12", alerts: 65, confirmed: 12 },
  { date: "2024-04-13", alerts: 82, confirmed: 20 },
  { date: "2024-04-14", alerts: 47, confirmed: 9 },
  { date: "2024-04-15", alerts: 39, confirmed: 7 },
  { date: "2024-04-16", alerts: 44, confirmed: 8 },
  { date: "2024-04-17", alerts: 96, confirmed: 24 },
  { date: "2024-04-18", alerts: 84, confirmed: 21 },
  { date: "2024-04-19", alerts: 63, confirmed: 13 },
  { date: "2024-04-20", alerts: 29, confirmed: 5 },
  { date: "2024-04-21", alerts: 47, confirmed: 8 },
  { date: "2024-04-22", alerts: 64, confirmed: 14 },
  { date: "2024-04-23", alerts: 58, confirmed: 10 },
  { date: "2024-04-24", alerts: 87, confirmed: 19 },
  { date: "2024-04-25", alerts: 65, confirmed: 15 },
  { date: "2024-04-26", alerts: 35, confirmed: 6 },
  { date: "2024-04-27", alerts: 93, confirmed: 22 },
  { date: "2024-04-28", alerts: 42, confirmed: 8 },
  { date: "2024-04-29", alerts: 75, confirmed: 16 },
  { date: "2024-04-30", alerts: 104, confirmed: 28 },
  { date: "2024-05-01", alerts: 55, confirmed: 12 },
  { date: "2024-05-02", alerts: 73, confirmed: 18 },
  { date: "2024-05-03", alerts: 67, confirmed: 14 },
  { date: "2024-05-04", alerts: 85, confirmed: 22 },
  { date: "2024-05-05", alerts: 101, confirmed: 27 },
  { date: "2024-05-06", alerts: 108, confirmed: 30 },
  { date: "2024-05-07", alerts: 88, confirmed: 20 },
  { date: "2024-05-08", alerts: 49, confirmed: 9 },
  { date: "2024-05-09", alerts: 57, confirmed: 11 },
  { date: "2024-05-10", alerts: 73, confirmed: 17 },
  { date: "2024-05-11", alerts: 85, confirmed: 19 },
  { date: "2024-05-12", alerts: 57, confirmed: 12 },
  { date: "2024-05-13", alerts: 57, confirmed: 10 },
  { date: "2024-05-14", alerts: 98, confirmed: 26 },
  { date: "2024-05-15", alerts: 103, confirmed: 28 },
  { date: "2024-05-16", alerts: 78, confirmed: 20 },
  { date: "2024-05-17", alerts: 109, confirmed: 32 },
  { date: "2024-05-18", alerts: 75, confirmed: 15 },
  { date: "2024-05-19", alerts: 55, confirmed: 9 },
  { date: "2024-05-20", alerts: 47, confirmed: 8 },
  { date: "2024-05-21", alerts: 32, confirmed: 5 },
  { date: "2024-05-22", alerts: 31, confirmed: 4 },
  { date: "2024-05-23", alerts: 62, confirmed: 13 },
  { date: "2024-05-24", alerts: 74, confirmed: 16 },
  { date: "2024-05-25", alerts: 61, confirmed: 12 },
  { date: "2024-05-26", alerts: 63, confirmed: 11 },
  { date: "2024-05-27", alerts: 110, confirmed: 34 },
  { date: "2024-05-28", alerts: 63, confirmed: 11 },
  { date: "2024-05-29", alerts: 28, confirmed: 5 },
  { date: "2024-05-30", alerts: 80, confirmed: 18 },
  { date: "2024-05-31", alerts: 58, confirmed: 10 },
  { date: "2024-06-01", alerts: 58, confirmed: 11 },
  { date: "2024-06-02", alerts: 100, confirmed: 29 },
  { date: "2024-06-03", alerts: 43, confirmed: 7 },
  { date: "2024-06-04", alerts: 99, confirmed: 25 },
  { date: "2024-06-05", alerts: 38, confirmed: 6 },
  { date: "2024-06-06", alerts: 74, confirmed: 15 },
  { date: "2024-06-07", alerts: 83, confirmed: 19 },
  { date: "2024-06-08", alerts: 95, confirmed: 22 },
  { date: "2024-06-09", alerts: 118, confirmed: 35 },
  { date: "2024-06-10", alerts: 45, confirmed: 9 },
  { date: "2024-06-11", alerts: 32, confirmed: 5 },
  { date: "2024-06-12", alerts: 102, confirmed: 28 },
  { date: "2024-06-13", alerts: 31, confirmed: 4 },
  { date: "2024-06-14", alerts: 96, confirmed: 22 },
  { date: "2024-06-15", alerts: 77, confirmed: 17 },
  { date: "2024-06-16", alerts: 91, confirmed: 21 },
  { date: "2024-06-17", alerts: 115, confirmed: 36 },
  { date: "2024-06-18", alerts: 37, confirmed: 7 },
  { date: "2024-06-19", alerts: 81, confirmed: 19 },
  { date: "2024-06-20", alerts: 108, confirmed: 31 },
  { date: "2024-06-21", alerts: 49, confirmed: 10 },
  { date: "2024-06-22", alerts: 77, confirmed: 17 },
  { date: "2024-06-23", alerts: 110, confirmed: 33 },
  { date: "2024-06-24", alerts: 42, confirmed: 8 },
  { date: "2024-06-25", alerts: 51, confirmed: 9 },
  { date: "2024-06-26", alerts: 94, confirmed: 24 },
  { date: "2024-06-27", alerts: 108, confirmed: 29 },
  { date: "2024-06-28", alerts: 49, confirmed: 10 },
  { date: "2024-06-29", alerts: 43, confirmed: 8 },
  { date: "2024-06-30", alerts: 116, confirmed: 32 },
]

const chartConfig = {
  transactions: {
    label: "Transaction Volume",
  },
  alerts: {
    label: "Fraud Alerts",
    color: "var(--primary)",
  },
  confirmed: {
    label: "Confirmed Fraud",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig


export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Fraud Alert Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Alerts vs. confirmed fraud for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Alert trends</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="confirmed"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-confirmed)"
              stackId="a"
            />
            <Area
              dataKey="alerts"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-alerts)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
