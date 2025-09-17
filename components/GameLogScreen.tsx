
import React, { useState } from 'react';

interface GameLogScreenProps {
    log: string[];
    isDebugMode: boolean;
    onBack: () => void;
}

export const GameLogScreen: React.FC<GameLogScreenProps> = ({ log, isDebugMode, onBack }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const logText = log.join('\n');
        navigator.clipboard.writeText(logText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono flex flex-col items-center p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="relative z-10 text-center w-full max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-widest mb-6" style={{ textShadow: '0 0 15px #06b6d4' }}>
                    Game Log
                </h1>

                <div className="bg-gray-800 bg-opacity-70 border-2 border-cyan-700 rounded-lg p-4 h-[70vh] overflow-y-auto text-left mb-6">
                    {log.map((entry, index) => {
                        const isTurnMarker = entry.toLowerCase().includes('turn ');
                        return (
                            <p 
                                key={index} 
                                className={`mb-1 ${isTurnMarker ? 'font-bold text-cyan-300 mt-2' : 'text-gray-300 pl-2'}`}
                            >
                                {entry}
                            </p>
                        )
                    })}
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-48 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        Back to Home
                    </button>
                    {isDebugMode && (
                        <button
                            onClick={handleCopy}
                            className={`w-48 px-6 py-3 text-white text-lg font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg ${copied ? 'bg-green-600' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                        >
                            {copied ? 'Copied!' : 'Copy Log'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
