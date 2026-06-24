"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";

const SCROLL_THRESHOLD = 400;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 print:hidden ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
      }`}
      style={{
        background: "linear-gradient(135deg, #FFC72C, #FF8C42)",
        color: "#5C4033",
        boxShadow: "0 4px 20px rgba(255,140,66,0.4)",
      }}
    >
      <FaArrowUp size={16} />
    </button>
  );
}
