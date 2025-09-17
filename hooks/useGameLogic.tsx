
import { useReducer, useCallback, useEffect } from 'react';
import { GameState, GamePhase, PlayerState, CardData, AwaitingTargetInfo, Move, GameAction, GameSettings, QubitDisplayState } from '../types';
import { ALL_CARDS, INITIAL_DECK_TEMPLATE, PLAYER1_ID, PLAYER2_ID } from '../constants';
import { v4 as uuidv4 } from 'uuid';

//==============================================
// QUANTUM ENGINE & HELPERS
//==============================================
const GATES = {
    H: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
    X: [[0, 1], [1, 0]],
    Z: [[1, 0], [0, -1]],
};

const applySingleQubitGate = (vector: number[], gate: number[][], targetQubit: number, qubitCount: number): number[] => {
    const resultVector = new Array(vector.length).fill(0);
    const targetBit = 1 << (qubitCount - 1 - targetQubit);

    for (let i = 0; i < vector.length; i++) {
        if ((i & targetBit) === 0) {
            const basisState0 = i;
            const basisState1 = i | targetBit;
            
            const amp0 = vector[basisState0];
            const amp1 = vector[basisState1];

            resultVector[basisState0] = gate[0][0] * amp0 + gate[0][1] * amp1;
            resultVector[basisState1] = gate[1][0] * amp0 + gate[1][1] * amp1;
        }
    }
    return resultVector;
};

const applyCNOT = (vector: number[], controlQubit: number, targetQubit: number, qubitCount: number): number[] => {
    const newVector = [...vector];
    const controlBit = 1 << (qubitCount - 1 - controlQubit);
    const targetBit = 1 << (qubitCount - 1 - targetQubit);

    for (let i = 0; i < vector.length; i++) {
        if ((i & controlBit) !== 0) {
            const j = i ^ targetBit;
            if (i < j) {
                [newVector[i], newVector[j]] = [newVector[j], newVector[i]];
            }
        }
    }
    return newVector;
};

const applySWAP = (vector: number[], qubitA: number, qubitB: number, qubitCount: number): number[] => {
    let tempVector = applyCNOT(vector, qubitA, qubitB, qubitCount);
    tempVector = applyCNOT(tempVector, qubitB, qubitA, qubitCount);
    return applyCNOT(tempVector, qubitA, qubitB, qubitCount);
};

const applyToffoli = (vector: number[], c1: number, c2: number, target: number, qubitCount: number): number[] => {
    const newVector = [...vector];
    const c1Bit = 1 << (qubitCount - 1 - c1);
    const c2Bit = 1 << (qubitCount - 1 - c2);
    const targetBit = 1 << (qubitCount - 1 - target);

    for (let i = 0; i < vector.length; i++) {
        if ((i & c1Bit) !== 0 && (i & c2Bit) !== 0) {
            const j = i ^ targetBit;
            if (i < j) {
                [newVector[i], newVector[j]] = [newVector[j], newVector[i]];
            }
        }
    }
    return newVector;
};

const measureQubit = (vector: number[], targetQubit: number, qubitCount: number): { newVector: number[], outcome: 0 | 1 } => {
    let probOne = 0;
    const targetBit = 1 << (qubitCount - 1 - targetQubit);
    for (let i = 0; i < vector.length; i++) {
        if ((i & targetBit) !== 0) {
            probOne += vector[i] * vector[i];
        }
    }

    const outcome = Math.random() < probOne ? 1 : 0;
    let newVector = new Array(vector.length).fill(0);
    let norm = 0;

    for (let i = 0; i < vector.length; i++) {
        const bit = (i & targetBit) !== 0 ? 1 : 0;
        if (bit === outcome) {
            newVector[i] = vector[i];
            norm += vector[i] * vector[i];
        }
    }

    norm = Math.sqrt(norm);
    if (norm > 0) {
        newVector = newVector.map(amp => amp / norm);
    }
    
    return { newVector, outcome };
}

