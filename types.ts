
export interface CardData {
  id: string;
  instanceId?: string; // Unique identifier for each card instance
  name: string;
  symbol: string;
  description: string;
  cost: number;
  type: 'single' | 'two' | 'three';
  targets: number; 
  roles?: string[]; // e.g. ['Control', 'Target']
}

// This is now purely for display purposes. The true state is in the stateVector.
export enum QubitDisplayState {
  Zero = '|0⟩',
  One = '|1⟩',
  Superposition = '|Ψ⟩',
}

export interface PlayerState {
  id:string;
  name: string;
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

export interface GameState {
  players: {
    [key: string]: PlayerState;
  };
  gamePhase: GamePhase;
  currentPlayerId: string;
  turn: number;
  actionsTaken: number; // New for two-action turns
  winner: string | null;
  log: string[];
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
  | { type: 'START_GAME'; settings: GameSettings }
  | { type: 'SELECT_CARD'; card: CardData; playerId: string }
  | { type: 'SELECT_QUBIT'; playerId: string; qubitId: number }
  | { type: 'CANCEL_TARGET' }
  | { type: 'END_TURN' }
  | { type: 'CPU_THINKING_START' }
  | { type: 'CPU_THINKING_END' }
  | { type: 'CPU_PERFORM_ACTION' }
  | { type: 'LOG_MESSAGE'; message: string };