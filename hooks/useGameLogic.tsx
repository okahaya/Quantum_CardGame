import { useReducer, useCallback, useEffect } from 'react';
import { GameState, GamePhase, PlayerState, QubitState, QubitPhysicalState, CardData, AwaitingTargetInfo, CircuitGate, Move, GameAction } from '../types';
import { INITIAL_DECK_TEMPLATE, PLAYER1_ID, PLAYER2_ID } from '../constants';
import { v4 as uuidv4 } from 'uuid';

//==============================================
// HELPER FUNCTIONS
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
        id, name,
        qubits: Array.from({ length: 3 }, (_, i) => ({ id: i, physicalState: QubitPhysicalState.Zero, entangledWith: null })),
        deck, hand, discard: [], mana: 0, maxMana: 0,
    };
};

const createInitialGameState = (): GameState => ({
    players: {
        [PLAYER1_ID]: createInitialPlayerState(PLAYER1_ID, 'Player 1'),
        [PLAYER2_ID]: createInitialPlayerState(PLAYER2_ID, 'CPU Opponent'),
    },
    gamePhase: GamePhase.Player1Setup,
    currentPlayerId: PLAYER1_ID,
    turn: 1,
    winner: null,
    log: ['Game Started. Turn 1: Preparation Phase. Target your own qubits for free.'],
    awaitingTarget: null,
    isCpuThinking: false,
    circuitHistory: [],
});

const findQubit = (state: GameState, playerId: string, qubitId: number): QubitState | undefined => state.players[playerId]?.qubits.find(q => q.id === qubitId);

const updateQubit = (state: GameState, playerId: string, qubitId: number, updates: Partial<QubitState>): GameState => ({
    ...state,
    players: {
        ...state.players,
        [playerId]: { ...state.players[playerId], qubits: state.players[playerId].qubits.map(q => q.id === qubitId ? { ...q, ...updates } : q) }
    }
});

export const isValidTarget = (targetPlayerId: string, targetQubitId: number, awaitingInfo: AwaitingTargetInfo | null, gameState: GameState): boolean => {
    if (!awaitingInfo) return false;

    // Rule for Preparation Phase (Turn 1): Can only target your own qubits
    if (gameState.turn === 1 && targetPlayerId !== awaitingInfo.sourcePlayerId) {
        return false;
    }

    const { card, sourcePlayerId, targetsAcquired } = awaitingInfo;
    const targetType = targetsAcquired.length;

    if (card.name === 'CNOT' || card.name === 'SWAP') {
        if (targetType === 0) return targetPlayerId === sourcePlayerId;
        if (targetType === 1) return targetPlayerId !== sourcePlayerId;
    } else if (card.name === 'Toffoli') {
        if (targetType < 2) return targetPlayerId === sourcePlayerId;
        if (targetType === 2) return targetPlayerId !== sourcePlayerId;
    } else if (!card.targetOpponent && gameState.turn > 1) { // targetOpponent rule only applies after setup
        return targetPlayerId === sourcePlayerId;
    }
    
    // Check for duplicate targets
    if (targetsAcquired.some(t => t.playerId === targetPlayerId && t.qubitId === targetQubitId)) {
        return false;
    }
    
    return true; // Default for single-target cards and other cases
};

//==============================================
// CPU LOGIC
//==============================================
const getPossibleTargetsForCpu = (card: CardData, cpu: PlayerState, opponent: PlayerState, gameState: GameState): {playerId: string, qubitId: number}[][] => {
    const allTargets: {playerId: string, qubitId: number}[][] = [];
    const ownQubits = cpu.qubits.map(q => ({playerId: cpu.id, qubitId: q.id}));
    const oppQubits = opponent.qubits.map(q => ({playerId: opponent.id, qubitId: q.id}));

    if (gameState.turn === 1) { // CPU Setup Logic
        if (card.targets === 1) {
            ownQubits.forEach(t => allTargets.push([t]));
        } // Multi-target cards on self are less useful in setup, can be added later
    } else { // Regular Turn Logic
        if (card.targets === 1) {
            if (card.targetOpponent) oppQubits.forEach(t => allTargets.push([t]));
            ownQubits.forEach(t => allTargets.push([t]));
        } else if (card.name === 'CNOT' || card.name === 'SWAP') {
            for (const ownTarget of ownQubits) for (const oppTarget of oppQubits) allTargets.push([ownTarget, oppTarget]);
        } else if (card.name === 'Toffoli') {
            for(let i=0; i < ownQubits.length; i++) for(let j=i+1; j < ownQubits.length; j++) for(const oppTarget of oppQubits) allTargets.push([ownQubits[i], ownQubits[j], oppTarget]);
        }
    }
    return allTargets;
};

