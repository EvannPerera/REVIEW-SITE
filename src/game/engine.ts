/**
 * ÉVANN OPS: SURVIVAL RUN — GAME ENGINE
 * High-performance, delta-time driven 2D game loop on HTML5 Canvas.
 * Handles physics, jump mechanics, parallax scrolling, obstacle pool,
 * progressive difficulty scaling, audio hooks, and clean lifecycle management.
 */

import { Player, Obstacle, Particle, GameStats, GameState, ObstacleType } from './types';
import { drawPlayer, drawObstacle, drawEnvironment, drawParticles } from './sprites';
import { soundEngine } from './audio';

export interface GameEngineCallbacks {
  onScoreUpdate: (stats: GameStats) => void;
  onGameOver: (finalStats: GameStats) => void;
  onStateChange: (state: GameState) => void;
  onLevelUp?: (level: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private callbacks: GameEngineCallbacks;

  // Viewport & Scaling
  public virtualWidth = 960;
  public virtualHeight = 420;
  public groundY = 345;

  // Game Loop
  private animFrameId: number | null = null;
  private lastTime = 0;
  private state: GameState = 'ready';

  // Player State
  private player: Player = {
    x: 90,
    y: 0, // set in reset()
    width: 36,
    height: 52,
    velocityY: 0,
    isGrounded: true,
    isJumping: false,
    jumpTimer: 0,
    runCycle: 0,
    headBobAngle: 0,
    bodyBounceY: 0,
    landingSquash: 1.0,
  };

  // Physics constants
  private readonly gravity = 1520; // px/s^2
  private readonly jumpForce = -560; // px/s
  private readonly baseSpeed = 310; // px/s
  private readonly maxSpeed = 740;  // px/s

  // World State
  private scrollDistance = 0;
  private obstacles: Obstacle[] = [];
  private particles: Particle[] = [];
  private nextObstacleDistance = 0;
  private nextObstacleId = 1;
  private safePeriodTimer = 3.2; // seconds of initial grace period without obstacles

  // Stats
  private stats: GameStats = {
    score: 0,
    distanceMeters: 0,
    missionLevel: 1,
    gameSpeed: 310,
    elapsedTime: 0,
    enemiesAvoided: 0,
  };

  // Score accumulation
  private scoreAcc = 0;
  private lastFootstepCycle = 0;

  constructor(canvas: HTMLCanvasElement, callbacks: GameEngineCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get 2D canvas context');
    this.ctx = context;
    this.callbacks = callbacks;

    this.handleResize();
    this.reset();
  }

  /**
   * Resize canvas backing store to high-DPI
   */
  public handleResize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);
    const parent = this.canvas.parentElement;
    const rect = this.canvas.getBoundingClientRect();
    const displayWidth = Math.max(280, (parent ? parent.clientWidth : rect.width) || this.virtualWidth);
    const displayHeight = Math.max(160, (parent ? parent.clientHeight : rect.height) || this.virtualHeight);

    // Fixed virtual height of 420 ensures identical jump arc, gravity, and ground height (345)
    this.virtualHeight = 420;
    // Adapt virtual width proportionally to the exact display aspect ratio
    this.virtualWidth = Math.round(420 * (displayWidth / displayHeight));

    this.canvas.width = Math.round(displayWidth * dpr);
    this.canvas.height = Math.round(displayHeight * dpr);

    // Dynamic player X position: keeps player comfortably placed from left edge on narrow screens
    this.player.x = Math.max(50, Math.min(90, Math.round(this.virtualWidth * 0.11)));

