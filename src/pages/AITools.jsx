import React, { useState } from 'react';
import { generateStudyMaterial } from '../services/aiService';
import { FiCpu, FiMessageSquare, FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const AITools = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    setResult('');
    setCopied(false);
    
    let prompt = '';
    if (type === 'summary') prompt = `Generate a comprehensive but concise summary for the topic: ${topic}. Structure it with bullet points if necessary.`;
    else if (type === 'questions') prompt = `Generate 5 practice questions for the topic: ${topic}. Include a mix of difficulty levels.`;
    else prompt = `Generate 3 flashcards for the topic: ${topic}. Format as 'Front: [Question/Term]' and 'Back: [Answer/Definition]'.`;

    try {
      const response = await generateStudyMaterial(prompt, type);
      setResult(response);
      toast.success('Material generated successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.info('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full p-8 w-full max-w-6xl mx-auto overflow-y-auto hide-scrollbar">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 tracking-tight flex items-center gap-3">
          <FiCpu className="text-indigo-600 dark:text-indigo-400" /> AI Study Assistant
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Generate summaries, practice questions, and flashcards instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-sm dark:shadow-gray-900/20 h-fit transition-colors duration-300">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">Study Topic</label>
              <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                placeholder="e.g. Binary Search Trees"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Generation Type</label>
              <div className="flex flex-col gap-3">
                {['summary', 'questions', 'flashcards'].map(t => (
                  <label key={t} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${type === t ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <input 
                      type="radio" 
                      name="type" 
                      value={t} 
                      checked={type === t} 
                      onChange={() => setType(t)} 
                      className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="capitalize font-semibold text-gray-800 dark:text-gray-200">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !topic.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white font-bold py-4 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 hover:-translate-y-0.5 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>Generate Material</>
              )}
            </button>
            <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 font-medium bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
              Uses AI to generate custom study content.
            </p>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] shadow-sm dark:shadow-gray-900/20 h-full min-h-[500px] flex flex-col overflow-hidden relative transition-colors duration-300">
            <div className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600 p-4 px-6 flex justify-between items-center backdrop-blur-sm z-10 relative">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FiMessageSquare className="text-indigo-500 dark:text-indigo-400" />
                Result Context
              </h3>
              {result && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white dark:bg-gray-600 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-500 shadow-sm hover:shadow active:scale-95"
                >
                  {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              {!result && !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
                  <FiCpu className="w-20 h-20 mb-6 text-gray-200 dark:text-gray-600" />
                  <p className="max-w-xs leading-relaxed font-medium">Enter a topic and select a generation type to create AI-powered study materials.</p>
                </div>
              ) : loading ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-3.5 h-3.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-5 animate-pulse tracking-wide">Consulting your AI tutor...</p>
                </div>
              ) : (
                <div className="prose prose-indigo dark:prose-invert max-w-none">
                  {result.split('\n').map((line, i) => (
                    <p key={i} className={`text-gray-700 dark:text-gray-300 leading-relaxed ${line.trim() === '' ? 'mb-4' : 'mb-1'} ${line.startsWith('Flashcard') || line.startsWith('Key') ? 'font-bold text-gray-900 dark:text-gray-100 mt-4' : ''}`}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