export const getDisplayStateForQubit = (stateVector: number[], qubitIndex: number, qubitCount: number): QubitDisplayState => {
  let probOne = 0;
  const k = qubitCount - 1 - qubitIndex;
  for (let i = 0; i < stateVector.length; i++) {
    if ((i >> k) & 1) {
      probOne += stateVector[i] * stateVector[i];
    }
  }
  if (probOne < 0.01) return QubitDisplayState.Zero;
  if (probOne > 0.99) return QubitDisplayState.One;
  return QubitDisplayState.Superposition;
};

const shuffleDeck = (deck: CardData[]): CardData[] => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
};


const createInitialPlayerState = (id: string, name: string, settings: GameSettings): PlayerState => {
    const initialDeck = INITIAL_DECK_TEMPLATE.map(card => ({ ...card, instanceId: uuidv4() }));
    const shuffledDeck = shuffleDeck(initialDeck);
    
    const maxHandSize = settings.qubitCount * 2 + 1;
    
    const hand = shuffledDeck.slice(0, maxHandSize);
    const deck = shuffledDeck.slice(maxHandSize);
    
    const stateVector = new Array(Math.pow(2, settings.qubitCount)).fill(0);
    stateVector[0] = 1;

    return { id, name, stateVector, deck, hand, mana: 0, maxMana: 0 };
};


const createInitialGameState = (settings: GameSettings): GameState => ({
    players: {
        [PLAYER1_ID]: createInitialPlayerState(PLAYER1_ID, 'Player 1', settings),
        [PLAYER2_ID]: createInitialPlayerState(PLAYER2_ID, 'CPU Opponent', settings),
    },
    gamePhase: GamePhase.Player1Setup,
    currentPlayerId: PLAYER1_ID,
    turn: 1,
    actionsTaken: 0,
    winner: null,
    log: ['Game Started. Turn 1: Preparation Phase.'],
    awaitingTarget: null,
    isCpuThinking: false,
    settings: settings
});

const checkWinCondition = (state: GameState, playerToCheckId: string): GameState => {
    if (state.turn === 1) return state; // No winning in setup phase
    const opponentId = playerToCheckId === PLAYER1_ID ? PLAYER2_ID : PLAYER1_ID;
    const opponentVector = state.players[opponentId].stateVector;
    const probGroundState = opponentVector[0] * opponentVector[0];

    if (probGroundState > 0.999) {
        return {
            ...state,
            winner: playerToCheckId,
            gamePhase: GamePhase.GameOver,
            log: [...state.log, `GAME OVER: ${state.players[playerToCheckId].name} wins!`]
        };
    }
    return state;
};

export const isValidTarget = (targetPlayerId: string, targetQubitId: number, awaitingInfo: AwaitingTargetInfo | null, gameState: GameState): boolean => {
    if (!awaitingInfo) return false;

    if (gameState.turn === 1 && targetPlayerId !== awaitingInfo.sourcePlayerId) {
        return false; // Self-target only in setup
    }
    
    if (awaitingInfo.actionNumber === 2 && targetPlayerId !== awaitingInfo.sourcePlayerId) {
        return false;
    }
    
    if (awaitingInfo.targetsAcquired.some(t => t.playerId === targetPlayerId && t.qubitId === targetQubitId)) {
        return false;
    }
    
    return true;
};
//==============================================
// CPU LOGIC
//==============================================
const getPossibleTargetsForCpu = (card: CardData, actionNumber: number, gameState: GameState): {playerId: string, qubitId: number}[][] => {
    const { settings } = gameState;
    const cpuId = PLAYER2_ID;
    const opponentId = PLAYER1_ID;

    const ownQubits = Array.from({ length: settings.qubitCount }, (_, i) => ({playerId: cpuId, qubitId: i}));
    
    if (gameState.turn === 1 || actionNumber === 2) {
        return generateCombinations(ownQubits, card.targets);
    }
    
    const oppQubits = Array.from({ length: settings.qubitCount }, (_, i) => ({playerId: opponentId, qubitId: i}));
    const allQubits = [...ownQubits, ...oppQubits];
    return generateCombinations(allQubits, card.targets);
};

