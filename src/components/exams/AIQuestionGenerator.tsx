// 'use client';

// import { useState } from 'react';
// import { QuestionType } from '@/constants/enums';

// type AIQuestion = {
//     text: string;
//     options: { text: string; isCorrect: boolean }[];
// };

// export default function AIQuestionGenerator({
//     onAddQuestions,
// }: {
//     onAddQuestions: (questions: any[]) => void;
// }) {
//     const [topic, setTopic] = useState('');
//     const [count, setCount] = useState(5);
//     const [loading, setLoading] = useState(false);
//     const [generated, setGenerated] = useState<AIQuestion[]>([]);
//     const [selected, setSelected] = useState<number[]>([]);

//     /* ---------------- MOCK AI API ---------------- */
//     const generateQuestions = async () => {
//         if (!topic || count < 1) return;

//         setLoading(true);

//         // 🔴 Replace with real AI API later
//         const mock: AIQuestion[] = Array.from({ length: count }).map((_, i) => ({
//             text: `${topic} Question ${i + 1}`,
//             options: [
//                 { text: 'Option A', isCorrect: true },
//                 { text: 'Option B', isCorrect: false },
//                 { text: 'Option C', isCorrect: false },
//                 { text: 'Option D', isCorrect: false },
//             ],
//         }));

//         setTimeout(() => {
//             setGenerated(mock);
//             setSelected([]);
//             setLoading(false);
//         }, 800);
//     };

//     /* ---------------- ADD TO FORM ---------------- */
//     const addSelectedQuestions = () => {
//         const selectedQuestions = generated
//             .filter((_, idx) => selected.includes(idx))
//             .map(q => ({
//                 questionType: QuestionType.MCQ,
//                 text: q.text,
//                 marks: 1,
//                 options: q.options,
//             }));

//         onAddQuestions(selectedQuestions);
//         setGenerated([]);
//         setSelected([]);
//     };

//     return (
//         <section className="border rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-white">
//             <h2 className="text-lg font-semibold mb-4">
//                 🤖 AI Question Generator
//             </h2>


//             <div className="grid md:grid-cols-3 gap-4">
//                 <input
//                     placeholder="Enter topic (e.g. Fundamentals of Computer)"
//                     value={topic}
//                     onChange={e => setTopic(e.target.value)}
//                     className="border rounded-lg px-4 py-2.5"
//                 />

//                 <input
//                     type="number"
//                     min={1}
//                     value={count}
//                     onChange={e => setCount(+e.target.value)}
//                     className="border rounded-lg px-4 py-2.5"
//                 />

//                 <button
//                     onClick={generateQuestions}
//                     disabled={loading}
//                     className="rounded-lg bg-blue-600 text-white font-medium"
//                 >
//                     {loading ? 'Generating...' : 'Generate'}
//                 </button>
//             </div>


//             {generated.length > 0 && (
//                 <div className="mt-6 space-y-4">
//                     <h3 className="font-medium">Generated Questions</h3>

//                     {generated.map((q, idx) => (
//                         <div
//                             key={idx}
//                             className="border rounded-lg p-4 bg-white"
//                         >
//                             <label className="flex gap-3">
//                                 <input
//                                     type="checkbox"
//                                     checked={selected.includes(idx)}
//                                     onChange={() =>
//                                         setSelected(prev =>
//                                             prev.includes(idx)
//                                                 ? prev.filter(i => i !== idx)
//                                                 : [...prev, idx]
//                                         )
//                                     }
//                                 />
//                                 <span className="font-medium">{q.text}</span>
//                             </label>

//                             <ul className="ml-6 mt-2 list-disc text-sm text-gray-600">
//                                 {q.options.map((o, i) => (
//                                     <li key={i}>
//                                         {o.text}
//                                         {o.isCorrect && ' ✅'}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}

//                     <button
//                         onClick={addSelectedQuestions}
//                         disabled={selected.length === 0}
//                         className="mt-4 px-5 py-2 rounded-lg bg-green-600 text-white"
//                     >
//                         ➕ Add Selected Questions
//                     </button>
//                 </div>
//             )}
//         </section>
//     );
// }


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

            // Gemini sometimes wraps JSON in ```json
            const clean = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(clean);
        } catch (err) {
            console.error('Gemini generation error:', err);
            throw err;
        }
    }
    //     const generateQuestions = async () => {
    //         if (!topic || count < 1) {
    //             setError('Topic and question count required');
    //             return;
    //         }

    //         setError('');
    //         setLoading(true);

    //         try {
    //             const prompt = `
    // Generate ${count} multiple choice questions on topic "${topic}".

    // Rules:
    // - Output ONLY valid JSON
    // - No markdown
    // - No explanation
    // - Each question must have exactly 4 options
    // - Only one correct option per question

    // JSON format:
    // [
    //   {
    //     "text": "Question text",
    //     "options": [
    //       { "text": "Option A", "isCorrect": false },
    //       { "text": "Option B", "isCorrect": true },
    //       { "text": "Option C", "isCorrect": false },
    //       { "text": "Option D", "isCorrect": false }
    //     ]
    //   }
    // ]
    // `;

    //             const result = await geminiModel.generateContent(prompt);
    //             const response = result.response.text();

    //             const parsed: AIQuestion[] = JSON.parse(response);
    //             setQuestions(parsed);
    //             setSelected([]);
    //         } catch (err) {
    //             console.error(err);
    //             setError('Failed to generate questions');
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

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

                <button
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
