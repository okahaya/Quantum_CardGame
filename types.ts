
export interface CardData {
  id: string;
  name: string;
  action: string;
  cost: number;
  type: 'single_qubit_gate' | 'two_qubit_gate' | 'special';
  targets: number; // How many qubits this card targets
  targetOpponent: boolean; // Can it target opponent qubits?
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
  id: string;
  name: string;
  qubits: QubitState[];
  deck: CardData[];
  hand: CardData[];
  discard: CardData[];
  mana: number;
  maxMana: number;
}

export enum GamePhase {
  Setup = 'SETUP',
  Player1Turn = 'PLAYER_1_TURN',
  Player2Turn = 'PLAYER_2_TURN',
  GameOver = 'GAME_OVER',
}

export interface AwaitingTargetInfo {
    card: CardData;
    sourcePlayerId: string;
    targetsAcquired: { playerId: string; qubitId: number }[];
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
}
