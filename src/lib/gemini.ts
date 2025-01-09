import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('Your Api Here');

export async function generateQuestions(settings: InterviewSettings): Promise<Question[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are an expert interviewer. Generate 5 interview questions for a ${settings.seniority} level ${settings.jobTitle} position.
    Role type: ${settings.jobRole}
    Categories: ${settings.categories.join(', ')}
    Difficulty: ${settings.difficultyLevel}
    Required skills: ${settings.skills.join(', ')}
    
    Respond ONLY with a JSON array of objects. Each object must have exactly these properties:
    - question: the interview question
    - modelAnswer: an excellent answer to the question
    
    Example format:
    [
      {
        "question": "What is...",
        "modelAnswer": "A good answer would be..."
      }
    ]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to extract JSON from the response if it's wrapped in other text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON array found, try parsing the whole response
    try {
      return JSON.parse(text);
    } catch {
      // If parsing fails, format the response manually
      const fallbackQuestions = [
        {
          question: "There was an error generating specific questions. Please try again.",
          modelAnswer: "Please try adjusting your settings and generating new questions."
        }
      ];
      return fallbackQuestions;
    }
  } catch (error) {
    console.error('Failed to generate questions:', error);
    return [];
  }
}

export async function generateFeedback(question: string, answer: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `As an expert interviewer, analyze this interview answer:

    Question: ${question}
    Answer: ${answer}
    
    Provide brief, constructive feedback in markdown format covering:
    1. Clarity and structure
    2. Relevance to the question
    3. Areas for improvement
    
    Keep the feedback concise, actionable, and encouraging.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Failed to generate feedback:', error);
    return "I apologize, but I couldn't generate feedback at this moment. Please try again.";
  }
}