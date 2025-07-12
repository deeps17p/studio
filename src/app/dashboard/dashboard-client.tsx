"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import Link from "next/link";
import { BookText, FileText, PenSquare, ArrowRight } from "lucide-react";
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a summary of your sales communication activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <Card className="bg-primary text-primary-foreground sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Start Writing</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Craft your next sales message with AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/composer">
                Go to Composer <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
                    tickFormatter={(value) => value.substring(0, 3)}
                  />
                  <YAxis />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Frequently Used Phrases</CardTitle>
            <CardDescription>
              Your saved phrases for quick access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {phrases.length > 0 ? (
              <ul className="space-y-2">
                {phrases.slice(0, 5).map((phrase, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md bg-secondary p-3 text-sm">
                    <span className="truncate pr-4">{phrase}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <p>You haven't saved any phrases yet.</p>
                <Button variant="link" asChild><Link href="/phrases">Add a Phrase</Link></Button>
              </div>
            )}
             {phrases.length > 5 && (
               <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/phrases">View All Phrases</Link>
                </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
