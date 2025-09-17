
import { useReducer, useCallback, useEffect, useState } from 'react';
import { GameState, GamePhase, PlayerState, QubitState, QubitPhysicalState, CardData, AwaitingTargetInfo } from '../types';
import { INITIAL_DECK_TEMPLATE, PLAYER1_ID, PLAYER2_ID } from '../constants';

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'CHOOSE_INITIAL_STATE'; payload: { q1: QubitPhysicalState, q2: QubitPhysicalState } }
  | { type: 'SELECT_CARD'; card: CardData; playerId: string }
  | { type: 'SELECT_QUBIT'; playerId: string; qubitId: number }
  | { type: 'END_TURN' }
  | { type: 'APPLY_CARD_EFFECT'; payload: AwaitingTargetInfo };

//==============================================
// CPU LOGIC
//==============================================
type Move = {
  card: CardData;
  targets: { playerId: string; qubitId: number }[];
  score: number;
};

const getPossibleTargetsForCpu = (card: CardData, cpu: PlayerState, opponent: PlayerState): {playerId: string, qubitId: number}[][] => {
    const allTargets: {playerId: string, qubitId: number}[][] = [];
    const ownQubits = cpu.qubits.map(q => ({playerId: cpu.id, qubitId: q.id}));
    const oppQubits = opponent.qubits.map(q => ({playerId: opponent.id, qubitId: q.id}));

    if (card.targets === 1) {
        ownQubits.forEach(t => allTargets.push([t]));
        if (card.targetOpponent) {
            oppQubits.forEach(t => allTargets.push([t]));
        }
    } else if (card.targets === 2) {
        if(card.name === 'CNOT Card' || card.name === 'SWAP Card' || card.name === 'Entanglement Card') {
            for (const ownTarget of ownQubits) {
                for (const oppTarget of oppQubits) {
                    allTargets.push([ownTarget, oppTarget]);
                }
            }
        }
    }
    return allTargets;
};


const evaluateCpuMove = (card: CardData, targets: { playerId: string; qubitId: number }[], gameState: GameState): number => {
    const cpuId = PLAYER2_ID;
    const opponentId = PLAYER1_ID;
    const opponentQubits = gameState.players[opponentId].qubits;
    const cpuQubits = gameState.players[cpuId].qubits;

    // Priority 1: Direct Win
    if (card.name === 'Pauli-X Card (X)' && targets[0].playerId === opponentId) {
        const targetQubit = opponentQubits.find(q => q.id === targets[0].qubitId)!;
        const otherQubit = opponentQubits.find(q => q.id !== targets[0].qubitId)!;
        if (targetQubit.physicalState === QubitPhysicalState.One && otherQubit.physicalState === QubitPhysicalState.Zero) {
            return 1000;
        }
    }
    if (card.name === 'CNOT Card') {
        const controlQubit = cpuQubits.find(q => q.id === targets[0].qubitId)!;
        const targetQubit = opponentQubits.find(q => q.id === targets[1].qubitId)!;
        const otherQubit = opponentQubits.find(q => q.id !== targets[1].qubitId)!;
        if (controlQubit.physicalState === QubitPhysicalState.One && targetQubit.physicalState === QubitPhysicalState.One && otherQubit.physicalState === QubitPhysicalState.Zero) {
            return 1000;
        }
    }

    // Priority 3: Disruption
    if (card.name === 'Measurement Card' && targets[0].playerId === opponentId) {
        const targetQubit = opponentQubits.find(q => q.id === targets[0].qubitId)!;
        if (targetQubit.physicalState === QubitPhysicalState.Superposition) {
            return 100;
        }
    }

    // Priority 2: State Preparation (getting closer to |00⟩)
    const initialOnes = opponentQubits.filter(q => q.physicalState === QubitPhysicalState.One).length;
    let finalOnes = initialOnes;
    
    if (card.name === 'Pauli-X Card (X)' && targets[0].playerId === opponentId) {
        const targetQubit = opponentQubits.find(q => q.id === targets[0].qubitId)!;
        if (targetQubit.physicalState === QubitPhysicalState.One) finalOnes--;
        else if (targetQubit.physicalState === QubitPhysicalState.Zero) finalOnes++;
    }
     if (card.name === 'CNOT Card') {
        const controlQubit = cpuQubits.find(q => q.id === targets[0].qubitId)!;
        const targetQubit = opponentQubits.find(q => q.id === targets[1].qubitId)!;
        if (controlQubit.physicalState === QubitPhysicalState.One && targetQubit.physicalState === QubitPhysicalState.One) {
            finalOnes--;
        }
    }
    if (finalOnes < initialOnes) return (initialOnes - finalOnes) * 50;
    if (finalOnes > initialOnes) return -50; // Penalize counter-productive moves
    if (card.name === 'Hadamard Card (H)' && targets[0].playerId === opponentId) {
        const targetQubit = opponentQubits.find(q => q.id === targets[0].qubitId)!;
        if(targetQubit.physicalState !== QubitPhysicalState.Superposition) return -20;
    }


    // Priority 4: Defense
    const cpuOnes = cpuQubits.filter(q => q.physicalState === QubitPhysicalState.One).length;
    if (cpuOnes > 0 && cpuQubits.every(q => q.physicalState !== QubitPhysicalState.Superposition)) {
        if (card.name === 'Hadamard Card (H)' && targets[0].playerId === cpuId) return 20;
        if (card.name === 'Entanglement Card') return 20;
    }

    // Priority 5: Default Move
    let baseScore = 10 - card.cost;
    if (targets.some(t => t.playerId === opponentId)) baseScore += 5;
    return baseScore;
};

