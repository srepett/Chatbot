
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types';
import { UserIcon, GeminiIcon, LoadingIcon } from './Icons';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const isUser = message.role === 'user';

    const renderTextWithCursor = (text: string) => {
        if (text === '' && !isUser) {
            return <LoadingIcon className="w-6 h-6 text-gemini-cyan" />;
        }
        return (
             <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-p:text-gray-300 prose-li:text-gray-300 prose-headings:text-gray-200 prose-strong:text-gray-100">
                {text}
            </ReactMarkdown>
        );
    };

    return (
        <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
             {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gemini-cyan to-blue-500 flex items-center justify-center">
                    <GeminiIcon className="w-5 h-5 text-white" />
                </div>
            )}
            <div className={`max-w-xl p-4 rounded-xl ${isUser ? 'bg-blue-500/20 text-gray-200' : 'bg-gemini-dark-2'}`}>
                {message.image && (
                    <img src={message.image} alt="User upload" className="rounded-lg mb-2 max-w-xs" />
                )}
                {renderTextWithCursor(message.text)}
            </div>
            {isUser && (
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-300" />
                </div>
            )}
        </div>
    );
};
