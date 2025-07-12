
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import { Loader2, Sparkles } from "lucide-react";
import { researchProductAction } from "./actions";
import { useToast } from "@/hooks/use-toast";

type ProductInfo = {
  name: string;
  description: string;
};

const researchSteps = [
    "Connecting to research AI...",
    "Analyzing product features...",
    "Scanning competitor landscape...",
    "Identifying target audience...",
    "Synthesizing value proposition...",
    "Finalizing product profile...",
];

export default function OnboardingPage() {
  const [productInfo, setProductInfo] = useLocalStorage<ProductInfo | null>("salespilot-product", null);
  const [name, setName] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isResearching, setIsResearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (productInfo) {
      router.replace("/dashboard");
    } else {
      setIsCheckingAuth(false);
    }
  }, [productInfo, router]);

  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (isResearching) {
          interval = setInterval(() => {
              setCurrentStep(prev => {
                  if(prev < researchSteps.length - 1) {
                      return prev + 1;
                  }
                  clearInterval(interval);
                  return prev;
              })
          }, 1500);
      }
      return () => clearInterval(interval);
  }, [isResearching]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsResearching(true);
      setCurrentStep(0);
      startTransition(async () => {
        const result = await researchProductAction({ productName: name });
        if (result.success) {
          setProductInfo({ name, description: result.success.productDescription });
          // The useEffect listening to productInfo will handle the redirect.
        } else {
          toast({ title: "Research Failed", description: result.failure, variant: "destructive" });
          setIsResearching(false);
        }
      });
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="absolute top-8 left-8 flex items-center gap-2">
            <Logo className="size-8 fill-primary" />
            <h1 className="text-2xl font-semibold text-primary">SalesPilot AI</h1>
        </div>
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          {isResearching ? (
             <CardTitle className="text-3xl text-center">Configuring Your AI...</CardTitle>
          ) : (
            <>
              <CardTitle className="text-3xl">Welcome to SalesPilot AI</CardTitle>
              <CardDescription>
                To start, tell us the name of your product. We'll do the rest.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {isResearching ? (
             <div className="flex flex-col items-center justify-center space-y-4 h-48">
                <Sparkles className="h-12 w-12 animate-pulse text-primary" />
                <p className="text-muted-foreground animate-in fade-in-50 duration-500">{researchSteps[currentStep]}</p>
             </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium text-foreground">Product Name</label>
              <Input
                id="product-name"
                placeholder="e.g., Skydo, Stripe, Notion"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-base"
              />
            </div>
            
            <Button type="submit" className="w-full" size="lg" disabled={!name.trim() || isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Start Research
            </Button>
          </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
