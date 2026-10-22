/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PosterModal from './components/PosterModal';
import DevilStampSeal from './components/DevilStampSeal';
import DevilStampTool from './components/DevilStampTool';
import { playKeyClick, playReceiptFeedSound, playStampSound, primeAudio } from './utils/audio';

// Static assets imports for reliable Vite bundling and Vercel production deployment
import ghostCleanBase from './assets/images/ghost_things_clean_base.png';
import ghostBlink from './assets/images/ghost_blink.png';
import ghostTalk from './assets/images/ghost_talk.png';
import ghostNormal from './assets/images/ghost_normal.png';
import titleSkyPatch from './assets/images/title_sky_patch.png';
import ghostThingsTitle from './assets/images/ghost_things_title.png';
import crtScreenCleanBg from './assets/images/crt_screen_clean_bg.png';
import heart1 from './assets/images/heart_1.png';
import heart2 from './assets/images/heart_2.png';
import heart3 from './assets/images/heart_3.png';
import bat1Img from './assets/images/bat_1.png';
import bat1FlapImg from './assets/images/bat_1_flap.png';
import bat2Img from './assets/images/bat_2.png';
import bat2FlapImg from './assets/images/bat_2_flap.png';
import potionBottle from './assets/images/potion_bottle_isolated.png';
import keyboardCutout from './assets/images/keyboard_cutout.png';