const evaluateCpuMove = (card: CardData, targets: { playerId: string; qubitId: number }[], gameState: GameState): number => {
    const opponentId = PLAYER1_ID;
    const opponentQubits = gameState.players[opponentId].qubits;
    const cpuQubits = gameState.players[PLAYER2_ID].qubits;
    let tempOpponentQubits = JSON.parse(JSON.stringify(opponentQubits));

    // Simulate state change
    if (card.name === 'Pauli-X (X)' && targets[0].playerId === opponentId) {
        const q = tempOpponentQubits.find((q: QubitState) => q.id === targets[0].qubitId);
        if (q.physicalState === QubitPhysicalState.Zero) q.physicalState = QubitPhysicalState.One;
        else if (q.physicalState === QubitPhysicalState.One) q.physicalState = QubitPhysicalState.Zero;
    } else if (card.name === 'CNOT') {
        if(cpuQubits.find(q => q.id === targets[0].qubitId)!.physicalState === QubitPhysicalState.One) {
            const q = tempOpponentQubits.find((q: QubitState) => q.id === targets[1].qubitId);
            if (q.physicalState === QubitPhysicalState.Zero) q.physicalState = QubitPhysicalState.One;
            else if (q.physicalState === QubitPhysicalState.One) q.physicalState = QubitPhysicalState.Zero;
        }
    } else if (card.name === 'Toffoli') {
        if(cpuQubits.find(q => q.id === targets[0].qubitId)!.physicalState === QubitPhysicalState.One && cpuQubits.find(q => q.id === targets[1].qubitId)!.physicalState === QubitPhysicalState.One) {
            const q = tempOpponentQubits.find((q: QubitState) => q.id === targets[2].qubitId);
            if (q.physicalState === QubitPhysicalState.Zero) q.physicalState = QubitPhysicalState.One;
            else if (q.physicalState === QubitPhysicalState.One) q.physicalState = QubitPhysicalState.Zero;
        }
    }
    
    if (tempOpponentQubits.every((q: QubitState) => q.physicalState === QubitPhysicalState.Zero)) return 1000;
    if (card.name === 'Measurement' && targets[0].playerId === opponentId && opponentQubits.find(q => q.id === targets[0].qubitId)!.physicalState === QubitPhysicalState.Superposition) return 100;
    const initialOnes = opponentQubits.filter(q => q.physicalState === QubitPhysicalState.One).length;
    const finalOnes = tempOpponentQubits.filter((q: QubitState) => q.physicalState === QubitPhysicalState.One).length;
    if (finalOnes < initialOnes) return (initialOnes - finalOnes) * 50;
    if (card.name === 'Hadamard (H)' && targets[0].playerId === PLAYER2_ID) return 20;
    
    let baseScore = 10 - card.cost;
    if (targets.some(t => t.playerId === opponentId)) baseScore += 5;
    return baseScore > 0 ? baseScore : 1;
};

const calculateBestCpuMove = (gameState: GameState): Move | null => {
    const cpuPlayer = gameState.players[PLAYER2_ID];
    const opponentPlayer = gameState.players[PLAYER1_ID];
    const playableCards = cpuPlayer.hand.filter(card => card.cost <= cpuPlayer.mana);
    if (playableCards.length === 0) return null;

    return playableCards.flatMap(card => 
        getPossibleTargetsForCpu(card, cpuPlayer, opponentPlayer, gameState)
        .map(targets => ({ card, targets, score: evaluateCpuMove(card, targets, gameState) }))
    ).reduce((best, move) => (!best || move.score > best.score) ? move : best, null as Move | null);
};

