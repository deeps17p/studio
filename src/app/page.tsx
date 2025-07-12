
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/icons";
import { Loader2 } from "lucide-react";

type ProductInfo = {
  name: string;
  description: string;
};

export default function OnboardingPage() {
  const [productInfo, setProductInfo] = useLocalStorage<ProductInfo | null>("salespilot-product", null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (productInfo) {
      router.replace("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [productInfo, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      setProductInfo({ name, description });
      // The useEffect will catch the change and redirect
    }
  };

  if (isLoading) {
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
          <CardTitle className="text-3xl">Welcome to SalesPilot AI</CardTitle>
          <CardDescription>
            Let's customize the app for your product. This will be used to generate hyper-relevant sales content.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-2">
               <label htmlFor="product-description" className="text-sm font-medium text-foreground">Product Description</label>
              <Textarea
                id="product-description"
                placeholder="Describe your product in a few sentences. What does it do? Who is it for? What makes it unique?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={5}
                className="text-base"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={!name.trim() || !description.trim()}>
              Get Started
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