type GameState = 'idle' | 'ghost_step_1' | 'ghost_step_2' | 'input_active';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [isKeyboardPressed, setIsKeyboardPressed] = useState(false);
  const [isPreClickCueActive, setIsPreClickCueActive] = useState(false);
  
  // User input states & collectible poster modal
  const [inputValue, setInputValue] = useState('');
  const [ghostList, setGhostList] = useState<string[]>([]);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [justPrinted, setJustPrinted] = useState(false);
  const [stampState, setStampState] = useState<'idle' | 'dropping' | 'stamped'>('idle');
  const [hasStampMark, setHasStampMark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const timersRef = useRef<number[]>([]);

  // Ghost facial animation state
  const [isBlinking, setIsBlinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Bat flap animation state
  const [bat1Flap, setBat1Flap] = useState(false);
  const [bat2Flap, setBat2Flap] = useState(false);

  // Dialogue box typewriter effect & terminal cursor
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Exact dialogue strings
  const fullPromptText =
    gameState === 'ghost_step_1'
      ? 'What do you want to ghost?'
      : gameState === 'ghost_step_2'
      ? 'Type them down'
      : '';

  // 1. Natural blinking cycle (every 3–5 seconds, blinks for 160ms)
  useEffect(() => {
    let blinkTimer: number;
    let closeTimer: number;

    const triggerBlink = () => {
      setIsBlinking(true);
      closeTimer = window.setTimeout(() => {
        setIsBlinking(false);
        const nextDelay = 2600 + Math.random() * 2600;
        blinkTimer = window.setTimeout(triggerBlink, nextDelay);
      }, 160);
    };

    const initialDelay = 1800 + Math.random() * 1500;
    blinkTimer = window.setTimeout(triggerBlink, initialDelay);

    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(closeTimer);
    };
  }, []);

  // 2. Ghost speaking mouth animation during dialogue steps
  useEffect(() => {
    if (gameState === 'ghost_step_1' || gameState === 'ghost_step_2') {
      const talkInterval = window.setInterval(() => {
        setIsSpeaking((prev) => !prev);
      }, 190);
      return () => {
        window.clearInterval(talkInterval);
        setIsSpeaking(false);
      };
    } else {
      setIsSpeaking(false);
    }
  }, [gameState]);

  // 3. Bat wing flapping cycles (desynchronized)
  useEffect(() => {
    const bat1Interval = window.setInterval(() => {
      setBat1Flap(true);
      window.setTimeout(() => setBat1Flap(false), 240);
    }, 2400);

    const bat2Interval = window.setInterval(() => {
      setBat2Flap(true);
      window.setTimeout(() => setBat2Flap(false), 240);
    }, 3100);

    return () => {
      window.clearInterval(bat1Interval);
      window.clearInterval(bat2Interval);
    };
  }, []);

  // 4. Typewriter effect: 50ms/char for prompt 1, 48ms/char for prompt 2
  useEffect(() => {
    if (!fullPromptText) {
      setDisplayedText('');
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;
    const speed = gameState === 'ghost_step_1' ? 50 : 48;
    const interval = window.setInterval(() => {
      currentIndex += 1;
      setDisplayedText(fullPromptText.slice(0, currentIndex));
      if (currentIndex >= fullPromptText.length) {
        window.clearInterval(interval);
      }
    }, speed);

    return () => {
      window.clearInterval(interval);
    };
  }, [fullPromptText, gameState]);

  // 5. Pre-click keyboard cue: nudges up/down & soft glow for 2 rounds, pauses, then repeats
  useEffect(() => {
    if (gameState !== 'ghost_step_2') {
      setIsPreClickCueActive(false);
      return;
    }

    let isMounted = true;
    let cycleTimer: number;

    const runCueCycle = () => {
      if (!isMounted) return;
      // Play 2 rounds of subtle nudge + glow (~2200ms)
      setIsPreClickCueActive(true);

      cycleTimer = window.setTimeout(() => {
        if (!isMounted) return;
        // Pause for ~2400ms
        setIsPreClickCueActive(false);

        cycleTimer = window.setTimeout(() => {
          if (!isMounted) return;
          // Repeat gently if user hasn't clicked yet
          runCueCycle();
        }, 2400);
      }, 2200);
    };

    // Trigger right when "Type them down" begins appearing
    runCueCycle();

    return () => {
      isMounted = false;
      window.clearTimeout(cycleTimer);
      setIsPreClickCueActive(false);
    };
  }, [gameState]);

  // Terminal cursor blinking (450ms cadence)
  useEffect(() => {
    const cursorTimer = window.setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 450);
    return () => window.clearInterval(cursorTimer);
  }, []);

  // Clear pending timers safely on unmount or re-trigger
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  // Handle clicking the potion bottle: Entrance to the game
  const handlePotionClick = () => {
    primeAudio();
    if (gameState === 'input_active') return;

    clearAllTimers();
    setIsPreClickCueActive(false);

    // Step 1: Prompt 1 begins immediately: "What do you want to ghost?"
    setGameState('ghost_step_1');

    // Prompt 1 has 26 characters -> 26 * 50ms = 1300ms to type out.
    // Pause for 1150ms after Prompt 1 completes.
    // 1300ms typing + 1150ms pause = 2450ms before Step 2 starts!
    const timer1 = window.setTimeout(() => {
      // Step 2: Prompt 2 begins typing: "Type them down"
      // This immediately activates the pre-click keyboard cue via useEffect!
      setGameState('ghost_step_2');
    }, 2450);

    timersRef.current = [timer1];
  };

  // Keyboard click handler: Immediately enters input state and plays click keypress
  const handleKeyboardClick = () => {
    primeAudio();
    clearAllTimers();
    setIsPreClickCueActive(false);
    setIsKeyboardPressed(true);

    const pressTimer = window.setTimeout(() => {
      setIsKeyboardPressed(false);
    }, 150);
    timersRef.current.push(pressTimer);

    // Transition immediately to input active
    setGameState('input_active');

    // Auto-focus the input box
    window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Handle submitting a ghost list item (max 10 items)
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ghostList.length >= 10) return;
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    playReceiptFeedSound();
    setGhostList((prev) => [...prev, trimmed]);
    setInputValue('');
    setJustPrinted(true);
    window.setTimeout(() => setJustPrinted(false), 500);
    inputRef.current?.focus();
  };

  // Finish writing with Little Devil Stamp interaction before expanding into poster
  const handleFinish = () => {
    if (ghostList.length === 0 || stampState !== 'idle') return;

    // Phase 1: Physical stamp drops down toward receipt
    setStampState('dropping');

    // Phase 2: Impact slap at 220ms (sound + squash + imprint)
    window.setTimeout(() => {
      playStampSound();
      setStampState('stamped');
      setHasStampMark(true);
    }, 220);

    // Phase 3: Stamp lifts away and poster smoothly opens at 760ms
    window.setTimeout(() => {
      setIsPosterOpen(true);
      setStampState('idle');
    }, 760);
  };

  // Current ghost face sprite
  const currentGhostSprite = isBlinking
    ? ghostBlink
    : isSpeaking
    ? ghostTalk
    : ghostNormal;

  return (
    <main className="w-screen h-screen bg-[#0a0512] flex items-center justify-center p-0 md:p-3 overflow-hidden select-none">
      {/* 9:16 Aspect Stage Container (Guarantees no distortion on any device) */}
      <div className="relative h-full max-h-screen aspect-[9/16] max-w-full flex items-center justify-center overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-[#110a19]">
        
        {/* Layer 0: Master Clean Background Base (768 x 1376) */}
        <img
          src={ghostCleanBase}
          alt="Ghost Things Game Background"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none z-0"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Layer 0.1: Starry Sky Cover Patch over old title position */}
        <div
          className="absolute z-1 pointer-events-none select-none"
          style={{
            top: '11.2%',
            left: 0,
            width: '100%',
            height: '12.8%',
          }}
        >
          <img
            src={titleSkyPatch}
            alt="Starry Sky Inpaint"
            className="w-full h-full object-fill pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Layer 0.2: Upward Shifted Main Title "GHOST THINGS" */}
        <div
          className="absolute z-2 pointer-events-none select-none flex items-center justify-center"
          style={{
            top: '6.2%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            height: '11.0%',
          }}
        >
          <img
            src={ghostThingsTitle}
            alt="GHOST THINGS"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(180,120,240,0.35)]"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Layer 0.5: Dynamic CRT Screen (Overlaying screen area: 25.78%, 34.16%, 48.70%, 21.80%) */}
        <div
          className="absolute z-5 overflow-hidden rounded-[14px] pointer-events-none"
          style={{
            left: '25.78%',
            top: '34.16%',
            width: '48.70%',
            height: '21.80%',
          }}
        >
          {/* CRT Screen Background (Clean Starry Night + Horizon Fence) */}
          <img
            src={crtScreenCleanBg}
            alt="CRT Screen Background"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Floating Heart 1 (Top-Left) */}
          <motion.img
            src={heart1}
            alt="Pixel Heart 1"
            className="absolute pointer-events-none select-none"
            style={{
              left: '19.5%',
              top: '11.0%',
              width: '8.3%',
              imageRendering: 'pixelated',
            }}
            animate={{
              y: [0, -5, 0, 4, 0],
              scale: [1, 1.08, 1, 0.94, 1],
              rotate: [0, -4, 0, 4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.2,
              ease: 'easeInOut',
            }}
          />

          {/* Floating Heart 2 (Mid-Left) */}
          <motion.img
            src={heart2}
            alt="Pixel Heart 2"
            className="absolute pointer-events-none select-none"
            style={{
              left: '11.8%',
              top: '26.3%',
              width: '11.5%',
              imageRendering: 'pixelated',
            }}
            animate={{
              y: [0, 4, 0, -6, 0],
              scale: [1, 0.95, 1, 1.06, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.1,
              ease: 'easeInOut',
            }}
          />

          {/* Floating Heart 3 (Mid-Right) */}
          <motion.img
            src={heart3}
            alt="Pixel Heart 3"
            className="absolute pointer-events-none select-none"
            style={{
              left: '77.5%',
              top: '41.7%',
              width: '8.6%',
              imageRendering: 'pixelated',
            }}
            animate={{
              y: [0, -4, 0, 5, 0],
              scale: [0.96, 1.06, 1, 0.94, 0.96],
              rotate: [0, -3, 0, 3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.7,
              ease: 'easeInOut',
            }}
          />

          {/* Fluttering Bat 1 (Top-Right) */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{
              left: '72.2%',
              top: '11.7%',
              width: '21.9%',
            }}
            animate={{
              y: [0, -6, 0, 4, 0],
              x: [0, 3, 0, -4, 0],
              rotate: [0, 4, 0, -3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4.8,
              ease: 'easeInOut',
            }}
          >
            <img
              src={bat1Flap ? bat1FlapImg : bat1Img}
              alt="Pixel Bat 1"
              className="w-full h-auto object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.div>

          {/* Fluttering Bat 2 (Mid-Left) */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{
              left: '2.7%',
              top: '46.7%',
              width: '22.7%',
            }}
            animate={{
              y: [0, 5, 0, -6, 0],
              x: [0, -3, 0, 4, 0],
              rotate: [0, -4, 0, 4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5.3,
              ease: 'easeInOut',
            }}
          >
            <img
              src={bat2Flap ? bat2FlapImg : bat2Img}
              alt="Pixel Bat 2"
              className="w-full h-auto object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.div>

          {/* Animated Ghost (Living Character) */}
          <motion.div
            className="absolute inset-0 pointer-events-none select-none flex items-center justify-center"
            animate={{
              y: [0, -5, 0, 3, 0],
              rotate: [0, -0.8, 0, 0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.6,
              ease: 'easeInOut',
            }}
          >
            <img
              src={currentGhostSprite}
              alt="Living Ghost Character"
              className="w-full h-full object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </motion.div>

          {/* Delicate CRT Scanline Effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 2px)',
            }}
          />
        </div>

        {/* Layer 1: Independent Transparent Potion Bottle (Responsive Position on Desk) */}
        <div
          className="absolute z-10"
          style={{
            left: '81.8%',
            top: '62.2%',
            width: '13.2%',
            height: '16.2%',
          }}
        >
          <motion.button
            type="button"
            onClick={handlePotionClick}
            aria-label="Click magic potion bottle to wake ghost"
            className="w-full h-full flex items-center justify-center cursor-pointer p-0 bg-transparent border-none outline-none group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              gameState === 'idle'
                ? {
                    rotate: [0, -4, 4, -3, 3, 0],
                    transition: {
                      repeat: Infinity,
                      repeatDelay: 3.5,
                      duration: 0.7,
                      ease: 'easeInOut',
                    },
                  }
                : {
                    rotate: 0,
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.3 },
                  }
            }
          >
            <img
              src={potionBottle}
              alt="Magic Potion Bottle"
              className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(216,160,240,0.4)] group-hover:drop-shadow-[0_0_14px_rgba(240,180,255,0.85)] transition-all duration-200"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* Idle pulse sparkle prompt around potion in idle state */}
            {gameState === 'idle' && (
              <span 
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-300 animate-ping opacity-75 pointer-events-none" 
              />
            )}
          </motion.button>
        </div>

        {/* Layer 2: Retro Pixel RPG Dialogue Window OR Active Input Terminal */}
        <AnimatePresence mode="wait">
          {/* Phase A: Guidance Dialogue Window */}
          {(gameState === 'ghost_step_1' || gameState === 'ghost_step_2') && (
            <motion.div
              key={gameState === 'ghost_step_1' ? 'step_1' : 'step_2'}
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -2, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute z-30 pointer-events-none flex flex-col items-center"
              style={{
                left: '12%',
                right: '12%',
                top: '22.0%',
              }}
            >
              {/* Retro Pixel RPG Container with Stepped Corners & Solid 3D Cast Shadow */}
              <div className="relative w-full max-w-[340px] flex flex-col items-center">
                
                {/* Solid Offset Pixel Cast Shadow (bottom & right 4px, crisp stepped pixel corners) */}
                <div 
                  className="absolute inset-0 translate-x-[4px] translate-y-[4px] bg-[#07030e] pixel-cut pointer-events-none" 
                  aria-hidden="true"
                />

                {/* Outer Bezel: Deep Midnight Gothic Plum (#170a28, 3px stepped rim) */}
                <div className="relative w-full bg-[#170a28] p-[3px] pixel-cut">
                  
                  {/* Inner Rim: Lavender Purple (#d8c8e8, 2px stepped rim) */}
                  <div className="w-full bg-[#d8c8e8] p-[2px] pixel-cut">
                    
                    {/* Deep Inset Bevel: Dark Plum (#2a143f, 1.5px bevel) */}
                    <div className="w-full bg-[#2a143f] p-[1.5px] pixel-cut">
                      
                      {/* Main Terminal Window Body */}
                      <div 
                        className="relative w-full bg-[#160b24] px-3.5 py-2 sm:px-4 sm:py-2.5 border-t-2 border-[#f7f0ff]/50 border-l border-[#f7f0ff]/25 border-b-2 border-[#090412] border-r border-[#090412] flex items-center justify-center min-h-[46px] sm:min-h-[50px]"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)',
                        }}
                      >
                        {/* Dialogue Text with Authentic Pixel Font */}
                        <div className="font-pixel text-[#fdf8fc] text-center tracking-wider text-[16px] md:text-[11px] md:text-[13px] leading-snug select-none flex items-center justify-center [text-shadow:1px_1px_0_#2b123d]">
                          <span className="text-[#dfa9bf] font-bold mr-1.5 opacity-90">{'>'}</span>
                          <span>{displayedText}</span>
                          {/* Blinking Pixel Block Cursor */}
                          <span 
                            className={`inline-block w-[6px] sm:w-[7px] h-[10px] sm:h-[12px] bg-[#dfa9bf] ml-1 align-middle transition-opacity duration-75 ${
                              showCursor ? 'opacity-100' : 'opacity-0'
                            }`}
                            aria-hidden="true"
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Stepped Pixel Pointer Tail (pointing straight down toward the Ghost head) */}
                <div className="relative flex flex-col items-center -mt-[1px]">
                  {/* Tail Solid Offset Shadow */}
                  <div className="absolute top-[3px] left-[3px] flex flex-col items-center pointer-events-none opacity-90" aria-hidden="true">
                    <div className="w-[14px] h-[3px] bg-[#07030e]" />
                    <div className="w-[10px] h-[3px] bg-[#07030e]" />
                    <div className="w-[6px] h-[3px] bg-[#07030e]" />
                    <div className="w-[2px] h-[2px] bg-[#07030e]" />
                  </div>

                  {/* Tail Stepped Outer & Inner Pixel Construction */}
                  <div className="relative flex flex-col items-center">
                    {/* Step 1: 14px */}
                    <div className="w-[14px] h-[3px] bg-[#170a28] flex items-center justify-center">
                      <div className="w-[10px] h-[3px] bg-[#d8c8e8] flex items-center justify-center">
                        <div className="w-[6px] h-[3px] bg-[#160b24]" />
                      </div>
                    </div>
                    {/* Step 2: 10px */}
                    <div className="w-[10px] h-[3px] bg-[#170a28] flex items-center justify-center">
                      <div className="w-[6px] h-[3px] bg-[#d8c8e8] flex items-center justify-center">
                        <div className="w-[2px] h-[3px] bg-[#160b24]" />
                      </div>
                    </div>
                    {/* Step 3: 6px */}
                    <div className="w-[6px] h-[3px] bg-[#170a28] flex items-center justify-center">
                      <div className="w-[2px] h-[3px] bg-[#d8c8e8]" />
                    </div>
                    {/* Step 4: 2px tip */}
                    <div className="w-[2px] h-[2px] bg-[#170a28]" />
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* Phase B: Active Input Terminal Window (Triggered upon Keyboard Click) */}
          {gameState === 'input_active' && (
            <motion.div
              key="input_terminal"
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute z-30 flex flex-col items-center"
              style={{
                left: '9%',
                right: '9%',
                top: '20.6%',
              }}
            >
              <div className="relative w-full max-w-[360px] flex flex-col items-center">
                
                {/* Solid Offset Pixel Cast Shadow */}
                <div 
                  className="absolute inset-0 translate-x-[4px] translate-y-[4px] bg-[#07030e] pixel-cut pointer-events-none" 
                  aria-hidden="true"
                />

                {/* Outer Bezel */}
                <div className="relative w-full bg-[#170a28] p-[3px] pixel-cut">
                  
                  {/* Inner Lavender Rim */}
                  <div className="w-full bg-[#d8c8e8] p-[2px] pixel-cut">
                    
                    {/* Dark Inset Bevel */}
                    <div className="w-full bg-[#2a143f] p-[1.5px] pixel-cut">
                      
                      {/* Terminal Input Container */}
                      <div
                        className="relative w-full bg-[#160b24] px-3.5 py-2.5 sm:px-4 sm:py-3 border-t-2 border-[#f7f0ff]/50 border-l border-[#f7f0ff]/25 border-b-2 border-[#090412] border-r border-[#090412] flex flex-col gap-2"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 2px)',
                        }}
                      >
                        {/* Short Prompt Label: "Type them down" with counter */}
                        <div className="w-full font-pixel text-[#fdf8fc] text-[16px] md:text-[11px] md:text-[13px] tracking-wider flex items-center justify-between [text-shadow:1px_1px_0_#2b123d] select-none">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[#dfa9bf] font-bold opacity-90">{'>'}</span>
                            <span>{ghostList.length >= 10 ? '10/10 entries complete' : 'Type them down'}</span>
                          </span>
                          <span className="text-[9px] text-[#dfa9bf]/90">
                            {ghostList.length}/10 GHOSTED
                          </span>
                        </div>

                        {/* Separate Input Form: input field on left, distinct SEND and FINISH buttons on right */}
                        <form
                          onSubmit={handleInputSubmit}
                          className="w-full flex items-center gap-1.5 sm:gap-2"
                        >
                          {/* Dedicated, auto-shrinking text input box */}
                          <div className="relative flex-1 min-w-0 bg-[#0c0517]/70 border border-[#d8c8e8]/30 px-2.5 py-1 flex items-center">
                            <input
                              ref={inputRef}
                              type="text"
                              value={inputValue}
                              onChange={(e) => {
                                const nextVal = e.target.value;
                                if (nextVal !== inputValue) {
                                  playKeyClick();
                                }
                                setInputValue(nextVal);
                              }}
                              placeholder={ghostList.length >= 10 ? 'Click FINISH to view poster' : ''}
                              disabled={ghostList.length >= 10}
                              autoFocus
                              maxLength={48}
                              className="w-full bg-transparent border-none outline-none font-pixel text-[#fdf8fc] text-[11px] sm:text-[12px] tracking-wider [text-shadow:1px_1px_0_#2b123d] shrink min-w-0 disabled:opacity-40"
                            />
                            {/* Blinking cursor when input is empty */}
                            {inputValue === '' && ghostList.length < 10 && (
                              <span 
                                className={`inline-block w-[6px] h-[10px] sm:h-[11px] bg-[#dfa9bf] transition-opacity duration-75 pointer-events-none ${
                                  showCursor ? 'opacity-100' : 'opacity-0'
                                }`}
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          {/* Action Button 1: Distinct SEND Button */}
                          <motion.button
                            type="submit"
                            disabled={ghostList.length >= 10 || !inputValue.trim()}
                            whileHover={ghostList.length < 10 && inputValue.trim() ? { scale: 1.04 } : {}}
                            whileTap={ghostList.length < 10 && inputValue.trim() ? { scale: 0.94, y: 1 } : {}}
                            aria-label="Send input"
                            className="shrink-0 px-2.5 sm:px-3 py-1 bg-[#2e1747] hover:bg-[#3d2060] active:bg-[#1a0c2b] disabled:opacity-40 disabled:hover:bg-[#2e1747] disabled:cursor-not-allowed border border-[#d8c8e8]/90 text-[#fdf8fc] font-pixel text-[10px] sm:text-[11px] tracking-widest cursor-pointer shadow-[1px_1px_0_#07030e] select-none transition-colors"
                          >
                            SEND
                          </motion.button>

                          {/* Action Button 2: Distinct FINISH Button */}
                          <motion.button
                            type="button"
                            onClick={handleFinish}
                            disabled={ghostList.length === 0 || stampState !== 'idle'}
                            whileHover={ghostList.length > 0 && stampState === 'idle' ? { scale: 1.04 } : {}}
                            whileTap={ghostList.length > 0 && stampState === 'idle' ? { scale: 0.94, y: 1 } : {}}
                            aria-label="Finish and view poster"
                            className="shrink-0 px-2.5 sm:px-3 py-1 bg-[#8c1822] hover:bg-[#a61e2b] active:bg-[#6b1018] disabled:opacity-35 disabled:hover:bg-[#8c1822] disabled:cursor-not-allowed border border-[#f5b8c0]/80 text-[#fff8f8] font-pixel text-[10px] sm:text-[11px] font-bold tracking-widest cursor-pointer shadow-[1px_1px_0_#07030e] select-none transition-colors"
                            title={ghostList.length === 0 ? "Submit at least one entry before finishing" : "Seal receipt with Little Devil Stamp and view final poster"}
                          >
                            {stampState !== 'idle' ? 'SEALING...' : 'FINISH'}
                          </motion.button>
                        </form>

                      </div>

                    </div>
                  </div>
                </div>

                {/* Stepped Pixel Pointer Tail */}
                <div className="relative flex flex-col items-center -mt-[1px]">
                  <div className="absolute top-[3px] left-[3px] flex flex-col items-center pointer-events-none opacity-90" aria-hidden="true">
                    <div className="w-[14px] h-[3px] bg-[#07030e]" />
                    <div className="w-[10px] h-[3px] bg-[#07030e]" />
                    <div className="w-[6px] h-[3px] bg-[#07030e]" />
                    <div className="w-[2px] h-[2px] bg-[#07030e]" />
                  </div>

                  <div className="relative flex flex-col items-center">
                    <div className="w-[14px] h-[3px] bg-[#170a28] flex items-center justify-center">
                      <div className="w-[10px] h-[3px] bg-[#d8c8e8] flex items-center justify-center">
                        <div className="w-[6px] h-[3px] bg-[#160b24]" />
                      </div>
                    </div>
                    <div className="w-[10px] h-[3px] bg-[#170a28] flex items-center justify-center">
                      <div className="w-[6px] h-[3px] bg-[#d8c8e8] flex items-center justify-center">
                        <div className="w-[2px] h-[3px] bg-[#160b24]" />
                      </div>
                    </div>
                    <div className="w-[6px] h-[3px] bg-[#170a28] flex items-center justify-center">
                      <div className="w-[2px] h-[3px] bg-[#d8c8e8]" />
                    </div>
                    <div className="w-[2px] h-[2px] bg-[#170a28]" />
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layer 3: Keyboard Responsive Touch/Click Layer with Pre-Click Cue & Post-Click Press */}
        <div
          className="absolute z-20"
          style={{
            left: '16.1%',
            top: '71.9%',
            width: '67.8%',
            height: '10.6%',
          }}
        >
          {/* Interactive Keyboard Button */}
          <button
            type="button"
            onClick={handleKeyboardClick}
            aria-label="Computer keyboard action area"
            className="w-full h-full relative cursor-pointer p-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 overflow-hidden"
            style={{
              outline: 'none',
              boxShadow: 'none',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* Keyboard Physical Visual Cutout Sprite with Pre-click Nudge & Post-click Press */}
            <motion.img
              src={keyboardCutout}
              alt="Mechanical Keyboard"
              className="w-full h-full object-contain pointer-events-none select-none"
              style={{
                imageRendering: 'pixelated',
              }}
              animate={
                isKeyboardPressed
                  ? { y: 2 }
                  : isPreClickCueActive
                  ? { y: [0, -2, 2, -1, 1, 0, -2, 2, 0] }
                  : { y: 0 }
              }
              transition={
                isKeyboardPressed
                  ? { duration: 0.1 }
                  : isPreClickCueActive
                  ? { duration: 2.2, ease: 'easeInOut' }
                  : { duration: 0.15 }
              }
            />

            {/* Soft, borderless lavender-pink highlight pulse during pre-click cue */}
            <AnimatePresence>
              {isPreClickCueActive && gameState === 'ghost_step_2' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.75, 0, 0.75, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.2, ease: 'easeInOut' }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 75% 65% at 50% 50%, rgba(220, 180, 245, 0.45) 0%, rgba(240, 180, 225, 0.2) 55%, transparent 85%)',
                    mixBlendMode: 'screen',
                  }}
                />
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Layer 2.5: Physical Continuous Paper Receipt Feeding from Computer Output Slot */}
        {ghostList.length > 0 && (
          <div
            className="absolute z-25 pointer-events-auto"
            style={{
              left: '44.27%',
              top: '62.65%',
              width: '29.95%',
            }}
          >
            {/* Dark slot lip shadow anchor to make paper appear physically inside the slot */}
            <div 
              className="absolute -top-[2px] left-0 right-0 h-[4px] bg-[#160822] pointer-events-none z-10 shadow-[0_2px_4px_rgba(0,0,0,0.85)]" 
              aria-hidden="true"
            />

            {/* Continuous Cumulative Paper Receipt Sheet (Fixed Width, Growing Downward) */}
            <motion.div
              layout
              animate={
                stampState === 'stamped'
                  ? { scale: [1, 0.95, 1.02, 1], y: [0, 2, -1, 0] }
                  : justPrinted
                  ? { y: [-3, 0] }
                  : { y: 0 }
              }
              transition={{ duration: stampState === 'stamped' ? 0.22 : 0.25, ease: 'easeOut' }}
              onClick={handleFinish}
              title="Click receipt to finish and view archival poster"
              className="relative w-full cursor-pointer group select-none shadow-[2px_10px_24px_rgba(0,0,0,0.7)]"
            >
              {/* Paper Body: Fixed Width matching slot, extends downward as entries are added */}
              <div 
                className="w-full bg-[#faf7ed] border-l border-r border-[#d4caa8] receipt-tear-bottom px-2.5 pt-2 pb-3 flex flex-col group-hover:bg-[#fffef7] transition-colors relative"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(60,50,40,0.03) 0px, rgba(60,50,40,0.03) 1px, transparent 1px, transparent 3px)',
                }}
              >
                {/* Paper Header */}
                <div className="w-full border-b border-dashed border-[#8c8273]/45 pb-1 mb-1.5 flex items-center justify-between">
                  <span className="font-courier text-[8.5px] sm:text-[9.5px] font-bold text-[#3c342d] tracking-wider uppercase">
                    GHOST LOG
                  </span>
                  <span className="font-pixel text-[7.5px] text-[#8c1822] font-bold">
                    {String(ghostList.length).padStart(2, '0')}/10
                  </span>
                </div>

                {/* Cumulative List of All Submitted Entries (Every entry preserved & visible) */}
                <div className="w-full flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-0.5">
                  {ghostList.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={idx === ghostList.length - 1 ? { opacity: 0, y: -4 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="w-full font-typewriter text-[9.5px] sm:text-[10.5px] leading-tight text-[#1c1815] font-bold flex items-start gap-1 break-words whitespace-pre-wrap"
                    >
                      <span className="text-[#6e6356] shrink-0 font-courier text-[9px] pt-[0.5px]">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="flex-1 break-words tracking-tight">
                        {item}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Authentic Little Devil Stamp Seal Imprint on Receipt */}
                {(hasStampMark || stampState === 'stamped') && (
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.95 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="w-full flex items-center justify-center py-1 mt-1 border-t border-dashed border-[#8c1822]/30 pointer-events-none"
                  >
                    <DevilStampSeal size={48} rotation={-4} />
                  </motion.div>
                )}

                {/* Paper Perforated Footer */}
                <div className="w-full border-t border-dashed border-[#8c8273]/40 pt-1 mt-2 flex items-center justify-between">
                  <span className="font-pixel text-[6.5px] sm:text-[7px] text-[#7a6f60] tracking-tighter uppercase">
                    {stampState !== 'idle' ? '[SEALING DEVIL RECORD]' : '[CLICK TO FINISH]'}
                  </span>
                  <span className="font-pixel text-[6.5px] sm:text-[7px] text-[#8c1822] font-bold group-hover:underline">
                    {stampState !== 'idle' ? 'STAMPING...' : 'FINISH ↗'}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Physical Little Devil Stamp Tool Animation */}
            <AnimatePresence>
              {stampState !== 'idle' && (
                <motion.div
                  key="devil-stamp-tool"
                  initial={{ y: -90, x: '-50%', opacity: 0, scale: 1.15, rotate: -6 }}
                  animate={
                    stampState === 'dropping'
                      ? { y: 15, x: '-50%', opacity: 1, scale: 0.95, rotate: 2 }
                      : { y: -40, x: '-50%', opacity: 0, scale: 1.05, rotate: -4 }
                  }
                  exit={{ opacity: 0 }}
                  transition={
                    stampState === 'dropping'
                      ? { duration: 0.22, ease: 'easeIn' }
                      : { duration: 0.35, ease: 'easeOut' }
                  }
                  className="absolute bottom-5 left-1/2 z-40 pointer-events-none drop-shadow-[0_12px_16px_rgba(0,0,0,0.65)]"
                >
                  <DevilStampTool />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Layer 4: Collectible Archival Printable Poster Modal */}
      <PosterModal
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
        ghostList={ghostList}
      />
    </main>
  );
}
