
"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleWhatsappObjectionAction } from "@/app/actions";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Bot } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";

const formSchema = z.object({
  conversationThread: z
    .string()
    .min(20, { message: "Conversation thread must be at least 20 characters." }),
  context: z
    .string()
    .min(5, { message: "Context must be at least 5 characters." }),
});

type ProductInfo = {
  name: string;
  description: string;
};

export function WhatsappFollowupClient() {
  const [suggestedReply, setSuggestedReply] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [productInfo] = useLocalStorage<ProductInfo | null>("salespilot-product", null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      conversationThread: "",
      context: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await handleWhatsappObjectionAction({
        ...values,
        productContext: productInfo?.description,
      });
      if (result.success) {
        setSuggestedReply(result.success.suggestedReply);
      } else {
        toast({ title: "Error", description: result.failure, variant: "destructive" });
      }
    });
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestedReply);
    toast({ title: "Copied!", description: "Reply copied to clipboard." });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp Objection Handler</h1>
        <p className="text-muted-foreground">
          Paste a conversation, provide context, and get an AI-powered reply.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Conversation Details</CardTitle>
            <CardDescription>
              Help the AI understand the situation. Your product info will be added automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="conversationThread"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Conversation Thread</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the entire conversation here..."
                          {...field}
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="context"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal for the Reply</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'Overcome price objection', 'Book a meeting'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Reply
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>Suggested Reply</CardTitle>
            <CardDescription>
              Your AI-generated reply will appear below. Review and send.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {isPending ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Bot className="h-10 w-10 mb-4 animate-bounce text-primary" />
                <p className="text-muted-foreground">Thinking of a perfect reply...</p>
              </div>
              ) : suggestedReply ? (
              <>
                <Textarea
                  value={suggestedReply}
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
                <p>Fill out the form to generate a reply</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
