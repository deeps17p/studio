"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import Link from "next/link";
import { BookText, FileText, PenSquare, ArrowRight, Lightbulb } from "lucide-react";
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

  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your sales communication activity.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Enhanced</CardTitle>
                <PenSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.enhanced}</div>
                <p className="text-xs text-muted-foreground">AI improvements applied</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.templates}</div>
                <p className="text-xs text-muted-foreground">Generated from product info</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Frequent Phrases</CardTitle>
                <BookText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{phrases.length}</div>
                <p className="text-xs text-muted-foreground">Saved for quick reuse</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Message Tone Analysis</CardTitle>
              <CardDescription>
                A summary of tones from your recently analyzed messages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="tone"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="bg-secondary/50 border-dashed">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Lightbulb className="h-6 w-6" />
                </div>
              </div>
              <div className="flex-1">
                <CardTitle>Sales Tip of the Day</CardTitle>
                <CardDescription className="mt-1">
                  Lead with the buyer's pain point. Address their problem before you mention your product.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <Button asChild className="w-full justify-start">
                  <Link href="/composer">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Compose New Message
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="w-full justify-start">
                  <Link href="/templates">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate a Template
                  </Link>
                </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Used Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              {phrases.length > 0 ? (
                <ul className="space-y-2">
                  {phrases.slice(0, 3).map((phrase, i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border bg-background p-3 text-sm">
                      <span className="truncate pr-4">{phrase}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">You haven't saved any phrases yet.</p>
                </div>
              )}
               <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/phrases">Manage Phrases</Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}