const generateCombinations = (arr: {playerId: string, qubitId: number}[], k: number): {playerId: string, qubitId: number}[][] => {
    if (k > arr.length) return [];
    
    const result: {playerId: string, qubitId: number}[][] = [];
    
    const permute = (prefix: {playerId: string, qubitId: number}[], remaining: {playerId: string, qubitId: number}[]) => {
        if (prefix.length === k) {
            result.push(prefix);
            return;
        }
        for (let i = 0; i < remaining.length; i++) {
            permute([...prefix, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i+1)]);
        }
    }
    permute([], arr);
    return result;
};


const evaluateCpuMove = (card: CardData, targets: { playerId: string; qubitId: number }[], gameState: GameState): number => {
    let tempGameState = JSON.parse(JSON.stringify(gameState));
    const effectInfo: AwaitingTargetInfo = { card, sourcePlayerId: PLAYER2_ID, targetsAcquired: targets, actionNumber: tempGameState.actionsTaken + 1 };
    
    const newStateAfterMove = applyCardEffect(tempGameState, effectInfo, true);

    const opponentVector = newStateAfterMove.players[PLAYER1_ID].stateVector;
    const probGroundState = opponentVector[0] * opponentVector[0];
    
    if (probGroundState > 0.999) return 1000;
    
    const initialProbGround = gameState.players[PLAYER1_ID].stateVector[0] * gameState.players[PLAYER1_ID].stateVector[0];
    let score = (probGroundState - initialProbGround) * 100;

    if (card.name === 'Measurement' && targets[0].playerId === PLAYER1_ID) score += 50;
    if (card.name === 'Hadamard (H)' && targets[0].playerId === PLAYER2_ID) score += 20; 
    if (card.name === 'Pauli-X (X)' && targets[0].playerId === PLAYER2_ID) score += 5; 
    
    score += (10 - card.cost);
    if (targets.some(t => t.playerId === PLAYER1_ID)) score += 5;
    
    return score > 0 ? score : 1;
};

const calculateBestCpuMove = (gameState: GameState): Move | null => {
    const cpuPlayer = gameState.players[PLAYER2_ID];
    const actionNumber = gameState.actionsTaken + 1;
    const playableCards = cpuPlayer.hand.filter(card => gameState.turn === 1 || card.cost <= cpuPlayer.mana);
    if (playableCards.length === 0) return null;

    const allPossibleMoves = playableCards.flatMap(card => 
        getPossibleTargetsForCpu(card, actionNumber, gameState)
        .map(targets => ({ card, targets, score: evaluateCpuMove(card, targets, gameState) }))
    );

    if(allPossibleMoves.length === 0) return null;

    return allPossibleMoves.reduce((best, move) => (!best || move.score > best.score) ? move : best, null as Move | null);
};

