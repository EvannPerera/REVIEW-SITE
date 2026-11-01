/**
 * ÉVANN OPS: SURVIVAL RUN — GAME PAGE COMPONENT
 * Full-featured React game view with tactical HUD, audio controls,
 * ready briefing, guidance bubble for player name, pause system (ESC + HUD button),
 * game over screen, global leaderboard, and touch/keyboard input.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Trophy,
  Shield,
  ArrowLeft,
  Pause,
  Sparkles,
  Gamepad2,
  Flame,
} from 'lucide-react';
import { useRouter } from '../routes/router';
import { GameEngine } from '../game/engine';
import { soundEngine } from '../game/audio';
import { GameStats, GameState } from '../game/types';
import {
  getPersonalBest,
  fetchGlobalHighScore,
  submitMissionScore,
  getStoredPlayerName,
  savePlayerCallsign,
  fetchTopLeaderboard,
  GlobalScoreResponse,
} from '../services/survivalService';

export const GamePage: React.FC = () => {
  const { navigate } = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Game UI States
  const [gameState, setGameState] = useState<GameState>('ready');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    distanceMeters: 0,
    missionLevel: 1,
    gameSpeed: 310,
    elapsedTime: 0,
    enemiesAvoided: 0,
  });

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.isMuted());

  // High Scores
  const [personalBest, setPersonalBest] = useState<number>(() => getPersonalBest());
  const [globalScoreInfo, setGlobalScoreInfo] = useState<GlobalScoreResponse>({
    score: 0,
    playerName: 'HQ_OPERATOR',
    isAvailable: false,
  });
  const [leaderboard, setLeaderboard] = useState<Array<{ rank: number; name: string; score: number }>>([]);

  // Player Name State
  const [playerName, setPlayerName] = useState<string>(() => getStoredPlayerName());
  const [showNameBubble, setShowNameBubble] = useState<boolean>(() => {
    try {
      const dismissed = sessionStorage.getItem('evann_ops_name_bubble_dismissed');
      const hasSaved = getStoredPlayerName();
      return !hasSaved && dismissed !== 'true';
    } catch {
      return false;
    }
  });

  // Game Over Results
  const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
  const [isNewGlobalRecord, setIsNewGlobalRecord] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);

  // Dismiss Name Guidance Bubble
  const handleDismissNameBubble = () => {
    setShowNameBubble(false);
    try {
      sessionStorage.setItem('evann_ops_name_bubble_dismissed', 'true');
    } catch {}
  };

  const handleNameChange = (val: string) => {
    const clean = val.slice(0, 20);
    setPlayerName(clean);
    if (clean.trim().length > 0) {
      setShowNameBubble(false);
    }
  };

  // Load initial scores
  const loadScores = useCallback(async () => {
    setPersonalBest(getPersonalBest());
    const globalRes = await fetchGlobalHighScore();
    setGlobalScoreInfo(globalRes);
    const top5 = await fetchTopLeaderboard();
    setLeaderboard(top5);
  }, []);

  useEffect(() => {
    loadScores();
  }, [loadScores]);

  // Initialize Game Engine on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, {
      onScoreUpdate: (newStats) => {
        setStats({ ...newStats });
      },
      onStateChange: (newState) => {
        setGameState(newState);
      },
      onGameOver: async (finalStats) => {
        setIsSubmittingScore(true);
        const effectiveName = playerName.trim().slice(0, 20) || 'GHOST_OPERATOR';
        const result = await submitMissionScore(
          finalStats.score,
          finalStats.missionLevel,
          finalStats.distanceMeters,
          effectiveName
        );

        setIsNewPersonalBest(result.isNewPersonalBest);
        setIsNewGlobalRecord(result.isNewGlobalRecord);
        setPersonalBest(result.personalBest);

        if (result.isNewGlobalRecord) {
          soundEngine.playNewRecord();
          setGlobalScoreInfo({
            score: result.globalHighScore,
            playerName: effectiveName,
            isAvailable: true,
          });
        }

        const top5 = await fetchTopLeaderboard();
        setLeaderboard(top5);
        setIsSubmittingScore(false);
      },
    });

    engineRef.current = engine;

    // Window resize handler
    const handleResize = () => {
      engine.handleResize();
      if (engine.getState() !== 'playing') {
        engine.render();
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial render in ready state
    engine.render();

    // Auto-pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden && engine.getState() === 'playing') {
        engine.pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      engine.destroy();
    };
  }, [playerName]);

  // Global Keyboard Controls (Space, Up, W to Jump; Enter to Retry; ESC to Pause/Resume)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in name input or any text field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Space, ArrowUp, or W to jump
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault(); // Prevent page scroll
        engineRef.current?.jump();
      }

      // Enter key on Game Over to retry
      if (e.code === 'Enter' && gameState === 'gameover') {
        e.preventDefault();
        handleStartMission();
      }

      // ESC key to toggle Pause / Resume
      if (e.code === 'Escape') {
        e.preventDefault();
        const currentState = engineRef.current?.getState();
        if (currentState === 'playing') {
          engineRef.current?.pause();
        } else if (currentState === 'paused') {
          engineRef.current?.resume();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Audio Toggle
  const handleToggleMute = () => {
    const nowMuted = soundEngine.toggleMute();
    setIsMuted(nowMuted);
  };

  // Start / Retry Mission
  const handleStartMission = () => {
    setIsNewPersonalBest(false);
    setIsNewGlobalRecord(false);
    const validName = playerName.trim().slice(0, 20);
    if (validName) {
      savePlayerCallsign(validName);
    }
    setShowNameBubble(false);
    engineRef.current?.start();
  };

  // Pause / Resume Toggle
  const handleTogglePause = () => {
    const currentState = engineRef.current?.getState();
    if (currentState === 'playing') {
      engineRef.current?.pause();
    } else if (currentState === 'paused') {
      engineRef.current?.resume();
    }
  };

  // Canvas Tap/Click Handler (mobile & desktop)
  const handleCanvasInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    // Only trigger jump on direct canvas touch/click
    if (gameState === 'playing') {
      e.preventDefault();
      engineRef.current?.jump();
    }
  };

  // Helper formatting for score
  const formatScore = (num: number) => num.toString().padStart(6, '0');

  return (
    <div
      className="survival-run-page"
      style={{
        minHeight: '100vh',
        backgroundColor: '#050608',
        color: '#F8FAFC',
        paddingTop: '86px',
        paddingBottom: '48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <div className="container" style={{ width: '100%', maxWidth: '1040px', padding: '0 1rem' }}>
        
        {/* --- 1. TACTICAL HUD HEADER --- */}
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 18px',
            backgroundColor: 'rgba(13, 14, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glass, rgba(255, 23, 68, 0.25))',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            marginBottom: '14px',
          }}
        >
          {/* Brand & Mission Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('home')}
              aria-label="Back to Website"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary, #CBD5E1)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-tech, monospace)',
                transition: 'all 200ms ease',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Gamepad2 size={24} color="var(--red-accent, #FF1744)" />
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-brand, sans-serif)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    margin: 0,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>ÉVANN OPS</span>
                  <span style={{ color: 'var(--red-accent, #FF1744)', fontSize: '0.85rem' }}>// RUN</span>
                </h1>
                <span
                  style={{
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.72rem',
                    color: gameState === 'paused' ? '#FACC15' : '#10B981',
                    letterSpacing: '0.05em',
                  }}
                >
                  {gameState === 'paused' ? '⏸ MISSION PAUSED' : '● MISSION ACTIVE'}
                </span>
              </div>
            </div>
          </div>

          {/* Real-time HUD Metrics */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.88rem',
            }}
          >
            {/* Current Score */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
              }}
            >
              <span style={{ color: '#7DD3FC', fontSize: '0.72rem', display: 'block' }}>SCORE</span>
              <strong style={{ color: '#38BDF8', fontSize: '1.15rem', letterSpacing: '0.08em' }}>
                {formatScore(stats.score)}
              </strong>
            </div>

            {/* Personal Record */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(250, 204, 21, 0.4)',
              }}
            >
              <span style={{ color: '#FDE047', fontSize: '0.72rem', display: 'block' }}>RECORD</span>
              <strong style={{ color: '#FACC15', fontSize: '1.15rem', letterSpacing: '0.08em' }}>
                {formatScore(personalBest)}
              </strong>
            </div>

            {/* Mission Level */}
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <span style={{ color: '#10B981', fontSize: '0.72rem', display: 'block' }}>MISSION LVL</span>
              <strong style={{ color: '#10B981', fontSize: '1.05rem' }}>
                LVL {stats.missionLevel.toString().padStart(2, '0')}
              </strong>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Sound Muted (Click to Unmute)' : 'Sound Enabled (Click to Mute)'}
              aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              style={{
                background: isMuted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                border: `1px solid ${isMuted ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                color: isMuted ? '#F87171' : '#4ADE80',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
              }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Visible Pause / Resume HUD Button */}
            <button
              onClick={handleTogglePause}
              disabled={gameState !== 'playing' && gameState !== 'paused'}
              title={
                gameState === 'paused'
                  ? 'Resume Mission (ESC)'
                  : gameState === 'playing'
                  ? 'Pause Mission (ESC)'
                  : 'Pause available during mission'
              }
              aria-label={gameState === 'paused' ? 'Resume Mission (ESC)' : 'Pause Mission (ESC)'}
              style={{
                background: gameState === 'paused'
                  ? 'rgba(234, 179, 8, 0.25)'
                  : gameState === 'playing'
                  ? 'rgba(56, 189, 248, 0.2)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${
                  gameState === 'paused'
                    ? '#EAB308'
                    : gameState === 'playing'
                    ? 'rgba(56, 189, 248, 0.45)'
                    : 'rgba(255, 255, 255, 0.1)'
                }`,
                color: gameState === 'paused'
                  ? '#FACC15'
                  : gameState === 'playing'
                  ? '#38BDF8'
                  : '#64748B',
                borderRadius: '8px',
                padding: '8px',
                cursor: (gameState === 'playing' || gameState === 'paused') ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
                opacity: (gameState === 'playing' || gameState === 'paused') ? 1 : 0.45,
              }}
            >
              {gameState === 'paused' ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
            </button>
          </div>
        </header>

        {/* --- 2. MAIN GAME CANVAS CONTAINER --- */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '960 / 420',
            backgroundColor: '#090B10',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(56, 189, 248, 0.45)',
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.25), 0 10px 40px rgba(0, 0, 0, 0.75)',
            touchAction: 'none',
          }}
          onClick={handleCanvasInteraction}
          onTouchStart={handleCanvasInteraction}
        >
          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              cursor: gameState === 'playing' ? 'pointer' : 'default',
            }}
          />

          {/* --- OVERLAY: READY / START SCREEN --- */}
          {gameState === 'ready' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 23, 68, 0.12)',
                  border: '1px solid var(--red-accent, #FF1744)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  marginBottom: '10px',
                }}
              >
                <Flame size={16} color="var(--red-accent, #FF1744)" />
                <span
                  style={{
                    fontFamily: 'var(--font-tech, monospace)',
                    color: 'var(--red-accent, #FF1744)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                >
                  SPECIAL OPS SIMULATION
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-brand, sans-serif)',
                  fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  margin: '0 0 8px 0',
                  color: '#FFFFFF',
                  textShadow: '0 0 25px rgba(56, 189, 248, 0.6), 0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                ÉVANN OPS: SURVIVAL RUN
              </h2>

              <p
                style={{
                  fontFamily: 'var(--font-tech, sans-serif)',
                  color: '#CBD5E1',
                  fontSize: 'clamp(0.9rem, 2vw, 1.15rem)',
                  maxWidth: '560px',
                  margin: '0 0 16px 0',
                }}
              >
                Your mission: survive as long as possible behind enemy lines.
              </p>

              {/* Controls Guidance Card */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'center',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  <strong style={{ color: '#F8FAFC' }}>SPACE / ↑ / W / TAP</strong>
                  <span style={{ color: '#94A3B8', marginLeft: '6px' }}>— JUMP OVER HOSTILES</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(250, 204, 21, 0.35)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  <strong style={{ color: '#FACC15' }}>ESC</strong>
                  <span style={{ color: '#94A3B8', marginLeft: '6px' }}>— PAUSE / RESUME</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    border: '1px solid rgba(0, 229, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                >
                  <strong style={{ color: '#00E5FF' }}>✈ AIR FLYOVERS</strong>
                  <span style={{ color: '#94A3B8', marginLeft: '6px' }}>— SAFE TO RUN UNDER</span>
                </div>
              </div>

              {/* Player Name Input Container with Animated Guidance Bubble */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                }}
              >
                {/* --- Animated Blue Guidance Bubble (Points directly to Player Name input) --- */}
                {showNameBubble && (
                  <div
                    role="tooltip"
                    className="name-guidance-bubble"
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 12px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 'min(285px, calc(100vw - 48px))',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      boxShadow: '0 10px 25px rgba(37, 99, 235, 0.45), 0 4px 12px rgba(0, 0, 0, 0.35)',
                      zIndex: 50,
                      textAlign: 'left',
                      pointerEvents: 'auto',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.92rem', fontFamily: 'var(--font-tech, sans-serif)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>👋 What&apos;s your name, soldier?</span>
                      </strong>
                    </div>
                    <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', lineHeight: 1.4, color: '#DBEAFE', fontFamily: 'var(--font-tech, sans-serif)' }}>
                      Enter your name here so you can identify yourself when playing ÉVANN OPS: SURVIVAL RUN!
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleDismissNameBubble}
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#1D4ED8',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-tech, sans-serif)',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        GOT IT
                      </button>
                    </div>

                    {/* Downward pointing triangle arrow pointing at the input */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid #2563EB',
                      }}
                    />
                  </div>
                )}

                <span style={{ fontFamily: 'var(--font-tech, monospace)', fontSize: '0.8rem', color: '#94A3B8' }}>
                  PLAYER NAME:
                </span>
                <input
                  type="text"
                  maxLength={20}
                  value={playerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your name"
                  aria-label="Player Name"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    border: '1.5px solid rgba(56, 189, 248, 0.5)',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.88rem',
                    textAlign: 'center',
                    outline: 'none',
                    width: '190px',
                    boxShadow: '0 0 10px rgba(56, 189, 248, 0.15)',
                  }}
                  onFocus={() => setShowNameBubble(false)}
                />
              </div>

              {/* START MISSION BUTTON */}
              <button
                onClick={handleStartMission}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #FF1744 0%, #EA580C 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '8px',
                  padding: '14px 38px',
                  fontFamily: 'var(--font-brand, sans-serif)',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  boxShadow: '0 0 30px rgba(234, 88, 12, 0.6), 0 4px 15px rgba(0,0,0,0.5)',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(234, 88, 12, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(234, 88, 12, 0.6)';
                }}
              >
                <Play size={20} fill="#FFFFFF" />
                <span>START MISSION</span>
              </button>
            </div>
          )}

          {/* --- OVERLAY: PAUSED SCREEN (Attractively styled military arcade standstill) --- */}
          {gameState === 'paused' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                zIndex: 10,
              }}
            >
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  border: '1px solid #EAB308',
                  borderRadius: '20px',
                  padding: '5px 14px',
                  marginBottom: '10px',
                }}
              >
                <Pause size={16} color="#FACC15" />
                <span
                  style={{
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.78rem',
                    color: '#FACC15',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                >
                  TACTICAL STANDSTILL
                </span>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: 'var(--font-brand, sans-serif)',
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  margin: '0 0 6px 0',
                  textShadow: '0 0 25px rgba(56, 189, 248, 0.6), 0 2px 10px rgba(0, 0, 0, 0.8)',
                }}
              >
                MISSION PAUSED
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: 'var(--font-tech, sans-serif)',
                  color: '#CBD5E1',
                  fontSize: 'clamp(0.88rem, 1.8vw, 1.05rem)',
                  margin: '0 0 20px 0',
                  maxWidth: '480px',
                }}
              >
                Take a breather. Your mission is waiting.
              </p>

              {/* Buttons: RESUME, RESTART, BACK TO WEBSITE */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                {/* RESUME MISSION */}
                <button
                  type="button"
                  onClick={() => engineRef.current?.resume()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #FF1744 0%, #EA580C 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '12px 26px',
                    fontFamily: 'var(--font-brand, sans-serif)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(234, 88, 12, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4)',
                    transition: 'all 150ms ease',
                  }}
                >
                  <Play size={18} fill="#FFFFFF" />
                  <span>RESUME MISSION</span>
                </button>

                {/* RESTART MISSION */}
                <button
                  type="button"
                  onClick={handleStartMission}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    color: '#38BDF8',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: '8px',
                    padding: '12px 22px',
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <RotateCcw size={16} />
                  <span>RESTART MISSION</span>
                </button>

                {/* BACK TO WEBSITE */}
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>BACK TO WEBSITE</span>
                </button>
              </div>

              {/* Small Hint */}
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.8rem',
                  color: '#94A3B8',
                  letterSpacing: '0.05em',
                }}
              >
                Press <strong style={{ color: '#FACC15' }}>ESC</strong> to resume
              </span>
            </div>
          )}

          {/* --- OVERLAY: GAME OVER SCREEN --- */}
          {gameState === 'gameover' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(8, 5, 8, 0.92)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
                zIndex: 10,
              }}
            >
              {/* Alert Title */}
              <div
                style={{
                  color: 'var(--red-accent, #FF1744)',
                  fontFamily: 'var(--font-tech, monospace)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.12em',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                // COMBAT CASUALTY DETECTED //
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-brand, sans-serif)',
                  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: '0 0 12px 0',
                  textShadow: '0 0 25px rgba(255, 23, 68, 0.7)',
                  letterSpacing: '0.05em',
                }}
              >
                GAME OVER
              </h2>

              {/* New Global Record Announcement */}
              {isNewGlobalRecord && (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 23, 68, 0.2)',
                    border: '2px solid var(--red-accent, #FF1744)',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    marginBottom: '16px',
                    boxShadow: '0 0 30px rgba(255, 23, 68, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'pulse 1.5s infinite',
                  }}
                >
                  <Sparkles size={18} color="#FFD700" />
                  <strong
                    style={{
                      fontFamily: 'var(--font-brand, sans-serif)',
                      color: '#FFFFFF',
                      fontSize: '1rem',
                      letterSpacing: '0.06em',
                    }}
                  >
                    ★ NEW GLOBAL RECORD ACHIEVED! ★
                  </strong>
                  <Sparkles size={18} color="#FFD700" />
                </div>
              )}

              {/* New Personal Best Badge (if not global) */}
              {!isNewGlobalRecord && isNewPersonalBest && (
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid #38BDF8',
                    borderRadius: '6px',
                    padding: '6px 16px',
                    marginBottom: '14px',
                    color: '#38BDF8',
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                  }}
                >
                  ⚡ NEW PERSONAL BEST!
                </div>
              )}

              {/* Stats Summary Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  width: '100%',
                  maxWidth: '520px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>FINAL SCORE</span>
                  <strong style={{ fontSize: '1.25rem', color: '#FFFFFF', fontFamily: 'var(--font-mono, monospace)' }}>
                    {formatScore(stats.score)}
                  </strong>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>PERSONAL BEST</span>
                  <strong style={{ fontSize: '1.25rem', color: '#38BDF8', fontFamily: 'var(--font-mono, monospace)' }}>
                    {formatScore(personalBest)}
                  </strong>
                </div>

                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 23, 68, 0.25)',
                  }}
                >
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>GLOBAL BEST</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--red-accent, #FF1744)', fontFamily: 'var(--font-mono, monospace)' }}>
                    {formatScore(globalScoreInfo.score)}
                  </strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={handleStartMission}
                  disabled={isSubmittingScore}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'var(--red-accent, #FF1744)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 28px',
                    fontFamily: 'var(--font-brand, sans-serif)',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 0 25px rgba(255, 23, 68, 0.5)',
                  }}
                >
                  <RotateCcw size={18} />
                  <span>RETRY MISSION (ENTER)</span>
                </button>

                <button
                  onClick={() => navigate('home')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#CBD5E1',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 22px',
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  <span>Back to Website</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- 3. BOTTOM INFO & GLOBAL LEADERBOARD SECTION --- */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          {/* Mission Intel & Controls Box */}
          <div
            style={{
              backgroundColor: 'rgba(13, 14, 18, 0.85)',
              border: '1px solid var(--border-glass, rgba(255, 23, 68, 0.2))',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Shield size={18} color="var(--red-accent, #FF1744)" />
              <h3
                style={{
                  fontFamily: 'var(--font-tech, monospace)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.06em',
                  color: '#FFFFFF',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                TACTICAL INTELLIGENCE
              </h3>
            </div>
            <ul
              style={{
                fontFamily: 'var(--font-tech, sans-serif)',
                fontSize: '0.85rem',
                color: '#94A3B8',
                paddingLeft: '1.2rem',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                lineHeight: 1.5,
              }}
            >
              <li>
                <strong style={{ color: '#F8FAFC' }}>Controls:</strong> Spacebar, Up Arrow, W, or tap anywhere in the area to jump.
              </li>
              <li>
                <strong style={{ color: '#FACC15' }}>Pause / Resume:</strong> Press <strong style={{ color: '#FACC15' }}>ESC</strong> or tap the Pause button in the top HUD.
              </li>
              <li>
                <strong style={{ color: '#F8FAFC' }}>Hostiles:</strong> Clear Mini Squads, Commando Soldiers, and Combat Walker Mechs.
              </li>
              <li>
                <strong style={{ color: '#00E5FF' }}>Overhead Air Support:</strong> Aircraft fly in the upper sky and are safe to run under.
              </li>
              <li>
                <strong style={{ color: '#F8FAFC' }}>Acceleration:</strong> Speed scales up steadily as mission distance increases.
              </li>
            </ul>
          </div>

          {/* Global Leaderboard Preview Box */}
          <div
            style={{
              backgroundColor: 'rgba(13, 14, 18, 0.85)',
              border: '1px solid var(--border-glass, rgba(255, 23, 68, 0.2))',
              borderRadius: '10px',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} color="#FFD700" />
                <h3
                  style={{
                    fontFamily: 'var(--font-tech, monospace)',
                    fontSize: '0.95rem',
                    letterSpacing: '0.06em',
                    color: '#FFFFFF',
                    margin: 0,
                    textTransform: 'uppercase',
                  }}
                >
                  GLOBAL HALL OF HONOR
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: globalScoreInfo.isAvailable ? '#10B981' : '#F59E0B',
                }}
              >
                {globalScoreInfo.isAvailable ? '● SUPABASE SYNCED' : '○ LOCAL FALLBACK'}
              </span>
            </div>

            {leaderboard.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {leaderboard.map((item) => (
                  <div
                    key={item.rank}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          color: item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : '#CD7F32',
                          fontWeight: 700,
                          width: '18px',
                        }}
                      >
                        #{item.rank}
                      </span>
                      <span style={{ color: '#F8FAFC' }}>{item.name}</span>
                    </div>
                    <strong style={{ color: 'var(--red-accent, #FF1744)' }}>
                      {formatScore(item.score)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  fontSize: '0.82rem',
                  color: '#94A3B8',
                  fontFamily: 'var(--font-tech, monospace)',
                  padding: '12px 0',
                  textAlign: 'center',
                }}
              >
                {globalScoreInfo.message || 'Complete a mission to register your record.'}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Embedded CSS for animations */}
      <style>{`
        @keyframes bubbleFloat {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-5px);
          }
        }
        .name-guidance-bubble {
          animation: bubbleFloat 2.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
