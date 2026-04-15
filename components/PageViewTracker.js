"use client";

import { useEffect } from "react";
import apiClient from "@/lib/api/client";

export default function PageViewTracker() {
  useEffect(() => {
    apiClient.post("/analytics/view").catch(() => {});
  }, []);

  return null;
}
