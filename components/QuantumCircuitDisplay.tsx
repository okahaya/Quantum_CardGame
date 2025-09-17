
import React from 'react';
import { CircuitGate } from '../types';
import { PLAYER1_ID } from '../constants';

interface QuantumCircuitDisplayProps {
    circuitHistory: CircuitGate[];
    qubitCount: number;
}

const GateSymbol: React.FC<{ gate: CircuitGate, isVertical: boolean, qubitCount: number }> = ({ gate, isVertical, qubitCount }) => {
    const symbol = gate.card.symbol;
    const isControl = (targetIndex: number) => 
        (gate.card.type === 'two' && targetIndex === 0) || 
        (gate.card.type === 'three' && targetIndex < 2);
    
    const isTarget = (targetIndex: number) =>
        (gate.card.type === 'two' && targetIndex === 1) ||
        (gate.card.type === 'three' && targetIndex === 2);

    const getSymbol = (targetIndex: number) => {
        if (isControl(targetIndex)) return '●';
        if (isTarget(targetIndex)) {
           if(gate.card.name === 'SWAP') return '✕';
           return '⊕';
        }
        return symbol;
    };
    
    // This function calculates wire positions for both layouts.
    // It's complex because it handles dynamic qubit counts and player separation.
    const getWirePosition = (target: {playerId: string, qubitId: number}) => {
        if (isVertical) {
            // Vertical: Wires are distributed across 100% width.
            const totalWires = qubitCount * 2;
            const wireIndex = (target.playerId === PLAYER1_ID ? 0 : qubitCount) + target.qubitId;
            return `${(wireIndex + 0.5) / totalWires * 100}%`;
        } else {
            // Horizontal: Wires are positioned with a gap in the middle.
            const wireSpacing = 28; // px between wires
            const playerGap = 40; // px gap between P1 and P2 wires
            const p1Offset = 20;
            const p2Offset = p1Offset + (qubitCount * wireSpacing) + playerGap;
            const base = target.qubitId * wireSpacing;
            return `${(target.playerId === PLAYER1_ID ? p1Offset : p2Offset) + base}px`;
        }
    };
    
    return (
        <div className="w-full h-full absolute top-0 left-0" title={`${gate.card.name}: ${gate.card.description}`}>
            {gate.targets.map((target, index) => (
                <div key={index} 
                     className={`absolute w-6 h-6 flex items-center justify-center rounded-full text-white font-bold text-sm border-2 z-10
                     ${isControl(index) ? 'bg-black border-cyan-400' : `bg-cyan-600 border-cyan-400`}
                     ${symbol.length > 2 ? 'text-xs' : ''}`} // Smaller font for long symbols
                     style={{
                         top: isVertical ? getWirePosition(target) : '50%',
                         left: isVertical ? '50%' : getWirePosition(target),
                         transform: 'translate(-50%, -50%)',
                     }}
                >
                    {getSymbol(index)}
                </div>
            ))}
            {gate.targets.length > 1 && (
                 <div className="absolute bg-cyan-400"
                     style={{
                        left: isVertical ? '50%' : `calc(${getWirePosition(gate.targets[0])})`,
                        top: isVertical ? `calc(${getWirePosition(gate.targets[0])})` : '50%',
                        width: isVertical ? '2px' : `calc(${getWirePosition(gate.targets[gate.targets.length - 1])} - ${getWirePosition(gate.targets[0])})`,
                        height: isVertical ? `calc(${getWirePosition(gate.targets[gate.targets.length - 1])} - ${getWirePosition(gate.targets[0])})` : '2px',
                        transform: isVertical ? 'translateX(-50%)' : 'translateY(-50%)',
                    }}
                />
            )}
        </div>
    );
};

