"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const NODE_COUNT = 7;

/**
 * Represents the hash-chain concept itself, not generic decoration: each
 * node is a "report," linked to the next, arranged in a slow-rotating ring
 * so the connections stay visible from every angle. Built with CSS
 * perspective + rotateY instead of WebGL — no SSR/hydration risk, no
 * frame-rate risk on a projector during a live demo, same visual goal as
 * the react-three-fiber version this replaces.
 */
export default function Hero3D() {
  const [hovered, setHovered] = useState(false);

  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => i);
  const angleStep = 360 / NODE_COUNT;
  const radius = 150;

  return (
    <div
      className="relative mx-auto h-[380px] w-full max-w-md select-none sm:h-[440px]"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ambient glow behind the ring */}
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-teal/10 blur-3xl" />

      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{
          transformStyle: "preserve-3d",
          animation: `chain-spin ${hovered ? 14 : 28}s linear infinite`,
          transition: "animation-duration 0.6s ease",
        }}
      >
        {nodes.map((i) => {
          const angle = angleStep * i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15, duration: 0.5, ease: "backOut" }}
              className="absolute left-0 top-0"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="relative -translate-x-1/2 -translate-y-1/2 rounded-lg border border-signal-teal/50 bg-signal-teal/10 backdrop-blur-sm"
                style={{
                  width: 56,
                  height: 56,
                  boxShadow: hovered
                    ? "0 0 28px -2px rgba(45,217,196,0.7)"
                    : "0 0 18px -4px rgba(45,217,196,0.4)",
                  animation: `node-pulse 2.6s ease-in-out ${i * 0.3}s infinite`,
                }}
              >
                <div className="absolute inset-2 rounded border border-signal-teal/30" />
                <span className="absolute bottom-1 right-1.5 font-mono text-[9px] text-signal-teal/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* connecting ring, one flat plane behind the nodes */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal-teal/20"
          style={{
            width: radius * 2,
            height: radius * 2,
            transform: "rotateX(90deg)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes chain-spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
        @keyframes node-pulse {
          0%,
          100% {
            filter: brightness(1);
            opacity: 0.85;
          }
          50% {
            filter: brightness(1.4);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
