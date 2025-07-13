
"use client";

import React, { useState, useTransition } from "react";
import {
  analyzeMessageToneAction,
  improveMessageClarityAction,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Wand2, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useLocalStorage } from "@/hooks/use-local-storage";

type ClarityResult = {
  improvedMessage: string;
  explanation: string;
};

type ToneResult = {
  tone: string;
  suggestions: string;
};

type ProductInfo = {
  name: string;
  description: string;
};

export function ComposerClient() {
  const [message, setMessage] = useState("");
  const [clarityResult, setClarityResult] = useState<ClarityResult | null>(
    null
  );
  const [toneResult, setToneResult] = useState<ToneResult | null>(null);
  const [activeTab, setActiveTab] = useState<"clarity" | "tone" | null>(null);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [, setStats] = useLocalStorage("salespilot-stats", { enhanced: 12, templates: 5 });
  const [productInfo] = useLocalStorage<ProductInfo | null>("salespilot-product", null);


  const handleImproveClarity = () => {
    if (!message) {
      toast({ title: "Message is empty", description: "Please enter a message to improve.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      setToneResult(null);
      setClarityResult(null);
      setActiveTab("clarity");
      const result = await improveMessageClarityAction({
        message,
        productContext: productInfo?.description,
      });
      if (result.success) {
        setClarityResult(result.success);
        setStats(s => ({...s, enhanced: s.enhanced + 1}));
      } else {
        toast({ title: "Error", description: result.failure, variant: "destructive" });
        setActiveTab(null);
      }
    });
  };

  const handleAnalyzeTone = () => {
    if (!message) {
      toast({ title: "Message is empty", description: "Please enter a message to analyze.", variant: "destructive" });
      return;
    }
    startTransition(async () => {
      setClarityResult(null);
      setToneResult(null);
      setActiveTab("tone");
      const result = await analyzeMessageToneAction({
        message,
        productContext: productInfo?.description,
      });
      if (result.success) {
        setToneResult(result.success);
      } else {
        toast({ title: "Error", description: result.failure, variant: "destructive" });
        setActiveTab(null);
      }
    });
  };

  const useImprovedMessage = () => {
    if (clarityResult) {
      setMessage(clarityResult.improvedMessage);
      setClarityResult(null);
      setActiveTab(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Message Composer</h1>
        <p className="text-muted-foreground">
          Write your message and use AI to enhance it with context from your product, {productInfo?.name || '...loading'}.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Message</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Textarea
              placeholder="Start writing your email, WhatsApp, or text message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleImproveClarity} disabled={isPending}>
                {isPending && activeTab === 'clarity' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Improve Clarity
              </Button>
              <Button onClick={handleAnalyzeTone} disabled={isPending} variant="outline">
                {isPending && activeTab === 'tone' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Analyze Tone
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 min-h-[400px]">
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>
              Suggestions and analysis will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : clarityResult ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Improved Message</h3>
                <Textarea
                  value={clarityResult.improvedMessage}
                  readOnly
                  rows={6}
                  className="bg-secondary"
                />
                 <Button onClick={useImprovedMessage}>
                    Use this version <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Separator />
                <h3 className="font-semibold">Explanation</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{clarityResult.explanation}</p>
              </div>
            ) : toneResult ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Overall Tone: <span className="text-primary">{toneResult.tone}</span></h3>
                <Separator />
                <h3 className="font-semibold">Suggestions for Improvement</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{toneResult.suggestions}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>Click a button to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
