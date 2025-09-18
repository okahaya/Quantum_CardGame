
import { CardData } from './types';

export const ALL_CARDS: CardData[] = [
  { id: 'h', name: 'cards.h_name', symbol: 'H', description: 'cards.h_desc', cost: 1, type: 'single', targets: 1 },
  { id: 'x', name: 'cards.x_name', symbol: 'X', description: 'cards.x_desc', cost: 1, type: 'single', targets: 1 },
  { id: 'z', name: 'cards.z_name', symbol: 'Z', description: 'cards.z_desc', cost: 1, type: 'single', targets: 1 },
  { id: 'cnot', name: 'cards.cnot_name', symbol: 'CNOT', description: 'cards.cnot_desc', cost: 2, type: 'two', targets: 2, roles: ['cardRoles.control', 'cardRoles.target'] },
  { id: 'swap', name: 'cards.swap_name', symbol: 'SWAP', description: 'cards.swap_desc', cost: 3, type: 'two', targets: 2, roles: ['cardRoles.qubitA', 'cardRoles.qubitB'] },
  { id: 'measure', name: 'cards.measure_name', symbol: 'M', description: 'cards.measure_desc', cost: 2, type: 'single', targets: 1 },
  { id: 'toffoli', name: 'cards.toffoli_name', symbol: 'CCNOT', description: 'cards.toffoli_desc', cost: 3, type: 'three', targets: 3, roles: ['cardRoles.control1', 'cardRoles.control2', 'cardRoles.target'] },
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
