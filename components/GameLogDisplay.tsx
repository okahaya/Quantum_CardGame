import React, { useEffect, useRef } from 'react';

interface GameLogDisplayProps {
    log: string[];
    awaitingTargetPrompt: string | undefined;
}

export const GameLogDisplay: React.FC<GameLogDisplayProps> = ({ log, awaitingTargetPrompt }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [log, awaitingTargetPrompt]);

    return (
        <div className="w-full h-full bg-gray-900 border-2 border-cyan-800 rounded-lg p-2 flex flex-col">
            <h3 className="text-lg font-bold text-cyan-400 mb-2 shrink-0">Game Log</h3>
            <div ref={logContainerRef} className="text-sm overflow-y-auto flex-grow pr-2">
                {log.map((entry, index) => <p key={index} className="text-gray-300 mb-1">{entry}</p>)}
                 {awaitingTargetPrompt && (
                    <p className="text-yellow-300 font-bold animate-pulse mt-2">{awaitingTargetPrompt}</p>
                 )}
            </div>
        </div>
    )
};