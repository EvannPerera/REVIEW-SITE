/**
 * ÉVANN OPS: SURVIVAL RUN — COLOURFUL CINEMATIC MILITARY ARCADE SPRITES
 * Vibrant, high-contrast, fully readable military characters, mechs, aircraft,
 * and outdoor combat zone environment.
 */

import { Player, Obstacle, Particle } from './types';

// ============================================================================
// VIBRANT COLOR PALETTES
// ============================================================================
// Player (Ghost Operator: Dark slate & iconic skull mask with cyan optic)
const P_SUIT = '#1E293B';
const P_SUIT_LIGHT = '#334155';
const P_VEST = '#0F172A';
const P_SKULL = '#F8FAFC';
const P_CYAN = '#00F0FF';
const P_BOOTS = '#090D16';

// Enemy Standard & Mini Soldiers (Desert Tan & Olive Green with High-Vis Orange)
const E_UNIFORM = '#E5A967'; // Warm desert tan (pops against blue/green!)
const E_UNIFORM_SHADOW = '#B4783B';
const E_VEST = '#3F6212';    // Rich tactical olive green
const E_VEST_STRAP = '#EA580C'; // High-vis orange tactical harness
const E_HELMET = '#78350F';  // Tan combat helmet
const E_BOOTS = '#1C1917';   // Tactical black boots
const E_VISOR = '#EF4444';   // Hostile red combat visor dot
const E_WEAPON = '#1E293B';  // Carbine rifle silhouette

// Combat Mech (Cobalt Blue, Metallic Titanium & Hazard Yellow)
const MECH_BLUE = '#2563EB';
const MECH_DARK = '#1E293B';
const MECH_TITANIUM = '#94A3B8';
const MECH_HAZARD = '#FACC15';
const MECH_GLOW = '#EF4444';

