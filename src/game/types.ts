/**
 * ÉVANN OPS: SURVIVAL RUN — TYPES & INTERFACES
 */

export type GameState = 'ready' | 'playing' | 'paused' | 'gameover' | 'restarting';

export type ObstacleType = 
  | 'mini_soldiers'
  | 'standard_soldier'
  | 'combat_robot'
  | 'three_formation'
  | 'aircraft_flyover';

export interface HitBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  isGrounded: boolean;
  isJumping: boolean;
  jumpTimer: number;
  runCycle: number; // 0 to 1 cycle progress
  headBobAngle: number;
  bodyBounceY: number;
  landingSquash: number; // 1 = normal, < 1 = squashed
}

export interface Obstacle {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  width: number;
  height: number;
  hitbox: HitBox;
  speedMultiplier: number;
  animTimer: number;
  cleared: boolean; // Has the player cleared this obstacle
  subCount?: number; // e.g. 2 or 3 mini soldiers
  glowColor?: string;
  isFlyover?: boolean; // If true, never collides with player!
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation?: number;
  vRot?: number;
}

export interface ParallaxLayer {
  speedFactor: number;
  offset: number;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, offset: number) => void;
}

export interface GameStats {
  score: number;
  distanceMeters: number;
  missionLevel: number;
  gameSpeed: number;
  elapsedTime: number;
  enemiesAvoided: number;
}
