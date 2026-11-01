/**
 * ÉVANN OPS: SURVIVAL RUN — RESPONSIVE ARCADE GAME PAGE
 * Features:
 * - Dedicated responsive mobile layout + intact desktop presentation
 * - Touch-optimized canvas jumping with zero-delay pointer handling & touch-action: none
 * - High-DPI uniform canvas scaling without distortion
 * - Positioned Player Callsign input & non-overlapping animated Blue Guidance Bubble
 * - Compact mobile HUD with Score, Record, Audio toggle, and Pause/Resume
 * - Responsive overlay cards for Ready, Paused, and Game Over states
 * - Tactical intel & Supabase-synced Global Hall of Honor leaderboard
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
  Check,
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

  // Player Callsign State
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
    // Initial resize & render
    engine.handleResize();
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

  // Pointer Interaction on Canvas (handles touch tap & mouse click with zero delay and no synthetic double jump)
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If user tapped an interactive button/input inside an overlay, let that element handle it
    if ((e.target as HTMLElement).closest('button, input, a')) {
      return;
    }

    if (gameState === 'playing') {
      e.preventDefault();
      engineRef.current?.jump();
    } else if (gameState === 'ready') {
      e.preventDefault();
      handleStartMission();
    }
  };

  // Helper formatting for score
  const formatScore = (num: number) => num.toString().padStart(6, '0');

  return (
    <div className="survival-run-page">
      <div className="survival-run-container">

        {/* --- 1. TITLE & MISSION DESCRIPTION (In page flow) --- */}
        <div className="game-title-header">
          <div className="game-title-row">
            <button
              onClick={() => navigate('home')}
              aria-label="Back to Website"
              className="back-nav-btn"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="game-title-wrapper">
              <Gamepad2 size={24} className="game-title-icon" color="#FF1744" />
              <h1 className="game-title-text">
                <span>ÉVANN OPS</span>
                <span className="game-title-sub">// RUN</span>
              </h1>
            </div>

            <div className="game-status-badge">
              <span
                className="status-dot"
                style={{
                  backgroundColor:
                    gameState === 'playing'
                      ? '#10B981'
                      : gameState === 'paused'
                      ? '#FACC15'
                      : '#64748B',
                }}
              />
              <span className="status-label">
                {gameState === 'playing'
                  ? 'ACTIVE'
                  : gameState === 'paused'
                  ? 'PAUSED'
                  : 'READY'}
              </span>
            </div>
          </div>

          <p className="mission-description">
            Tactical Special Ops endless runner. Survive behind enemy lines, jump incoming hostiles & set global records.
          </p>
        </div>

        {/* --- 2. PLAYER CALLSIGN INPUT & BLUE GUIDANCE BUBBLE (Shown on Ready Screen) --- */}
        {gameState === 'ready' && (
          <div className="player-callsign-section">
            {/* Animated Blue Guidance Bubble */}
            {showNameBubble && (
              <div role="tooltip" className="name-guidance-bubble">
                <div className="bubble-header">
                  <div className="bubble-title-group">
                    <Sparkles size={15} color="#FFD700" />
                    <span className="bubble-title">OPERATOR CALLSIGN REQUIRED</span>
                  </div>
                  <button
                    onClick={handleDismissNameBubble}
                    className="bubble-close-btn"
                    aria-label="Close hint"
                  >
                    ✕
                  </button>
                </div>
                <p className="bubble-text">
                  Enter your callsign below to register your combat score on the Global Hall of Honor!
                </p>
                <div className="bubble-actions">
                  <button
                    onClick={handleDismissNameBubble}
                    className="bubble-gotit-btn"
                  >
                    <span>GOT IT</span>
                  </button>
                </div>
                {/* Downward pointer pointing to input */}
                <div className="bubble-pointer-down" />
              </div>
            )}

            {/* Callsign Input Card */}
            <div className="callsign-input-card">
              <div className="callsign-label-group">
                <Shield size={16} color="#38BDF8" />
                <label htmlFor="player-callsign-input" className="callsign-label">
                  CALLSIGN:
                </label>
              </div>

              <input
                id="player-callsign-input"
                type="text"
                value={playerName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ENTER CALLSIGN..."
                maxLength={20}
                aria-label="Player Callsign"
                className="callsign-input-field"
                autoComplete="off"
                spellCheck={false}
              />

              {playerName.trim().length > 0 && (
                <span className="callsign-check-badge">
                  <Check size={14} color="#10B981" />
                  <span className="check-text">READY</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* --- 3. TACTICAL HUD (Score, Records, Audio & Pause Controls) --- */}
        <div className="tactical-hud-bar">
          {/* Current Score */}
          <div className="hud-metric-pill score-pill">
            <span className="hud-metric-label">SCORE</span>
            <strong className="hud-metric-val score-val">{formatScore(stats.score)}</strong>
          </div>

          {/* Personal Record */}
          <div className="hud-metric-pill record-pill">
            <span className="hud-metric-label">BEST</span>
            <strong className="hud-metric-val record-val">{formatScore(personalBest)}</strong>
          </div>

          {/* Mission Level */}
          <div className="hud-metric-pill level-pill">
            <span className="hud-metric-label">LVL</span>
            <strong className="hud-metric-val level-val">
              {stats.missionLevel.toString().padStart(2, '0')}
            </strong>
          </div>

          {/* Audio Toggle Button */}
          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Sound Muted (Click to Unmute)' : 'Sound Enabled (Click to Mute)'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className={`hud-control-btn mute-btn ${isMuted ? 'is-muted' : ''}`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Pause / Resume Button */}
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
            aria-label={gameState === 'paused' ? 'Resume Mission' : 'Pause Mission'}
            className={`hud-control-btn pause-btn ${
              gameState === 'paused' ? 'is-paused' : gameState === 'playing' ? 'is-active' : 'is-disabled'
            }`}
          >
            {gameState === 'paused' ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
          </button>
        </div>

        {/* --- 4. MAIN GAMEPLAY AREA (Responsive Canvas Container) --- */}
        <div
          className="game-canvas-wrapper"
          onPointerDown={handleCanvasPointerDown}
        >
          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            className="game-canvas-element"
            style={{
              cursor: gameState === 'playing' ? 'pointer' : 'default',
            }}
          />

          {/* --- OVERLAY: READY / START SCREEN --- */}
          {gameState === 'ready' && (
            <div className="canvas-overlay ready-overlay">
              <div className="ready-badge">
                <Flame size={14} color="#FF1744" />
                <span>MISSION READY</span>
              </div>

              <button
                type="button"
                onClick={handleStartMission}
                className="start-mission-cta-btn"
                aria-label="Start Mission"
              >
                <Play size={22} fill="#FFFFFF" />
                <span>START MISSION</span>
              </button>

              <span className="ready-tap-hint">
                TAP TO START • TAP ANYWHERE TO JUMP
              </span>
            </div>
          )}

          {/* --- OVERLAY: PAUSED SCREEN --- */}
          {gameState === 'paused' && (
            <div className="canvas-overlay paused-overlay">
              <div className="paused-badge">
                <Pause size={14} color="#FACC15" />
                <span>TACTICAL STANDSTILL</span>
              </div>

              <h2 className="overlay-heading paused-heading">MISSION PAUSED</h2>

              <p className="paused-subtext">
                Score: <strong style={{ color: '#38BDF8' }}>{formatScore(stats.score)}</strong> • LVL {stats.missionLevel}
              </p>

              <div className="overlay-btn-group">
                <button
                  type="button"
                  onClick={() => engineRef.current?.resume()}
                  className="overlay-btn primary-btn"
                >
                  <Play size={18} fill="#FFFFFF" />
                  <span>RESUME MISSION</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartMission}
                  className="overlay-btn secondary-btn"
                >
                  <RotateCcw size={16} />
                  <span>RESTART MISSION</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="overlay-btn outline-btn"
                >
                  <ArrowLeft size={16} />
                  <span>BACK TO WEBSITE</span>
                </button>
              </div>
            </div>
          )}

          {/* --- OVERLAY: GAME OVER SCREEN --- */}
          {gameState === 'gameover' && (
            <div className="canvas-overlay gameover-overlay">
              <div className="gameover-alert-label">
                // COMBAT CASUALTY DETECTED //
              </div>

              <h2 className="overlay-heading gameover-heading">GAME OVER</h2>

              {/* Record Announcements */}
              {isNewGlobalRecord && (
                <div className="record-banner global-record-banner">
                  <Sparkles size={16} color="#FFD700" />
                  <span>NEW GLOBAL RECORD ACHIEVED!</span>
                  <Sparkles size={16} color="#FFD700" />
                </div>
              )}

              {!isNewGlobalRecord && isNewPersonalBest && (
                <div className="record-banner personal-best-banner">
                  <span>⭐ NEW PERSONAL BEST!</span>
                </div>
              )}

              {/* Compact Stats Row */}
              <div className="gameover-stats-grid">
                <div className="stat-box">
                  <span className="stat-box-label">SCORE</span>
                  <strong className="stat-box-val">{formatScore(stats.score)}</strong>
                </div>

                <div className="stat-box">
                  <span className="stat-box-label">PERSONAL</span>
                  <strong className="stat-box-val pb-val">{formatScore(personalBest)}</strong>
                </div>

                <div className="stat-box">
                  <span className="stat-box-label">GLOBAL</span>
                  <strong className="stat-box-val global-val">{formatScore(globalScoreInfo.score)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="overlay-btn-group">
                <button
                  type="button"
                  onClick={handleStartMission}
                  disabled={isSubmittingScore}
                  className="overlay-btn primary-btn retry-btn"
                >
                  <RotateCcw size={18} />
                  <span>RETRY MISSION</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="overlay-btn outline-btn"
                >
                  <span>Back to Website</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- 5. TOUCH-CONTROL INSTRUCTIONS BAR --- */}
        <div className="controls-guide-bar">
          <div className="control-chip">
            <span className="chip-key">👆 TAP CANVAS</span>
            <span className="chip-desc">TO JUMP</span>
          </div>
          <div className="control-chip">
            <span className="chip-key">⏸️ PAUSE</span>
            <span className="chip-desc">TOP RIGHT</span>
          </div>
          <div className="control-chip">
            <span className="chip-key">✈️ FLYOVERS</span>
            <span className="chip-desc">SAFE TO RUN UNDER</span>
          </div>
        </div>

        {/* --- 6. SECONDARY INSTRUCTIONS & GLOBAL HALL OF HONOR --- */}
        <section className="game-bottom-grid">
          {/* Tactical Intelligence */}
          <div className="bottom-card tactical-intel-card">
            <div className="card-header-row">
              <Shield size={18} color="#FF1744" />
              <h3 className="card-heading">TACTICAL INTELLIGENCE</h3>
            </div>
            <ul className="intel-list">
              <li>
                <strong>Controls:</strong> Tap the screen, press Spacebar, Up Arrow, or W to jump.
              </li>
              <li>
                <strong>Pause / Resume:</strong> Tap the Pause button in the HUD or press <strong>ESC</strong> on keyboard.
              </li>
              <li>
                <strong>Hostile Units:</strong> Clear Mini Squads, Commando Soldiers, and Combat Walker Mechs.
              </li>
              <li>
                <strong>Air Support:</strong> Stealth jet aircraft fly safely high in the sky.
              </li>
              <li>
                <strong>Difficulty:</strong> Speed escalates dynamically as your mission distance increases.
              </li>
            </ul>
          </div>

          {/* Global Leaderboard Preview */}
          <div className="bottom-card leaderboard-card">
            <div className="card-header-row">
              <div className="leaderboard-title-group">
                <Trophy size={18} color="#FFD700" />
                <h3 className="card-heading">GLOBAL HALL OF HONOR</h3>
              </div>
              <span className="supabase-status-tag">
                {globalScoreInfo.isAvailable ? '● SYNCED' : 'LOCAL'}
              </span>
            </div>

            {leaderboard.length > 0 ? (
              <div className="leaderboard-list">
                {leaderboard.map((item) => (
                  <div key={item.rank} className="leaderboard-row">
                    <div className="leaderboard-player">
                      <span
                        className="leaderboard-rank"
                        style={{
                          color:
                            item.rank === 1
                              ? '#FFD700'
                              : item.rank === 2
                              ? '#C0C0C0'
                              : '#CD7F32',
                        }}
                      >
                        #{item.rank}
                      </span>
                      <span className="leaderboard-name">{item.name}</span>
                    </div>
                    <strong className="leaderboard-score">{formatScore(item.score)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="leaderboard-empty">
                {globalScoreInfo.message || 'Complete a mission to register your record.'}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Embedded Responsive CSS for Survival Run Layout */}
      <style>{`
        /* Global Page Container */
        .survival-run-page {
          min-height: 100vh;
          background-color: #050608;
          color: #F8FAFC;
          padding-top: calc(56px + env(safe-area-inset-top, 0px) + 8px);
          padding-bottom: calc(36px + env(safe-area-inset-bottom, 0px));
          padding-left: calc(12px + env(safe-area-inset-left, 0px));
          padding-right: calc(12px + env(safe-area-inset-right, 0px));
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          user-select: none;
          -webkit-user-select: none;
          overflow-x: hidden;
          width: 100%;
          box-sizing: border-box;
        }

        .survival-run-container {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        @media (min-width: 768px) {
          .survival-run-page {
            padding-top: calc(78px + env(safe-area-inset-top, 0px) + 12px);
            padding-bottom: 48px;
            padding-left: 20px;
            padding-right: 20px;
          }
          .survival-run-container {
            gap: 14px;
          }
        }

        /* 1. Game Title Header */
        .game-title-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }

        .game-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          width: 100%;
        }

        .back-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #CBD5E1;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 0.82rem;
          min-height: 38px;
          cursor: pointer;
          font-family: var(--font-tech, monospace);
          transition: all 150ms ease;
          flex-shrink: 0;
        }
        .back-nav-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }

        .game-title-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .game-title-icon {
          flex-shrink: 0;
        }

        .game-title-text {
          font-family: var(--font-brand, sans-serif);
          font-size: clamp(1rem, 3.2vw, 1.35rem);
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #FFFFFF;
          margin: 0;
          text-transform: uppercase;
          display: flex;
          align-items: baseline;
          gap: 5px;
          white-space: nowrap;
        }

        .game-title-sub {
          color: #FF1744;
          font-size: 0.78em;
        }

        .game-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(0, 0, 0, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
          font-family: var(--font-tech, monospace);
          font-size: 0.7rem;
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-label {
          color: #CBD5E1;
        }

        .mission-description {
          font-family: var(--font-tech, sans-serif);
          color: #94A3B8;
          font-size: clamp(0.75rem, 1.8vw, 0.88rem);
          margin: 0;
          line-height: 1.35;
        }

        /* 2. Player Callsign & Guidance Bubble */
        .player-callsign-section {
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .name-guidance-bubble {
          position: relative;
          width: 100%;
          max-width: 320px;
          margin: 0 auto 10px auto;
          background: #2563EB;
          color: #FFFFFF;
          padding: 10px 14px;
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
          z-index: 30;
          animation: bubblePulse 2.8s ease-in-out infinite;
          box-sizing: border-box;
        }

        @keyframes bubblePulse {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .bubble-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }

        .bubble-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .bubble-title {
          font-family: var(--font-brand, sans-serif);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .bubble-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #FFFFFF;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .bubble-text {
          font-family: var(--font-tech, sans-serif);
          font-size: 0.78rem;
          line-height: 1.3;
          margin: 0 0 8px 0;
          opacity: 0.95;
        }

        .bubble-actions {
          display: flex;
          justify-content: flex-end;
        }

        .bubble-gotit-btn {
          background: #FFFFFF;
          color: #2563EB;
          border: none;
          border-radius: 5px;
          padding: 4px 12px;
          font-family: var(--font-brand, sans-serif);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
        }

        .bubble-pointer-down {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #2563EB;
        }

        .callsign-input-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(13, 14, 18, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 8px;
          padding: 4px 10px;
          box-sizing: border-box;
          min-height: 44px;
        }

        .callsign-label-group {
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }

        .callsign-label {
          font-family: var(--font-tech, monospace);
          font-size: 0.75rem;
          color: #38BDF8;
          letter-spacing: 0.06em;
          font-weight: 700;
        }

        .callsign-input-field {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: #FFFFFF;
          font-family: var(--font-mono, monospace);
          font-size: 16px; /* 16px prevents iOS Safari auto-zoom */
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .callsign-input-field::placeholder {
          color: #475569;
          font-size: 0.82rem;
          font-weight: 500;
        }

        .callsign-check-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          padding: 3px 8px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .check-text {
          font-family: var(--font-tech, monospace);
          font-size: 0.68rem;
          color: #10B981;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        /* 3. Tactical HUD Bar */
        .tactical-hud-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          background: rgba(13, 14, 18, 0.9);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 23, 68, 0.22);
          border-radius: 8px;
          padding: 6px 8px;
          width: 100%;
          box-sizing: border-box;
          min-height: 46px;
        }

        .hud-metric-pill {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: rgba(0, 0, 0, 0.55);
          padding: 4px 8px;
          border-radius: 6px;
          min-width: 0;
          flex: 1;
        }

        .hud-metric-label {
          font-size: 0.62rem;
          font-family: var(--font-tech, monospace);
          letter-spacing: 0.05em;
          line-height: 1;
          margin-bottom: 2px;
        }

        .hud-metric-val {
          font-family: var(--font-mono, monospace);
          font-size: clamp(0.92rem, 2.5vw, 1.15rem);
          letter-spacing: 0.06em;
          line-height: 1;
          white-space: nowrap;
        }

        .score-pill {
          border: 1px solid rgba(56, 189, 248, 0.4);
        }
        .score-pill .hud-metric-label {
          color: #7DD3FC;
        }
        .score-val {
          color: #38BDF8;
        }

        .record-pill {
          border: 1px solid rgba(250, 204, 21, 0.4);
        }
        .record-pill .hud-metric-label {
          color: #FDE047;
        }
        .record-val {
          color: #FACC15;
        }

        .level-pill {
          border: 1px solid rgba(16, 185, 129, 0.35);
          max-width: 58px;
          display: none;
        }
        .level-pill .hud-metric-label {
          color: #6EE7B7;
        }
        .level-val {
          color: #10B981;
        }

        @media (min-width: 360px) {
          .level-pill {
            display: flex;
          }
        }

        .hud-control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          min-height: 40px;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 150ms ease;
          flex-shrink: 0;
        }

        .mute-btn {
          background: rgba(34, 197, 94, 0.15);
          border-color: rgba(34, 197, 94, 0.35);
          color: #4ADE80;
        }
        .mute-btn.is-muted {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
          color: #F87171;
        }

        .pause-btn.is-active {
          background: rgba(56, 189, 248, 0.18);
          border-color: rgba(56, 189, 248, 0.45);
          color: #38BDF8;
        }
        .pause-btn.is-paused {
          background: rgba(234, 179, 8, 0.25);
          border-color: #EAB308;
          color: #FACC15;
        }
        .pause-btn.is-disabled {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          color: #64748B;
          opacity: 0.45;
          cursor: default;
        }

        /* 4. Canvas Wrapper */
        .game-canvas-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          min-height: 210px;
          max-height: 44vh;
          background-color: #090B10;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(56, 189, 248, 0.45);
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.2), 0 8px 30px rgba(0, 0, 0, 0.7);
          touch-action: none; /* Prevents scroll & double-tap zoom on canvas */
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .game-canvas-wrapper {
            aspect-ratio: 960 / 420;
            max-height: none;
            border-radius: 12px;
          }
        }

        .game-canvas-element {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* Canvas Overlays */
        .canvas-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          box-sizing: border-box;
          z-index: 10;
          text-align: center;
        }

        .ready-overlay {
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(5px);
          gap: 10px;
        }

        .ready-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 23, 68, 0.15);
          border: 1px solid #FF1744;
          padding: 3px 12px;
          border-radius: 14px;
          font-family: var(--font-tech, monospace);
          color: #FF1744;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }

        .start-mission-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #FF1744 0%, #EA580C 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 12px 28px;
          min-width: 200px;
          min-height: 48px;
          font-family: var(--font-brand, sans-serif);
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          cursor: pointer;
          box-shadow: 0 0 25px rgba(234, 88, 12, 0.55), 0 4px 14px rgba(0, 0, 0, 0.5);
          animation: ctaPulse 2s infinite;
          transition: transform 150ms ease;
        }

        @keyframes ctaPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 25px rgba(234, 88, 12, 0.55);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 35px rgba(234, 88, 12, 0.8);
          }
        }

        .ready-tap-hint {
          font-family: var(--font-mono, monospace);
          font-size: 0.75rem;
          color: #94A3B8;
          letter-spacing: 0.05em;
        }

        /* Paused Overlay */
        .paused-overlay {
          background: rgba(15, 23, 42, 0.82);
          backdrop-filter: blur(6px);
          gap: 8px;
        }

        .paused-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(234, 179, 8, 0.18);
          border: 1px solid #EAB308;
          border-radius: 14px;
          padding: 3px 10px;
          font-family: var(--font-tech, monospace);
          font-size: 0.72rem;
          color: #FACC15;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .overlay-heading {
          font-family: var(--font-brand, sans-serif);
          font-weight: 900;
          letter-spacing: 0.05em;
          margin: 0;
          line-height: 1.1;
        }

        .paused-heading {
          font-size: clamp(1.3rem, 4vw, 2.2rem);
          color: #FFFFFF;
          text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);
        }

        .paused-subtext {
          font-family: var(--font-mono, monospace);
          font-size: 0.82rem;
          color: #CBD5E1;
          margin: 0 0 4px 0;
        }

        .overlay-btn-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
          width: 100%;
          max-width: 240px;
          align-items: center;
        }

        @media (min-width: 640px) {
          .overlay-btn-group {
            flex-direction: row;
            max-width: none;
            justify-content: center;
            gap: 10px;
          }
        }

        .overlay-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 7px;
          font-family: var(--font-brand, sans-serif);
          font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer;
          width: 100%;
          min-height: 42px;
          padding: 8px 18px;
          font-size: 0.88rem;
          transition: all 150ms ease;
          border: 1px solid transparent;
        }

        @media (min-width: 640px) {
          .overlay-btn {
            width: auto;
            min-width: 150px;
          }
        }

        .primary-btn {
          background: linear-gradient(135deg, #FF1744 0%, #EA580C 100%);
          color: #FFFFFF;
          border-color: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 20px rgba(234, 88, 12, 0.45);
        }

        .secondary-btn {
          background: rgba(56, 189, 248, 0.15);
          color: #38BDF8;
          border-color: rgba(56, 189, 248, 0.4);
          font-family: var(--font-tech, monospace);
          font-weight: 700;
        }

        .outline-btn {
          background: rgba(255, 255, 255, 0.06);
          color: #CBD5E1;
          border-color: rgba(255, 255, 255, 0.15);
          font-family: var(--font-tech, monospace);
        }

        /* Game Over Overlay */
        .gameover-overlay {
          background: rgba(8, 5, 8, 0.9);
          backdrop-filter: blur(8px);
          gap: 6px;
        }

        .gameover-alert-label {
          color: #FF1744;
          font-family: var(--font-tech, monospace);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .gameover-heading {
          font-size: clamp(1.4rem, 4.5vw, 2.5rem);
          color: #FFFFFF;
          text-shadow: 0 0 25px rgba(255, 23, 68, 0.7);
        }

        .record-banner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 6px;
          padding: 4px 12px;
          font-family: var(--font-tech, monospace);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .global-record-banner {
          background: rgba(255, 23, 68, 0.25);
          border: 1px solid #FF1744;
          color: #FFFFFF;
          box-shadow: 0 0 20px rgba(255, 23, 68, 0.5);
        }

        .personal-best-banner {
          background: rgba(56, 189, 248, 0.18);
          border: 1px solid #38BDF8;
          color: #38BDF8;
        }

        .gameover-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          width: 100%;
          max-width: 380px;
          margin: 4px 0 8px 0;
        }

        .stat-box {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 4px 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-box-label {
          font-size: 0.6rem;
          color: #94A3B8;
          font-family: var(--font-tech, monospace);
        }

        .stat-box-val {
          font-family: var(--font-mono, monospace);
          font-size: clamp(0.85rem, 2.2vw, 1.1rem);
          color: #FFFFFF;
        }

        .pb-val {
          color: #38BDF8;
        }

        .global-val {
          color: #FF1744;
        }

        .retry-btn {
          min-height: 46px;
        }

        /* 5. Controls Guide Bar */
        .controls-guide-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
          width: 100%;
          padding: 2px 0;
        }

        .control-chip {
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 0.72rem;
          font-family: var(--font-mono, monospace);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .chip-key {
          color: #F8FAFC;
          font-weight: 700;
        }

        .chip-desc {
          color: #94A3B8;
        }

        /* 6. Bottom Grid (Intel & Leaderboard) */
        .game-bottom-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          width: 100%;
          margin-top: 4px;
        }

        @media (min-width: 768px) {
          .game-bottom-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            margin-top: 8px;
          }
        }

        .bottom-card {
          background: rgba(13, 14, 18, 0.85);
          border: 1px solid rgba(255, 23, 68, 0.18);
          border-radius: 10px;
          padding: 14px 16px;
          box-sizing: border-box;
        }

        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .card-heading {
          font-family: var(--font-tech, monospace);
          font-size: 0.88rem;
          letter-spacing: 0.06em;
          color: #FFFFFF;
          margin: 0;
          text-transform: uppercase;
        }

        .intel-list {
          font-family: var(--font-tech, sans-serif);
          font-size: 0.8rem;
          color: #94A3B8;
          padding-left: 1.1rem;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
          line-height: 1.4;
        }

        .intel-list strong {
          color: #F8FAFC;
        }

        .leaderboard-title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .supabase-status-tag {
          font-size: 0.68rem;
          font-family: var(--font-mono, monospace);
          color: #10B981;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .leaderboard-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 8px;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 5px;
          font-family: var(--font-mono, monospace);
          font-size: 0.8rem;
        }

        .leaderboard-player {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }

        .leaderboard-rank {
          font-weight: 700;
          width: 18px;
          flex-shrink: 0;
        }

        .leaderboard-name {
          color: #F8FAFC;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .leaderboard-score {
          color: #FF1744;
          flex-shrink: 0;
        }

        .leaderboard-empty {
          font-size: 0.78rem;
          color: #94A3B8;
          font-family: var(--font-tech, monospace);
          padding: 8px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
