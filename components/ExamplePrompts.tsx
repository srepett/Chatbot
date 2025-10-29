import React from 'react';
import { SparklesIcon } from './Icons';

interface ExamplePromptsProps {
  title: string;
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ title, prompts, onPromptClick }) => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="w-6 h-6 text-gemini-cyan" />
        <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(prompt)}
            className="p-4 bg-gemini-dark-2 rounded-lg text-left hover:bg-gray-800/80 transition-colors duration-200 border border-gray-700/60"
          >
            <p className="text-sm text-gray-300">{prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
