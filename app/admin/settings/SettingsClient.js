"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import apiClient from "@/lib/api/client";

export default function SettingsClient() {
  const [logoUrl, setLogoUrl] = useState("");
  const [logoAlt, setLogoAlt] = useState("Site logo");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await apiClient.get("/settings");
        setLogoUrl(data?.settings?.logoUrl || "");
        setLogoAlt(data?.settings?.logoAlt || "Site logo");
      } catch {
        setStatus("Unable to load settings.");
      }
    }
    loadSettings();
  }, []);

  async function uploadLogo(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setStatus("Uploading logo...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "logo");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setLogoUrl(data.url);
      setStatus("Logo uploaded.");
    } catch (error) {
      setStatus(String(error));
    }
  }

  async function saveSettings() {
    setStatus("Saving settings...");
    try {
      await apiClient.post("/settings", { logoUrl, logoAlt });
      setStatus("Settings saved.");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to save settings.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-2 text-sm text-zinc-400">Upload Logo</p>
          <input type="file" accept="image/*" onChange={uploadLogo} />
        </div>
        <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" />
        <Input value={logoAlt} onChange={(e) => setLogoAlt(e.target.value)} placeholder="Logo alt text" />
        <Button onClick={saveSettings}>Save Settings</Button>
        <p className="text-sm text-zinc-500">{status}</p>
      </CardContent>
    </Card>
  );
}