const calculateBestCpuMove = (gameState: GameState): Move | null => {
    const cpuPlayer = gameState.players[PLAYER2_ID];
    const opponentPlayer = gameState.players[PLAYER1_ID];
    const playableCards = cpuPlayer.hand.filter(card => card.cost <= cpuPlayer.mana);

    if (playableCards.length === 0) return null;

    let bestMove: Move | null = null;

    for (const card of playableCards) {
        const possibleTargets = getPossibleTargetsForCpu(card, cpuPlayer, opponentPlayer);
        for (const targets of possibleTargets) {
            const score = evaluateCpuMove(card, targets, gameState);
            if (!bestMove || score > bestMove.score) {
                bestMove = { card, targets, score };
            }
        }
    }
    return bestMove;
};


//==============================================
// GAME LOGIC HOOK
//==============================================

const shuffleDeck = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const createInitialPlayerState = (id: string, name: string): PlayerState => {
    const deck = shuffleDeck(INITIAL_DECK_TEMPLATE);
    const hand = deck.splice(0, 7);
    return {
        id,
        name,
        qubits: [
            { id: 0, physicalState: QubitPhysicalState.Zero, entangledWith: null },
            { id: 1, physicalState: QubitPhysicalState.Zero, entangledWith: null },
        ],
        deck,
        hand,
        discard: [],
        mana: 1,
        maxMana: 1,
    };
};

const createInitialGameState = (): GameState => {
  return {
    players: {
      [PLAYER1_ID]: createInitialPlayerState(PLAYER1_ID, 'Player 1'),
      [PLAYER2_ID]: createInitialPlayerState(PLAYER2_ID, 'CPU Opponent'),
    },
    gamePhase: GamePhase.Setup,
    currentPlayerId: PLAYER1_ID,
    turn: 1,
    winner: null,
    log: ['Game Started. Choose your initial state.'],
    awaitingTarget: null,
    isCpuThinking: false,
  };
};

const findQubit = (state: GameState, playerId: string, qubitId: number): QubitState | undefined => {
    return state.players[playerId]?.qubits.find(q => q.id === qubitId);
}

