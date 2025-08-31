"use client";

import { useState } from "react";

export default function TestNotionPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [parentPageId, setParentPageId] = useState("");
  const [databaseId, setDatabaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePage = async () => {
    if (!title || (!parentPageId && !databaseId)) {
      setError("Title and either Parent Page ID or Database ID are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call the API route that uses the SDK on the server side
      const response = await fetch("/api/test-sdk/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          parentPageId,
          databaseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create page");
      }

      setResult(data.page);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Notion Create Page (SDK)</h1>

      <div className="space-y-4">
  

        <div>
          <label className="block text-sm font-medium mb-2">Database ID</label>
          <input
            type="text"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
            placeholder="Enter Notion database ID"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">
            The database ID where the new page will be created (if not using parent page)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Page Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Page Content (Optional)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter page content"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleCreatePage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Page"}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success!</strong> Page created with ID: {result.id}
            <br />
            <a
              href={`https://notion.so/${result.id.replace(/-/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View in Notion
            </a>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Make sure you have a Notion integration connected in the dashboard</li>
          <li>Provide either a Parent Page ID or Database ID (not both)</li>
          <li>Enter a page title (required)</li>
          <li>Optionally add page content</li>
          <li>Click "Create Page" to test the SDK via API route</li>
        </ol>
        <p className="mt-2 text-sm text-gray-600">
          <strong>Note:</strong> This test uses the @techno-king/sdk package on the server side via API route.
        </p>
      </div>
    </div>
  );
}
