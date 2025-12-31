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
import { 
  Button, 
  Card, 
  Col, 
  Input, 
  InputNumber, 
  Row, 
  Space, 
  Typography, 
  Checkbox, 
  Divider, 
  message,
  Alert,
  Spin
} from 'antd';
import { 
  RobotOutlined, 
  SendOutlined, 
  PlusCircleOutlined, 
  CheckOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

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
    async function handleGenerate() {
        if (!topic) {
            message.warning('Please enter a topic first');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const prompt = `
                Generate ${count} MCQ questions on "${topic}".
                Return ONLY valid JSON.

                Rules:
                - Each question must have exactly 4 options
                - Only one correct option per question

                Format:
                {
                "questions": [
                    {
                    "text": "Question text?",
                    "options": [
                        { "text": "A", "isCorrect": false },
                        { "text": "B", "isCorrect": true },
                        { "text": "C", "isCorrect": false },
                        { "text": "D", "isCorrect": false }
                    ],
                    "marks": 1
                    }
                ]
                }
                `;

            const responseText = await generateWithGemini(prompt);
            const clean = responseText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(clean);
            
            if (parsed.questions) {
                setQuestions(parsed.questions);
                setSelected(parsed.questions.map((_: any, i: number) => i)); // Select all by default
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            console.error('Gemini generation error:', err);
            setError('Failed to generate questions. Please try again.');
            message.error('AI generation failed');
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
        message.success(`Added ${selectedQs.length} questions to exam`);
    };

    return (
        <Card 
            className="rounded-xl border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/20 dark:to-gray-800 dark:border-blue-900/50"
            title={
                <Space>
                    <RobotOutlined className="text-blue-600 dark:text-blue-400" />
                    <Title level={5} style={{ margin: 0 }} className="dark:text-gray-200">AI Question Generator (Gemini)</Title>
                </Space>
            }
        >
            <Row gutter={[16, 16]} align="bottom">
                <Col xs={24} md={14}>
                    <Text strong className="block mb-2 text-gray-600 dark:text-gray-400">Enter Topic or Subject</Text>
                    <Input
                        value={topic}
                        onChange={e => setTopic(e.target.value)}
                        placeholder="e.g. React Fundamentals, Python Basics..."
                        size="large"
                        prefix={<SendOutlined className="text-gray-400" />}
                        className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    />
                </Col>

                <Col xs={12} md={5}>
                    <Text strong className="block mb-2 text-gray-600 dark:text-gray-400">Question Count</Text>
                    <InputNumber
                        min={1}
                        max={10}
                        value={count}
                        onChange={val => setCount(val || 1)}
                        className="w-full dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                        size="large"
                    />
                </Col>

                <Col xs={12} md={5}>
                    <Button
                        type="primary"
                        icon={loading ? <Spin size="small" /> : <RobotOutlined />}
                        onClick={handleGenerate}
                        disabled={loading}
                        block
                        size="large"
                        className="bg-blue-600"
                    >
                        {loading ? 'Thinking...' : 'Generate'}
                    </Button>
                </Col>
            </Row>

            {error && (
                <Alert 
                    message={error} 
                    type="error" 
                    showIcon 
                    className="mt-4" 
                />
            )}

            {/* PREVIEW */}
            {questions.length > 0 && (
                <div className="mt-8">
                    <Divider titlePlacement="start">Generated Questions Preview</Divider>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {questions.map((q, i) => (
                            <Card 
                                key={i} 
                                size="small" 
                                className={`border-l-4 dark:bg-gray-800 ${selected.includes(i) ? 'border-l-blue-500 bg-blue-50/20 dark:bg-blue-900/20' : 'border-l-gray-300 dark:border-l-gray-700'}`}
                            >
                                <Checkbox
                                    checked={selected.includes(i)}
                                    onChange={() =>
                                        setSelected(prev =>
                                            prev.includes(i)
                                                ? prev.filter(x => x !== i)
                                                : [...prev, i]
                                        )
                                    }
                                >
                                    <Text strong className="dark:text-gray-200">{q.text}</Text>
                                </Checkbox>

                                <div className="mt-2 ml-6">
                                    <Row gutter={[12, 8]}>
                                        {q.options.map((o, idx) => (
                                            <Col span={12} key={idx}>
                                                <Space size="small">
                                                    <div className={`w-2 h-2 rounded-full ${o.isCorrect ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                    <Text type={o.isCorrect ? 'success' : 'secondary'} className="text-xs dark:text-gray-400">
                                                        {o.text} {o.isCorrect && <CheckOutlined className="text-[10px]" />}
                                                    </Text>
                                                </Space>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                        <Text type="secondary" className="dark:text-gray-400">
                            {selected.length} questions selected out of {questions.length}
                        </Text>
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={addSelected}
                            disabled={selected.length === 0}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Add {selected.length} Questions to Exam
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
