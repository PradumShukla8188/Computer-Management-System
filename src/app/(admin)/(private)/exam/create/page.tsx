'use client';

import { 
  Button, 
  Card, 
  Col, 
  DatePicker, 
  Form, 
  Input, 
  InputNumber, 
  Row, 
  Select, 
  Switch, 
  TimePicker, 
  Divider, 
  Space, 
  Typography,
  message,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  ArrowLeftOutlined, 
  InfoCircleOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { ExamMode, ExamType, QuestionType } from '@/constants/enums';
import AIQuestionGenerator from '@/components/exams/AIQuestionGenerator';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

/* -------------------- TYPES -------------------- */

type OptionForm = {
    text: string;
    isCorrect: boolean;
};

type QuestionForm = {
    questionType: QuestionType;
    text: string;
    marks: number;
    options: OptionForm[];
};

type ExamFormValues = {
    title: string;
    courseId: string;
    examDate: any;
    startTime: any;
    endTime: any;
    durationMinutes: number;
    totalMarks: number;
    passMarks: number;
    type: ExamType;
    mode: ExamMode;
    negativeMarking: boolean;
    negativeMarksPerQuestion?: number;
    questions: QuestionForm[];
};

/* -------------------- COMPONENT -------------------- */

export default function CreateExamPage() {
    const [form] = Form.useForm<ExamFormValues>();
    const router = useRouter();

    const onSubmit = (values: any) => {
        // Convert dates/times to string for payload
        const payload = {
            ...values,
            examDate: values.examDate?.format('YYYY-MM-DD'),
            startTime: values.startTime?.format('HH:mm'),
            endTime: values.endTime?.format('HH:mm'),
        };
        console.log('EXAM PAYLOAD 👉', payload);
        message.success('Exam created successfully! (Logged to console)');
    };

    const handleAddAIQuestions = (questions: QuestionForm[]) => {
        const currentQuestions = form.getFieldValue('questions') || [];
        form.setFieldsValue({
            questions: [...currentQuestions, ...questions],
        });
        message.success(`${questions.length} AI questions added!`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/exam">
                            <Button 
                                type="text" 
                                icon={<ArrowLeftOutlined />}
                                className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200"
                            />
                        </Link>
                        <div>
                            <Title level={2} style={{ margin: 0 }} className="dark:text-gray-100">Create New Exam</Title>
                            <Text type="secondary" className="dark:text-gray-400">Plan and configure your examination details</Text>
                        </div>
                    </div>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                    onValuesChange={(changedValues, allValues) => {
                        if (changedValues.startTime || changedValues.endTime) {
                            const { startTime, endTime } = allValues;
                            if (startTime && endTime) {
                                const diff = endTime.diff(startTime, 'minute');
                                form.setFieldsValue({ durationMinutes: diff > 0 ? diff : 0 });
                            }
                        }
                    }}
                    initialValues={{
                        negativeMarking: false,
                        type: ExamType.FINAL,
                        mode: ExamMode.SUBJECTIVE,
                        questions: [],
                    }}
                >
                    <Card className="rounded-xl shadow-sm border-gray-200 dark:bg-gray-800 dark:border-gray-700 mb-8">
                        {/* ---------------- EXAM DETAILS ---------------- */}
                        <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <BookOutlined style={{ fontSize: '20px' }} />
                           </div>
                           <Title level={4} style={{ margin: 0 }} className="dark:text-gray-200">Exam Details</Title>
                        </div>

                        <Row gutter={[24, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Exam Title"
                                    name="title"
                                    rules={[{ required: true, message: 'Exam title is required' }]}
                                >
                                    <Input placeholder="e.g. Mid-term Mathematics 2024" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Course ID"
                                    name="courseId"
                                    rules={[{ required: true, message: 'Course ID is required' }]}
                                >
                                    <Input placeholder="Enter Course ID" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Exam Date"
                                    name="examDate"
                                    rules={[{ required: true, message: 'Exam date is required' }]}
                                >
                                    <DatePicker className="w-full" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={12} md={8}>
                                <Form.Item
                                    label="Start Time"
                                    name="startTime"
                                    rules={[{ required: true, message: 'Start time required' }]}
                                >
                                    <TimePicker className="w-full" format="HH:mm" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={12} md={8}>
                                <Form.Item
                                    label="End Time"
                                    name="endTime"
                                    dependencies={['startTime']}
                                    rules={[
                                        { required: true, message: 'End time required' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const startTime = getFieldValue('startTime');
                                                if (!value || !startTime || value.isAfter(startTime)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('End time must be after start time'));
                                            },
                                        }),
                                    ]}
                                >
                                    <TimePicker className="w-full" format="HH:mm" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Duration (minutes)"
                                    name="durationMinutes"
                                    rules={[
                                        { required: true, message: 'Duration required' },
                                        { type: 'number', min: 1, message: 'Must be greater than 0' }
                                    ]}
                                >
                                    <InputNumber className="w-full" placeholder="60" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={12} md={8}>
                                <Form.Item
                                    label="Total Marks"
                                    name="totalMarks"
                                    rules={[{ required: true, message: 'Total marks required' }]}
                                >
                                    <InputNumber className="w-full" placeholder="100" size="large" />
                                </Form.Item>
                            </Col>

                            <Col xs={12} md={8}>
                                <Form.Item
                                    label="Pass Marks"
                                    name="passMarks"
                                    rules={[{ required: true, message: 'Pass marks required' }]}
                                >
                                    <InputNumber className="w-full" placeholder="33" size="large" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider style={{ margin: '12px 0 24px' }} />

                        <Row gutter={[24, 0]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Exam Type"
                                    name="type"
                                    rules={[{ required: true }]}
                                >
                                    <Select size="large">
                                        {Object.values(ExamType).map(v => (
                                            <Option key={v} value={v}>{v}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Exam Mode"
                                    name="mode"
                                    rules={[{ required: true }]}
                                >
                                    <Select size="large">
                                        {Object.values(ExamMode).map(v => (
                                            <Option key={v} value={v}>{v}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mt-4 border border-gray-100 dark:border-gray-700">
                            <Row align="middle" justify="space-between">
                                <Col>
                                    <Space size="middle">
                                        <Text strong className="dark:text-gray-300">Enable Negative Marking</Text>
                                        <Form.Item name="negativeMarking" valuePropName="checked" noStyle>
                                            <Switch />
                                        </Form.Item>
                                    </Space>
                                </Col>
                                <Form.Item noStyle shouldUpdate={(prev, curr) => prev.negativeMarking !== curr.negativeMarking}>
                                    {({ getFieldValue }) => 
                                        getFieldValue('negativeMarking') && (
                                            <Col xs={24} sm={12} md={8} className="mt-4 sm:mt-0">
                                                <Form.Item
                                                    label="Negative Marks / Question"
                                                    name="negativeMarksPerQuestion"
                                                    rules={[
                                                        { required: true, message: 'Required' },
                                                        { type: 'number', min: 0, message: 'Cannot be negative' }
                                                    ]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <InputNumber className="w-full" size="large" />
                                                </Form.Item>
                                            </Col>
                                        )
                                    }
                                </Form.Item>
                            </Row>
                        </div>
                    </Card>

                    {/* ---------------- AI QUESTION GENERATOR ---------------- */}
                    <div className="mb-8">
                        <AIQuestionGenerator onAddQuestions={handleAddAIQuestions} />
                    </div>

                    {/* ---------------- QUESTIONS ---------------- */}
                    <Card className="rounded-xl shadow-sm border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                    <QuestionCircleOutlined style={{ fontSize: '20px' }} />
                                </div>
                                <Title level={4} style={{ margin: 0 }} className="dark:text-gray-200">Question Bank</Title>
                            </div>
                        </div>

                        <Form.List name="questions">
                            {(fields, { add, remove }) => (
                                <>
                                    <div className="space-y-6">
                                        {fields.map(({ key, name, ...restField }, index) => (
                                            <QuestionBlock
                                                key={key}
                                                name={name}
                                                restField={restField}
                                                index={index}
                                                remove={remove}
                                            />
                                        ))}
                                    </div>

                                    <Button
                                        type="dashed"
                                        onClick={() => add({
                                            questionType: QuestionType.MCQ,
                                            text: '',
                                            marks: 1,
                                            options: [],
                                        })}
                                        block
                                        icon={<PlusOutlined />}
                                        size="large"
                                        className="mt-6 border-blue-400 text-blue-600 hover:text-blue-700 hover:border-blue-500"
                                        style={{ height: '50px' }}
                                    >
                                        Add New Question Manually
                                    </Button>
                                </>
                            )}
                        </Form.List>
                    </Card>

                    {/* ---------------- SUBMIT ---------------- */}
                    <div className="flex justify-end mt-10 mb-20">
                        <Space size="large">
                            <Button size="large" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                className="bg-green-600 hover:bg-green-700 px-10"
                                style={{ height: '48px' }}
                            >
                                Publish Exam
                            </Button>
                        </Space>
                    </div>
                </Form>
            </div>
        </div>
    );
}

/* -------------------- QUESTION BLOCK -------------------- */

function QuestionBlock({ name, restField, index, remove }: any) {
    return (
        <Card 
            size="small"
            className="border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 transition-colors shadow-sm"
            style={{ borderRadius: '12px' }}
        >
            <div className="flex justify-between items-center mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Space>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                        {index + 1}
                    </div>
                    <Text strong className="dark:text-gray-200">Question Details</Text>
                </Space>
                <Popconfirm
                    title="Delete this question?"
                    onConfirm={() => remove(name)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        className="hover:bg-red-50"
                    >
                        Remove
                    </Button>
                </Popconfirm>
            </div>

            <Row gutter={[16, 0]}>
                <Col span={24}>
                    <Form.Item
                        {...restField}
                        name={[name, 'text']}
                        rules={[{ required: true, message: 'Question text required' }]}
                    >
                        <Input.TextArea 
                            placeholder="Type your question here..." 
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Form.Item
                        {...restField}
                        label="Question Type"
                        name={[name, 'questionType']}
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Option value={QuestionType.MCQ}>Multiple Choice (MCQ)</Option>
                            <Option value={QuestionType.TYPING}>Typing Based</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={6}>
                    <Form.Item
                        {...restField}
                        label="Marks"
                        name={[name, 'marks']}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <InputNumber min={1} className="w-full" />
                    </Form.Item>
                </Col>
            </Row>

            <Divider style={{ margin: '12px 0' }} dashed />

            {/* OPTIONS */}
            <Form.Item label={<Text strong>Options & Answers</Text>}>
                <Form.List name={[name, 'options']}>
                    {(fields, { add, remove: removeOpt }) => (
                        <div className="space-y-3">
                            {fields.map((optField, i) => (
                                <Row key={optField.key} gutter={12} align="middle">
                                    <Col flex="auto">
                                        <Form.Item
                                            {...optField}
                                            name={[optField.name, 'text']}
                                            rules={[{ required: true, message: 'Option text required' }]}
                                            noStyle
                                        >
                                            <Input 
                                                placeholder={`Option ${i + 1}`} 
                                                className="rounded-lg" 
                                                prefix={<Text type="secondary">{String.fromCharCode(65 + i)}.</Text>}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Form.Item
                                            {...optField}
                                            name={[optField.name, 'isCorrect']}
                                            valuePropName="checked"
                                            noStyle
                                        >
                                            <Tooltip title="Mark as Correct Answer">
                                                <Switch 
                                                    checkedChildren={<CheckCircleOutlined />} 
                                                    unCheckedChildren="✗"
                                                    defaultChecked={false}
                                                />
                                            </Tooltip>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button 
                                            type="text" 
                                            danger 
                                            icon={<DeleteOutlined />} 
                                            onClick={() => removeOpt(optField.name)}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Button
                                type="default"
                                onClick={() => add({ text: '', isCorrect: false })}
                                icon={<PlusOutlined />}
                                size="small"
                                className="mt-2 text-blue-600 border-blue-200"
                            >
                                Add Option
                            </Button>
                        </div>
                    )}
                </Form.List>
            </Form.Item>
        </Card>
    );
}
