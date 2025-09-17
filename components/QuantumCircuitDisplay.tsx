import React from 'react';
import { CircuitGate } from '../types';
import { PLAYER1_ID } from '../constants';

interface QuantumCircuitDisplayProps {
    circuitHistory: CircuitGate[];
}

const GateSymbol: React.FC<{ gate: CircuitGate, isVertical: boolean }> = ({ gate, isVertical }) => {
    const symbol = gate.card.name.split(' ')[0][0];
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
    
    const getWirePosition = (target: {playerId: string, qubitId: number}) => {
        // Vertical layout: P1 Q0-2, P2 Q0-2 are 6 wires
        // Horizontal layout: P1 Q0-2, separator, P2 Q0-2
        const base = target.qubitId * (isVertical ? 16.66 : 28);
        if (isVertical) {
            return target.playerId === PLAYER1_ID ? `${base}%` : `${50 + base}%`;
        }
        // Horizontal
        return `${(target.playerId === PLAYER1_ID ? 20 : 122) + base}px`;
    };
    
    return (
        <div className="w-full h-full absolute top-0 left-0" title={`${gate.card.name}: ${gate.card.description}`}>
            {gate.targets.map((target, index) => (
                <div key={index} 
                     className={`absolute w-6 h-6 flex items-center justify-center rounded-full text-white font-bold text-sm border-2
                     ${isControl(index) ? 'bg-black border-cyan-400' : 'bg-cyan-600 border-cyan-400'}`}
                     style={{
                         [isVertical ? 'top' : 'left']: isVertical ? `calc(${getWirePosition(target)} - 12px)` : '50%',
                         [isVertical ? 'left' : 'top']: isVertical ? '50%' : getWirePosition(target),
                         transform: 'translate(-50%, -50%)',
                     }}
                >
                    {getSymbol(index)}
                </div>
            ))}
            {gate.targets.length > 1 && (
                 <div className="absolute bg-cyan-400"
                     style={{
                        left: isVertical ? 'calc(50% - 1px)' : 'calc(50% - 1px)',
                        top: isVertical ? `calc(${getWirePosition(gate.targets[0])})` : `calc(${getWirePosition(gate.targets[0])} + 12px)`,
                        [isVertical ? 'height' : 'width']: '100%',
                        [isVertical ? 'width' : 'height']: isVertical 
                            ? `${(gate.targets[0].playerId === gate.targets[gate.targets.length - 1].playerId ? Math.abs(gate.targets[gate.targets.length - 1].qubitId - gate.targets[0].qubitId) : 2 + gate.targets[gate.targets.length - 1].qubitId + gate.targets[0].qubitId) * 16.66}%`
                            : `${Math.abs(gate.targets[gate.targets.length - 1].qubitId - gate.targets[0].qubitId) * 28 + (gate.targets[0].playerId !== gate.targets[gate.targets.length - 1].playerId ? 102 : 0)}px`,
                        transform: isVertical ? '' : 'translateX(-50%)',
                    }}
                />
            )}
        </div>
    );
};

const HorizontalLayout: React.FC<{circuitHistory: CircuitGate[]}> = ({ circuitHistory }) => {
    const maxTurn = Math.max(1, ...circuitHistory.map(g => g.turn));
    const turns = Array.from({ length: maxTurn }, (_, i) => i + 1);
    return (
         <div className="w-full h-full overflow-x-auto overflow-y-hidden">
            <div className="flex h-full relative min-w-max">
                {/* Qubit Wires */}
                <div className="sticky left-0 bg-gray-900 z-10 pr-4">
                    <div className="h-full flex flex-col justify-around text-cyan-300">
                        <div>P1 Qubits</div>
                        {[0,1,2].map(i => <div key={`p1-q${i}`} className="h-px bg-gray-600 relative"><div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs">Q{i+1}</div></div>)}
                        <div className="border-t-2 border-dashed border-cyan-700 my-2"></div>
                        <div>P2 Qubits</div>
                        {[0,1,2].map(i => <div key={`p2-q${i}`} className="h-px bg-gray-600 relative"><div className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs">Q{i+1}</div></div>)}
                    </div>
                </div>

                <div className="flex-grow flex relative pl-2">
                    {/* Background Wires */}
                     <div className="absolute top-0 left-0 right-0 h-full flex flex-col justify-around">
                        {[0,1,2].map(i => <div key={`p1-w${i}`} className="h-px bg-gray-600"></div>)}
                         <div className="h-8"></div>
                        {[0,1,2].map(i => <div key={`p2-w${i}`} className="h-px bg-gray-600"></div>)}
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
                                      style={{ left: `${index * gateSpacing + 30}px`, top:0 }}
                                    >
                                        <GateSymbol gate={gate} isVertical={false} />
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

const VerticalLayout: React.FC<{circuitHistory: CircuitGate[]}> = ({ circuitHistory }) => {
    const maxTurn = Math.max(1, ...circuitHistory.map(g => g.turn));
    const turns = Array.from({ length: maxTurn }, (_, i) => i + 1);
    
    return (
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col w-full relative min-h-max">
                 {/* Background Wires */}
                 <div className="absolute top-0 left-0 bottom-0 w-full flex justify-around">
                    {[...Array(6)].map((_, i) => <div key={`w${i}`} className="w-px h-full bg-gray-600"></div>)}
                 </div>

                {/* Qubit Labels */}
                <div className="sticky top-0 bg-gray-900 z-10 pb-2">
                    <div className="w-full flex justify-around text-cyan-300 text-xs">
                        <span>P1Q1</span><span>P1Q2</span><span>P1Q3</span>
                        <span>P2Q1</span><span>P2Q2</span><span>P2Q3</span>
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
                                <div key={gate.id} className="absolute w-full" style={{ top: `${index * gateSpacing + 30}px` }}>
                                    <GateSymbol gate={gate} isVertical={true} />
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}


export const QuantumCircuitDisplay: React.FC<QuantumCircuitDisplayProps> = ({ circuitHistory }) => {
    return (
        <div className="w-full h-full bg-gray-900 border-2 border-cyan-800 rounded-lg p-2 flex flex-col">
            <h3 className="text-lg font-bold text-cyan-400 mb-2 shrink-0">Quantum Circuit</h3>
            <div className="flex-grow relative min-h-0">
                {/* Render vertical layout for large screens, horizontal for smaller screens */}
                <div className="hidden lg:block w-full h-full">
                    <VerticalLayout circuitHistory={circuitHistory} />
                </div>
                <div className="block lg:hidden w-full h-full">
                    <HorizontalLayout circuitHistory={circuitHistory} />
                </div>
            </div>
        </div>
    );
};