const updateQubit = (state: GameState, playerId: string, qubitId: number, updates: Partial<QubitState>): GameState => {
    return {
        ...state,
        players: {
            ...state.players,
            [playerId]: {
                ...state.players[playerId],
                qubits: state.players[playerId].qubits.map(q => q.id === qubitId ? { ...q, ...updates } : q)
            }
        }
    };
}


const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return createInitialGameState();

    case 'CHOOSE_INITIAL_STATE': {
      if (state.gamePhase !== GamePhase.Setup) return state;
      
      const { q1, q2 } = action.payload;

      // Set Player 1's state
      const player1Qubits: QubitState[] = [
        { id: 0, physicalState: q1, entangledWith: null },
        { id: 1, physicalState: q2, entangledWith: null },
      ];
      
      // Randomly set Player 2's state
      const possibleStates = [
          [QubitPhysicalState.Zero, QubitPhysicalState.Zero],
          [QubitPhysicalState.Zero, QubitPhysicalState.One],
          [QubitPhysicalState.One, QubitPhysicalState.Zero],
          [QubitPhysicalState.One, QubitPhysicalState.One],
      ];
      const randomIndex = Math.floor(Math.random() * possibleStates.length);
      const [p2q1, p2q2] = possibleStates[randomIndex];
      const player2Qubits: QubitState[] = [
        { id: 0, physicalState: p2q1, entangledWith: null },
        { id: 1, physicalState: p2q2, entangledWith: null },
      ];

      return {
        ...state,
        players: {
          ...state.players,
          [PLAYER1_ID]: { ...state.players[PLAYER1_ID], qubits: player1Qubits },
          [PLAYER2_ID]: { ...state.players[PLAYER2_ID], qubits: player2Qubits },
        },
        gamePhase: GamePhase.Player1Turn,
        log: [...state.log, `Player 1 chose initial state.`, `Player 1's turn.`]
      };
    }

    case 'SELECT_CARD': {
      const { card, playerId } = action;
      if (state.gamePhase !== GamePhase.Player1Turn && state.gamePhase !== GamePhase.Player2Turn) return state;
      if (playerId !== state.currentPlayerId) return state;
      if (state.awaitingTarget) return state; // Already waiting for a target

      const player = state.players[playerId];
      if (player.mana < card.cost) {
          return {...state, log: [...state.log, `Not enough mana to play ${card.name}`]};
      }
      
      const awaitingTarget: AwaitingTargetInfo = { card, sourcePlayerId: playerId, targetsAcquired: [] };
      
      if(card.targets === 0) {
        // Immediately apply effect for no-target cards (not in this set, but good practice)
        return applyCardEffect(state, awaitingTarget);
      } else {
        return { ...state, awaitingTarget, log: [...state.log, `${player.name} plays ${card.name}. Select target(s).`] };
      }
    }

    case 'SELECT_QUBIT': {
        if (!state.awaitingTarget) return state;
        const { playerId, qubitId } = action;
        const { card, sourcePlayerId, targetsAcquired } = state.awaitingTarget;

        // Validation
        if(card.name === 'CNOT Card' || card.name === 'SWAP Card' || card.name === 'Entanglement Card') {
            if(targetsAcquired.length === 0 && playerId !== sourcePlayerId) return state; // First target must be own qubit
            if(targetsAcquired.length === 1 && playerId === sourcePlayerId) return state; // Second target must be opponent
        } else if (!card.targetOpponent && playerId !== sourcePlayerId) {
            return state; // Cannot target opponent
        }

        const newTargets = [...targetsAcquired, { playerId, qubitId }];

        if (newTargets.length === card.targets) {
            return applyCardEffect(state, { ...state.awaitingTarget, targetsAcquired: newTargets });
        } else {
            return { ...state, awaitingTarget: { ...state.awaitingTarget, targetsAcquired: newTargets } };
        }
    }

    case 'END_TURN': {
        if (state.gamePhase !== GamePhase.Player1Turn && state.gamePhase !== GamePhase.Player2Turn) return state;
        if (state.awaitingTarget) return state;

        // Draw cards
        const currentPlayer = state.players[state.currentPlayerId];
        let newDeck = [...currentPlayer.deck];
        let newHand = [...currentPlayer.hand];
        while(newHand.length < 5 && newDeck.length > 0) {
            newHand.push(newDeck.pop()!);
        }
        
        const nextPlayerId = state.currentPlayerId === PLAYER1_ID ? PLAYER2_ID : PLAYER1_ID;
        const isNewRound = nextPlayerId === PLAYER1_ID;
        const newTurn = isNewRound ? state.turn + 1 : state.turn;
        
        let nextPlayer = state.players[nextPlayerId];
        const newMaxMana = Math.min(10, newTurn);
        const isCpuTurnStarting = nextPlayerId === PLAYER2_ID;
        
        return {
            ...state,
            players: {
                ...state.players,
                [state.currentPlayerId]: { ...currentPlayer, hand: newHand, deck: newDeck },
                [nextPlayerId]: { ...nextPlayer, maxMana: newMaxMana, mana: newMaxMana }
            },
            currentPlayerId: nextPlayerId,
            gamePhase: nextPlayerId === PLAYER1_ID ? GamePhase.Player1Turn : GamePhase.Player2Turn,
            turn: newTurn,
            awaitingTarget: null,
            log: [...state.log, `${currentPlayer.name} ends their turn.`, `${nextPlayer.name}'s turn.`],
            isCpuThinking: isCpuTurnStarting,
        };
    }

    default:
      return state;
  }
};

