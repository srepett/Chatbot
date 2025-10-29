import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { MessageItem } from './MessageItem';
import { SparklesIcon } from './Icons';
import { ExamplePrompts } from './ExamplePrompts';

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (text: string, image: File | null) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    const examplePrompts = [
        "Tulis puisi tentang hujan di kota metropolitan",
        "Jelaskan konsep black hole kepada anak usia 10 tahun",
        "Buat rencana perjalanan 3 hari untuk liburan di Bali",
        "Berikan saya 5 ide resep makan malam sehat dan cepat",
    ];

    return (
        <div className="h-full overflow-y-auto p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col justify-center h-full text-gray-400">
                        <div className="text-center mb-12">
                           <div className="inline-block p-4 bg-gemini-dark-2/50 rounded-full mb-4 border border-gemini-cyan/20">
                               <SparklesIcon className="w-16 h-16 text-gemini-cyan animate-pulse"/>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-200">Hello there!</h2>
                            <p className="mt-2">How can I help you today?</p>
                        </div>
                        <ExamplePrompts 
                            title="Try these prompts"
                            prompts={examplePrompts}
                            onPromptClick={(prompt) => onSendMessage(prompt, null)}
                        />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {messages.map((message, index) => (
                            <MessageItem key={index} message={message} />
                        ))}
                        {isLoading && messages[messages.length - 1]?.role !== 'model' && (
                             <MessageItem message={{role: 'model', text: ''}} />
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};