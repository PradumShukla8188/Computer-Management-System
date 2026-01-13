'use client';

import { useState } from 'react';
import { generateWithGemini } from '@/lib/gemini';
import { QuestionType } from '@/constants/enums';

type AIQuestion = {
    text: string;
    options: { text: string; isCorrect: boolean }[];
};

export default function AIQuestionGenerator({
    onAddQuestions,
}: {
    onAddQuestions: (questions: any[]) => void;
}) {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<AIQuestion[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [error, setError] = useState('');

    /* ---------------- GEMINI CALL ---------------- */
    async function generateQuestions(topic: string, count: number) {
        try {
            const prompt = `
                Generate ${count} MCQ questions on "${topic}".
                Return ONLY valid JSON.

                Format:
                {
                "questions": [
                    {
                    "text": "Question?",
                    "options": [
                        { "text": "A", "isCorrect": false },
                        { "text": "B", "isCorrect": true }
                    ],
                    "marks": 1
                    }
                ]
                }
                `;

            const responseText = await generateWithGemini(prompt);

            const clean = responseText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);
            if (!parsed.questions || !Array.isArray(parsed.questions)) {
                throw new Error('Invalid AI response format');
            }

            setQuestions(parsed.questions);
            setSelected([]);
        } catch (err) {
            console.error('Gemini generation error:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }

    /* ---------------- ADD TO FORM ---------------- */
    const addSelected = () => {
        const selectedQs = questions
            .filter((_, i) => selected.includes(i))
            .map(q => ({
                questionType: QuestionType.MCQ,
                text: q.text,
                marks: 1,
                options: q.options,
            }));

        onAddQuestions(selectedQs);
        setQuestions([]);
        setSelected([]);
    };

    return (
        <section className="rounded-2xl border p-6 bg-gradient-to-br from-blue-50 to-white">
            <h2 className="text-lg font-semibold mb-4">
                🤖 AI Question Generator (Gemini)
            </h2>

            {/* INPUT */}
            <div className="grid md:grid-cols-3 gap-4">
                <input
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="Topic (e.g. Fundamentals of Computer)"
                    className="border rounded-lg px-4 py-2.5"
                />

                <input
                    type="number"
                    min={1}
                    value={count}
                    onChange={e => setCount(+e.target.value)}
                    className="border rounded-lg px-4 py-2.5"
                />

                <button type='button'
                    onClick={generateQuestions.bind(null, topic, count)}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                    {loading ? 'Generating...' : 'Generate'}
                </button>
            </div>

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            {/* PREVIEW */}
            {questions.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="font-medium">Generated Questions</h3>

                    {questions.map((q, i) => (
                        <div key={i} className="border rounded-lg p-4 bg-white">
                            <label className="flex gap-3">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(i)}
                                    onChange={() =>
                                        setSelected(prev =>
                                            prev.includes(i)
                                                ? prev.filter(x => x !== i)
                                                : [...prev, i]
                                        )
                                    }
                                />
                                <span className="font-medium">{q.text}</span>
                            </label>

                            <ul className="ml-6 mt-2 list-disc text-sm text-gray-600">
                                {q.options.map((o, idx) => (
                                    <li key={idx}>
                                        {o.text} {o.isCorrect && '✅'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <button
                        onClick={addSelected}
                        disabled={selected.length === 0}
                        className="mt-4 px-5 py-2 rounded-lg bg-green-600 text-white"
                    >
                        ➕ Add Selected Questions
                    </button>
                </div>
            )}
        </section>
    );
}
