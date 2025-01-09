import React, { useState } from 'react';
import { Brain, Github, Linkedin } from 'lucide-react';
import type { InterviewSettings, Question } from './types';
import { generateQuestions } from './lib/gemini';
import SettingsForm from './components/SettingsForm';
import InterviewSession from './components/InterviewSession';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSettingsSubmit = async (settings: InterviewSettings) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateQuestions(settings);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError('Failed to generate questions. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleSessionComplete = () => {
    setQuestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Interview Prep AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/aryan1112003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/aryan-acharya-9b939b316/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-500 text-right">
            Created by Aryan Acharya
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating questions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        ) : questions.length > 0 ? (
          <InterviewSession
            questions={questions}
            onComplete={handleSessionComplete}
          />
        ) : (
          <SettingsForm onSubmit={handleSettingsSubmit} />
        )}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Interview Prep AI. All rights reserved.</p>
            <p className="mt-1">Designed and developed by Aryan Acharya</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;