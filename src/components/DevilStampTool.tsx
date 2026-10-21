/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Visual representation of the physical "Little Devil Stamp" (小恶魔印章) tool:
 * A turned wooden handle with vintage brass ferrule, dark rubber mounting base,
 * and cute red devil horns on the handle finial.
 */
export default function DevilStampTool({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-[64px] h-[88px] flex flex-col items-center select-none pointer-events-none ${className}`}>
      {/* 1. Finial Horns on top of handle knob */}
      <div className="relative w-7 h-3 flex items-end justify-between px-0.5 -mb-0.5 z-20">
        {/* Left red horn */}
        <div 
          className="w-2.5 h-3 bg-[#8c1822] rounded-tl-full shadow-sm"
          style={{ clipPath: 'polygon(0% 0%, 100% 40%, 70% 100%, 0% 100%)' }}
        />
        {/* Right red horn */}
        <div 
          className="w-2.5 h-3 bg-[#8c1822] rounded-tr-full shadow-sm"
          style={{ clipPath: 'polygon(0% 40%, 100% 0%, 100% 100%, 30% 100%)' }}
        />
      </div>

      {/* 2. Turned Wooden Handle Knob */}
      <div 
        className="w-8 h-8 rounded-full border border-[#301a0d] shadow-md z-10 flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #a46d43 0%, #683c1b 60%, #3a1f0d 100%)',
        }}
      >
        {/* Wood grain highlight */}
        <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white/20 blur-[0.5px]" />
      </div>

      {/* 3. Wooden Handle Neck / Shaft */}
      <div 
        className="w-4 h-6 -mt-1 border-x border-[#301a0d] z-0 relative"
        style={{
          background: 'linear-gradient(90deg, #44240f 0%, #8a5732 45%, #a86e42 55%, #44240f 100%)',
        }}
      />

      {/* 4. Vintage Brass Collar / Ferrule */}
      <div 
        className="w-6 h-2.5 -mt-0.5 border border-[#4a3b10] rounded-sm z-10 shadow-sm"
        style={{
          background: 'linear-gradient(90deg, #7c6217 0%, #f4d36a 50%, #6d5412 100%)',
        }}
      />

      {/* 5. Stamp Mount Block (Hardwood base) */}
      <div 
        className="w-14 h-4 -mt-0.5 rounded-sm border border-[#2b160a] z-10 shadow-md flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #8a5732 0%, #522c13 100%)',
        }}
      >
        <span className="font-pixel text-[6px] tracking-widest text-[#f5d0a9] uppercase font-bold opacity-85">
          ★ GHOSTY ★
        </span>
      </div>

      {/* 6. Dark Red Rubber Cushion & Die Base */}
      <div 
        className="w-12 h-2 -mt-0.5 rounded-b-sm border-b border-x border-[#590e16] bg-[#8c1822] shadow-[0_3px_6px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}
