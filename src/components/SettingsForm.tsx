import React from 'react';
import { Settings, Brain, BookOpen } from 'lucide-react';
import type { InterviewSettings } from '../types';

interface Props {
  onSubmit: (settings: InterviewSettings) => void;
}

export default function SettingsForm({ onSubmit }: Props) {
  const [settings, setSettings] = React.useState<InterviewSettings>({
    jobTitle: '',
    jobRole: 'tech',
    categories: ['technical'],
    difficultyLevel: 'intermediate',
    seniority: 'mid',
    skills: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="flex items-center space-x-2">
        <Settings className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Interview Settings</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            type="text"
            value={settings.jobTitle}
            onChange={(e) => setSettings({ ...settings, jobTitle: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role Type</label>
          <select
            value={settings.jobRole}
            onChange={(e) => setSettings({ ...settings, jobRole: e.target.value as 'tech' | 'non-tech' })}
            className="w-full p-2 border rounded"
          >
            <option value="tech">Technical</option>
            <option value="non-tech">Non-Technical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Question Categories</label>
          <div className="space-y-2">
            {['technical', 'behavioral', 'hr'].map((category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.categories.includes(category as any)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...settings.categories, category]
                      : settings.categories.filter((c) => c !== category);
                    setSettings({ ...settings, categories: newCategories as any[] });
                  }}
                />
                <span className="capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Difficulty Level</label>
          <select
            value={settings.difficultyLevel}
            onChange={(e) => setSettings({ ...settings, difficultyLevel: e.target.value as any })}
            className="w-full p-2 border rounded"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Seniority Level</label>
          <select
            value={settings.seniority}
            onChange={(e) => setSettings({ ...settings, seniority: e.target.value as any })}
            className="w-full p-2 border rounded"
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
          <input
            type="text"
            value={settings.skills.join(', ')}
            onChange={(e) => setSettings({ ...settings, skills: e.target.value.split(',').map(s => s.trim()) })}
            className="w-full p-2 border rounded"
            placeholder="e.g., React, TypeScript, Node.js"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Generate Questions
      </button>
    </form>
  );
}