function applyCardEffect(state: GameState, effectInfo: AwaitingTargetInfo): GameState {
    const { card, sourcePlayerId, targetsAcquired } = effectInfo;
    
    let newState = { ...state };
    const player = newState.players[sourcePlayerId];

    // Deduct cost and move card to discard
    const cardIndex = player.hand.findIndex(c => c.id === card.id);
    if(cardIndex === -1) return state; // Card not in hand
    
    const newHand = [...player.hand];
    const playedCard = newHand.splice(cardIndex, 1)[0];

    newState.players[sourcePlayerId] = {
        ...player,
        mana: player.mana - card.cost,
        hand: newHand,
        discard: [...player.discard, playedCard]
    };
    newState.log = [...newState.log, `${player.name}'s ${card.name} resolves.`];
    
    // Apply card specific logic
    switch (card.name) {
        case 'Hadamard Card (H)': {
            const target = targetsAcquired[0];
            newState = updateQubit(newState, target.playerId, target.qubitId, { physicalState: QubitPhysicalState.Superposition });
            break;
        }
        case 'Pauli-X Card (X)': {
            const target = targetsAcquired[0];
            const qubit = findQubit(newState, target.playerId, target.qubitId);
            if(qubit) {
                const newStateVal = qubit.physicalState === QubitPhysicalState.Zero ? QubitPhysicalState.One : QubitPhysicalState.Zero;
                newState = updateQubit(newState, target.playerId, target.qubitId, { physicalState: newStateVal });
            }
            break;
        }
         case 'Measurement Card': {
            const target = targetsAcquired[0];
            const qubit = findQubit(newState, target.playerId, target.qubitId);
            if (qubit && qubit.physicalState === QubitPhysicalState.Superposition) {
                const outcome = Math.random() < 0.5 ? QubitPhysicalState.Zero : QubitPhysicalState.One;
                newState = updateQubit(newState, target.playerId, target.qubitId, { physicalState: outcome });
            }
            break;
        }
        case 'CNOT Card': {
            const control = targetsAcquired[0];
            const target = targetsAcquired[1];
            const controlQubit = findQubit(newState, control.playerId, control.qubitId);
            const targetQubit = findQubit(newState, target.playerId, target.qubitId);

            if (controlQubit?.physicalState === QubitPhysicalState.One && targetQubit) {
                const newStateVal = targetQubit.physicalState === QubitPhysicalState.Zero ? QubitPhysicalState.One : QubitPhysicalState.Zero;
                newState = updateQubit(newState, target.playerId, target.qubitId, { physicalState: newStateVal });
            }
            break;
        }
        case 'SWAP Card': {
            const q1_ref = targetsAcquired[0];
            const q2_ref = targetsAcquired[1];
            const q1 = findQubit(newState, q1_ref.playerId, q1_ref.qubitId);
            const q2 = findQubit(newState, q2_ref.playerId, q2_ref.qubitId);
            if(q1 && q2) {
                const tempState = q1.physicalState;
                newState = updateQubit(newState, q1_ref.playerId, q1_ref.qubitId, { physicalState: q2.physicalState });
                newState = updateQubit(newState, q2_ref.playerId, q2_ref.qubitId, { physicalState: tempState });
            }
            break;
        }
        case 'Entanglement Card': {
            // simplified entanglement logic
            const q1_ref = targetsAcquired[0];
            const q2_ref = targetsAcquired[1];
            newState = updateQubit(newState, q1_ref.playerId, q1_ref.qubitId, { entangledWith: q2_ref });
            newState = updateQubit(newState, q2_ref.playerId, q2_ref.qubitId, { entangledWith: q1_ref });
            break;
        }
    }
    
    // Check for win condition
    const opponentId = sourcePlayerId === PLAYER1_ID ? PLAYER2_ID : PLAYER1_ID;
    const opponentQubits = newState.players[opponentId].qubits;
    const playerWins = opponentQubits.every(q => q.physicalState === QubitPhysicalState.Zero);

    if (playerWins) {
        newState.winner = sourcePlayerId;
        newState.gamePhase = GamePhase.GameOver;
        newState.log.push(`${newState.players[sourcePlayerId].name} wins by setting opponent to |00⟩!`);
    }
    
    return { ...newState, awaitingTarget: null };
}


