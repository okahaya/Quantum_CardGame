
import { CardData } from './types';

export const ALL_CARDS: CardData[] = [
  { id: 'h', name: 'Hadamard (H)', description: 'Puts a target qubit into a superposition state.', cost: 1, type: 'single', targets: 1, targetOpponent: true },
  { id: 'x', name: 'Pauli-X (X)', description: 'Flips a target qubit\'s state (|0⟩ ↔ |1⟩). Collapses superposition.', cost: 1, type: 'single', targets: 1, targetOpponent: true },
  { id: 'z', name: 'Pauli-Z (Z)', description: 'Flips the phase of a target qubit.', cost: 1, type: 'single', targets: 1, targetOpponent: true },
  { id: 'cnot', name: 'CNOT', description: 'Uses your qubit as control to flip an opponent\'s qubit.', cost: 2, type: 'two', targets: 2, targetOpponent: true },
  { id: 'swap', name: 'SWAP', description: 'Swaps one of your qubits with an opponent\'s qubit.', cost: 3, type: 'two', targets: 2, targetOpponent: true },
  { id: 'measure', name: 'Measurement', description: 'Measures a qubit, collapsing superposition to |0⟩ or |1⟩.', cost: 2, type: 'single', targets: 1, targetOpponent: true },
  { id: 'toffoli', name: 'Toffoli', description: 'Uses two of your qubits as controls to flip an opponent\'s qubit.', cost: 3, type: 'three', targets: 3, targetOpponent: true },
];

export const INITIAL_DECK_TEMPLATE: CardData[] = [
    ...Array(4).fill(ALL_CARDS[0]), // Hadamard
    ...Array(4).fill(ALL_CARDS[1]), // Pauli-X
    ...Array(3).fill(ALL_CARDS[2]), // Pauli-Z
    ...Array(3).fill(ALL_CARDS[3]), // CNOT
    ...Array(2).fill(ALL_CARDS[4]), // SWAP
    ...Array(3).fill(ALL_CARDS[5]), // Measurement
    ...Array(2).fill(ALL_CARDS[6]), // Toffoli
];

export const PLAYER1_ID = 'player1';
export const PLAYER2_ID = 'player2';
