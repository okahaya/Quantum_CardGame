export interface CardData {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'single' | 'two' | 'three';
  targets: number; 
  targetOpponent: boolean; 
}

export enum QubitPhysicalState {
  Zero = '|0⟩',
  One = '|1⟩',
  Superposition = '|Ψ⟩',
}

export interface QubitState {
  id: number;
  physicalState: QubitPhysicalState;
  entangledWith: { playerId: string; qubitId: number } | null;
}

export interface PlayerState {
  id:string;
  name: string;
  qubits: QubitState[];
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
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
}

export interface CircuitGate {
  id: string;
  turn: number;
  card: CardData;
  sourcePlayerId: string;
  targets: { playerId: string; qubitId: number }[];
}

export interface GameState {
  players: {
    [key: string]: PlayerState;
  };
  gamePhase: GamePhase;
  currentPlayerId: string;
  turn: number;
  winner: string | null;
  log: string[];
  awaitingTarget: AwaitingTargetInfo | null;
  isCpuThinking: boolean;
  circuitHistory: CircuitGate[];
}

export type Move = {
  card: CardData;
  targets: { playerId: string; qubitId: number }[];
  score: number;
};

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_CARD'; card: CardData; playerId: string }
  | { type: 'SELECT_QUBIT'; playerId: string; qubitId: number }
  | { type: 'CANCEL_TARGET' }
  | { type: 'END_TURN' }
  | { type: 'CPU_THINKING_START' }
  | { type: 'CPU_THINKING_END' }
  | { type: 'CPU_PERFORM_MOVE'; move: Move | null }
  | { type: 'CPU_PERFORM_SETUP_MOVES'; moves: AwaitingTargetInfo[] };