//==============================================
// REDUCER LOGIC
//==============================================
function applyCardEffect(state: GameState, effectInfo: AwaitingTargetInfo): GameState {
    const { card, sourcePlayerId, targetsAcquired } = effectInfo;
    let newState = { ...state };
    const player = newState.players[sourcePlayerId];
    
    const cardIndex = player.hand.findIndex(c => c.id === card.id);
    if(cardIndex === -1) return state; // Card must be in hand
    
    const newHand = [...player.hand];
    newHand.splice(cardIndex, 1);

    newState.players[sourcePlayerId] = {
        ...player,
        mana: state.turn > 1 ? player.mana - card.cost : player.mana, // No cost on turn 1
        hand: newHand,
        discard: [...player.discard, card]
    };
    newState.log = [...newState.log, `${player.name}'s ${card.name} resolves.`];
    newState.circuitHistory = [...newState.circuitHistory, { id: uuidv4(), card, sourcePlayerId, targets: targetsAcquired, turn: state.turn }];

    switch (card.name) {
        case 'Hadamard (H)':
            newState = updateQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId, { physicalState: QubitPhysicalState.Superposition }); break;
        case 'Pauli-X (X)': {
            const qubit = findQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId);
            if(qubit) newState = updateQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId, { physicalState: qubit.physicalState === QubitPhysicalState.Zero ? QubitPhysicalState.One : QubitPhysicalState.Zero });
            break;
        }
        case 'Measurement': {
            const qubit = findQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId);
            if (qubit?.physicalState === QubitPhysicalState.Superposition) {
                newState = updateQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId, { physicalState: Math.random() < 0.5 ? QubitPhysicalState.Zero : QubitPhysicalState.One });
            }
            break;
        }
        case 'CNOT': {
            const control = findQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId);
            const target = findQubit(newState, targetsAcquired[1].playerId, targetsAcquired[1].qubitId);
            if (control?.physicalState === QubitPhysicalState.One && target) {
                newState = updateQubit(newState, targetsAcquired[1].playerId, targetsAcquired[1].qubitId, { physicalState: target.physicalState === QubitPhysicalState.Zero ? QubitPhysicalState.One : QubitPhysicalState.Zero });
            }
            break;
        }
        case 'SWAP': {
            const q1 = findQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId);
            const q2 = findQubit(newState, targetsAcquired[1].playerId, targetsAcquired[1].qubitId);
            if(q1 && q2) {
                newState = updateQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId, { physicalState: q2.physicalState });
                newState = updateQubit(newState, targetsAcquired[1].playerId, targetsAcquired[1].qubitId, { physicalState: q1.physicalState });
            }
            break;
        }
        case 'Toffoli': {
            const c1 = findQubit(newState, targetsAcquired[0].playerId, targetsAcquired[0].qubitId);
            const c2 = findQubit(newState, targetsAcquired[1].playerId, targetsAcquired[1].qubitId);
            const target = findQubit(newState, targetsAcquired[2].playerId, targetsAcquired[2].qubitId);
            if (c1?.physicalState === QubitPhysicalState.One && c2?.physicalState === QubitPhysicalState.One && target) {
                 newState = updateQubit(newState, targetsAcquired[2].playerId, targetsAcquired[2].qubitId, { physicalState: target.physicalState === QubitPhysicalState.Zero ? QubitPhysicalState.One : QubitPhysicalState.Zero });
            }
            break;
        }
    }
    
    // Win condition check only applies after Turn 1
    if (newState.turn > 1) {
        const opponentId = sourcePlayerId === PLAYER1_ID ? PLAYER2_ID : PLAYER1_ID;
        if (newState.players[opponentId].qubits.every(q => q.physicalState === QubitPhysicalState.Zero)) {
            newState.winner = sourcePlayerId;
            newState.gamePhase = GamePhase.GameOver;
            newState.log.push(`${newState.players[sourcePlayerId].name} wins by collapsing opponent to |000⟩!`);
        }
    }
    
    return { ...newState, awaitingTarget: null };
}

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': return createInitialGameState();
    case 'CPU_THINKING_START': return { ...state, isCpuThinking: true };
    case 'CPU_THINKING_END': return { ...state, isCpuThinking: false };
    case 'CANCEL_TARGET': return { ...state, awaitingTarget: null };
    
    case 'SELECT_CARD': {
        const { card, playerId } = action;
        if (playerId !== state.currentPlayerId || state.awaitingTarget) return state;
        const player = state.players[playerId];
        if (state.turn > 1 && player.mana < card.cost) return {...state, log: [...state.log, `Not enough mana for ${card.name}`]};
        
        const prompts = {'CNOT': 'Select YOUR control qubit.', 'SWAP': 'Select YOUR qubit to swap.', 'Toffoli': 'Select YOUR first control qubit.'}
        const prompt = prompts[card.name as keyof typeof prompts] || 'Select a target qubit.';
        const awaitingTarget: AwaitingTargetInfo = { card, sourcePlayerId: playerId, targetsAcquired: [], prompt };
        
        return { ...state, awaitingTarget, log: [...state.log, `${player.name} plays ${card.name}. ${awaitingTarget.prompt}`] };
    }

    case 'SELECT_QUBIT': {
        if (!state.awaitingTarget) return state;
        const { playerId, qubitId } = action;
        if (!isValidTarget(playerId, qubitId, state.awaitingTarget, state)) return state;

        const newTargets = [...state.awaitingTarget.targetsAcquired, { playerId, qubitId }];
        if (newTargets.length === state.awaitingTarget.card.targets) {
            return applyCardEffect(state, { ...state.awaitingTarget, targetsAcquired: newTargets });
        } else {
            let prompt = '';
            if (state.awaitingTarget.card.name === 'CNOT' || state.awaitingTarget.card.name === 'SWAP') prompt = 'Select OPPONENT\'s target qubit.';
            if (state.awaitingTarget.card.name === 'Toffoli') prompt = newTargets.length === 1 ? 'Select YOUR second control qubit.' : 'Select OPPONENT\'s target qubit.';
            return { ...state, awaitingTarget: { ...state.awaitingTarget, targetsAcquired: newTargets, prompt } };
        }
    }

    case 'END_TURN': {
        if (state.awaitingTarget) return state;
        
        if (state.gamePhase === GamePhase.Player1Setup) {
            return { ...state, gamePhase: GamePhase.Player2Setup, currentPlayerId: PLAYER2_ID, log: [...state.log, `Player 1 ends setup.`, `CPU's preparation turn.`] };
        }
        if (state.gamePhase === GamePhase.Player2Setup) {
            const turn = 2, maxMana = 2;
            return {
                ...state, gamePhase: GamePhase.Player1Turn, currentPlayerId: PLAYER1_ID, turn,
                players: {
                    [PLAYER1_ID]: {...state.players[PLAYER1_ID], mana: maxMana, maxMana},
                    [PLAYER2_ID]: {...state.players[PLAYER2_ID], mana: maxMana, maxMana},
                },
                log: [...state.log, `Preparation phase ends.`, `Turn 2: Battle phase begins.`]
            };
        }
        
        const currentPlayer = state.players[state.currentPlayerId];
        let newDeck = [...currentPlayer.deck], newHand = [...currentPlayer.hand];
        while(newHand.length < 5 && newDeck.length > 0) newHand.push(newDeck.pop()!);
        
        const nextPlayerId = state.currentPlayerId === PLAYER1_ID ? PLAYER2_ID : PLAYER1_ID;
        const newTurn = nextPlayerId === PLAYER1_ID ? state.turn + 1 : state.turn;
        const newMaxMana = Math.min(10, newTurn);
        
        return {
            ...state,
            players: {
                ...state.players,
                [state.currentPlayerId]: { ...currentPlayer, hand: newHand, deck: newDeck },
                [nextPlayerId]: { ...state.players[nextPlayerId], maxMana: newMaxMana, mana: newMaxMana }
            },
            currentPlayerId: nextPlayerId,
            gamePhase: nextPlayerId === PLAYER1_ID ? GamePhase.Player1Turn : GamePhase.Player2Turn,
            turn: newTurn,
            awaitingTarget: null,
            log: [...state.log, `${currentPlayer.name} ends turn.`, `${state.players[nextPlayerId].name}'s turn.`]
        };
    }
      
    case 'CPU_PERFORM_SETUP_MOVES': {
        return action.moves.reduce((currentState, move) => applyCardEffect(currentState, move), state);
    }
      
    case 'CPU_PERFORM_MOVE': {
        if (!action.move) return state;
        const effect: AwaitingTargetInfo = { card: action.move.card, sourcePlayerId: PLAYER2_ID, targetsAcquired: action.move.targets };
        return applyCardEffect(state, effect);
    }

    default: return state;
  }
};

