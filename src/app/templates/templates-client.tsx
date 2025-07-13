
"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateSalesTemplateAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

const formSchema = z.object({
  productDescription: z
    .string()
    .min(10, { message: "Product description must be at least 10 characters." }),
  messageType: z.enum(["email", "WhatsApp", "text message"], {
    required_error: "You need to select a message type.",
  }),
  scenario: z
    .string()
    .min(5, { message: "Scenario must be at least 5 characters." }),
});

type ProductInfo = {
  name: string;
  description: string;
};

export function TemplatesClient() {
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [, setStats] = useLocalStorage("salespilot-stats", { enhanced: 12, templates: 5 });
  const [productInfo] = useLocalStorage<ProductInfo | null>("salespilot-product", null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
      scenario: "",
    },
  });

  useEffect(() => {
    if (productInfo?.description) {
      form.setValue("productDescription", productInfo.description);
    }
  }, [productInfo?.description, form.setValue]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await generateSalesTemplateAction(values);
      if (result.success) {
        setGeneratedTemplate(result.success.template);
        setStats(s => ({...s, templates: s.templates + 1}));
      } else {
        toast({ title: "Error", description: result.failure, variant: "destructive" });
      }
    });
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTemplate);
    toast({ title: "Copied!", description: "Template copied to clipboard." });
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Template Generator</h1>
        <p className="text-sm text-muted-foreground">
          Create contextual sales templates based on your product information.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>
              Provide details about your sales scenario. The product description is pre-filled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., An innovative CRM for small businesses that automates lead tracking."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="messageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a message type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="text message">Text Message</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="scenario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Scenario</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Follow-up after a demo, initial cold outreach" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Template
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Generated Template</CardTitle>
            <CardDescription>
              Your AI-generated template will appear below.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isPending ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              ) : generatedTemplate ? (
              <>
                <Textarea
                  value={generatedTemplate}
                  readOnly
                  rows={12}
                  className="bg-secondary"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p className="text-sm">Fill out the form to generate a template</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
