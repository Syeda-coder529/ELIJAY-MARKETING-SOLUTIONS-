"use client";

import { useEffect, useRef } from "react";

/**
 * ELIJAY hero globe — a rotating 3D node network.
 *
 * Points sit on a sphere (Fibonacci lattice), are rotated in world space each
 * frame, then perspective-projected. Depth drives scale, opacity, colour and
 * paint order, so nodes genuinely pass behind one another.
 *
 * The brand gradient comes from depth rather than a CSS gradient: far nodes
 * render in deep emerald through emerald teal, near nodes warm through
 * metallic gold to light gold. Rotation therefore reads as a continuous
 * emerald-to-gold sweep across the sphere.
 *
 * Dependency-free canvas 2D — no three.js, nothing added to the bundle, no
 * WebGL context to lose.
 */

const NODE_COUNT_DESKTOP = 150;
const NODE_COUNT_MOBILE = 70;
const RADIUS = 210;
const FOCAL = 560;
const LINK_DISTANCE = 66;
const MOBILE_BREAKPOINT = 768;

const FAR: [number, number, number] = [0, 59, 50];
const MID: [number, number, number] = [0, 138, 112];
const NEAR: [number, number, number] = [214, 163, 67];
const PEAK: [number, number, number] = [245, 210, 122];

type Node = { x: number; y: number; z: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function brandColor(t: number): [number, number, number] {
  if (t < 0.4) {
    const k = t / 0.4;
    return [lerp(FAR[0], MID[0], k), lerp(FAR[1], MID[1], k), lerp(FAR[2], MID[2], k)];
  }
  if (t < 0.75) {
    const k = (t - 0.4) / 0.35;
    return [lerp(MID[0], NEAR[0], k), lerp(MID[1], NEAR[1], k), lerp(MID[2], NEAR[2], k)];
  }
  const k = (t - 0.75) / 0.25;
  return [lerp(NEAR[0], PEAK[0], k), lerp(NEAR[1], PEAK[1], k), lerp(NEAR[2], PEAK[2], k)];
}

function buildSphere(count: number): Node[] {
  const nodes: Node[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    nodes.push({
      x: Math.cos(theta) * ring * RADIUS,
      y: y * RADIUS,
      z: Math.sin(theta) * ring * RADIUS,
    });
  }
  return nodes;
}

export function Hero3D({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    let nodes = buildSphere(isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP);

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;
    let rafId = 0;
    let angleY = 0;
    let angleX = -0.32;

    function resize() {
      const wasMobile = isMobile;
      isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      // rebuild only when crossing the breakpoint, not on every resize tick
      if (wasMobile !== isMobile) {
        nodes = buildSphere(isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP);
      }
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      const sinY = Math.sin(angleY);
      const cosY = Math.cos(angleY);
      const sinX = Math.sin(angleX);
      const cosX = Math.cos(angleX);

      const projected = nodes.map((n) => {
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.x * sinY + n.z * cosY;
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;
        const scale = FOCAL / (FOCAL + z2);
        const depth = (RADIUS - z2) / (RADIUS * 2);
        return { x: cx + x1 * scale, y: cy + y2 * scale, z: z2, scale, depth };
      });

      // links: emerald at the back, gold at the front
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > LINK_DISTANCE) continue;

          const depth = (a.depth + b.depth) / 2;
          const alpha = (1 - dist / LINK_DISTANCE) * (0.1 + depth * 0.3);

          if (isMobile) {
            // one flat colour — building a gradient object per link is the
            // single most expensive thing in this loop
            const [mr, mg, mb] = brandColor(depth);
            ctx!.strokeStyle = `rgba(${mr | 0}, ${mg | 0}, ${mb | 0}, ${alpha})`;
          } else {
            const grad = ctx!.createLinearGradient(a.x, a.y, b.x, b.y);
            const [ar, ag, ab] = brandColor(a.depth);
            const [br, bg, bb] = brandColor(b.depth);
            grad.addColorStop(0, `rgba(${ar | 0}, ${ag | 0}, ${ab | 0}, ${alpha})`);
            grad.addColorStop(1, `rgba(${br | 0}, ${bg | 0}, ${bb | 0}, ${alpha})`);
            ctx!.strokeStyle = grad;
          }
          ctx!.lineWidth = 0.6 + depth * 0.5;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.stroke();
        }
      }

      // nodes: far first so near ones occlude them
      projected
        .slice()
        .sort((a, b) => b.z - a.z)
        .forEach((p, index) => {
          const [r, g, b] = brandColor(p.depth);
          const alpha = 0.18 + p.depth * 0.62;
          const pulse = (Math.sin(frame * 0.018 + index * 0.4) + 1) / 2;
          const isPulsing = pulse > 0.94 && p.depth > 0.5;
          const radius = (1.3 + p.depth * 0.9) * (isPulsing ? 2.1 : 1);

          if (isPulsing) {
            const glow = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 4);
            glow.addColorStop(0, `rgba(245, 210, 122, ${alpha * 0.5})`);
            glow.addColorStop(1, "rgba(245, 210, 122, 0)");
            ctx!.fillStyle = glow;
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, radius * 4, 0, Math.PI * 2);
            ctx!.fill();
          }

          ctx!.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx!.fill();
        });
    }

    let skip = false;
    function loop() {
      if (!running) return;
      rafId = requestAnimationFrame(loop);

      // half frame rate on phones — the rotation is slow enough that this is
      // invisible, and it halves the work
      if (isMobile) {
        skip = !skip;
        if (skip) return;
        angleY += 0.003;
      } else {
        angleY += 0.0015;
      }

      angleX = -0.32 + Math.sin(frame * 0.0007) * 0.1;
      frame++;
      draw();
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
