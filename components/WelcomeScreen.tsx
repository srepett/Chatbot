import React from 'react';
import { SparklesIcon } from './Icons';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="p-6 bg-gemini-dark-2/50 rounded-full mb-6 border-2 border-gemini-cyan/30 shadow-gemini">
        <SparklesIcon className="w-24 h-24 text-gemini-cyan animate-pulse" style={{ animationDuration: '2s' }}/>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4">
        Selamat Datang di Zymzz AI Studio
      </h1>
      <p className="max-w-2xl text-lg text-gray-400 mb-8">
        Terlibat dalam percakapan cerdas atau ubah desain visual menjadi kode. Ajukan pertanyaan, unggah gambar UI, atau jelajahi ide-ide dengan kekuatan Zymzz AI.
      </p>
      <button
        onClick={onStartChat}
        className="px-8 py-4 bg-gemini-cyan text-gemini-dark font-semibold text-lg rounded-full shadow-lg shadow-gemini-cyan/20 hover:bg-cyan-300 hover:shadow-xl hover:shadow-gemini-cyan/40 transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Mulai Membuat
      </button>
    </div>
  );
};