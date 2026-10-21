/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface DevilStampSealProps {
  className?: string;
  size?: number | string;
  rotation?: number;
}

/**
 * Authentic vintage rubber stamp imprint of the "Little Devil Seal" (小恶魔盖章).
 * Rendered in oxblood red (#8c1822) with a distressed rubber border,
 * cute Halloween devil silhouette, and official archival badge text.
 */
export default function DevilStampSeal({
  className = '',
  size = 72,
  rotation = -5,
}: DevilStampSealProps) {
  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full text-[#8c1822]"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0.5px 0.5px 0px rgba(140,24,34,0.3))',
        }}
      >
        <defs>
          {/* Top text arc */}
          <path
            id="devil-stamp-top-arc"
            d="M 18 60 A 42 42 0 0 1 102 60"
            fill="none"
          />
          {/* Bottom text arc */}
          <path
            id="devil-stamp-bottom-arc"
            d="M 102 60 A 42 42 0 0 1 18 60"
            fill="none"
          />
        </defs>

        {/* Outer distressed circular border */}
        <circle
          cx="60"
          cy="60"
          r="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="9 2 14 2 6 2"
          opacity="0.9"
        />

        {/* Secondary inner ring */}
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.75"
        />

        {/* Decorative corner stars / notches */}
        <polygon points="60,6 62,11 67,11 63,14 65,19 60,16 55,19 57,14 53,11 58,11" opacity="0.85" />
        <polygon points="60,114 62,109 67,109 63,106 65,101 60,104 55,101 57,106 53,109 58,109" opacity="0.85" />

        {/* Archival curved text on top arc: GHOSTED & VOID */}
        <text
          fill="currentColor"
          fontSize="9.2"
          fontFamily="'Courier Prime', monospace"
          fontWeight="900"
          letterSpacing="0.22em"
          opacity="0.92"
        >
          <textPath href="#devil-stamp-top-arc" startOffset="50%" textAnchor="middle">
            ★ GHOSTED & VOID ★
          </textPath>
        </text>

        {/* Archival curved text on bottom arc: DEVIL ARCHIVE */}
        <text
          fill="currentColor"
          fontSize="8.6"
          fontFamily="'Courier Prime', monospace"
          fontWeight="900"
          letterSpacing="0.2em"
          opacity="0.92"
        >
          <textPath href="#devil-stamp-bottom-arc" startOffset="50%" textAnchor="middle">
            OFFICIAL DEVIL SEAL
          </textPath>
        </text>

        {/* Inner seal circle */}
        <circle
          cx="60"
          cy="60"
          r="34"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="4 2"
          opacity="0.7"
        />

        {/* Center: Cute Little Devil Face & Silhouette */}
        <g transform="translate(60, 58) scale(0.92)">
          {/* Left Devil Horn */}
          <path
            d="M -13 -6 C -18 -15, -20 -23, -12 -22 C -10 -17, -8 -11, -7 -5 Z"
            fill="currentColor"
          />
          {/* Right Devil Horn */}
          <path
            d="M 13 -6 C 18 -15, 20 -23, 12 -22 C 10 -17, 8 -11, 7 -5 Z"
            fill="currentColor"
          />

          {/* Little Devil Head / Body */}
          <path
            d="M -15 2 C -16 -8, 16 -8, 15 2 C 15 13, 8 18, 0 18 C -8 18, -15 13, -15 2 Z"
            fill="currentColor"
            opacity="0.92"
          />

          {/* Pointy Devil Tail */}
          <path
            d="M 12 12 Q 22 16 19 24 Q 15 22 15 17"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Arrow tip of the tail */}
          <polygon points="19,25 24,24 21,20" fill="currentColor" />

          {/* Mischievous Little Eyes (Hollow in the head silhouette) */}
          <circle cx="-6" cy="1" r="2.2" fill="#faf7ed" />
          <circle cx="6" cy="1" r="2.2" fill="#faf7ed" />
          <circle cx="-5.3" cy="1.2" r="1.1" fill="currentColor" />
          <circle cx="6.7" cy="1.2" r="1.1" fill="currentColor" />

          {/* Cute Devil Smirk with Tiny Fangs */}
          <path
            d="M -5 7 Q 0 12 5 7"
            fill="none"
            stroke="#faf7ed"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Left Fang */}
          <polygon points="-3,7 -1.5,10.2 -0.8,7" fill="#faf7ed" />
          {/* Right Fang */}
          <polygon points="3,7 1.5,10.2 0.8,7" fill="#faf7ed" />

          {/* Small Ribbon / Banner Label: "CONFIRMED" */}
          <rect
            x="-18"
            y="-16"
            width="36"
            height="7"
            rx="1.5"
            fill="#faf7ed"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.95"
          />
          <text
            x="0"
            y="-11"
            fill="currentColor"
            fontSize="5"
            fontFamily="'Courier Prime', monospace"
            fontWeight="900"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            CONFIRMED
          </text>
        </g>

        {/* Vintage rubber stamp distress speckles */}
        <circle cx="34" cy="28" r="1" opacity="0.3" fill="currentColor" />
        <circle cx="88" cy="36" r="0.8" opacity="0.3" fill="currentColor" />
        <circle cx="28" cy="84" r="0.9" opacity="0.25" fill="currentColor" />
        <circle cx="92" cy="80" r="1.1" opacity="0.3" fill="currentColor" />
        <circle cx="48" cy="98" r="0.7" opacity="0.2" fill="currentColor" />
        <circle cx="72" cy="16" r="0.8" opacity="0.25" fill="currentColor" />
      </svg>
    </div>
  );
}
