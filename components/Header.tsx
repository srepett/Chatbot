import React from 'react';
import type { Mode } from '../types';
import { ChatBubbleLeftIcon, CodeBracketIcon } from './Icons';

interface HeaderProps {
    mode: Mode;
    setMode: (mode: Mode) => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
    const activeClass = 'bg-gemini-dark-2 text-gemini-cyan shadow-gemini-light';
    const inactiveClass = 'bg-transparent text-gray-400 hover:bg-gemini-dark-2/50 hover:text-gray-200';

    return (
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h1 className="text-xl font-semibold text-gray-200">Zymzz AI Studio</h1>

            <div className="p-1 bg-gemini-dark/50 rounded-lg border border-gray-700/50 flex items-center space-x-1">
                <button 
                    onClick={() => setMode('chat')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 ${mode === 'chat' ? activeClass : inactiveClass}`}
                >
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    Chat
                </button>
                <button 
                    onClick={() => setMode('imageToCode')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 ${mode === 'imageToCode' ? activeClass : inactiveClass}`}
                >
                    <CodeBracketIcon className="w-5 h-5" />
                    Image to Code
                </button>
            </div>
        </header>
    );
};