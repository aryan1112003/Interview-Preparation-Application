import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Download } from 'lucide-react';
import type { Question } from '../types';
import { generateFeedback } from '../lib/gemini';
import ReactMarkdown from 'react-markdown';

interface Props {
  questions: Question[];
  onComplete: () => void;
}

export default function InterviewSession({ questions, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { answer: string; feedback: string }>>({});

  const currentQuestion = questions[currentIndex];

  const handleNext = async () => {
    if (!userAnswer.trim()) return;

    setIsSubmitting(true);
    try {
      const feedbackText = await generateFeedback(currentQuestion.question, userAnswer);
      setFeedback(feedbackText);
      setAnswers({
        ...answers,
        [currentIndex]: { answer: userAnswer, feedback: feedbackText }
      });
    } catch (error) {
      console.error('Failed to generate feedback:', error);
    }
    setIsSubmitting(false);
  };

  const handleContinue = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
      setFeedback('');
      setShowModelAnswer(false);
    } else {
      onComplete();
    }
  };

  const handleExport = () => {
    const content = questions.map((q, index) => {
      const answerData = answers[index];
      return `
# Question ${index + 1}:
${q.question}

## Your Answer:
${answerData?.answer || 'Not answered'}

## Feedback:
${answerData?.feedback || 'No feedback available'}

${showModelAnswer ? `## Model Answer:
${q.modelAnswer || 'No model answer available'}

---` : ''}
`
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-session.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Question {currentIndex + 1} of {questions.length}</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Download className="w-4 h-4" />
            Export Session
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-full h-32 p-3 border rounded resize-none"
          placeholder="Type your answer here..."
          disabled={!!feedback}
        />

        {!feedback && (
          <button
            onClick={handleNext}
            disabled={!userAnswer.trim() || isSubmitting}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answer'}
          </button>
        )}

        {feedback && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4" />
                Feedback
              </h4>
              <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>

            <button
              onClick={() => setShowModelAnswer(!showModelAnswer)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showModelAnswer ? 'Hide' : 'Show'} Model Answer
            </button>

            {showModelAnswer && currentQuestion.modelAnswer && (
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Model Answer
                </h4>
                <ReactMarkdown>{currentQuestion.modelAnswer}</ReactMarkdown>
              </div>
            )}

            <button
              onClick={handleContinue}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Session'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}