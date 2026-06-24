"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface SiteConfig {
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>({});

  useEffect(() => {
    let active = true;
    getDoc(doc(db, "siteConfig", "main")).then((snap) => {
      if (active && snap.exists()) setConfig(snap.data() as SiteConfig);
    });
    return () => {
      active = false;
    };
  }, []);

  return config;
}
