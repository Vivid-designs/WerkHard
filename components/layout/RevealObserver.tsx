"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.07 }
    );

    // Observe all .reveal elements, including those added after mount
    const observe = () => {
      document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => {
        observer.observe(el);
      });
    };

    observe();

    return () => observer.disconnect();
  }, []);

  return null;
}
