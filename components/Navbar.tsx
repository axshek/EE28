'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 32px',
        fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
        background: scrolled ? 'rgba(8,8,8,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* graduation cap icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L17 6.5L9 11L1 6.5L9 2Z" fill="rgba(255,255,255,0.8)" />
            <path d="M4 9V13C4 13 6 15 9 15C12 15 14 13 14 13V9" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" fill="none" />
            <line x1="17" y1="6.5" x2="17" y2="11" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
          </svg>
        </div>
        <div>
          <p style={{ margin: 0, color: '#fff', fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1 }}>
            EE Portal
          </p>
          <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.35)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Tezpur University
          </p>
        </div>
      </Link>

      {/* Sign In — always in the top right, first load */}
      <Link
        href="/login"
        style={{
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '50px',
          padding: '8px 20px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
          fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif",
        }}
      >
        Sign In
      </Link>
    </nav>
  );
}