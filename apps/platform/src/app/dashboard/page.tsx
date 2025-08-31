"use client";

import { useEffect, useState } from "react";
import {
  Home,
  Plug,
  Settings,
  X,
  ChevronRight,
  Mail,
  FileText,
} from "lucide-react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

type Integration = {
  provider: "GMAIL" | "NOTION";
  connected: boolean;
};

export default function DashboardPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { user } = useUser();
  useEffect(() => {
    // Fetch integration status
    fetch("/api/integrations/status")
      .then((res) => res.json())
      .then((data) => setIntegrations(data));
  }, []);

  const handleConnect = (provider: string) => {
    const url = `/api/oauth/${provider.toLowerCase()}/start`;
    const popup = window.open(
      url,
      `${provider.toLowerCase()}_auth`,
      "width=500,height=600,scrollbars=yes,resizable=yes"
    );

    // Poll for popup closure and refresh integrations
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Refresh integration status
        fetch("/api/integrations/status")
          .then((res) => res.json())
          .then((data) => setIntegrations(data));
      }
    }, 1000);
  };
  const sidebarItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: Plug, label: "Integrations", active: true },
    { icon: Settings, label: "Settings", active: false },
    { icon: FileText, label: "Test Workflow", active: false, href: "/test-workflow" },
  ];

  const getProviderDetails = (provider: string) => {
    switch (provider) {
      case "GMAIL":
        return {
          icon: Mail,
          name: "Gmail",
          description: "Email management",
        };
      case "NOTION":
        return {
          icon: FileText,
          name: "Notion",
          description: "Workspace & docs",
        };
      default:
        return {
          icon: Plug,
          name: provider,
          description: "Integration",
        };
    }
  };

  const generateKey = async () => {
    const response = await fetch("/api/keys/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "My DevFlow Key" }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Your API Key:", result.apiKey);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-50/50 backdrop-blur-xl border-r border-gray-200/30
        transform transition-all duration-300 ease-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-24 px-8 border-b border-gray-200/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                <span className="text-white text-lg font-bold">F</span>
              </div>
              <span className="text-lg font-light text-gray-900">Fu*k Documentation</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-12">
            <div className="space-y-3">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href || "#"}
                    className={`
                      group flex items-center px-6 py-4 text-sm font-medium rounded-2xl transition-all duration-200
                      ${
                        item.active
                          ? "bg-black text-white shadow-2xl shadow-black/10"
                          : "text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-lg"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 mr-4 transition-colors ${
                        item.active
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    {item.label}
                    {item.active && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </a>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/30 lg:hidden">
          <div className="flex items-center h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="ml-4 text-lg font-medium text-gray-900">
              Integrations
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-8 lg:px-12 py-16">
            {/* Header */}
            <div className="mb-16">
              <h1 className="text-5xl font-extralight text-gray-900 mb-4 tracking-tight">
                Integrations
              </h1>
              <p className="text-xl text-gray-500 font-light">
                Hello, {user?.firstName}!
              </p>
            </div>

            {/* Integration grid */}
            <div className="grid gap-8 lg:grid-cols-2 mb-16">
              {["GMAIL", "NOTION"].map((provider) => {
                const isConnected = integrations.find(
                  (i) => i.provider === provider
                )?.connected;
                const details = getProviderDetails(provider);
                const Icon = details.icon;

                return (
                  <div
                    key={provider}
                    className="group relative bg-white rounded-3xl border border-gray-200/40 p-10 hover:border-gray-300/60 hover:shadow-2xl hover:shadow-gray-900/5 transition-all duration-500 overflow-hidden"
                  >
                    {/* Subtle background element */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gray-100/30 rounded-full -mr-20 -mt-20 transition-all group-hover:bg-gray-100/50" />

                    <div className="relative">
                      <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center space-x-5">
                          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center shadow-xl">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-light text-gray-900 mb-2">
                              {details.name}
                            </h3>
                            <p className="text-gray-500 font-light">
                              {details.description}
                            </p>
                          </div>
                        </div>

                        {isConnected && (
                          <div className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-2xl text-sm font-medium">
                            <div className="w-2 h-2 bg-gray-600 rounded-full" />
                            <span>Connected</span>
                          </div>
                        )}
                      </div>

                      <div className="mb-10">
                        <p className="text-gray-600 leading-relaxed font-light text-lg">
                          {provider === "GMAIL"
                            ? "Seamlessly integrate your Gmail account to manage emails, automate workflows, and sync messages."
                            : "Connect your Notion workspace to access pages, databases, and collaborate on documents effortlessly."}
                        </p>
                      </div>

                      {!isConnected ? (
                        <button
                          onClick={() => handleConnect(provider)}
                          className="w-full bg-black text-white px-8 py-4 rounded-2xl hover:bg-gray-800 hover:shadow-2xl hover:shadow-black/20 transform hover:-translate-y-1 transition-all duration-300 font-medium text-lg"
                        >
                          Connect {details.name}
                        </button>
                      ) : (
                        <button className="w-full bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-medium text-lg border border-gray-200/50">
                          Manage Connection
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50/50 rounded-3xl border border-gray-200/40 p-12">
              <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
                Get API Key
              </h2>
              <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto">
                {apiKey ? (
                  <div className="w-full">
                    <div className="flex gap-2">
                      <Input
                        value={apiKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(apiKey);
                          toast.success("API key copied to clipboard");
                        }}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Save this API key - it will not be shown again
                    </p>
                  </div>
                ) : (
                  <Button
                    className="font-medium"
                    onClick={async () => {
                      const response = await fetch("/api/keys/generate", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: "Dashboard Generated Key" }),
                      });
                      const data = await response.json();
                      if (data.success) {
                        setApiKey(data.apiKey);
                      }
                    }}
                  >
                    Generate API Key
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
