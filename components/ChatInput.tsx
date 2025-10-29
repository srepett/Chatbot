import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon, SparklesIcon, ChevronDownIcon } from './Icons';
import type { Model } from '../types';

interface ChatInputProps {
    onSendMessage: (text: string, image: File | null) => void;
    isLoading: boolean;
    model: Model;
    setModel: (model: Model) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, model, setModel }) => {
    const [text, setText] = useState('');
    const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const models: Model[] = ['Zymzz-2.5-flash', 'Zymzz-1.0-Pro-Beta'];

    const handleModelSelect = (selectedModel: Model) => {
        setModel(selectedModel);
        setIsDropdownOpen(false);
    }

    useEffect(() => {
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    const handleSend = () => {
        if (isLoading || (!text.trim() && !image)) return;
        onSendMessage(text.trim(), image?.file || null);
        setText('');
        setImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage({ file, preview: URL.createObjectURL(file) });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-start mb-2">
                 <div className="relative inline-block">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gemini-dark-2 rounded-md hover:bg-gray-700 transition-colors duration-200 shadow-gemini-light text-xs"
                    >
                        <SparklesIcon className="w-4 h-4 text-gemini-cyan" />
                        <span className="font-medium">{model}</span>
                        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute bottom-full mb-2 w-48 bg-gemini-dark-2 rounded-md shadow-lg z-10 border border-gray-700/50 origin-bottom">
                            <ul className="py-1">
                                {models.map((m) => (
                                    <li key={m}>
                                        <button
                                            onClick={() => handleModelSelect(m)}
                                            className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
                                        >
                                            {m}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {image && (
                <div className="relative inline-block mb-2 ml-14">
                    <img src={image.preview} alt="Preview" className="h-20 w-20 object-cover rounded-md" />
                    <button
                        onClick={() => setImage(null)}
                        className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-0.5 text-gray-300 hover:text-white"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
            <div className="relative flex items-end gap-2 p-2 bg-gemini-dark-2 rounded-2xl border border-gray-700/60 shadow-gemini focus-within:shadow-gemini-light focus-within:border-gemini-cyan/50 transition-all duration-300">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-400 hover:text-gemini-cyan rounded-full transition-colors"
                    aria-label="Attach image"
                >
                    <PaperClipIcon className="w-6 h-6" />
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                </button>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a prompt here..."
                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 resize-none focus:outline-none max-h-48"
                    rows={1}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || (!text.trim() && !image)}
                    className="p-2 rounded-full bg-gemini-cyan text-gemini-dark disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send message"
                >
                    <PaperAirplaneIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};