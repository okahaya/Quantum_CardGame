
import { CardData } from './types';

export const ALL_CARDS: CardData[] = [
  { id: 'h', name: 'Hadamard (H)', symbol: 'H', description: 'Puts a target qubit into a superposition state.', cost: 1, type: 'single', targets: 1 },
  { id: 'x', name: 'Pauli-X (X)', symbol: 'X', description: 'Flips a target qubit\'s state (|0⟩ ↔ |1⟩).', cost: 1, type: 'single', targets: 1 },
  { id: 'z', name: 'Pauli-Z (Z)', symbol: 'Z', description: 'Flips the phase of a target qubit.', cost: 1, type: 'single', targets: 1 },
  { id: 'cnot', name: 'CNOT', symbol: 'CNOT', description: 'Uses a control qubit to flip a target qubit.', cost: 2, type: 'two', targets: 2, roles: ['Control', 'Target'] },
  { id: 'swap', name: 'SWAP', symbol: 'SWAP', description: 'Swaps the state of two target qubits.', cost: 3, type: 'two', targets: 2, roles: ['Qubit A', 'Qubit B'] },
  { id: 'measure', name: 'Measurement', symbol: 'M', description: 'Measures a qubit, collapsing its state to |0⟩ or |1⟩.', cost: 2, type: 'single', targets: 1 },
  { id: 'toffoli', name: 'Toffoli', symbol: 'CCNOT', description: 'Uses two control qubits to flip a target qubit.', cost: 3, type: 'three', targets: 3, roles: ['Control 1', 'Control 2', 'Target'] },
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