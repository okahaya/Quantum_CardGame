
import React, { useState } from 'react';
import { GameSettings } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (settings: GameSettings) => void;
    initialSettings: GameSettings;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
    const [settings, setSettings] = useState<GameSettings>(initialSettings);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(settings);
    };
    
    const handleQubitCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(s => ({...s, qubitCount: parseInt(e.target.value, 10) }));
    };

    const handleViewModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(s => ({ ...s, cardViewMode: e.target.checked ? 'advanced' : 'basic' }));
    };
    
    const handleDebugModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(s => ({ ...s, debugMode: e.target.checked }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 border-2 border-cyan-500 rounded-lg p-6 md:p-8 shadow-2xl shadow-cyan-500/40 w-11/12 max-w-md text-white">
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-6 text-center">Settings</h2>

                {/* Qubit Count Slider */}
                <div className="mb-6">
                    <label htmlFor="qubit-slider" className="block text-lg mb-2">Qubit Count: <span className="font-bold text-cyan-300">{settings.qubitCount}</span></label>
                    <input
                        id="qubit-slider"
                        type="range"
                        min="2"
                        max="5"
                        value={settings.qubitCount}
                        onChange={handleQubitCountChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="w-full flex justify-between text-xs text-gray-400 mt-1">
                        <span>2</span><span>3</span><span>4</span><span>5</span>
                    </div>
                </div>

                {/* Card View Mode Toggle */}
                <div className="mb-6">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-lg">Advanced Card View <span className="text-sm text-gray-400">(Symbols only)</span></span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={settings.cardViewMode === 'advanced'} onChange={handleViewModeChange} />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.cardViewMode === 'advanced' ? 'transform translate-x-6 bg-cyan-400' : ''}`}></div>
                        </div>
                    </label>
                </div>
                
                 {/* Debug Mode Toggle */}
                <div className="mb-8">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-lg">Debug Mode</span>
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={settings.debugMode} onChange={handleDebugModeChange} />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${settings.debugMode ? 'transform translate-x-6 bg-cyan-400' : ''}`}></div>
                        </div>
                    </label>
                </div>
                
                <p className="text-xs text-center text-yellow-400 mb-4">Note: Changing settings will restart the current game.</p>
                
                <div className="flex justify-between gap-4">
                     <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-500 font-bold rounded-lg transition-transform transform hover:scale-105"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 font-bold rounded-lg transition-transform transform hover:scale-105"
                    >
                        Save & Restart
                    </button>
                </div>
            </div>
        </div>
    );
};
