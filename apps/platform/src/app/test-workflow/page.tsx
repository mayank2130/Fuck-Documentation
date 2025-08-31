"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TestWorkflowPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("from:support@company.com");
  const [databaseId, setDatabaseId] = useState("support_tickets");

  const runWorkflow = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/test-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          databaseId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Workflow failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Gmail → Notion Workflow</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Workflow Configuration</CardTitle>
          <CardDescription>
            Monitor Gmail for new emails and create Notion pages automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="query">Gmail Query</Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="from:support@company.com"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Gmail search query to filter emails
            </p>
          </div>
          
          <div>
            <Label htmlFor="databaseId">Notion Database ID</Label>
            <Input
              id="databaseId"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              placeholder="support_tickets"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Notion database where pages will be created
            </p>
          </div>

          <Button 
            onClick={runWorkflow} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Running Workflow..." : "Run Workflow"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Workflow Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Emails Found:</h3>
                <p className="text-sm text-gray-600">{result.emailsFound} emails</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Notion Pages Created:</h3>
                <p className="text-sm text-gray-600">{result.pagesCreated} pages</p>
              </div>

              {result.details && (
                <div>
                  <h3 className="font-semibold">Details:</h3>
                  <Textarea
                    value={JSON.stringify(result.details, null, 2)}
                    readOnly
                    className="mt-2 font-mono text-xs"
                    rows={10}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
