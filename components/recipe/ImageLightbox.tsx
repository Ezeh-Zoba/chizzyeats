"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  alt: string;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function ImageLightbox({ images, index, open, onOpenChange, onIndexChange, alt }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragState = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  useEffect(() => {
    reset();
  }, [index, open]);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const zoomBy = (delta: number) => {
    setScale((prev) => {
      const next = clampScale(prev + delta);
      if (next === MIN_SCALE) setTranslate({ x: 0, y: 0 });
      return next;
    });
  };

  const goTo = (next: number) => {
    const wrapped = (next + images.length) % images.length;
    onIndexChange(wrapped);
  };

  // Non-passive wheel listener — React's synthetic onWheel is passive in React 17+
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !open) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? 0.25 : -0.25);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [open]);

  // Keyboard: arrow keys to navigate, Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, index]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale === MIN_SCALE) return;
    dragState.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.x;
    const dy = e.clientY - dragState.current.y;
    setTranslate({ x: dragState.current.tx + dx, y: dragState.current.ty + dy });
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "rgba(0,0,0,0.95)" }}
      className="flex items-center justify-center select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Image layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: dragState.current ? "none" : "transform 0.15s ease-out",
          cursor: scale > MIN_SCALE ? "grab" : "default",
        }}
        className="flex items-center justify-center"
      >
        <Image
          src={images[index]}
          alt={alt}
          fill
          sizes="100vw"
          className="object-contain pointer-events-none"
          priority
        />
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center z-10"
        style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Prev / Next + counter */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1.5 rounded-full z-10"
            style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
          >
            {index + 1} / {images.length}
          </div>
        </>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={() => zoomBy(-0.5)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
          aria-label="Zoom out"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
          aria-label="Reset zoom"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          onClick={() => zoomBy(0.5)}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}
          aria-label="Zoom in"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>,
    document.body
  );
}
