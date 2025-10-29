import React, { useState, useCallback } from 'react';
import type { GoogleGenAI } from '@google/genai';
import { useDropzone } from 'react-dropzone';
import { fileToGenerativePart } from '../utils/fileUtils';
import { EyeIcon, CodeBracketIcon, ClipboardIcon, ArrowPathIcon, SparklesIcon, PhotoIcon, LightBulbIcon } from './Icons';

interface ImageToCodeProps {
    ai: GoogleGenAI | null;
}

type Tab = 'preview' | 'code';

export const ImageToCode: React.FC<ImageToCodeProps> = ({ ai }) => {
    const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
    const [generatedCode, setGeneratedCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('preview');
    const [copySuccess, setCopySuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const file = acceptedFiles[0];
            setImage({ file, preview: URL.createObjectURL(file) });
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp'] },
        multiple: false
    });
    
    const examples = [
        { name: 'Formulir Login', imageUrl: 'https://placehold.co/300x200/1e1f20/00ddff/png?text=Formulir+Login' },
        { name: 'Kartu Produk', imageUrl: 'https://placehold.co/300x200/1e1f20/00ddff/png?text=Kartu+Produk' },
        { name: 'Profil Pengguna', imageUrl: 'https://placehold.co/300x200/1e1f20/00ddff/png?text=Profil+Pengguna' },
    ];

    const handleGenerateCode = async () => {
        if (!image || !ai) {
            setError('Please upload an image and ensure AI is initialized.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedCode('');

        try {
            const imagePart = await fileToGenerativePart(image.file);
            const prompt = "You are an expert web developer. Your task is to convert the given image into a single, self-contained HTML file. Use inline CSS and JavaScript to replicate the design and functionality shown in the image. Your response should ONLY be the raw HTML code, without any extra explanations, comments, or markdown formatting like ```html.";
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, { text: prompt }] },
            });

            setGeneratedCode(response.text);

        } catch (e) {
            console.error(e);
            setError('Failed to generate code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(generatedCode).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleStartOver = () => {
        setImage(null);
        setGeneratedCode('');
        setError(null);
        setActiveTab('preview');
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <div className="p-4 bg-gemini-dark-2/50 rounded-full mb-4 border border-gemini-cyan/20">
                    <SparklesIcon className="w-16 h-16 text-gemini-cyan animate-pulse" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-200">Generating your code...</h2>
                <p className="mt-2">The AI is analyzing the image and building your web page.</p>
            </div>
        );
    }
    
    if (generatedCode) {
        const activeTabClass = 'bg-gemini-dark-2 text-gemini-cyan';
        const inactiveTabClass = 'text-gray-400 hover:bg-gemini-dark-2/50 hover:text-gray-200';
        return (
            <div className="flex h-full p-4 md:p-6 gap-6">
                <div className="w-1/4 flex flex-col gap-4">
                     <h2 className="text-lg font-semibold text-gray-200">Original Image</h2>
                    <img src={image?.preview} alt="Uploaded design" className="rounded-lg border-2 border-gray-700/50 object-contain"/>
                    <button
                        onClick={handleStartOver}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-700/80 text-gray-200 rounded-md hover:bg-gray-600 transition-colors"
                    >
                        <ArrowPathIcon className="w-5 h-5"/>
                        Start Over
                    </button>
                </div>
                <div className="w-3/4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                         <div className="p-1 bg-gemini-dark/50 rounded-lg border border-gray-700/50 flex items-center space-x-1">
                            <button onClick={() => setActiveTab('preview')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 ${activeTab === 'preview' ? activeTabClass : inactiveTabClass}`}>
                                <EyeIcon className="w-5 h-5" />
                                Preview
                            </button>
                            <button onClick={() => setActiveTab('code')} className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-200 ${activeTab === 'code' ? activeTabClass : inactiveTabClass}`}>
                                <CodeBracketIcon className="w-5 h-5" />
                                Code
                            </button>
                        </div>
                        {activeTab === 'code' && (
                             <button onClick={handleCopyCode} className="flex items-center gap-2 px-3 py-1.5 bg-gemini-dark-2 rounded-md hover:bg-gray-700 transition-colors duration-200 text-xs text-gray-300">
                                <ClipboardIcon className="w-4 h-4"/>
                                {copySuccess ? 'Copied!' : 'Copy Code'}
                            </button>
                        )}
                    </div>
                   
                    <div className="flex-1 bg-gemini-dark-2 rounded-lg border border-gray-700/50 overflow-hidden">
                        {activeTab === 'preview' ? (
                            <iframe srcDoc={generatedCode} title="Preview" className="w-full h-full bg-white" sandbox="allow-scripts"/>
                        ) : (
                            <pre className="h-full overflow-auto p-4 text-sm"><code className="language-html">{generatedCode}</code></pre>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col items-center justify-center p-4 md:p-6 text-center">
            <div className="max-w-3xl w-full">
                <div 
                    {...getRootProps()} 
                    className={`p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-gemini-cyan bg-gemini-dark-2/50' : 'border-gray-600 hover:border-gray-500'}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center text-gray-400">
                         <PhotoIcon className="w-16 h-16 mb-4"/>
                        {image ? (
                           <>
                             <img src={image.preview} alt="Preview" className="max-h-48 rounded-lg mb-4 border border-gray-700"/>
                             <p className="font-semibold text-gray-300">{image.file.name}</p>
                             <p className="text-sm">Drag another image or click to replace</p>
                           </>
                        ) : (
                           <>
                             <h2 className="text-xl font-semibold text-gray-200">Drag & drop an image here</h2>
                             <p className="mt-2">or click to select a file</p>
                             <p className="text-xs mt-4 text-gray-500">PNG, JPG, GIF, WEBP supported</p>
                           </>
                        )}
                    </div>
                </div>

                <div className="mt-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <LightBulbIcon className="w-6 h-6 text-gemini-cyan" />
                        <h3 className="text-lg font-semibold text-gray-200">Studi Kasus</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {examples.map((example, index) => (
                            <div key={index} className="p-3 bg-gemini-dark-2 rounded-lg border border-gray-700/60">
                                <img src={example.imageUrl} alt={example.name} className="rounded-md w-full h-auto object-cover mb-2" />
                                <p className="text-sm text-gray-300">{example.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                 {error && <p className="text-red-500 mt-4">{error}</p>}
                <button
                    onClick={handleGenerateCode}
                    disabled={!image || isLoading}
                    className="mt-8 px-8 py-4 bg-gemini-cyan text-gemini-dark font-semibold text-lg rounded-full shadow-lg shadow-gemini-cyan/20 hover:bg-cyan-300 hover:shadow-xl hover:shadow-gemini-cyan/40 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                    <span className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6"/>
                        Generate Code
                    </span>
                </button>
            </div>
        </div>
    );
};