// ============================================================================
// 1. DRAW GHOST-INSPIRED PLAYER OPERATOR
// ============================================================================
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  groundY: number
): void {
  ctx.save();

  const px = player.x;
  const py = player.y;
  const squash = player.landingSquash;

  // Apply landing squash scale if landing
  ctx.translate(px + player.width / 2, py + player.height);
  ctx.scale(1 / squash, squash);
  ctx.translate(-(px + player.width / 2), -(py + player.height));

  const isJumping = !player.isGrounded;
  const cycle = player.runCycle; // 0 to 1

  // Kinetic parameters
  const bobY = isJumping ? 0 : Math.sin(cycle * Math.PI * 2) * 3;
  const headNod = isJumping ? -0.05 : Math.sin(cycle * Math.PI * 2) * 0.14; // distinctive head nod!
  const legAngle1 = isJumping ? -0.58 : Math.sin(cycle * Math.PI * 2) * 0.85;
  const legAngle2 = isJumping ? -0.45 : -Math.sin(cycle * Math.PI * 2) * 0.85;
  const armAngle = isJumping ? -0.25 : Math.sin(cycle * Math.PI * 2) * 0.52;

  const cx = px + player.width / 2;
  const hipY = py + player.height - 24 + bobY;

  // Ground Shadow
  if (player.isGrounded) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx, groundY, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const altitude = Math.max(0, groundY - (py + player.height));
    const shadowScale = Math.max(0.35, 1 - altitude / 220);
    ctx.fillStyle = `rgba(0, 0, 0, ${0.35 * shadowScale})`;
    ctx.beginPath();
    ctx.ellipse(cx, groundY, 18 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- BACK LEG ---
  drawPlayerLeg(ctx, cx - 2, hipY, legAngle2, isJumping, false);

  // --- TORSO & PLATE CARRIER ---
  ctx.save();
  ctx.translate(cx, hipY);
  ctx.rotate(isJumping ? -0.08 : 0.05);

  // Combat Under-suit
  ctx.fillStyle = P_SUIT;
  ctx.beginPath();
  ctx.roundRect(-9, -24, 18, 24, 3);
  ctx.fill();

  // Tactical Plate Carrier Vest (Matte Dark Slate with Molle pouches)
  ctx.fillStyle = P_VEST;
  ctx.beginPath();
  ctx.roundRect(-10, -22, 20, 18, 2);
  ctx.fill();

  // Molle Webbing & Ammo Pouches
  ctx.fillStyle = P_SUIT_LIGHT;
  ctx.fillRect(-8, -14, 5, 8);
  ctx.fillRect(-1, -14, 5, 8);
  ctx.fillRect(5, -14, 4, 8);

  // Status Beacon LED (Cyan glow matching visor)
  ctx.fillStyle = P_CYAN;
  ctx.shadowColor = P_CYAN;
  ctx.shadowBlur = 6;
  ctx.fillRect(5, -20, 3, 3);
  ctx.shadowBlur = 0;

  // --- HEAD & GHOST SKULL MASK ---
  ctx.save();
  ctx.translate(2, -26);
  ctx.rotate(headNod); // Head nodding/shaking animation!

  // Tactical Combat Helmet
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(0, -5, 10, Math.PI, 0, false);
  ctx.fill();

  // Comms Headset & Antenna
  ctx.fillStyle = '#475569';
  ctx.fillRect(-11, -6, 3, 7);
  ctx.fillRect(-1, -14, 2, 8); // antenna

  // Ghost Skull Balaclava
  ctx.fillStyle = '#090D16';
  ctx.beginPath();
  ctx.roundRect(-8, -4, 16, 12, 4);
  ctx.fill();

  // Signature Skull Bone Markings (High contrast white)
  ctx.fillStyle = P_SKULL;
  // Nasal bone
  ctx.fillRect(-2, 0, 4, 3);
  // Skull teeth lines
  ctx.fillRect(-6, 4, 2, 3);
  ctx.fillRect(-3, 4, 2, 3);
  ctx.fillRect(0, 4, 2, 3);
  ctx.fillRect(3, 4, 2, 3);
  ctx.fillRect(5, 4, 2, 3);

  // Glowing Cyan Tactical Visor Slits
  ctx.fillStyle = P_CYAN;
  ctx.shadowColor = P_CYAN;
  ctx.shadowBlur = 8;
  ctx.fillRect(-6, -3, 4, 2.5);
  ctx.fillRect(1, -3, 4, 2.5);
  ctx.shadowBlur = 0;

  ctx.restore(); // restore head

  // Tactical Carbine Rifle held in combat low-ready
  ctx.save();
  ctx.translate(2, -12);
  ctx.rotate(armAngle * 0.3);
  ctx.fillStyle = '#090D16';
  ctx.fillRect(-4, -2, 22, 5); // rifle receiver & barrel
  ctx.fillRect(3, 3, 4, 6);   // magazine
  ctx.fillStyle = P_CYAN;
  ctx.fillRect(15, -1, 3, 1);  // cyan laser sight dot
  ctx.restore();

  // --- FRONT ARM ---
  ctx.save();
  ctx.translate(2, -18);
  ctx.rotate(armAngle);
  ctx.fillStyle = P_SUIT_LIGHT;
  ctx.beginPath();
  ctx.roundRect(-3, 0, 6, 13, 2);
  ctx.fill();
  ctx.fillStyle = P_BOOTS;
  ctx.beginPath();
  ctx.arc(0, 14, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore(); // restore torso

  // --- FRONT LEG ---
  drawPlayerLeg(ctx, cx + 4, hipY, legAngle1, isJumping, true);

  ctx.restore();
}

function drawPlayerLeg(
  ctx: CanvasRenderingContext2D,
  hipX: number,
  hipY: number,
  angle: number,
  isJumping: boolean,
  isFront: boolean
): void {
  ctx.save();
  ctx.translate(hipX, hipY);
  ctx.rotate(angle);

  const thighLen = 12;
  const shinLen = 12;

  // Thigh
  ctx.strokeStyle = isFront ? P_SUIT_LIGHT : P_SUIT;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, thighLen);
  ctx.stroke();

  // Knee Pad
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(0, thighLen, 4, 0, Math.PI * 2);
  ctx.fill();

  // Shin & Combat Boot
  ctx.save();
  ctx.translate(0, thighLen);
  const kneeBend = isJumping ? 0.9 : Math.max(0, angle * 0.7);
  ctx.rotate(kneeBend);

  ctx.strokeStyle = isFront ? P_SUIT : '#0B0F19';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, shinLen);
  ctx.stroke();

  // Boot
  ctx.fillStyle = P_BOOTS;
  ctx.beginPath();
  ctx.roundRect(-2, shinLen - 3, 9, 6, 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

// ============================================================================
// 2. DRAW ENEMY OBSTACLES (VIBRANT & FULLY RECOGNIZABLE)
// ============================================================================
export function drawObstacle(
  ctx: CanvasRenderingContext2D,
  obstacle: Obstacle,
  groundY: number
): void {
  ctx.save();

  switch (obstacle.type) {
    case 'mini_soldiers':
      drawMiniSoldiers(ctx, obstacle, groundY);
      break;

    case 'standard_soldier':
      drawStandardSoldier(ctx, obstacle, groundY);
      break;

    case 'combat_robot':
      drawCombatRobot(ctx, obstacle, groundY);
      break;

    case 'three_formation':
      drawThreeFormation(ctx, obstacle, groundY);
      break;

    case 'aircraft_flyover':
      drawAircraftFlyover(ctx, obstacle, groundY);
      break;
  }

  ctx.restore();
}

/**
 * Obstacle B: Full-sized Enemy Commando Soldier (Crisp, colorful, highly visible!)
 */
function drawStandardSoldier(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number,
  offsetX: number = 0
): void {
  const ox = obs.x + offsetX;
  const oy = groundY - obs.height;
  const anim = Math.sin(obs.animTimer * 12);
  const cx = ox + obs.width / 2;

  ctx.save();
  ctx.translate(cx, oy);

  // Ground Contact Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, obs.height, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const legStride = anim * 0.85;

  // --- BACK LEG ---
  drawEnemyLeg(ctx, 3, obs.height - 22, -legStride, false);

  // --- BACKPACK / FIELD RADIO ---
  ctx.fillStyle = '#78350F'; // Tan field pack
  ctx.beginPath();
  ctx.roundRect(5, 14, 7, 14, 2);
  ctx.fill();
  ctx.strokeStyle = '#92400E';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Radio antenna
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(9, 14);
  ctx.lineTo(11, 4);
  ctx.stroke();

  // --- TORSO (DESERT TAN WITH TACTICAL OLIVE VEST & ORANGE HARNESS) ---
  // Desert Tan Combat Shirt
  ctx.fillStyle = E_UNIFORM;
  ctx.beginPath();
  ctx.roundRect(-8, 12, 16, 22, 3);
  ctx.fill();
  ctx.strokeStyle = E_UNIFORM_SHADOW;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Tactical Olive Green Armor Vest
  ctx.fillStyle = E_VEST;
  ctx.beginPath();
  ctx.roundRect(-7, 14, 14, 16, 2);
  ctx.fill();

  // High-Vis Orange Chest Harness (Guarantees instant visibility against any background!)
  ctx.fillStyle = E_VEST_STRAP;
  ctx.fillRect(-6, 17, 12, 3);
  ctx.fillRect(-6, 23, 12, 2.5);

  // --- HEAD & COMBAT HELMET ---
  // Neck
  ctx.fillStyle = E_UNIFORM_SHADOW;
  ctx.fillRect(-3, 8, 6, 5);

  // Desert Camo Tactical Helmet
  ctx.fillStyle = E_HELMET;
  ctx.beginPath();
  ctx.arc(0, 6, 8.5, Math.PI, 0, false);
  ctx.fill();
  ctx.strokeStyle = '#572607';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Helmet Edge Rim
  ctx.fillStyle = '#451A03';
  ctx.fillRect(-8.5, 6, 17, 3);

  // Tactical Balaclava & Goggles
  ctx.fillStyle = '#1C1917';
  ctx.fillRect(-6, 9, 12, 5);

  // Red Hostile Eye Goggle Dot (Clear combat optic!)
  ctx.fillStyle = E_VISOR;
  ctx.shadowColor = E_VISOR;
  ctx.shadowBlur = 6;
  ctx.fillRect(-5, 9.5, 4, 2.5);
  ctx.shadowBlur = 0;

  // --- WEAPON (ASSAULT CARBINE SILHOUETTE POINTED AT PLAYER) ---
  ctx.save();
  ctx.translate(-4, 20);
  ctx.fillStyle = E_WEAPON;
  ctx.fillRect(-16, -2, 18, 5); // barrel & receiver
  ctx.fillRect(-6, 3, 4, 6);   // magazine
  ctx.fillStyle = '#EA580C';   // orange tactical muzzle tip for high visibility!
  ctx.fillRect(-18, -1.5, 2.5, 4);
  ctx.restore();

  // --- FRONT ARM ---
  ctx.save();
  ctx.translate(1, 16);
  ctx.rotate(-anim * 0.4);
  ctx.fillStyle = E_UNIFORM;
  ctx.beginPath();
  ctx.roundRect(-3, 0, 6, 12, 2);
  ctx.fill();
  ctx.fillStyle = '#1C1917'; // Glove
  ctx.beginPath();
  ctx.arc(0, 13, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // --- FRONT LEG ---
  drawEnemyLeg(ctx, -3, obs.height - 22, legStride, true);

  ctx.restore();
}

function drawEnemyLeg(
  ctx: CanvasRenderingContext2D,
  hipX: number,
  hipY: number,
  angle: number,
  isFront: boolean
): void {
  ctx.save();
  ctx.translate(hipX, hipY);
  ctx.rotate(angle);

  const thighLen = 11;
  const shinLen = 11;

  // Thigh (Desert Tan)
  ctx.strokeStyle = isFront ? E_UNIFORM : E_UNIFORM_SHADOW;
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, thighLen);
  ctx.stroke();

  // Knee Pad (Olive green)
  ctx.fillStyle = E_VEST;
  ctx.beginPath();
  ctx.arc(0, thighLen, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Shin & Boot
  ctx.save();
  ctx.translate(0, thighLen);
  ctx.rotate(Math.max(0, angle * 0.6));

  ctx.strokeStyle = isFront ? E_UNIFORM_SHADOW : '#9A3412';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, shinLen);
  ctx.stroke();

  // Black Tactical Boot
  ctx.fillStyle = E_BOOTS;
  ctx.beginPath();
  ctx.roundRect(-2, shinLen - 3, 8.5, 5.5, 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}

/**
 * Obstacle A: Mini Soldiers (Smaller, but fully illustrated with clear body shapes!)
 */
function drawMiniSoldiers(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number
): void {
  const count = obs.subCount || 1;
  const spacing = 22; // Distinct spacing so each soldier is separate!

  for (let i = 0; i < count; i++) {
    const ox = obs.x + i * spacing;
    const oy = groundY - obs.height;
    const anim = Math.sin((obs.animTimer * 14) + (i * 1.5));
    const cx = ox + 10;

    ctx.save();
    ctx.translate(cx, oy);

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, obs.height, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    const legStride = anim * 0.75;

    // Back leg
    ctx.strokeStyle = E_UNIFORM_SHADOW;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(2, obs.height - 12);
    ctx.lineTo(2 - legStride * 5, obs.height);
    ctx.stroke();

    // Torso (Desert Tan + Olive Vest + Orange Strap)
    ctx.fillStyle = E_UNIFORM;
    ctx.beginPath();
    ctx.roundRect(-5, 8, 10, 14, 2);
    ctx.fill();

    ctx.fillStyle = E_VEST;
    ctx.fillRect(-4, 10, 8, 8);
    ctx.fillStyle = E_VEST_STRAP;
    ctx.fillRect(-4, 12, 8, 2);

    // Helmet & Red Visor
    ctx.fillStyle = E_HELMET;
    ctx.beginPath();
    ctx.arc(0, 5, 5.5, Math.PI, 0);
    ctx.fill();

    ctx.fillStyle = '#1C1917';
    ctx.fillRect(-4, 5, 8, 3.5);

    ctx.fillStyle = E_VISOR;
    ctx.fillRect(-3, 5.5, 3, 1.8);

    // Mini Rifle
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(-10, 13, 11, 3.5);
    ctx.fillStyle = '#EA580C';
    ctx.fillRect(-11, 13, 1.5, 3.5);

    // Front leg
    ctx.strokeStyle = E_UNIFORM;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-2, obs.height - 12);
    ctx.lineTo(-2 + legStride * 5, obs.height);
    ctx.stroke();

    ctx.restore();
  }
}

/**
 * Obstacle C: Large Combat Walker Robot (Intimidating, cobalt blue + titanium + hazard stripes!)
 */
function drawCombatRobot(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number
): void {
  const ox = obs.x;
  const oy = groundY - obs.height;
  const mechCycle = Math.sin(obs.animTimer * 6);
  const cx = ox + obs.width / 2;

  ctx.save();
  ctx.translate(cx, oy);

  // Heavy Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.beginPath();
  ctx.ellipse(0, obs.height, 28, 6.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- HYDRAULIC BACK LEG ---
  ctx.strokeStyle = MECH_DARK;
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(10, 42);
  ctx.lineTo(18 + mechCycle * 8, obs.height - 10);
  ctx.lineTo(22 + mechCycle * 8, obs.height);
  ctx.stroke();

  // Foot clamp
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(16 + mechCycle * 8, obs.height - 5, 12, 5);

  // --- MECHANICAL CHASSIS (COBALT BLUE & TITANIUM ARMOR) ---
  ctx.fillStyle = MECH_DARK;
  ctx.beginPath();
  ctx.moveTo(-20, 14);
  ctx.lineTo(20, 14);
  ctx.lineTo(15, 46);
  ctx.lineTo(-15, 46);
  ctx.closePath();
  ctx.fill();

  // Armored Chest Plate (Vibrant Cobalt Blue)
  ctx.fillStyle = MECH_BLUE;
  ctx.beginPath();
  ctx.roundRect(-16, 16, 32, 22, 3);
  ctx.fill();
  ctx.strokeStyle = MECH_TITANIUM;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Golden Yellow & Black Hazard Stripes
  ctx.fillStyle = MECH_HAZARD;
  ctx.fillRect(-12, 32, 6, 3.5);
  ctx.fillRect(-2, 32, 6, 3.5);
  ctx.fillRect(8, 32, 6, 3.5);
  ctx.fillStyle = '#000000';
  ctx.fillRect(-6, 32, 4, 3.5);
  ctx.fillRect(4, 32, 4, 3.5);

  // Twin Shoulder Missile Launchers
  ctx.fillStyle = MECH_TITANIUM;
  ctx.fillRect(-24, 10, 9, 15);
  ctx.fillRect(15, 10, 9, 15);
  ctx.fillStyle = '#EF4444'; // Red warhead caps
  ctx.fillRect(-22, 12, 5, 3);
  ctx.fillRect(17, 12, 5, 3);

  // Central Rotating Optic Visor (Cylon/Terminator red sweep)
  const eyeSweep = Math.sin(obs.animTimer * 10) * 7;
  ctx.fillStyle = '#050B14';
  ctx.fillRect(-12, 22, 24, 6);
  ctx.fillStyle = MECH_GLOW;
  ctx.shadowColor = MECH_GLOW;
  ctx.shadowBlur = 12;
  ctx.fillRect(eyeSweep - 3, 23, 7, 4);
  ctx.shadowBlur = 0;

  // --- FRONT HYDRAULIC LEG ---
  ctx.strokeStyle = MECH_TITANIUM;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(-10, 42);
  ctx.lineTo(-16 - mechCycle * 8, obs.height - 10);
  ctx.lineTo(-20 - mechCycle * 8, obs.height);
  ctx.stroke();

  // Heavy Front Mechanical Foot Clamp
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(-26 - mechCycle * 8, obs.height - 5, 16, 5);

  ctx.restore();
}

/**
 * Obstacle D: Three-Soldier Formation (Staggered file, clearly separated!)
 */
function drawThreeFormation(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number
): void {
  const spacing = 26; // Clear spacing so each soldier is distinct
  for (let i = 0; i < 3; i++) {
    const singleObs: Obstacle = {
      ...obs,
      x: obs.x,
      width: 24,
    };
    drawStandardSoldier(ctx, singleObs, groundY, i * spacing);
  }
}

/**
 * Obstacle E: Military Aircraft Flyover (Supersonic Stealth Fighter)
 * High in the sky, bright contrast against sky blue, safe overhead flight!
 */
function drawAircraftFlyover(
  ctx: CanvasRenderingContext2D,
  obs: Obstacle,
  groundY: number
): void {
  const ax = obs.x;
  const ay = obs.y;

  ctx.save();
  ctx.translate(ax, ay);

  // Moving ground shadow on runway
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.ellipse(ax - obs.x + 35, groundY - 2, 45, 8, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Twin Jet Engine Afterburner Flames
  const flamePulse = 20 + Math.random() * 8;
  const flameGrad = ctx.createLinearGradient(0, 8, -flamePulse, 8);
  flameGrad.addColorStop(0, '#FFFFFF');
  flameGrad.addColorStop(0.3, '#38BDF8');
  flameGrad.addColorStop(0.7, '#F97316');
  flameGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = flameGrad;
  ctx.beginPath();
  ctx.moveTo(8, 5);
  ctx.lineTo(-flamePulse, 8);
  ctx.lineTo(8, 11);
  ctx.fill();

  // Aerodynamic Stealth Fighter Fuselage (Dark Navy Blue & Titanium Grey)
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.moveTo(70, 8);   // nose
  ctx.lineTo(26, 2);   // wing forward
  ctx.lineTo(10, -8);  // wingtip port
  ctx.lineTo(14, 5);   // wing root
  ctx.lineTo(6, 6);    // tail
  ctx.lineTo(6, 10);
  ctx.lineTo(14, 11);
  ctx.lineTo(10, 24);  // wingtip starboard
  ctx.lineTo(26, 14);
  ctx.closePath();
  ctx.fill();

  // Contrasting Panel Highlights (Clean readability against sky)
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Gold Tinted Cockpit Canopy
  ctx.fillStyle = '#F59E0B';
  ctx.shadowColor = '#F59E0B';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.ellipse(46, 8, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Strobe Navigation Lights
  const strobe = Math.floor(Date.now() / 200) % 2 === 0;
  if (strobe) {
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(9, -9, 2.5, 2.5);
    ctx.fillStyle = '#10B981';
    ctx.fillRect(9, 23, 2.5, 2.5);
  }

  ctx.restore();
}

// ============================================================================
// 3. VIBRANT, COLOURFUL OUTDOOR MILITARY ENVIRONMENT
// ============================================================================
export function drawEnvironment(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  groundY: number,
  scrollDistance: number
): void {
  // --- 1. VIBRANT SKY WITH WARM ATMOSPHERIC GRADIENT ---
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, '#0284C7');    // Bright military cobalt sky blue
  skyGrad.addColorStop(0.35, '#38BDF8'); // Turquoise cyan
  skyGrad.addColorStop(0.7, '#7DD3FC');  // Soft atmospheric blue
  skyGrad.addColorStop(0.92, '#FDE68A'); // Warm golden sunset / desert horizon
  skyGrad.addColorStop(1, '#F59E0B');    // Golden yellow edge
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, groundY);

  // Radiant Golden Sun
  ctx.save();
  const sunX = width - 140;
  const sunY = 70;
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 70);
  sunGrad.addColorStop(0, '#FFFFFF');
  sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.85)');
  sunGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.3)');
  sunGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant Soft White Clouds
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  const cloudOffset = (scrollDistance * 0.03) % (width + 300);
  drawCloud(ctx, (120 - cloudOffset + width + 300) % (width + 300), 55, 60);
  drawCloud(ctx, (480 - cloudOffset + width + 300) % (width + 300), 85, 45);
  drawCloud(ctx, (820 - cloudOffset + width + 300) % (width + 300), 45, 55);
  ctx.restore();

  // --- 2. LAYER 1: DISTANT MOUNTAINS & RIDGES (Parallax 0.06) ---
  ctx.save();
  ctx.fillStyle = '#475569'; // Slate mountain silhouettes
  const mountainOffset = (scrollDistance * 0.06) % 480;
  for (let x = -mountainOffset; x < width + 480; x += 480) {
    ctx.beginPath();
    ctx.moveTo(x, groundY);
    ctx.lineTo(x + 110, groundY - 110);
    ctx.lineTo(x + 220, groundY - 60);
    ctx.lineTo(x + 340, groundY - 130);
    ctx.lineTo(x + 480, groundY);
    ctx.closePath();
    ctx.fill();
  }
  // Golden sun highlights on mountain peaks
  ctx.fillStyle = '#CBD5E1';
  for (let x = -mountainOffset; x < width + 480; x += 480) {
    ctx.beginPath();
    ctx.moveTo(x + 110, groundY - 110);
    ctx.lineTo(x + 125, groundY - 95);
    ctx.lineTo(x + 110, groundY - 80);
    ctx.lineTo(x + 95, groundY - 95);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 340, groundY - 130);
    ctx.lineTo(x + 355, groundY - 112);
    ctx.lineTo(x + 340, groundY - 95);
    ctx.lineTo(x + 325, groundY - 112);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // --- 3. LAYER 2: MILITARY OUTPOST & TROPICAL FOLIAGE (Parallax 0.16) ---
  ctx.save();
  const outpostOffset = (scrollDistance * 0.16) % 360;
  for (let x = -outpostOffset; x < width + 360; x += 360) {
    // Military Watchtower (Steel Grey)
    ctx.fillStyle = '#334155';
    ctx.fillRect(x + 40, groundY - 75, 12, 75);
    ctx.fillRect(x + 32, groundY - 85, 28, 12);
    // Watchtower roof
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(x + 28, groundY - 85);
    ctx.lineTo(x + 46, groundY - 96);
    ctx.lineTo(x + 64, groundY - 85);
    ctx.closePath();
    ctx.fill();

    // Radar dish
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 180, groundY - 55, 18, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.fillRect(x + 178, groundY - 45, 4, 45);

    // Hangar / Bunker Dome (Warm sand & olive)
    ctx.fillStyle = '#65A30D'; // Lush tactical grass mound
    ctx.beginPath();
    ctx.arc(x + 270, groundY, 40, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#4D7C0F';
    ctx.fillRect(x + 256, groundY - 26, 28, 26); // hangar blast door

    // Tropical Palm Trees for colourful military setting!
    drawPalmTree(ctx, x + 115, groundY);
    drawPalmTree(ctx, x + 340, groundY);
  }
  ctx.restore();

  // --- 4. LAYER 3: MID-GROUND BARRICADES & AMMO CRATES (Parallax 0.45) ---
  ctx.save();
  const barricadeOffset = (scrollDistance * 0.45) % 280;
  for (let x = -barricadeOffset; x < width + 280; x += 280) {
    // Olive Sandbag Bunker
    ctx.fillStyle = '#84CC16'; // Vivid tactical olive sandbag
    ctx.beginPath();
    ctx.roundRect(x + 30, groundY - 20, 50, 20, 3);
    ctx.fill();
    ctx.fillStyle = '#4D7C0F';
    ctx.beginPath();
    ctx.roundRect(x + 34, groundY - 28, 42, 10, 3);
    ctx.fill();

    // Yellow / Orange Ammo Crate
    ctx.fillStyle = '#D97706';
    ctx.fillRect(x + 170, groundY - 22, 22, 22);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(x + 172, groundY - 20, 18, 18);
    // Hazard stencil cross
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 174, groundY - 18, 14, 14);
  }
  ctx.restore();

  // --- 5. FOREGROUND RUNWAY & COMBAT GROUND SURFACE (Parallax 1.0) ---
  const groundHeight = height - groundY;
  // Clear, crisp, illuminated concrete airstrip
  const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
  groundGrad.addColorStop(0, '#57534E');   // Stone concrete
  groundGrad.addColorStop(0.12, '#44403C');
  groundGrad.addColorStop(1, '#292524');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, groundY, width, groundHeight);

  // Sharp Golden Edge Line (Zero dark fog, 100% visible ground perimeter)
  ctx.fillStyle = '#FACC15';
  ctx.fillRect(0, groundY - 2.5, width, 3);

  // High-Visibility Golden Runway Centerlines
  const markerSpacing = 100;
  const markerOffset = scrollDistance % markerSpacing;
  ctx.fillStyle = '#FDE047';
  for (let x = -markerOffset; x < width + markerSpacing; x += markerSpacing) {
    ctx.fillRect(x, groundY + 16, 50, 4);
  }

  // Turquoise / White edge safety markers
  const edgeSpacing = 240;
  const edgeOffset = scrollDistance % edgeSpacing;
  ctx.fillStyle = '#06B6D4';
  for (let x = -edgeOffset; x < width + edgeSpacing; x += edgeSpacing) {
    ctx.fillRect(x, groundY + 4, 18, 2.5);
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.arc(x + r * 0.4, y - r * 0.2, r * 0.6, 0, Math.PI * 2);
  ctx.arc(x + r * 0.9, y, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, groundY: number): void {
  // Curved trunk
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(x, groundY);
  ctx.quadraticCurveTo(x + 6, groundY - 25, x + 3, groundY - 48);
  ctx.stroke();

  // Lush green palm fronds
  ctx.fillStyle = '#16A34A';
  const tx = x + 3;
  const ty = groundY - 48;
  const angles = [-0.9, -0.4, 0.1, 0.6, 1.1];
  angles.forEach((ang) => {
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.ellipse(12, 0, 14, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

// ============================================================================
// 4. DRAW PARTICLE SYSTEMS (GOLDEN DUST, SPARKS, FLAMES)
// ============================================================================
export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[]
): void {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
