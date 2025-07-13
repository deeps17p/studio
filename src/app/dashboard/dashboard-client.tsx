
"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import Link from "next/link";
import { BookText, FileText, PenSquare, ArrowRight, Lightbulb } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

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

const NeumorphicCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-2xl bg-card p-6 shadow-[5px_5px_10px_#1a1a1a,-5px_-5px_10px_#2e2e2e]", className)}>
    {children}
  </div>
);

export function DashboardClient() {
  const [phrases] = useLocalStorage<string[]>("frequent-phrases", []);
  const [stats] = useLocalStorage("salespilot-stats", { enhanced: 12, templates: 5 });

  const StatCard = ({ icon, title, value, subtitle }: { icon: React.ElementType, title: string, value: string | number, subtitle: string }) => (
    <NeumorphicCard>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {React.createElement(icon, { className: "h-5 w-5 text-muted-foreground" })}
      </div>
      <div>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </NeumorphicCard>
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground text-lg">
          Here's your sales activity at a glance.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={PenSquare} title="Messages Enhanced" value={stats.enhanced} subtitle="AI improvements applied" />
        <StatCard icon={FileText} title="Templates Used" value={stats.templates} subtitle="Generated from product info" />
        <StatCard icon={BookText} title="Frequent Phrases" value={phrases.length} subtitle="Saved for quick reuse" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <NeumorphicCard className="h-full">
            <h3 className="text-lg font-semibold">Message Tone Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A summary of tones from your recently analyzed messages.
            </p>
            <div className="h-72 w-full">
              <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis
                      dataKey="tone"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </NeumorphicCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <NeumorphicCard>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
               <Button asChild className="w-full justify-start text-base py-6" size="lg">
                  <Link href="/composer">
                    <PenSquare className="mr-3 h-5 w-5" />
                    Compose New Message
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full justify-start text-base py-6" size="lg">
                  <Link href="/templates">
                    <FileText className="mr-3 h-5 w-5" />
                    Generate a Template
                  </Link>
                </Button>
            </div>
          </NeumorphicCard>
          
          <NeumorphicCard>
             <div className="flex items-start gap-4">
               <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Lightbulb className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Sales Tip of the Day</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Lead with the buyer's pain point. Address their problem before you mention your product.
                </p>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </div>
    </div>
  );
}
