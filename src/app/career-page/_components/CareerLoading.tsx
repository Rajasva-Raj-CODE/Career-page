"use client";
import React from "react";

// CareerLoading.tsx
// TailwindCSS + modern black & white themed loading fallback for Career page (client-safe)

export default function CareerLoading() {
  return (
    <div className="w-full min-h-[320px] flex items-center justify-center p-8 bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <div className="flex flex-col items-center gap-8 animate-fadeIn">
        {/* Animated Career Logo / Globe */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/20 to-white/5 blur-lg opacity-70 animate-ping" />
          <svg
            viewBox="0 0 120 120"
            className="w-24 h-24 relative z-10 drop-shadow-xl"
            aria-hidden
            focusable="false"
          >
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="url(#careerBWGradient)"
              className="opacity-90 animate-pulse"
            />

            <defs>
              <linearGradient id="careerBWGradient" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#111111" />
              </linearGradient>
            </defs>

            <g className="transform-gpu animate-spin-slow origin-center">
              <path
                d="M60 15 A45 45 0 0 1 105 60"
                stroke="#fff"
                strokeWidth="3"
                fill="none"
                strokeDasharray="6 6"
                className="opacity-80"
              />
              <path
                d="M60 105 A45 45 0 0 1 15 60"
                stroke="#ccc"
                strokeWidth="3"
                fill="none"
                strokeDasharray="6 6"
                className="opacity-60"
              />
            </g>
          </svg>
          <span className="sr-only">Loading careers...</span>
        </div>

        {/* Career-specific title + message */}
        <div className="text-center max-w-md">
          <div className="text-xl font-bold leading-snug tracking-tight">
            We’re preparing career opportunities for you
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Connecting you with jobs, roles, and possibilities...
          </div>
        </div>

        {/* Animated skeleton cards to mimic job listings */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md animate-pulse"
            >
              <div className="h-4 w-2/3 bg-white/20 rounded mb-2" />
              <div className="h-3 w-1/2 bg-white/20 rounded" />
            </div>
          ))}
        </div>

        {/* Subtle dots loader */}
        <div className="flex items-center gap-2 mt-4" aria-hidden>
          <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-200" />
          <span className="w-2 h-2 rounded-full bg-gray-600 animate-bounce animation-delay-400" />
        </div>
      </div>
    </div>
  );
}

// 👉 To fix build issues, move custom animations into tailwind.config.js
// Example in tailwind.config.js:
// extend: {
//   animation: {
//     'spin-slow': 'spin 2.5s linear infinite',
//     fadeIn: 'fadeIn 0.6s ease-in-out'
//   },
//   keyframes: {
//     fadeIn: {
//       '0%': { opacity: '0', transform: 'translateY(10px)' },
//       '100%': { opacity: '1', transform: 'translateY(0)' },
//     }
//   }
// }
// Also add `animation-delay` utilities in CSS or via plugin.