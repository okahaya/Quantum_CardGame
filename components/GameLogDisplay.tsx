
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface GameLogDisplayProps {
    log: LogEntry[];
    awaitingTargetPrompt: string | undefined;
    t: (key: string, params?: any) => string;
}

export const GameLogDisplay: React.FC<GameLogDisplayProps> = ({ log, awaitingTargetPrompt, t }) => {
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [log, awaitingTargetPrompt]);

    return (
        <div className="w-full h-full bg-gray-900 border-2 border-cyan-800 rounded-lg p-2 flex flex-col">
            <h3 className="text-lg font-bold text-cyan-400 mb-2 shrink-0">{t('logScreen.title')}</h3>
            <div ref={logContainerRef} className="text-sm overflow-y-auto flex-grow pr-2">
                {log.map((entry, index) => <p key={index} className="text-gray-300 mb-1">{t(entry.key, entry.params)}</p>)}
                 {awaitingTargetPrompt && (
                    <p className="text-yellow-300 font-bold animate-pulse mt-2">{awaitingTargetPrompt}</p>
                 )}
            </div>
        </div>
    )
};