const HorizontalLayout: React.FC<{circuitHistory: CircuitGate[], qubitCount: number}> = ({ circuitHistory, qubitCount }) => {
    const maxTurn = Math.max(1, ...circuitHistory.map(g => g.turn));
    const turns = Array.from({ length: maxTurn }, (_, i) => i + 1);
    const qubitIndices = Array.from({length: qubitCount}, (_, i) => i);
    const wireSpacing = 28;
    const playerGap = 40;
    
    return (
         <div className="w-full h-full overflow-x-auto overflow-y-hidden">
            <div className="flex h-full relative min-w-max">
                {/* Qubit Wires Labels */}
                <div className="sticky left-0 bg-gray-900 z-20 pr-4 flex flex-col justify-around text-cyan-300 text-xs">
                    {qubitIndices.map(i => <div key={`p1-q${i}`}>P1 Q{i+1}</div>)}
                    <div className="h-4"></div>
                    {qubitIndices.map(i => <div key={`p2-q${i}`}>P2 Q{i+1}</div>)}
                </div>

                <div className="flex-grow flex relative pl-2">
                    {/* Background Wires */}
                     <div className="absolute top-0 left-0 right-0 h-full flex flex-col justify-around">
                        {qubitIndices.map(i => <div key={`p1-w${i}`} className="h-px bg-gray-600"></div>)}
                         <div style={{height: `${playerGap}px`}}></div>
                        {qubitIndices.map(i => <div key={`p2-w${i}`} className="h-px bg-gray-600"></div>)}
                    </div>

                    {turns.map(turn => {
                        const gatesInTurn = circuitHistory.filter(g => g.turn === turn);
                        const gateSpacing = 60;
                        return (
                            <div key={turn} className="relative h-full" style={{ width: `${Math.max(1, gatesInTurn.length) * gateSpacing + 20}px` }}>
                                <div className="absolute top-0 text-xs text-gray-500">T{turn}</div>
                                <div className="absolute left-0 top-0 bottom-0 w-px bg-cyan-900"></div>
                                {gatesInTurn.map((gate, index) => (
                                    <div 
                                      key={gate.id} 
                                      className="absolute h-full" 
                                      style={{ left: `${index * gateSpacing + 30}px`, width: `${wireSpacing}px` }}
                                    >
                                        <GateSymbol gate={gate} isVertical={false} qubitCount={qubitCount} />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

const VerticalLayout: React.FC<{circuitHistory: CircuitGate[], qubitCount: number}> = ({ circuitHistory, qubitCount }) => {
    const maxTurn = Math.max(1, ...circuitHistory.map(g => g.turn));
    const turns = Array.from({ length: maxTurn }, (_, i) => i + 1);
    const qubitIndices = Array.from({length: qubitCount}, (_, i) => i);
    
    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col w-full relative min-h-max">
                 {/* Background Wires */}
                 <div className="absolute top-0 left-0 bottom-0 w-full flex justify-around">
                    {[...Array(qubitCount * 2)].map((_, i) => <div key={`w${i}`} className="w-px h-full bg-gray-600"></div>)}
                 </div>

                {/* Qubit Labels */}
                <div className="sticky top-0 bg-gray-900 z-20 pb-2">
                    <div className="w-full flex justify-around text-cyan-300 text-xs">
                        {qubitIndices.map(i => <span key={`p1-l${i}`}>P1Q{i+1}</span>)}
                        {qubitIndices.map(i => <span key={`p2-l${i}`}>P2Q{i+1}</span>)}
                    </div>
                </div>
               
                {turns.map(turn => {
                    const gatesInTurn = circuitHistory.filter(g => g.turn === turn);
                    const gateSpacing = 60;
                    return (
                        <div key={turn} className="relative w-full" style={{ height: `${Math.max(1, gatesInTurn.length) * gateSpacing + 20}px` }}>
                            <div className="absolute left-0 text-xs text-gray-500">T{turn}</div>
                            <div className="absolute top-0 left-0 right-0 h-px bg-cyan-900"></div>
                            {gatesInTurn.map((gate, index) => (
                                <div key={gate.id} className="absolute w-full" style={{ top: `${index * gateSpacing + 30}px`, height: `${gateSpacing}px` }}>
                                    <GateSymbol gate={gate} isVertical={true} qubitCount={qubitCount} />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export const QuantumCircuitDisplay: React.FC<QuantumCircuitDisplayProps> = ({ circuitHistory, qubitCount }) => {
    return (
        <div className="w-full h-full bg-gray-900 border-2 border-cyan-800 rounded-lg p-2 flex flex-col">
            <h3 className="text-lg font-bold text-cyan-400 mb-2 shrink-0">Quantum Circuit</h3>
            <div className="flex-grow relative min-h-0">
                <div className="hidden lg:block w-full h-full">
                    <VerticalLayout circuitHistory={circuitHistory} qubitCount={qubitCount} />
                </div>
                <div className="block lg:hidden w-full h-full">
                    <HorizontalLayout circuitHistory={circuitHistory} qubitCount={qubitCount} />
                </div>
            </div>
        </div>
    );
};
