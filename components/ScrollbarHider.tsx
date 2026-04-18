"use client";

import { useEffect } from "react";

export default function ScrollbarHider() {
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar");
    return () => {
      document.documentElement.classList.remove("no-scrollbar");
    };
  }, []);

  return null;
}
