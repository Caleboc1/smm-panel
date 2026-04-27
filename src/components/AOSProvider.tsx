"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration
      once: true,    // only animate once
      easing: "ease-in-out",
    });
  }, []);

  return null;
}