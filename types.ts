
export interface CardData {
  id: string;
  instanceId?: string; // Unique identifier for each card instance
  name: string; // This will now be a translation key, e.g., 'cards.h_name'
  symbol: string;
  description: string; // This will now be a translation key
  cost: number;
  type: 'single' | 'two' | 'three';
  targets: number; 
  roles?: string[]; // Translation keys for roles
}

// This is now purely for display purposes. The true state is in the stateVector.
export enum QubitDisplayState {
  Zero = '|0⟩',
  One = '|1⟩',
  Superposition = '|Ψ⟩',
}

export interface PlayerState {
  id:string;
  name: string; // This will be a translation key, e.g., 'playerArea.player1Name'
  stateVector: number[]; // Represents the quantum state of all qubits
  deck: CardData[];
  hand: CardData[];
  mana: number;
  maxMana: number;
}

export enum GamePhase {
  Player1Setup = 'PLAYER_1_SETUP',
  Player2Setup = 'PLAYER_2_SETUP',
  Player1Turn = 'PLAYER_1_TURN',
  Player2Turn = 'PLAYER_2_TURN',
  GameOver = 'GAME_OVER',
}

export interface AwaitingTargetInfo {
    card: CardData;
    sourcePlayerId: string;
    targetsAcquired: { playerId: string; qubitId: number }[];
    prompt?: string;
    actionNumber: number; // 1 or 2
}

export interface GameSettings {
    qubitCount: number;
    cardViewMode: 'basic' | 'advanced';
    debugMode: boolean;
}

export type LogEntry = {
    key: string;
    params?: Record<string, string | number>;
};

export interface GameState {
  players: {
    [key: string]: PlayerState;
  };
  gamePhase: GamePhase;
  currentPlayerId: string;
  turn: number;
  actionsTaken: number; // New for two-action turns
  winner: string | null;
  log: LogEntry[];
  awaitingTarget: AwaitingTargetInfo | null;
  isCpuThinking: boolean;
  settings: GameSettings;
}

export type Move = {
  card: CardData;
  targets: { playerId: string; qubitId: number }[];
  score: number;
};

export type GameAction =
  | { type: 'START_GAME'; settings: GameSettings, t: (key: string, params?: any) => string; }
  | { type: 'SELECT_CARD'; card: CardData; playerId: string, t: (key: string, params?: any) => string; }
  | { type: 'SELECT_QUBIT'; playerId: string; qubitId: number, t: (key: string, params?: any) => string; }
  | { type: 'CANCEL_TARGET' }
  | { type: 'END_TURN', t: (key: string, params?: any) => string; }
  | { type: 'CPU_THINKING_START' }
  | { type: 'CPU_THINKING_END' }
  | { type: 'CPU_PERFORM_ACTION', t: (key: string, params?: any) => string; }
  | { type: 'LOG_MESSAGE'; messageKey: string, params?: Record<string, string | number> };
