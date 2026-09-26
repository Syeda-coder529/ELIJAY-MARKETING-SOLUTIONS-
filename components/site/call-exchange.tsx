"use client";

import { useEffect, useRef } from "react";

/**
 * Buy / sell call exchange — the two-sided marketplace, animated.
 *
 * Publishers sell on the left, buyers purchase on the right, and ELIJAY sits
 * in the middle as two stages: SCREEN, then MATCH. Calls that fail screening
 * turn rust and drop away with their reason attached — they never reach a
 * buyer. Counters tally sold against disqualified.
 *
 * Canvas 2D, no dependencies. Pauses when off-screen or when the tab is
 * hidden, and renders one static frame under prefers-reduced-motion.
 *
 * NOTE: the payouts, verticals and the roughly one-in-four rejection rate are
 * illustrative values chosen to make the motion legible — they are not
 * network statistics. Adjust SPAWN_PATTERN / PRICE_BASE if you want the
 * on-screen ratio to read differently.
 */

const PUB_LANES = ["Medicare", "ACA", "Final Expense", "Auto"];
const BUY_LANES = ["Buyer A", "Buyer B", "Buyer C", "Buyer D"];
const REASONS = ["Duplicate", "Out of geo", "Short duration", "No consent"];
const PRICE_BASE = 26;

const GOLD: [number, number, number] = [214, 163, 67];
const LIGHT: [number, number, number] = [245, 210, 122];
const TEAL: [number, number, number] = [0, 138, 112];
const EM: [number, number, number] = [0, 59, 50];
const WARM: [number, number, number] = [244, 241, 232];
const RUST: [number, number, number] = [194, 72, 60];

