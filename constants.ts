
import { CardData } from './types';

export const ALL_CARDS: CardData[] = [
  // Single Qubit Gates
  { id: 'c1', name: 'Hadamard Card (H)', action: 'Puts a target qubit into a superposition state.', cost: 1, type: 'single_qubit_gate', targets: 1, targetOpponent: true },
  { id: 'c2', name: 'Pauli-X Card (X)', action: 'Flips a target qubit\'s state (|0⟩ ↔ |1⟩). Collapses superposition.', cost: 1, type: 'single_qubit_gate', targets: 1, targetOpponent: true },
  { id: 'c3', name: 'Pauli-Z Card (Z)', action: 'Flips the phase of a target qubit. No visible effect on |0> or |1>, but interacts with other gates.', cost: 1, type: 'single_qubit_gate', targets: 1, targetOpponent: true },

  // Two Qubit Gates
  { id: 'c4', name: 'CNOT Card', action: 'Uses one of your qubits as control. If it is |1⟩, flips an opponent\'s qubit.', cost: 2, type: 'two_qubit_gate', targets: 2, targetOpponent: true },
  { id: 'c5', name: 'SWAP Card', action: 'Swaps the state of one of your qubits with an opponent\'s qubit.', cost: 3, type: 'two_qubit_gate', targets: 2, targetOpponent: true },

  // Special Cards
  { id: 'c6', name: 'Measurement Card', action: 'Measures a qubit in superposition, collapsing it randomly to |0⟩ or |1⟩.', cost: 2, type: 'special', targets: 1, targetOpponent: true },
  { id: 'c7', name: 'Entanglement Card', action: 'Entangles one of your qubits with one of your opponent\'s qubits.', cost: 4, type: 'special', targets: 2, targetOpponent: true },
];

export const INITIAL_DECK_TEMPLATE: CardData[] = [
    ...Array(3).fill(ALL_CARDS[0]), // Hadamard
    ...Array(3).fill(ALL_CARDS[1]), // Pauli-X
    ...Array(2).fill(ALL_CARDS[2]), // Pauli-Z
    ...Array(2).fill(ALL_CARDS[3]), // CNOT
    ...Array(1).fill(ALL_CARDS[4]), // SWAP
    ...Array(2).fill(ALL_CARDS[5]), // Measurement
    ...Array(1).fill(ALL_CARDS[6]), // Entanglement
];

export const PLAYER1_ID = 'player1';
export const PLAYER2_ID = 'player2';
