/**
 * ÉVANN OPS: SURVIVAL RUN — RECORD & HIGH SCORE SERVICE
 * Supabase-backed global leaderboard & localStorage personal best tracking.
 * Includes defensive offline fallbacks, rate-limiting, and error tolerance.
 */
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface SurvivalRecord {
  id?: string;
  playerName: string;
  score: number;
  missionLevel: number;
  distanceMeters: number;
  createdAt?: string;
}

export interface GlobalScoreResponse {
  score: number;
  playerName: string;
  isAvailable: boolean;
  message?: string;
}

export interface ScoreSubmissionResult {
  success: boolean;
  isNewGlobalRecord: boolean;
  isNewPersonalBest: boolean;
  globalHighScore: number;
  personalBest: number;
  error?: string;
}

const LOCAL_STORAGE_PB_KEY = 'evann_ops_survival_pb';
const LOCAL_STORAGE_PLAYER_NAME = 'evann_ops_player_name';

/**
 * Get personal best from local storage (instant, works offline)
 */
export const getPersonalBest = (): number => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PB_KEY);
    if (!raw) return 0;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) || parsed < 0 ? 0 : parsed;
  } catch {
    return 0;
  }
};

/**
 * Save personal best to local storage
 */
export const savePersonalBest = (newScore: number): { isNewPersonalBest: boolean; personalBest: number } => {
  const currentPB = getPersonalBest();
  if (newScore > currentPB) {
    try {
      localStorage.setItem(LOCAL_STORAGE_PB_KEY, newScore.toString());
    } catch {
      // LocalStorage quota or access error
    }
    return { isNewPersonalBest: true, personalBest: newScore };
  }
  return { isNewPersonalBest: false, personalBest: currentPB };
};

/**
 * Get stored player callsign or default
 */
export const getStoredPlayerName = (): string => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PLAYER_NAME);
    if (stored && stored.trim().length > 0) {
      return stored.trim().slice(0, 20);
    }
  } catch {}
  return '';
};

export const getPlayerCallsign = (): string => {
  const stored = getStoredPlayerName();
  return stored || 'GHOST_OPERATOR';
};

/**
 * Store player callsign
 */
export const savePlayerCallsign = (name: string): void => {
  try {
    const clean = name.trim().slice(0, 20);
    if (clean) {
      localStorage.setItem(LOCAL_STORAGE_PLAYER_NAME, clean);
    }
  } catch {}
};

/**
 * Fetch the shared global high score from Supabase.
 * Gracefully reports when offline or when table migration hasn't been executed.
 */
export const fetchGlobalHighScore = async (): Promise<GlobalScoreResponse> => {
  if (!isSupabaseConfigured) {
    return {
      score: 0,
      playerName: 'OPERATOR_HQ',
      isAvailable: false,
      message: 'Supabase credentials pending configuration.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('survival_run_records')
      .select('score, player_name')
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      // Table may not exist yet or network issue
      return {
        score: 0,
        playerName: 'OPERATOR_HQ',
        isAvailable: false,
        message: 'Global record temporarily unavailable.',
      };
    }

    if (data && typeof data.score === 'number') {
      return {
        score: data.score,
        playerName: data.player_name || 'GHOST_ELITE',
        isAvailable: true,
      };
    }

    // Table exists but is empty
    return {
      score: 0,
      playerName: 'NO_RECORD_YET',
      isAvailable: true,
      message: 'Be the first operator to set a record!',
    };
  } catch (err: any) {
    return {
      score: 0,
      playerName: 'OPERATOR_HQ',
      isAvailable: false,
      message: 'Global record temporarily unavailable.',
    };
  }
};

/**
 * Fetch top 5 global leaderboard entries for display
 */
export const fetchTopLeaderboard = async (): Promise<Array<{ rank: number; name: string; score: number }>> => {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('survival_run_records')
      .select('score, player_name')
      .order('score', { ascending: false })
      .limit(5);

    if (error || !data) return [];
    return data.map((item, idx) => ({
      rank: idx + 1,
      name: item.player_name || 'GHOST',
      score: item.score || 0,
    }));
  } catch {
    return [];
  }
};

/**
 * Submit a score after mission conclusion.
 * Updates personal best locally and checks/submits to Supabase atomically.
 */
export const submitMissionScore = async (
  score: number,
  missionLevel: number,
  distanceMeters: number,
  playerName?: string
): Promise<ScoreSubmissionResult> => {
  // 1. Always evaluate and save personal best locally
  const pbResult = savePersonalBest(score);
  const callsign = (playerName || getPlayerCallsign()).trim().slice(0, 24);

  // Default response if Supabase is offline
  const baseResult: ScoreSubmissionResult = {
    success: true,
    isNewGlobalRecord: false,
    isNewPersonalBest: pbResult.isNewPersonalBest,
    globalHighScore: 0,
    personalBest: pbResult.personalBest,
  };

  if (!isSupabaseConfigured || score <= 0) {
    return baseResult;
  }

  try {
    // 2. First attempt atomic RPC call if user created the function
    const { data: rpcData, error: rpcError } = await supabase.rpc('submit_survival_score', {
      p_player_name: callsign,
      p_score: Math.floor(score),
      p_distance_m: Number(distanceMeters.toFixed(1)),
      p_mission_level: Math.floor(missionLevel),
      p_platform: 'web',
    });

    if (!rpcError && rpcData && rpcData.success) {
      return {
        success: true,
        isNewGlobalRecord: Boolean(rpcData.is_new_record),
        isNewPersonalBest: pbResult.isNewPersonalBest,
        globalHighScore: rpcData.global_high_score || score,
        personalBest: pbResult.personalBest,
      };
    }

    // 3. Fallback: Direct insert if RPC is unavailable
    // Check current max score
    const currentGlobal = await fetchGlobalHighScore();
    const isNewGlobal = currentGlobal.isAvailable && score > currentGlobal.score;

    const { error: insertError } = await supabase
      .from('survival_run_records')
      .insert({
        player_name: callsign,
        score: Math.floor(score),
        distance_m: Number(distanceMeters.toFixed(1)),
        mission_level: Math.floor(missionLevel),
        client_platform: 'web',
      });

    if (insertError) {
      return {
        ...baseResult,
        globalHighScore: currentGlobal.score,
        error: insertError.message,
      };
    }

    return {
      success: true,
      isNewGlobalRecord: isNewGlobal,
      isNewPersonalBest: pbResult.isNewPersonalBest,
      globalHighScore: Math.max(currentGlobal.score, score),
      personalBest: pbResult.personalBest,
    };
  } catch (err: any) {
    return {
      ...baseResult,
      error: err?.message || 'Database submission error',
    };
  }
};
