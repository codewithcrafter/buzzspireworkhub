"use client";

import React, { useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AiAssistantPage() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        
        setIsLoading(true);
        setResponse("");

        try {
            const res = await fetch("/api/admin/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt, action: "generate_copy" })
            });

            const data = await res.json();
            if (data.success) {
                setResponse(data.response);
            } else {
                setResponse("Failed to generate content.");
            }
        } catch (error) {
            setResponse("Network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-primary" />
                    AI Marketing Assistant
                </h1>
                <p className="text-muted-foreground mt-2">
                    Generate marketing strategies, SEO content, and email campaigns instantly.
                </p>
            </div>

            <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-4">
                <Textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., Write a 500-word SEO blog post about digital marketing trends in 2026..."
                    className="h-32 text-sm"
                />
                
                <Button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !prompt}
                    className="rounded-full w-48"
                >
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Send className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Generating..." : "Generate Content"}
                </Button>
            </div>

            {response && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-6 relative">
                    <h3 className="text-sm font-bold text-primary mb-2 uppercase tracking-widest">AI Output</h3>
                    <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {response}
                    </div>
                </div>
            )}
        </div>
    );
}
