"use client";

import React, { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Trash2, PlusCircle } from "lucide-react";

export function PhrasesClient() {
  const [phrases, setPhrases] = useLocalStorage<string[]>("frequent-phrases", [
    "Just following up on our previous conversation.",
    "Hope you're having a great week!",
    "Let me know if you have any questions.",
  ]);
  const [newPhrase, setNewPhrase] = useState("");
  const { toast } = useToast();

  const addPhrase = () => {
    if (newPhrase.trim() === "") {
      toast({ title: "Cannot add empty phrase", variant: "destructive" });
      return;
    }
    setPhrases([newPhrase, ...phrases]);
    setNewPhrase("");
    toast({ title: "Phrase added!" });
  };

  const deletePhrase = (index: number) => {
    const updatedPhrases = phrases.filter((_, i) => i !== index);
    setPhrases(updatedPhrases);
    toast({ title: "Phrase deleted." });
  };

  const copyPhrase = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Phrase copied to clipboard." });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Frequent Phrases</h1>
        <p className="text-muted-foreground">
          Manage your saved phrases for quick access in your communications.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Phrase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-lg items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter a new phrase..."
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPhrase()}
            />
            <Button onClick={addPhrase}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {phrases.map((phrase, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <p className="text-sm text-foreground mb-4 h-16">{phrase}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                <Button variant="outline" size="icon" onClick={() => copyPhrase(phrase)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => deletePhrase(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
          </Card>
        ))}
        {phrases.length === 0 && (
            <Card className="md:col-span-2 lg:col-span-3">
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">No phrases saved yet. Add one above to get started.</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