export const useGameLogic = () => {
  const [gameState, dispatch] = useReducer(gameReducer, createInitialGameState());
  const [isCpuThinking, setIsCpuThinking] = useState(false);

  useEffect(() => {
    if (gameState.gamePhase === GamePhase.Player2Turn && !isCpuThinking && !gameState.winner) {
        setIsCpuThinking(true);
        
        // Use timeout to simulate CPU "thinking"
        setTimeout(() => {
            const move = calculateBestCpuMove(gameState);

            if (move) {
                // Sequence the card play with delays
                setTimeout(() => {
                    dispatch({ type: 'SELECT_CARD', card: move.card, playerId: PLAYER2_ID });
                }, 500);

                move.targets.forEach((target, index) => {
                    setTimeout(() => {
                        dispatch({ type: 'SELECT_QUBIT', playerId: target.playerId, qubitId: target.qubitId });
                    }, 500 + 700 * (index + 1));
                });
                
                // End turn after the final action
                setTimeout(() => {
                    dispatch({ type: 'END_TURN' });
                    setIsCpuThinking(false);
                }, 500 + 700 * (move.targets.length + 1));

            } else {
                // No valid move, just end the turn
                setTimeout(() => {
                    dispatch({ type: 'END_TURN' });
                    setIsCpuThinking(false);
                }, 1000);
            }
        }, 1500); // Initial thinking delay
    }
  }, [gameState.gamePhase, gameState, isCpuThinking]);


  const selectCard = useCallback((card: CardData, playerId: string) => {
    // Prevent human from playing during CPU turn
    if(playerId === PLAYER2_ID) return;
    dispatch({ type: 'SELECT_CARD', card, playerId });
  }, []);

  const selectQubit = useCallback((playerId: string, qubitId: number) => {
    dispatch({ type: 'SELECT_QUBIT', playerId, qubitId });
  }, []);

  const endTurn = useCallback(() => {
     if(gameState.currentPlayerId === PLAYER2_ID) return;
    dispatch({ type: 'END_TURN' });
  }, [gameState.currentPlayerId]);

  return { gameState, dispatch, selectCard, selectQubit, endTurn };
};