const rgba = (c: [number, number, number], a: number) =>
  `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t;

type Call = {
  t: number;
  lane: number;
  buyLane: number;
  price: number;
  fail: boolean;
  reason: string;
  fy: number;
  fv: number;
};

export function CallExchange({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let rafId = 0;
    let calls: Call[] = [];
    let sold = 0;
    let rejected = 0;

    function roundRect(x: number, y: number, rw: number, rh: number, r: number) {
      ctx!.beginPath();
      ctx!.moveTo(x + r, y);
      ctx!.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx!.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx!.arcTo(x, y + rh, x, y, r);
      ctx!.arcTo(x, y, x + rw, y, r);
      ctx!.closePath();
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function laneY(i: number, count: number, top: number, bottom: number) {
      const gap = (bottom - top) / count;
      return top + gap * i + gap / 2;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      const colW = Math.min(150, width * 0.2);
      const leftX = 22 + colW / 2;
      const rightX = width - 22 - colW / 2;
      const top = 58;
      const bottom = height - 104;
      const cx = width / 2;
      const screenX = cx - 62;
      const matchX = cx + 62;
      const midY = (top + bottom) / 2;

      // --- columns ---
      (
        [
          [leftX, "PUBLISHERS", "sell calls", TEAL, PUB_LANES, 0],
          [rightX, "BUYERS", "buy calls", GOLD, BUY_LANES, 1],
        ] as const
      ).forEach(([x, t1, t2, col, lanes, side]) => {
        ctx!.fillStyle = rgba(col, 0.07);
        roundRect(x - colW / 2, 40, colW, height - 150, 12);
        ctx!.fill();
        ctx!.strokeStyle = rgba(col, 0.28);
        ctx!.lineWidth = 1;
        ctx!.stroke();

        ctx!.textAlign = "center";
        ctx!.fillStyle = rgba(col, 0.95);
        ctx!.font = "600 10px Inter, sans-serif";
        ctx!.fillText(t1, x, 26);
        ctx!.fillStyle = rgba(WARM, 0.38);
        ctx!.font = "500 9px Inter, sans-serif";
        ctx!.fillText(t2, x, height - 98);

        lanes.forEach((lab, i) => {
          const y = laneY(i, lanes.length, top, bottom);
          const hot = calls.some((c) =>
            side === 0
              ? c.lane === i && c.t < 0.16
              : c.buyLane === i && c.t > 0.86 && !c.fail
          );
          ctx!.fillStyle = hot ? rgba(col, 0.26) : rgba(col, 0.11);
          roundRect(x - colW / 2 + 11, y - 13, colW - 22, 26, 7);
          ctx!.fill();
          if (hot) {
            ctx!.strokeStyle = rgba(col, 0.6);
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
          ctx!.fillStyle = rgba(WARM, hot ? 0.92 : 0.52);
          ctx!.font = "500 10px Inter, sans-serif";
          ctx!.textAlign = "center";
          ctx!.fillText(lab, x, y + 4);
        });
      });

      // --- router: screen + match ---
      const glow = ctx!.createRadialGradient(cx, midY, 0, cx, midY, 110);
      glow.addColorStop(0, rgba(GOLD, 0.1));
      glow.addColorStop(1, rgba(GOLD, 0));
      ctx!.fillStyle = glow;
      ctx!.beginPath();
      ctx!.arc(cx, midY, 110, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = rgba(EM, 0.92);
      roundRect(screenX - 44, midY - 26, 88, 52, 10);
      ctx!.fill();
      ctx!.strokeStyle = rgba(TEAL, 0.55);
      ctx!.lineWidth = 1.1;
      ctx!.stroke();
      ctx!.textAlign = "center";
      ctx!.fillStyle = rgba(WARM, 0.9);
      ctx!.font = "600 10px Inter, sans-serif";
      ctx!.fillText("SCREEN", screenX, midY - 4);
      ctx!.fillStyle = rgba(WARM, 0.4);
      ctx!.font = "500 8px Inter, sans-serif";
      ctx!.fillText("consent · dupe · geo", screenX, midY + 10);

      ctx!.fillStyle = rgba(EM, 0.92);
      roundRect(matchX - 44, midY - 26, 88, 52, 10);
      ctx!.fill();
      ctx!.strokeStyle = rgba(GOLD, 0.7);
      ctx!.lineWidth = 1.3;
      ctx!.stroke();
      ctx!.fillStyle = rgba(LIGHT, 0.95);
      ctx!.font = "600 10px Inter, sans-serif";
      ctx!.fillText("MATCH", matchX, midY - 4);
      ctx!.fillStyle = rgba(WARM, 0.4);
      ctx!.font = "500 8px Inter, sans-serif";
      ctx!.fillText("best payout", matchX, midY + 10);

      ctx!.strokeStyle = rgba(GOLD, 0.3);
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(screenX + 44, midY);
      ctx!.lineTo(matchX - 44, midY);
      ctx!.stroke();

      ctx!.fillStyle = rgba(GOLD, 0.55);
      ctx!.font = "600 9px Inter, sans-serif";
      ctx!.fillText("ELIJAY", cx, midY - 38);

      // --- spawn ---
      if (frame % 30 === 0 && calls.length < 10) {
        const n = (frame / 30) | 0;
        const fail = n % 4 === 2;
        calls.push({
          t: 0,
          lane: n % PUB_LANES.length,
          buyLane: (n * 3) % BUY_LANES.length,
          price: PRICE_BASE + ((n * 13) % 44),
          fail,
          reason: REASONS[n % REASONS.length],
          fy: 0,
          fv: 0,
        });
      }

      // --- calls ---
      calls.forEach((c) => {
        const y0 = laneY(c.lane, PUB_LANES.length, top, bottom);
        const y1 = laneY(c.buyLane, BUY_LANES.length, top, bottom);
        const startX = leftX + colW / 2;
        const endX = rightX - colW / 2;

        ctx!.strokeStyle = rgba(TEAL, 0.08);
        ctx!.lineWidth = 0.6;
        ctx!.beginPath();
        ctx!.moveTo(startX, y0);
        ctx!.lineTo(screenX - 44, midY);
        ctx!.stroke();
        if (!c.fail) {
          ctx!.strokeStyle = rgba(GOLD, 0.08);
          ctx!.beginPath();
          ctx!.moveTo(matchX + 44, midY);
          ctx!.lineTo(endX, y1);
          ctx!.stroke();
        }

        c.t += 0.0075;

        let px: number;
        let py: number;
        let col: [number, number, number];
        let alpha = 1;

        if (c.t < 0.4) {
          const k = easeIn(c.t / 0.4);
          px = lerp(startX, screenX - 44, k);
          py = lerp(y0, midY, k);
          col = TEAL;
        } else if (c.t < 0.52) {
          px = screenX;
          py = midY;
          col = TEAL;
        } else if (c.fail) {
          c.fv += 0.55;
          c.fy += c.fv;
          px = screenX + c.fy * 0.22;
          py = midY + c.fy;
          col = RUST;
          alpha = Math.max(0, 1 - c.fy / 150);
        } else if (c.t < 0.62) {
          const k = (c.t - 0.52) / 0.1;
          px = lerp(screenX, matchX, k);
          py = midY;
          col = LIGHT;
        } else {
          const k = easeOut((c.t - 0.62) / 0.38);
          px = lerp(matchX + 44, endX, k);
          py = lerp(midY, y1, k);
          col = LIGHT;
        }

        ctx!.globalAlpha = alpha;
        const g = ctx!.createRadialGradient(px, py, 0, px, py, 11);
        g.addColorStop(0, rgba(col, 0.75));
        g.addColorStop(1, rgba(col, 0));
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(px, py, 11, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = rgba(col, 0.95);
        ctx!.beginPath();
        ctx!.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx!.fill();

        if (c.fail && c.t > 0.52) {
          ctx!.fillStyle = rgba(RUST, alpha * 0.95);
          ctx!.font = "600 10px Inter, sans-serif";
          ctx!.textAlign = "left";
          ctx!.fillText(c.reason, px + 10, py + 3);
        } else if (!c.fail && c.t > 0.62) {
          ctx!.fillStyle = rgba(GOLD, Math.min(1, (c.t - 0.62) * 5));
          ctx!.font = "600 10px Inter, sans-serif";
          ctx!.textAlign = "center";
          ctx!.fillText("$" + c.price, px, py - 13);
        }
        ctx!.globalAlpha = 1;
      });

      calls = calls.filter((c) => {
        if (c.fail && c.fy > 150) {
          rejected++;
          return false;
        }
        if (!c.fail && c.t >= 1) {
          sold++;
          return false;
        }
        return true;
      });

      // --- counters ---
      const barY = height - 56;
      (
        [
          [cx - 108, "SOLD", sold, GOLD],
          [cx + 108, "DISQUALIFIED", rejected, RUST],
        ] as const
      ).forEach(([x, lab, val, col]) => {
        ctx!.fillStyle = rgba(col, 0.1);
        roundRect(x - 92, barY, 184, 38, 9);
        ctx!.fill();
        ctx!.strokeStyle = rgba(col, 0.38);
        ctx!.lineWidth = 1;
        ctx!.stroke();
        ctx!.textAlign = "left";
        ctx!.fillStyle = rgba(WARM, 0.5);
        ctx!.font = "600 9px Inter, sans-serif";
        ctx!.fillText(lab, x - 76, barY + 23);
        ctx!.textAlign = "right";
        ctx!.fillStyle = rgba(col, 0.95);
        ctx!.font = "600 17px Inter, sans-serif";
        ctx!.fillText(String(val), x + 76, barY + 25);
      });
    }

    function loop() {
      if (!running) return;
      frame++;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    resize();
    draw();
    if (!reduceMotion) rafId = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const was = running;
        running = entry.isIntersecting && !document.hidden && !reduceMotion;
        if (running && !was) rafId = requestAnimationFrame(loop);
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    function onVisibility() {
      const was = running;
      running = !document.hidden && !reduceMotion;
      if (running && !was) rafId = requestAnimationFrame(loop);
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
