"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Config ───────────────────────────────────────────────────────────────────
const FRAME_COUNT = 66;
const SCROLL_HEIGHT = 6000; 
const LERP = 0.1;
const PRIORITY_FRAMES = 10; // Load first 10 frames immediately
const FRAME_PATH = (n: number) => `/frames/frame_${String(n).padStart(3, "0")}.webp`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function PikachuAntigravity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Animation State Refs ──
  const bitmapsRef = useRef<(ImageBitmap | null)[]>(new Array(FRAME_COUNT).fill(null));
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isLoadedRef = useRef(false);

  // ── Loading UI State ──
  const [loadProgress, setLoadProgress] = useState(0);
  const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(false);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // ── Layer 1: Optimized decoding pipeline ──
    async function loadFrames() {
      let loadedCount = 0;

      // Phase 1: Load Priority Frames (0-9)
      const priorityBatch = [];
      for (let i = 0; i < PRIORITY_FRAMES; i++) {
        priorityBatch.push(loadSingleFrame(i));
      }
      await Promise.all(priorityBatch);
      setIsInitiallyLoaded(true);

      // Phase 2: Load Remaining Frames in background
      const remainingFrames = [];
      for (let i = PRIORITY_FRAMES; i < FRAME_COUNT; i++) {
        remainingFrames.push(i);
      }

      // Load remaining in small batches to not choke the network
      const batchSize = 5;
      for (let i = 0; i < remainingFrames.length; i += batchSize) {
        const batch = remainingFrames.slice(i, i + batchSize).map(index => loadSingleFrame(index));
        await Promise.all(batch);
      }

      isLoadedRef.current = true;
      setIsFullyLoaded(true);
    }

    async function loadSingleFrame(index: number) {
      try {
        const response = await fetch(FRAME_PATH(index + 1));
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        const bmp = await createImageBitmap(blob);
        bitmapsRef.current[index] = bmp;
        
        const currentLoaded = bitmapsRef.current.filter(b => b !== null).length;
        setLoadProgress((currentLoaded / FRAME_COUNT) * 100);

        // If this is the first frame, draw it immediately
        if (index === 0 && currentFrameRef.current === 0) {
          drawFrame(0);
        }
      } catch (err) {
        console.error(`Failed to load frame ${index}:`, err);
      }
    }

    // ── Layer 2: Decoupled RAF loop ──
    function animate() {
      const delta = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(delta) > 0.01) {
        currentFrameRef.current += delta * LERP;
        drawFrame(Math.round(currentFrameRef.current));
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function drawFrame(index: number) {
      let bmp = bitmapsRef.current[index];

      // Progressive Fallback: If requested frame isn't loaded, find the nearest available
      if (!bmp) {
        let nearestIdx = -1;
        let minDiff = Infinity;
        for (let i = 0; i < FRAME_COUNT; i++) {
          if (bitmapsRef.current[i]) {
            const diff = Math.abs(i - index);
            if (diff < minDiff) {
              minDiff = diff;
              nearestIdx = i;
            }
          }
        }
        if (nearestIdx !== -1) bmp = bitmapsRef.current[nearestIdx];
      }

      if (!bmp || !canvas) return;

      const cw = canvas.width;
      const ch = canvas.height;

      const scale = Math.max(cw / bmp.width, ch / bmp.height);
      const dx = (cw - bmp.width * scale) / 2;
      const dy = (ch - bmp.height * scale) / 2;

      ctx!.drawImage(bmp, dx, dy, bmp.width * scale, bmp.height * scale);
    }

    // ── Layer 3: Optimized Scroll Handler ──
    function onScroll() {
      const scrollY = window.scrollY;
      const maxScroll = SCROLL_HEIGHT - window.innerHeight;
      const progress = Math.max(0, Math.min(scrollY / maxScroll, 1));

      targetFrameRef.current = progress * (FRAME_COUNT - 1);

      const heroEl = document.getElementById("hero-text-container");
      const memeEl = document.getElementById("meme-scroll-container");
      
      const fade = Math.max(0, 1 - scrollY / 800);
      const transform = scrollY * 0.3;

      if (heroEl) {
        heroEl.style.opacity = String(fade);
        heroEl.style.transform = `translateY(-${transform}px)`;
      }

      if (memeEl) {
        memeEl.style.opacity = String(fade);
        memeEl.style.transform = `translateY(-${transform}px)`;
      }
    }

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      drawFrame(Math.round(currentFrameRef.current));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    resize();
    loadFrames();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      bitmapsRef.current.forEach(bmp => bmp?.close());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: `${SCROLL_HEIGHT}px`,
        background: "#080808",
      }}
    >
      {/* Sticky Stage */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            willChange: "contents",
          }}
        />

        {/* Gradient Overlay */}
        <div
          className="responsive-gradient"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Hero Text Container */}
        <div
          id="hero-text-container"
          className="hero-layout"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          <div className="hero-content">
            <p className="eyebrow">Tezpur University · Dept. of EE</p>
            <h1 className="headline">
              ELECTRICAL
              <br />
              <span className="accent">ENGINEERING</span>
              <br />
              PORTAL
            </h1>
            <p className="subcopy">
              An easy academic portal for Electrical Engineering students at Tezpur University.
            </p>
            <div className="cta-group">
              <Link href="/register" className="btn btn-primary">Create Account</Link>
              <Link href="/login" className="btn btn-secondary">Sign In</Link>
            </div>
            <div style={{ marginTop: '20px', opacity: 0.4 }}>
              <Link 
                href="/admin-login" 
                style={{ 
                  fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif",
                  fontSize: '11px',
                  color: 'white',
                  textDecoration: 'none',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  pointerEvents: 'auto'
                }}
                className="hover:text-accent transition-colors"
              >
                — Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Meme Side Container - Scroll Linked */}
        {isInitiallyLoaded && (
          <div 
            id="meme-scroll-container" 
            className="meme-side-container"
            style={{ willChange: "transform, opacity" }}
          >
            <a 
              href="https://www.instagram.com/tezu.electrical/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="meme-floating-icon"
            >
              <img src="/images/meme-page.jpg" alt="Tezu Electrical Instagram" />
            </a>
            <div className="meme-popup-panel">
              <span className="meme-text">MEME PAGE</span>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {!isInitiallyLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 100,
              background: "#080808",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.8s ease-out",
            }}
          >
            <p style={{
              color: "white",
              fontFamily: "-apple-system, BlinkMacSystemFont, system-ui",
              fontSize: "12px",
              letterSpacing: "0.4em",
              marginBottom: "20px"
            }}>LOADING</p>
            <div style={{ width: "200px", height: "2px", background: "rgba(255,255,255,0.1)" }}>
              <div style={{
                width: `${loadProgress}%`,
                height: "100%",
                background: "#FFE500",
                transition: "width 0.3s ease-out"
              }} />
            </div>
          </div>
        )}

        {/* Scroll Hint */}
        <p className="scroll-hint">SCROLL</p>
      </div>

      <style jsx>{`
        .responsive-gradient {
          background: linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.65) 38%, rgba(8,8,8,0.15) 58%, transparent 100%);
        }

        .hero-layout {
          padding-left: clamp(28px, 5vw, 80px);
          max-width: 55%;
        }

        .hero-content {
          pointer-events: auto;
        }

        .eyebrow {
          font-family: -apple-system, 'SF Pro Display', system-ui, sans-serif;
          font-size: clamp(10px, 1vw, 12px);
          font-weight: 500;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .headline {
          font-family: -apple-system, 'SF Pro Display', system-ui, sans-serif;
          font-size: clamp(40px, 6vw, 90px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: white;
          margin: 0;
        }

        .accent {
          color: #FFE500;
        }

        .subcopy {
          font-family: -apple-system, 'SF Pro Text', system-ui, sans-serif;
          font-size: clamp(14px, 1.2vw, 18px);
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin: 24px 0 40px;
          max-width: 400px;
        }

        .cta-group {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .btn {
          font-family: -apple-system, 'SF Pro Text', system-ui, sans-serif;
          padding: 8px 22px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          height: 36px;
          box-sizing: border-box;
        }

        .btn-primary {
          background: #0A84FF;
          color: white;
          border: 1px solid #0A84FF;
        }

        .btn-primary:hover {
          background: #007AFF;
          border-color: #007AFF;
          transform: none;
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.4);
          transform: none;
        }

        .scroll-hint {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          font-family: -apple-system, system-ui, sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
        }

        .meme-side-container {
          position: absolute;
          right: clamp(16px, 3vw, 40px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          pointer-events: none;
          will-change: transform, opacity;
        }

        .meme-side-container * {
          pointer-events: auto;
        }

        .meme-floating-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.12);
          transition: all 0.3s ease;
          overflow: hidden;
          position: relative;
        }

        .meme-floating-icon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .meme-popup-panel {
          background: #0f1117;
          padding: 8px 18px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin-right: 12px;
          opacity: 0;
          transform: translateX(10px);
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .meme-side-container:hover .meme-popup-panel {
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
        }

        .meme-text {
          font-family: -apple-system, system-ui, sans-serif;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .responsive-gradient {
            background: linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.7) 40%, transparent 100%);
          }
          .hero-layout {
            max-width: 100%;
            padding: 0 32px;
            justify-content: flex-end;
            padding-bottom: 120px;
          }
          .headline {
            font-size: clamp(36px, 10vw, 54px);
          }
          .subcopy {
            margin: 20px 0 32px;
          }
          .cta-group {
            flex-direction: column;
            gap: 12px;
            width: 100%;
          }
          .btn {
            width: 100%;
          }
          .meme-popup-panel {
            display: none;
          }
          .meme-side-container {
            right: 20px;
            top: 40%;
          }
          .meme-floating-icon {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
