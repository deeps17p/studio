
"use client";

import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import Link from "next/link";
import { BookText, FileText, PenSquare, Lightbulb } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

const chartData = [
  { tone: "Confident", count: 186 },
  { tone: "Friendly", count: 305 },
  { tone: "Formal", count: 237 },
  { tone: "Persuasive", count: 73 },
  { tone: "Casual", count: 209 },
];

const chartConfig = {
  count: {
    label: "Messages",
    color: "hsl(var(--primary))",
  },
};

export function DashboardClient() {
  const [phrases] = useLocalStorage<string[]>("frequent-phrases", []);
  const [stats] = useLocalStorage("salespilot-stats", { enhanced: 12, templates: 5 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const StatCard = ({ icon, title, value, subtitle }: { icon: React.ElementType, title: string, value: string | number, subtitle: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {React.createElement(icon, { className: "h-4 w-4 text-muted-foreground" })}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-5">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Here's your sales activity at a glance.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard icon={PenSquare} title="Messages Enhanced" value={isClient ? stats.enhanced : '...'} subtitle="AI improvements applied" />
        <StatCard icon={FileText} title="Templates Used" value={isClient ? stats.templates : '...'} subtitle="Generated from product info" />
        <StatCard icon={BookText} title="Frequent Phrases" value={isClient ? phrases.length : '...'} subtitle="Saved for quick reuse" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Message Tone Analysis</CardTitle>
                <CardDescription>A summary of tones from your recently analyzed messages.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="w-full h-72">
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="tone"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        

        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <Button asChild className="w-full justify-start text-base" size="lg">
                  <Link href="/composer">
                    <PenSquare className="mr-3 h-5 w-5" />
                    Compose New Message
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full justify-start text-base" size="lg">
                  <Link href="/templates">
                    <FileText className="mr-3 h-5 w-5" />
                    Generate a Template
                  </Link>
                </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-start gap-4">
               <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lightbulb className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Sales Tip of the Day</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Lead with the buyer's pain point. Address their problem before you mention your product.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
