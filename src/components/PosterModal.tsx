/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { Download, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import DevilStampSeal from './DevilStampSeal';
import ghostMachineXeroxImg from '../assets/images/ghost_machine_xerox.png';

interface PosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  ghostList: string[];
}

export default function PosterModal({ isOpen, onClose, ghostList }: PosterModalProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  // Dynamic real date formatting (e.g. "OCT 21, 2026")
  const today = new Date();
  const dateFormatted = today
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .toUpperCase();

  // Fallback to sample items if poster opened before typing
  const effectiveList = ghostList.length > 0
    ? ghostList
    : [
        'Late night doomscrolling',
        'Unpaid emotional labor',
        'Imposter syndrome & self-doubt',
      ];

  // Formatted 2-digit dynamic count (e.g. "03", "10")
  const countFormatted = String(effectiveList.length).padStart(2, '0');

  // Handle client-side high-resolution PNG export
  const handleDownload = async () => {
    if (!posterRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // Ensure all custom web fonts (Special Elite, VT323, Caveat, Courier Prime) are loaded
      await document.fonts.ready;

      // Small delay to ensure rendering is completely settled
      await new Promise((r) => setTimeout(r, 120));

      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 2.5, // Crisp 2.5x high-res export
        quality: 0.98,
      });

      // Try automatic file download
      try {
        const link = document.createElement('a');
        link.download = `ghost-things-poster-${today.toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (clickErr) {
        console.warn('Direct download click blocked, opening fallback preview:', clickErr);
      }

      // Also set preview for mobile touch devices (allowing long-press to Save to Photos)
      setPreviewDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating poster PNG:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  // Determine dynamic font size and vertical spacing based on item count
  const isCompact = effectiveList.length >= 7;
  const isModerate = effectiveList.length >= 4 && effectiveList.length < 7;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6"
      >
        {/* Floating Top Control Bar (Excluded from exported PNG) */}
        <div className="w-full max-w-[620px] flex items-center justify-between py-2 mb-2 sm:mb-3 select-none">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1e1529] hover:bg-[#2b1e3b] text-[#d8c8e8] font-pixel text-[11px] sm:text-[12px] border border-[#d8c8e8]/40 cursor-pointer transition-colors shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO TERMINAL</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#8c1822] hover:bg-[#a61e2b] active:bg-[#6b1018] text-[#fff8f8] font-pixel text-[11px] sm:text-[12px] font-bold tracking-wider cursor-pointer transition-all shadow-[0_2px_10px_rgba(140,24,34,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'EXPORTING...' : 'DOWNLOAD PNG'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close poster"
              className="p-1.5 rounded bg-[#1e1529] hover:bg-[#2b1e3b] text-[#d8c8e8] border border-[#d8c8e8]/40 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable 3:4 Archival Collectible Poster */}
        <motion.div
          ref={posterRef}
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative w-full max-w-[620px] aspect-[3/4] bg-[#f6f3ea] text-[#1a1715] p-6 sm:p-8 md:p-9 shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden select-none border border-[#d8d0be]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.45) 0%, rgba(242,237,222,0.15) 75%, rgba(228,220,200,0.25) 100%)',
          }}
        >
          {/* Subtle Outer Archival Paper Border Line */}
          <div className="absolute inset-3 sm:inset-4 border border-[#3c342d]/25 pointer-events-none" />

          {/* Top Metadata Header */}
          <div className="relative z-10 w-full">
            <div className="flex items-center justify-between border-b border-[#3c342d]/30 pb-2">
              <span className="font-courier text-[9.5px] sm:text-[11px] font-bold tracking-[0.2em] text-[#4a423a] uppercase">
                GHOST THINGS · ANNUAL RECORD
              </span>
              <span className="font-courier text-[9.5px] sm:text-[11px] font-bold tracking-wider text-[#4a423a] uppercase">
                {dateFormatted}
              </span>
            </div>

            {/* Centered Main Title Block */}
            <div className="text-center mt-3.5 sm:mt-5 mb-4 sm:mb-6 flex flex-col items-center">
              <div className="font-typewriter text-[13px] sm:text-[15px] md:text-[16px] text-[#4a423a] font-bold tracking-tight">
                What I Want to
              </div>
              <h1 className="font-typewriter text-[26px] sm:text-[32px] md:text-[36px] font-black text-[#151210] leading-none mt-1 tracking-tight">
                Ghost This Year
              </h1>
              <div className="font-courier text-[9px] sm:text-[10.5px] md:text-[11px] font-bold tracking-[0.24em] text-[#8c1822] uppercase mt-2">
                — THE THINGS I LEAVE BEHIND —
              </div>
            </div>
          </div>

          {/* Central Main List Area (Dominant Visual Focus of the Poster) */}
          <div className="relative z-10 w-full flex-1 flex flex-col justify-start overflow-hidden my-auto px-1 sm:px-2">
            <div className="w-full flex flex-col">
              {effectiveList.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-full flex items-baseline gap-2.5 sm:gap-3.5 border-b border-[#3c342d]/15 ${
                    isCompact
                      ? 'py-1.5 sm:py-2'
                      : isModerate
                      ? 'py-2.5 sm:py-3'
                      : 'py-3 sm:py-4.5'
                  }`}
                >
                  {/* Large Oxblood Red Number */}
                  <span
                    className={`font-typewriter font-black text-[#8c1822] shrink-0 ${
                      isCompact
                        ? 'text-[16px] sm:text-[19px] w-8 sm:w-9'
                        : isModerate
                        ? 'text-[18px] sm:text-[22px] w-9 sm:w-11'
                        : 'text-[22px] sm:text-[26px] md:text-[28px] w-10 sm:w-12'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}.
                  </span>

                  {/* High-Legibility Retro Printed Terminal Entry Text (VT323) */}
                  <span
                    className={`font-terminal font-normal text-[#181412] tracking-wide break-words flex-1 leading-snug ${
                      isCompact
                        ? 'text-[15px] sm:text-[18px] md:text-[19px]'
                        : isModerate
                        ? 'text-[17px] sm:text-[20px] md:text-[22px]'
                        : 'text-[20px] sm:text-[24px] md:text-[26px]'
                    }`}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Area: Signature on Left, Devil Stamp Seal in Middle, Xerox Computer Illustration on Right */}
          <div className="relative z-10 w-full mt-3 sm:mt-4 flex items-end justify-between gap-2 sm:gap-4">
            {/* Left Side: Certified by Ghosty & Autograph */}
            <div className="flex flex-col items-start select-none pb-1 shrink-0">
              <span className="font-courier text-[8.5px] sm:text-[9.5px] tracking-[0.2em] text-[#7a7266] uppercase font-bold">
                CERTIFIED BY GHOSTY
              </span>
              <div className="flex items-center gap-1.5 mt-1 rotate-[-2deg]">
                {/* Oxblood Red Ghost Signature Wave Doodle */}
                <svg
                  viewBox="0 0 36 16"
                  className="w-7 h-3.5 text-[#8c1822]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M 2 8 C 6 2, 10 14, 15 8 C 20 2, 24 14, 29 8 C 32 4, 34 10, 35 8" />
                </svg>
                <span className="font-handwriting text-[#8c1822] text-[22px] sm:text-[26px] font-bold leading-none select-none drop-shadow-[0.5px_0.5px_0_rgba(140,24,34,0.2)]">
                  ~ Ghosty ~
                </span>
              </div>
            </div>

            {/* Middle: Authentic Little Devil Rubber Stamp Seal */}
            <div className="flex flex-col items-center justify-center shrink-0 mb-0.5 sm:mb-1">
              <DevilStampSeal
                size={66}
                rotation={-6}
                className="w-[56px] h-[56px] sm:w-[66px] sm:h-[66px] md:w-[74px] md:h-[74px]"
              />
            </div>

            {/* Right Side: Monochrome Xerox Computer Illustration */}
            <div className="flex flex-col items-end shrink-0">
              <div className="w-22 sm:w-28 md:w-32 border border-[#3c342d]/40 bg-[#ece6d5]/60 p-1 shadow-[1px_2px_8px_rgba(0,0,0,0.12)]">
                <img
                  src={ghostMachineXeroxImg}
                  alt="Fig. 01 — Personal Archive"
                  className="w-full h-auto object-cover grayscale contrast-125 brightness-95"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
          </div>

          {/* Footer Metadata Line */}
          <div className="relative z-10 w-full pt-2.5 sm:pt-3 border-t border-[#3c342d]/30 flex items-center justify-between mt-2">
            <div className="font-typewriter text-[10.5px] sm:text-[12px] font-bold text-[#3c342d] tracking-[0.16em]">
              GHOSTED: {countFormatted}
            </div>

            <div className="font-courier text-[9px] sm:text-[10px] font-bold text-[#6a6256] tracking-[0.16em] uppercase text-right">
              FIG. 01 · PERSONAL ARCHIVE
            </div>
          </div>

        </motion.div>

        {/* Mobile / Fallback Long-Press Save Preview Modal */}
        <AnimatePresence>
          {previewDataUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-5"
            >
              <div className="w-full max-w-[460px] bg-[#1e1529] border border-[#d8c8e8]/50 p-4 rounded flex flex-col items-center gap-3 shadow-2xl">
                <div className="w-full flex items-center justify-between border-b border-[#d8c8e8]/30 pb-2">
                  <span className="font-pixel text-[11px] sm:text-[12px] text-[#fdf8fc] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#dfa9bf]" />
                    <span>POSTER PNG READY</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewDataUrl(null)}
                    aria-label="Close preview"
                    className="p-1 rounded bg-[#2b1e3b] text-[#d8c8e8] hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-pixel text-[9.5px] sm:text-[10.5px] text-[#dfa9bf] text-center leading-relaxed">
                  Desktop will auto-download. On iPhone/Android, press &amp; hold the image below to "Save to Photos" (长按图片即可保存至相册).
                </p>

                <div className="w-full max-h-[60vh] overflow-y-auto flex justify-center bg-black/40 p-2 rounded border border-[#3c2a52]">
                  <img
                    src={previewDataUrl}
                    alt="Ghost Things Collectible Poster"
                    className="max-w-full h-auto object-contain rounded shadow-lg"
                  />
                </div>

                <div className="w-full flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewDataUrl(null)}
                    className="flex-1 py-1.5 bg-[#8c1822] hover:bg-[#a61e2b] text-[#fff8f8] font-pixel text-[11px] font-bold rounded cursor-pointer transition-colors"
                  >
                    DONE / CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
