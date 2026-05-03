'use client';

import { BookOpen, Lock, Search } from 'lucide-react'
import PikachuAntigravity from '@/components/PikachuAntigravity'

const FONT_STACK = "-apple-system, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif";

export default function LandingPage() {
  return (
    <main style={{ background: "#080808", minHeight: "100vh", color: "#fff", fontFamily: FONT_STACK }}>
      {/* Animation + Hero Section */}
      <PikachuAntigravity />

      {/* Features Section - Hard cut below */}
      <section style={{ background: "#080808", padding: "100px 5vw 120px" }}>
        <p style={{
          fontFamily: FONT_STACK,
          fontSize: "11px",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          textAlign: "center",
          marginBottom: "60px"
        }}>What&apos;s inside</p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          overflow: "hidden"
        }}>
          {/* Card 1 */}
          <div className="feature-card">
            <div className="icon-box"><Lock size={20} strokeWidth={1.5} /></div>
            <h3>SECURE ACCESS</h3>
            <p>Exclusive to authenticated Tezpur University students via domain-restricted email verification.</p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <div className="icon-box"><Search size={20} strokeWidth={1.5} /></div>
            <h3>ADVANCED SEARCH</h3>
            <p>Filter question papers by semester, subject code, year, and examination type — with instant results.</p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <div className="icon-box"><BookOpen size={20} strokeWidth={1.5} /></div>
            <h3>COMPREHENSIVE ARCHIVE</h3>
            <p>A continuously updated repository of Mid-Semester and End-Semester papers, beautifully organized.</p>
          </div>
        </div>
      </section>

      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        textAlign: "center",
        padding: "48px 24px",
        fontFamily: FONT_STACK,
        fontSize: "11px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.2)",
        background: "#080808"
      }}>
        <p>Electrical Engineering 2024–2028 · @Abhishek Das (EEB24021)</p>
      </footer>

      <style jsx>{`
        .feature-card {
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.05);
        }
        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(255,229,0,0.1);
          color: #FFE500;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        h3 {
          font-family: ${FONT_STACK};
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #fff;
          margin: 0;
        }
        p {
          font-family: ${FONT_STACK};
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.7;
          margin: 0;
        }
      `}</style>
    </main>
  )
}
