"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const PARTICLE_COUNT = 78;
const TRAIL_SPAN = 0.32;
const DURATION_MS = 5400;
const ROTATION_DURATION_MS = 28000;
const PULSE_DURATION_MS = 4600;
const STROKE_WIDTH = 4.5;
const ROSE_A = 9.2;
const ROSE_A_BOOST = 0.6;
const ROSE_BREATH_BASE = 0.72;
const ROSE_BREATH_BOOST = 0.28;
const ROSE_K = 5;
const ROSE_SCALE = 3.25;
const PATH_STEPS = 480;

function rosePoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2;
  const a = ROSE_A + detailScale * ROSE_A_BOOST;
  const r =
    a *
    (ROSE_BREATH_BASE + detailScale * ROSE_BREATH_BOOST) *
    Math.cos(ROSE_K * t);
  return {
    x: 50 + Math.cos(t) * r * ROSE_SCALE,
    y: 50 + Math.sin(t) * r * ROSE_SCALE,
  };
}

function normalize(p: number) {
  return ((p % 1) + 1) % 1;
}

interface RoseCurveLoaderProps {
  className?: string;
}

export function RoseCurveLoader({ className }: RoseCurveLoaderProps) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const particlesRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const time = now - startedAt;
      const progress = (time % DURATION_MS) / DURATION_MS;
      const pulseAngle =
        ((time % PULSE_DURATION_MS) / PULSE_DURATION_MS) * Math.PI * 2;
      const detailScale =
        0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
      const rotation =
        -((time % ROTATION_DURATION_MS) / ROTATION_DURATION_MS) * 360;

      groupRef.current?.setAttribute(
        "transform",
        `rotate(${rotation} 50 50)`,
      );

      if (pathRef.current) {
        let d = "";
        for (let i = 0; i <= PATH_STEPS; i++) {
          const point = rosePoint(i / PATH_STEPS, detailScale);
          d += `${i === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
        }
        pathRef.current.setAttribute("d", d);
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const node = particlesRef.current[i];
        if (!node) continue;
        const tailOffset = i / (PARTICLE_COUNT - 1);
        const point = rosePoint(
          normalize(progress - tailOffset * TRAIL_SPAN),
          detailScale,
        );
        const fade = Math.pow(1 - tailOffset, 0.56);
        node.setAttribute("cx", point.x.toFixed(2));
        node.setAttribute("cy", point.y.toFixed(2));
        node.setAttribute("r", (0.9 + fade * 2.7).toFixed(2));
        node.setAttribute("opacity", (0.04 + fade * 0.96).toFixed(3));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Loading"
      role="status"
      className={cn("overflow-visible", className)}
    >
      <g ref={groupRef}>
        <path
          ref={pathRef}
          stroke="currentColor"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.1}
        />
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <circle
            key={i}
            ref={(el) => {
              particlesRef.current[i] = el;
            }}
            fill="currentColor"
          />
        ))}
      </g>
    </svg>
  );
}