    // Uniform proportional scale in both dimensions (ZERO stretching or distortion!)
    this.ctx.resetTransform?.();
    const scale = this.canvas.width / this.virtualWidth;
    this.ctx.scale(scale, scale);
  }

  /**
   * Reset game state for a new mission
   */
  public reset(): void {
    this.player.y = this.groundY - this.player.height;
    this.player.velocityY = 0;
    this.player.isGrounded = true;
    this.player.isJumping = false;
    this.player.runCycle = 0;
    this.player.landingSquash = 1.0;

    this.scrollDistance = 0;
    this.obstacles = [];
    this.particles = [];
    this.nextObstacleId = 1;
    this.safePeriodTimer = 3.0; // 3 seconds safe zone
    this.nextObstacleDistance = 500;

    this.stats = {
      score: 0,
      distanceMeters: 0,
      missionLevel: 1,
      gameSpeed: this.baseSpeed,
      elapsedTime: 0,
      enemiesAvoided: 0,
    };
    this.scoreAcc = 0;
    this.lastFootstepCycle = 0;
  }

  /**
   * Start or restart gameplay
   */
  public start(): void {
    soundEngine.unlockAudio();
    this.reset();
    this.setState('playing');
    this.lastTime = performance.now();
    this.startLoop();
  }

  /**
   * Pause gameplay
   */
  public pause(): void {
    if (this.state === 'playing') {
      this.setState('paused');
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }
  }

  /**
   * Resume gameplay from pause
   */
  public resume(): void {
    if (this.state === 'paused') {
      this.setState('playing');
      this.lastTime = performance.now();
      this.startLoop();
    }
  }

  /**
   * Execute jump action
   */
  public jump(): boolean {
    if (this.state !== 'playing') {
      if (this.state === 'ready') {
        this.start();
        return true;
      }
      return false;
    }

    // Only allow jump when grounded (no double jumping)
    if (this.player.isGrounded) {
      this.player.velocityY = this.jumpForce;
      this.player.isGrounded = false;
      this.player.isJumping = true;
      this.player.landingSquash = 1.0;
      soundEngine.playJump();

      // Emit jump dust burst
      this.emitDust(this.player.x + this.player.width / 2, this.groundY, 8);
      return true;
    }

    return false;
  }

  private setState(newState: GameState): void {
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  public getState(): GameState {
    return this.state;
  }

  private startLoop(): void {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const loop = (currentTime: number) => {
      if (this.state !== 'playing') return;

      const dt = Math.min((currentTime - this.lastTime) / 1000, 0.08); // Cap max delta to avoid physics tunnels
      this.lastTime = currentTime;

      this.update(dt);
      this.render();

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  /**
   * Main physics & world update step
   */
  private update(dt: number): void {
    // 1. Calculate current game speed (gradual smooth scaling based on score)
    const speedBonus = Math.min((this.stats.score * 0.16) + (this.stats.distanceMeters * 0.04), this.maxSpeed - this.baseSpeed);
    this.stats.gameSpeed = this.baseSpeed + speedBonus;
    const currentSpeed = this.stats.gameSpeed;

    // 2. Update stats & distance
    this.stats.elapsedTime += dt;
    const distanceDelta = currentSpeed * dt;
    this.scrollDistance += distanceDelta;
    this.stats.distanceMeters += distanceDelta / 20; // 20px approx 1 meter

    // Score increases consistently as player survives
    this.scoreAcc += dt * (12 + (this.stats.missionLevel * 2));
    this.stats.score = Math.floor(this.scoreAcc);

    // Update mission level (every 300 points)
    const newLevel = Math.min(99, Math.floor(this.stats.score / 300) + 1);
    if (newLevel !== this.stats.missionLevel) {
      this.stats.missionLevel = newLevel;
      this.callbacks.onLevelUp?.(newLevel);
    }

    this.callbacks.onScoreUpdate(this.stats);

    // 3. Update Player Physics
    this.updatePlayer(dt);

    // 4. Update Safe Period & Obstacle Spawning
    if (this.safePeriodTimer > 0) {
      this.safePeriodTimer -= dt;
    } else {
      this.updateObstacleSpawning(distanceDelta);
    }

    // 5. Update Obstacles Movement & Collision
    this.updateObstacles(dt, currentSpeed);

    // 6. Update Particles
    this.updateParticles(dt);
  }

  private updatePlayer(dt: number): void {
    const p = this.player;

    if (!p.isGrounded) {
      // Apply gravity
      p.velocityY += this.gravity * dt;
      p.y += p.velocityY * dt;

      // Check ground landing
      if (p.y >= this.groundY - p.height) {
        p.y = this.groundY - p.height;
        p.velocityY = 0;
        p.isGrounded = true;
        p.isJumping = false;
        p.landingSquash = 0.82; // Visual landing squash!
        soundEngine.playLand();
        this.emitDust(p.x + p.width / 2, this.groundY, 6);
      }
    } else {
      // Recover landing squash smoothly
      if (p.landingSquash < 1.0) {
        p.landingSquash = Math.min(1.0, p.landingSquash + dt * 6);
      }

      // Running animation cycle (speed-matched)
      const stepFreq = (this.stats.gameSpeed / 180);
      p.runCycle = (p.runCycle + dt * stepFreq) % 1.0;

      // Footstep sound at cycle intervals
      if ((p.runCycle > 0.25 && this.lastFootstepCycle <= 0.25) ||
          (p.runCycle > 0.75 && this.lastFootstepCycle <= 0.75)) {
        soundEngine.playFootstep();
        this.emitDust(p.x + 8, this.groundY, 2);
      }
      this.lastFootstepCycle = p.runCycle;
    }
  }

  private updateObstacleSpawning(distanceDelta: number): void {
    this.nextObstacleDistance -= distanceDelta;

    if (this.nextObstacleDistance <= 0) {
      this.spawnObstacle();

      // Calculate next safe reaction window
      // Guaranteed 0.85s to 1.35s reaction window depending on speed
      const baseSpacing = Math.max(380, this.stats.gameSpeed * 0.88);
      const randomPadding = Math.random() * 240;
      this.nextObstacleDistance = baseSpacing + randomPadding;
    }
  }

  private spawnObstacle(): void {
    const level = this.stats.missionLevel;
    const pool: ObstacleType[] = ['mini_soldiers', 'standard_soldier'];

    if (level >= 2) pool.push('three_formation');
    if (level >= 3) pool.push('combat_robot');
    if (level >= 2 && Math.random() < 0.25) pool.push('aircraft_flyover');

    const chosenType = pool[Math.floor(Math.random() * pool.length)];
    const spawnX = this.virtualWidth + 40;

    let width = 24;
    let height = 44;
    let subCount = 1;
    let isFlyover = false;
    let spawnY = this.groundY - height;

    switch (chosenType) {
      case 'mini_soldiers':
        // Groups of 2 or 3 mini soldiers with visible body shapes and moving legs
        subCount = Math.random() < 0.6 ? 2 : 3;
        width = subCount === 2 ? 46 : 68;
        height = 34; // Clearly visible!
        spawnY = this.groundY - height;
        break;

      case 'standard_soldier':
        width = 28;
        height = 48; // Large, clear, fully illustrated!
        spawnY = this.groundY - height;
        break;

      case 'three_formation':
        width = 78;
        height = 48; // Well spaced three-soldier file!
        spawnY = this.groundY - height;
        break;

      case 'combat_robot':
        width = 44;
        height = 64; // Intimidating heavy combat walker mech!
        spawnY = this.groundY - height;
        break;

      case 'aircraft_flyover':
        width = 70;
        height = 24;
        isFlyover = true;
        spawnY = 55 + Math.random() * 35; // Fly high overhead
        soundEngine.playAircraftFlyover();
        break;
    }

    // Inset tight inner hitbox for fair, exhilarating gameplay
    // Inset tight inner hitbox for fair, exhilarating gameplay
    const hitbox = isFlyover
      ? { x: 0, y: 0, width: 0, height: 0 } // AIRCRAFT FLYOVER NEVER COLLIDES!
      : chosenType === 'combat_robot'
      ? {
          x: spawnX + 6,
          y: spawnY + 12, // Forgiving top hitbox so 103px jump clears cleanly!
          width: width - 12,
          height: height - 14,
        }
      : {
          x: spawnX + 4,
          y: spawnY + 4,
          width: width - 8,
          height: height - 6,
        };

    const obstacle: Obstacle = {
      id: this.nextObstacleId++,
      type: chosenType,
      x: spawnX,
      y: spawnY,
      width,
      height,
      hitbox,
      speedMultiplier: isFlyover ? 1.6 : 1.0,
      animTimer: 0,
      cleared: false,
      subCount,
      isFlyover,
    };

    this.obstacles.push(obstacle);
  }

  private updateObstacles(dt: number, currentSpeed: number): void {
    const p = this.player;

    // Player tight bounding box
    const playerHitbox = {
      x: p.x + 8,
      y: p.y + 6,
      width: p.width - 14,
      height: p.height - 8,
    };

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.animTimer += dt;
      obs.x -= currentSpeed * obs.speedMultiplier * dt;

      // Update hitbox position
      if (!obs.isFlyover) {
        obs.hitbox.x = obs.x + 4;
        obs.hitbox.y = obs.y + 4;

        // Check Collision with player
        if (this.checkCollision(playerHitbox, obs.hitbox)) {
          this.triggerGameOver();
          return;
        }

        // Check if cleared
        if (!obs.cleared && obs.x + obs.width < p.x) {
          obs.cleared = true;
          this.stats.enemiesAvoided++;
          this.scoreAcc += 15; // Bonus points for clearing obstacle!
        }
      }

      // Despawn off-screen obstacles
      if (obs.x + obs.width < -120) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  private checkCollision(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private triggerGameOver(): void {
    this.setState('gameover');
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    soundEngine.playGameOver();

    // Trigger explosive impact particles
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;
    this.emitExplosion(px, py);

    // Final render with explosion
    this.render();

    this.callbacks.onGameOver(this.stats);
  }

  private emitDust(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 8 - 4),
        y: y - 2,
        vx: -(this.stats.gameSpeed * 0.4) - Math.random() * 60,
        vy: -(Math.random() * 40 + 10),
        size: Math.random() * 3 + 1.5,
        color: 'rgba(245, 158, 11, 0.45)',
        alpha: 0.6,
        decay: 1.8 + Math.random() * 1.5,
      });
    }
  }

  private emitExplosion(x: number, y: number): void {
    const colors = ['#F59E0B', '#EF4444', '#FACC15', '#00F0FF', '#FFFFFF'];
    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36 + (Math.random() * 0.4);
      const speed = Math.random() * 260 + 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
        decay: 1.2 + Math.random() * 0.8,
      });
    }
  }

  private updateParticles(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.alpha -= p.decay * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Main render pass
   */
  public render(): void {
    const ctx = this.ctx;
    const w = this.virtualWidth;
    const h = this.virtualHeight;

    // 1. Clear background
    ctx.clearRect(0, 0, w, h);

    // 2. Parallax Environment
    drawEnvironment(ctx, w, h, this.groundY, this.scrollDistance);

    // 3. Obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      drawObstacle(ctx, this.obstacles[i], this.groundY);
    }

    // 4. Ghost Player Operator
    drawPlayer(ctx, this.player, this.groundY);

    // 5. Particles
    drawParticles(ctx, this.particles);
  }

  /**
   * Cleanup resources on unmount
   */
  public destroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.obstacles = [];
    this.particles = [];
  }
}