export const useGameLogic = () => {
  const [gameState, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);

  useEffect(() => {
    if (gameState.winner || gameState.awaitingTarget || gameState.isCpuThinking) return;

    const isCpuSetup = gameState.gamePhase === GamePhase.Player2Setup;
    const isCpuTurn = gameState.gamePhase === GamePhase.Player2Turn;

    if (isCpuSetup) {
        dispatch({ type: 'CPU_THINKING_START' });
        setTimeout(() => {
            const cpu = gameState.players[PLAYER2_ID];
            let moves: AwaitingTargetInfo[] = [];
            // Strategy: Play up to 2 X-Cards to set qubits to |1⟩, then 1 H-card for defense.
            const xCards = cpu.hand.filter(c => c.id === 'x');
            const hCards = cpu.hand.filter(c => c.id === 'h');
            const availableQubitIds = [0, 1, 2];

            if (xCards.length > 0 && availableQubitIds.length > 0) {
                const targetId = availableQubitIds.pop()!;
                moves.push({ card: xCards[0], sourcePlayerId: PLAYER2_ID, targetsAcquired: [{playerId: PLAYER2_ID, qubitId: targetId}] });
            }
            if (xCards.length > 1 && availableQubitIds.length > 0) {
                 const targetId = availableQubitIds.pop()!;
                 moves.push({ card: xCards[1], sourcePlayerId: PLAYER2_ID, targetsAcquired: [{playerId: PLAYER2_ID, qubitId: targetId}] });
            }
            if (hCards.length > 0 && availableQubitIds.length > 0) {
                 const targetId = availableQubitIds.pop()!;
                 moves.push({ card: hCards[0], sourcePlayerId: PLAYER2_ID, targetsAcquired: [{playerId: PLAYER2_ID, qubitId: targetId}] });
            }

            dispatch({ type: 'CPU_PERFORM_SETUP_MOVES', moves });
            setTimeout(() => {
                dispatch({ type: 'CPU_THINKING_END' });
                dispatch({ type: 'END_TURN' });
            }, 500 * (moves.length || 1));
        }, 1500);
    }

    if (isCpuTurn) {
        dispatch({ type: 'CPU_THINKING_START' });
        setTimeout(() => {
            const move = calculateBestCpuMove(gameState);
            dispatch({ type: 'CPU_PERFORM_MOVE', move });
            setTimeout(() => {
                dispatch({ type: 'CPU_THINKING_END' });
                dispatch({ type: 'END_TURN' });
            }, 500);
        }, 1500);
    }
  }, [gameState.gamePhase, gameState.winner, gameState.awaitingTarget, gameState.isCpuThinking]);

  const selectCard = useCallback((card: CardData) => {
    if(gameState.currentPlayerId !== PLAYER1_ID) return;
    dispatch({ type: 'SELECT_CARD', card, playerId: PLAYER1_ID });
  }, [gameState.currentPlayerId]);

  const selectQubit = useCallback((playerId: string, qubitId: number) => {
    dispatch({ type: 'SELECT_QUBIT', playerId, qubitId });
  }, []);
  
  const cancelTarget = useCallback(() => {
    dispatch({ type: 'CANCEL_TARGET' });
  }, []);

  const endTurn = useCallback(() => {
     if(gameState.currentPlayerId !== PLAYER1_ID || gameState.awaitingTarget) return;
    dispatch({ type: 'END_TURN' });
  }, [gameState.currentPlayerId, gameState.awaitingTarget]);

  return { gameState, dispatch, selectCard, selectQubit, endTurn, cancelTarget };
};