//==============================================
// REDUCER LOGIC
//==============================================
function applyCardEffect(state: GameState, effectInfo: AwaitingTargetInfo, isSimulation = false): GameState {
    const { card, sourcePlayerId, targetsAcquired } = effectInfo;
    let newState = JSON.parse(JSON.stringify(state));
    const player = newState.players[sourcePlayerId];
    
    if(!isSimulation) {
      const cardIndex = player.hand.findIndex((c:CardData) => c.instanceId === card.instanceId);
      if(cardIndex === -1) return state; 
      
      const newHand = [...player.hand];
      newHand.splice(cardIndex, 1);
      
      const newDeck = shuffleDeck([...player.deck, card]);

      newState.players[sourcePlayerId] = {
          ...player,
          mana: state.turn > 1 ? player.mana - card.cost : player.mana,
          hand: newHand,
          deck: newDeck
      };

      const sourceName = newState.players[sourcePlayerId].name;
      const targetsString = targetsAcquired.map(t => `${newState.players[t.playerId].name}'s Q${t.qubitId + 1}`).join(', ');
      const logMessage = `Turn ${state.turn} (${sourceName}): Played ${card.name} on ${targetsString}.`;
      newState.log.push(logMessage);

      // Only increment actions taken if it's not the unlimited setup phase
      if (state.turn > 1) {
        newState.actionsTaken = state.actionsTaken + 1;
      } else {
        newState.actionsTaken = state.actionsTaken + 1; // Still track for CPU logic, but don't limit player
      }
    }

    const qubitCount = newState.settings.qubitCount;
    
    switch (card.name) {
        case 'Hadamard (H)':
        case 'Pauli-X (X)': 
        case 'Pauli-Z (Z)': {
            const gate = GATES[card.symbol as keyof typeof GATES];
            const target = targetsAcquired[0];
            newState.players[target.playerId].stateVector = applySingleQubitGate(
                newState.players[target.playerId].stateVector,
                gate,
                target.qubitId,
                qubitCount
            );
            break;
        }
        case 'Measurement': {
            const target = targetsAcquired[0];
            const { newVector, outcome } = measureQubit(newState.players[target.playerId].stateVector, target.qubitId, qubitCount);
            newState.players[target.playerId].stateVector = newVector;
            if(!isSimulation) newState.log.push(`> Measurement on ${newState.players[target.playerId].name}'s Q${target.qubitId+1} collapsed to |${outcome}⟩.`);
            break;
        }
        case 'CNOT': {
            const control = targetsAcquired[0];
            const target = targetsAcquired[1];

            if (control.playerId === target.playerId) {
                 newState.players[control.playerId].stateVector = applyCNOT(
                     newState.players[control.playerId].stateVector,
                     control.qubitId,
                     target.qubitId,
                     qubitCount
                 );
            } else { 
                 const { newVector: newControlVector, outcome } = measureQubit(newState.players[control.playerId].stateVector, control.qubitId, qubitCount);
                 newState.players[control.playerId].stateVector = newControlVector;
                 if(!isSimulation) newState.log.push(`> Control qubit measured as |${outcome}⟩.`);

                 if (outcome === 1) {
                     newState.players[target.playerId].stateVector = applySingleQubitGate(newState.players[target.playerId].stateVector, GATES.X, target.qubitId, qubitCount);
                 }
            }
            break;
        }
        case 'SWAP': {
            const p1 = targetsAcquired[0];
            const p2 = targetsAcquired[1];

            if (p1.playerId === p2.playerId) {
                newState.players[p1.playerId].stateVector = applySWAP(
                    newState.players[p1.playerId].stateVector,
                    p1.qubitId,
                    p2.qubitId,
                    qubitCount
                );
            } else { 
                const vec1 = newState.players[p1.playerId].stateVector;
                const vec2 = newState.players[p2.playerId].stateVector;
                
                const p1State = getDisplayStateForQubit(vec1, p1.qubitId, qubitCount);
                const p2State = getDisplayStateForQubit(vec2, p2.qubitId, qubitCount);

                if (p1State !== QubitDisplayState.Superposition && p2State !== QubitDisplayState.Superposition && p1State !== p2State) {
                    newState.players[p1.playerId].stateVector = applySingleQubitGate(vec1, GATES.X, p1.qubitId, qubitCount);
                    newState.players[p2.playerId].stateVector = applySingleQubitGate(vec2, GATES.X, p2.qubitId, qubitCount);
                }
            }
            break;
        }
        case 'Toffoli': {
             const c1 = targetsAcquired[0];
             const c2 = targetsAcquired[1];
             const target = targetsAcquired[2];

             if (c1.playerId === c2.playerId && c1.playerId === target.playerId) {
                 newState.players[c1.playerId].stateVector = applyToffoli(
                     newState.players[c1.playerId].stateVector,
                     c1.qubitId,
                     c2.qubitId,
                     target.qubitId,
                     qubitCount
                 );
             } else { 
                 const { newVector: newC1Vec, outcome: o1 } = measureQubit(newState.players[c1.playerId].stateVector, c1.qubitId, qubitCount);
                 newState.players[c1.playerId].stateVector = newC1Vec;
                 const { newVector: newC2Vec, outcome: o2 } = measureQubit(newState.players[c2.playerId].stateVector, c2.qubitId, qubitCount);
                 newState.players[c2.playerId].stateVector = newC2Vec;

                 if(!isSimulation) newState.log.push(`> Toffoli controls measured as |${o1}⟩ and |${o2}⟩.`);

                 if (o1 === 1 && o2 === 1) {
                      newState.players[target.playerId].stateVector = applySingleQubitGate(newState.players[target.playerId].stateVector, GATES.X, target.qubitId, qubitCount);
                 }
             }
            break;
        }
    }
    
    if (!isSimulation) {
       newState = checkWinCondition(newState, sourcePlayerId);
    }
    
    return { ...newState, awaitingTarget: null };
}

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': return createInitialGameState(action.settings);
    case 'CPU_THINKING_START': return { ...state, isCpuThinking: true };
    case 'CPU_THINKING_END': return { ...state, isCpuThinking: false };
    case 'CANCEL_TARGET': return { ...state, awaitingTarget: null };
    case 'LOG_MESSAGE': return { ...state, log: [...state.log, action.message] };
    
    case 'SELECT_CARD': {
        const { card, playerId } = action;
        const actionLimit = state.turn === 1 ? Infinity : 2;
        const hasActions = state.actionsTaken < actionLimit;
        
        if (playerId !== state.currentPlayerId || state.awaitingTarget || !hasActions) return state;

        const player = state.players[playerId];
        if (state.turn > 1 && player.mana < card.cost) return {...state, log: [...state.log, `Not enough mana for ${card.name}`]};
        
        const actionNumber = state.actionsTaken + 1;
        const role = card.roles ? card.roles[0] : 'a target';
        const prompt = `Action ${actionNumber}: Select ${role} for ${card.name}.`;
        const awaitingTarget: AwaitingTargetInfo = { card, sourcePlayerId: playerId, targetsAcquired: [], prompt, actionNumber };
        
        return { ...state, awaitingTarget };
    }

    case 'SELECT_QUBIT': {
        if (!state.awaitingTarget) return state;
        const { playerId, qubitId } = action;
        if (!isValidTarget(playerId, qubitId, state.awaitingTarget, state)) return state;

        const newTargets = [...state.awaitingTarget.targetsAcquired, { playerId, qubitId }];
        if (newTargets.length === state.awaitingTarget.card.targets) {
            return applyCardEffect(state, { ...state.awaitingTarget, targetsAcquired: newTargets });
        } else {
            const nextRole = state.awaitingTarget.card.roles ? state.awaitingTarget.card.roles[newTargets.length] : 'the next target';
            const prompt = `Select ${nextRole}.`;
            return { ...state, awaitingTarget: { ...state.awaitingTarget, targetsAcquired: newTargets, prompt } };
        }
    }

    case 'END_TURN': {
        if (state.awaitingTarget) return state;
        
        if (state.gamePhase === GamePhase.Player1Setup) {
            return { ...state, gamePhase: GamePhase.Player2Setup, currentPlayerId: PLAYER2_ID, actionsTaken: 0, log: [...state.log, `End of Player 1's Preparation.`] };
        }
        if (state.gamePhase === GamePhase.Player2Setup) {
            const turn = 2, maxMana = 2;
            let nextState = {
                ...state, gamePhase: GamePhase.Player1Turn, currentPlayerId: PLAYER1_ID, turn, actionsTaken: 0,
                players: {
                    [PLAYER1_ID]: {...state.players[PLAYER1_ID], mana: maxMana, maxMana},
                    [PLAYER2_ID]: {...state.players[PLAYER2_ID], mana: maxMana, maxMana},
                },
                log: [...state.log, `End of CPU's Preparation.`, `Turn 2: Battle phase begins.`]
            };
            return checkWinCondition(nextState, PLAYER2_ID);
        }
        
        const currentPlayer = state.players[state.currentPlayerId];
        let newHand = [...currentPlayer.hand];
        let newDeck = [...currentPlayer.deck];
        const maxHandSize = state.settings.qubitCount * 2 + 1;
        
        const cardsToDrawCount = maxHandSize - newHand.length;
        if(cardsToDrawCount > 0) {
            const drawnCards = newDeck.splice(0, cardsToDrawCount);
            newHand.push(...drawnCards);
        }
        
        const nextPlayerId = state.currentPlayerId === PLAYER1_ID ? PLAYER2_ID : PLAYER1_ID;
        const newTurn = nextPlayerId === PLAYER1_ID ? state.turn + 1 : state.turn;
        const newMaxMana = Math.min(10, newTurn);
        
        let nextState = {
            ...state,
            players: {
                ...state.players,
                [state.currentPlayerId]: { ...currentPlayer, hand: newHand, deck: newDeck },
                [nextPlayerId]: { ...state.players[nextPlayerId], maxMana: newMaxMana, mana: newMaxMana }
            },
            currentPlayerId: nextPlayerId,
            gamePhase: nextPlayerId === PLAYER1_ID ? GamePhase.Player1Turn : GamePhase.Player2Turn,
            turn: newTurn,
            actionsTaken: 0,
            awaitingTarget: null,
            log: [...state.log, `${currentPlayer.name} ends turn.`, `Turn ${newTurn}: ${state.players[nextPlayerId].name}'s turn.`]
        };
        return checkWinCondition(nextState, state.currentPlayerId);
    }
      
    case 'CPU_PERFORM_ACTION': {
        const move = calculateBestCpuMove(state);
        if (!move) {
             const actionLimit = state.turn === 1 ? Infinity : 2;
             if (state.actionsTaken < actionLimit) {
                return { ...state, log: [...state.log, `Turn ${state.turn} (CPU Opponent): Takes no action.`], actionsTaken: state.actionsTaken + 1 };
             }
             return state;
        }
        const effect: AwaitingTargetInfo = { card: move.card, sourcePlayerId: PLAYER2_ID, targetsAcquired: move.targets, actionNumber: state.actionsTaken + 1 };
        return applyCardEffect(state, effect);
    }

    default: return state;
  }
};

