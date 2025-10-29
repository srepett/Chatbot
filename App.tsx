import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { GoogleGenAI } from '@google/genai';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ImageToCode } from './components/ImageToCode';
import type { Message, Model, Mode } from './types';
import { fileToGenerativePart } from './utils/fileUtils';

// Map display model names to actual API model names
const modelMapping: { [key in Model]: 'gemini-2.5-flash' | 'gemini-2.5-flash-lite' } = {
  'Zymzz-2.5-flash': 'gemini-2.5-flash',
  'Zymzz-1.0-Pro-Beta': 'gemini-2.5-flash-lite',
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<Model>('Zymzz-2.5-flash');
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const chatRef = useRef<Chat | null>(null);
  
  const aiRef = useRef<GoogleGenAI | null>(null);
  
  useEffect(() => {
    if (process.env.API_KEY) {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }, []);

  useEffect(() => {
    // Reset chat session when model changes or when switching to chat mode
    if (aiRef.current && mode === 'chat') {
        chatRef.current = aiRef.current.chats.create({
            model: modelMapping[model],
        });
        setMessages([]);
    }
  }, [model, mode]);


  const handleSendMessage = async (text: string, image: File | null) => {
    if (!text && !image) return;
    if (!chatRef.current) {
        alert("Gemini AI is not initialized. Please ensure your API key is set.");
        return;
    }

    setIsLoading(true);

    const userMessage: Message = {
      role: 'user',
      text: text,
      image: image ? URL.createObjectURL(image) : undefined,
    };
    setMessages((prev) => [...prev, userMessage]);

    const modelMessageId = Date.now();
    const modelMessage: Message = {
      id: modelMessageId,
      role: 'model',
      text: '',
    };
    setMessages((prev) => [...prev, modelMessage]);

    try {
        const promptParts: (string | { inlineData: { data: string; mimeType: string; } })[] = [text];
        if (image) {
            const imagePart = await fileToGenerativePart(image);
            promptParts.unshift(imagePart);
        }

        const result = await chatRef.current.sendMessageStream({ message: promptParts });

        let accumulatedText = '';
        for await (const chunk of result) {
            const chunkText = chunk.text;
            accumulatedText += chunkText;
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === modelMessageId ? { ...msg, text: accumulatedText } : msg
                )
            );
        }
    } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) =>
            prev.map((msg) =>
                msg.id === modelMessageId ? { ...msg, text: 'Sorry, something went wrong.' } : msg
            )
        );
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gemini-dark text-gray-200 font-sans">
      {!isChatStarted ? (
        <WelcomeScreen onStartChat={() => setIsChatStarted(true)} />
      ) : (
        <>
          <Header mode={mode} setMode={setMode} />
          {mode === 'chat' ? (
            <>
              <main className="flex-1 overflow-hidden">
                <ChatWindow 
                  messages={messages} 
                  isLoading={isLoading} 
                  onSendMessage={handleSendMessage}
                />
              </main>
              <div className="px-4 md:px-6 pb-4">
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isLoading={isLoading}
                  model={model}
                  setModel={setModel}
                />
              </div>
            </>
          ) : (
            <main className="flex-1 overflow-hidden">
              <ImageToCode ai={aiRef.current} />
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default App;