const useCpuTurn = (gameState: GameState, dispatch: React.Dispatch<GameAction>) => {
    const { currentPlayerId, gamePhase, winner, awaitingTarget, isCpuThinking, actionsTaken } = gameState;

    useEffect(() => {
        const isCpuTurn = currentPlayerId === PLAYER2_ID;
        if (!isCpuTurn || winner || awaitingTarget) {
            return;
        }

        const handle = setTimeout(() => {
            if (gamePhase === GamePhase.Player2Setup) {
                if (!isCpuThinking) dispatch({ type: 'CPU_THINKING_START' });

                const move = calculateBestCpuMove(gameState);
                if (move && move.score > 5) { // Threshold for a good setup move
                    dispatch({ type: 'CPU_PERFORM_ACTION' });
                } else {
                    if (actionsTaken === 0) {
                        dispatch({ type: 'LOG_MESSAGE', message: `CPU makes no setup moves.` });
                    }
                    dispatch({ type: 'END_TURN' });
                    dispatch({ type: 'CPU_THINKING_END' });
                }
            } else if (gamePhase === GamePhase.Player2Turn) {
                if (!isCpuThinking && actionsTaken < 2) {
                    dispatch({ type: 'CPU_THINKING_START' });
                }
                
                if (actionsTaken < 2) {
                    dispatch({ type: 'CPU_PERFORM_ACTION' });
                } else {
                    dispatch({ type: 'END_TURN' });
                    dispatch({ type: 'CPU_THINKING_END' });
                }
            }
        }, 700);
        
        return () => clearTimeout(handle);

    }, [gameState, dispatch]);
};


export const useGameLogic = (settings: GameSettings) => {
  const [gameState, dispatch] = useReducer(gameReducer, settings, createInitialGameState);

  useCpuTurn(gameState, dispatch);

  const selectCard = useCallback((card: CardData) => {
    if(gameState.currentPlayerId !== PLAYER1_ID) return;
    const actionLimit = gameState.turn === 1 ? Infinity : 2;
    if(gameState.actionsTaken < actionLimit) {
        dispatch({ type: 'SELECT_CARD', card, playerId: PLAYER1_ID });
    }
  }, [gameState.currentPlayerId, gameState.actionsTaken, gameState.turn]);

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
