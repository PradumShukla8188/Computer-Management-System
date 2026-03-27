'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    X,
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Link2,
    Quote,
    Code,
    Undo2,
    Redo2,
    Trash2,
    Eye,
    EyeOff,
} from 'lucide-react';

// Types
interface CMSPageForm {
    id?: string;
    name: string;
    slug: string;
    description: string;
    content: string;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    status: 'active' | 'inactive';
    isActive: boolean;
}

interface EditorState {
    content: string;
    history: string[];
    historyIndex: number;
}

// Dummy data for edit mode
const DUMMY_PAGE: CMSPageForm = {
    id: '1',
    name: 'Home Page',
    slug: 'home-page',
    description: 'Main landing page with hero section',
    content: `<h2>Welcome to Our Website</h2>
<p>This is the <strong>home page</strong> content with <em>rich text editing</em> capabilities.</p>
<p>You can use all formatting options available in the editor.</p>`,
    metaTitle: 'Home - Welcome to Our Site',
    metaDescription: 'Welcome to our amazing website with great content',
    metaKeywords: 'home, welcome, website',
    status: 'active',
    isActive: true,
};

interface CMSPageFormProps {
    pageId?: string;
}

export default function CMSPageForm({ pageId }: CMSPageFormProps) {
    const router = useRouter();
    const isEditMode = !!pageId;

    // Form State
    const [formData, setFormData] = useState<CMSPageForm>({
        name: '',
        slug: '',
        description: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        status: 'active',
        isActive: true,
    });

    // Editor State
    const [editorState, setEditorState] = useState<EditorState>({
        content: '',
        history: [''],
        historyIndex: 0,
    });

    // UI State
    const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'preview'>('content');
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load page data on mount (edit mode)
    useEffect(() => {
        if (isEditMode) {
            // Simulating API call - replace with real API
            setFormData(DUMMY_PAGE);
            setEditorState({
                content: DUMMY_PAGE.content,
                history: [DUMMY_PAGE.content],
                historyIndex: 0,
            });
        }
    }, [isEditMode, pageId]);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === 'status' && { isActive: value === 'active' }),
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Generate slug from name
    const generateSlug = () => {
        const slug = formData.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        setFormData((prev) => ({ ...prev, slug }));
    };

    // Editor: Apply formatting
    const applyFormat = (format: string) => {
        const editor = document.getElementById('content-editor') as HTMLDivElement;
        if (!editor) return;

        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
            alert('Please select text to format');
            return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        let formattedText = selectedText;
        switch (format) {
            case 'bold':
                formattedText = `<strong>${selectedText}</strong>`;
                break;
            case 'italic':
                formattedText = `<em>${selectedText}</em>`;
                break;
            case 'underline':
                formattedText = `<u>${selectedText}</u>`;
                break;
            case 'code':
                formattedText = `<code>${selectedText}</code>`;
                break;
            case 'quote':
                formattedText = `<blockquote>${selectedText}</blockquote>`;
                break;
            default:
                break;
        }

        const span = document.createElement('span');
        span.innerHTML = formattedText;

        try {
            range.deleteContents();
            range.insertNode(span);
            updateEditorContent();
            selection.removeAllRanges();
        } catch (e) {
            console.error('Error applying format:', e);
        }
    };

    // Editor: Insert list
    const insertList = (ordered: boolean) => {
        const editor = document.getElementById('content-editor') as HTMLDivElement;
        if (!editor) return;

        const tag = ordered ? 'ol' : 'ul';
        const listHTML = `<${tag}><li>Item 1</li><li>Item 2</li><li>Item 3</li></${tag}>`;

        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);

        if (range) {
            const span = document.createElement('span');
            span.innerHTML = listHTML;
            range.insertNode(span);
            updateEditorContent();
        }
    };

    // Editor: Insert link
    const insertLink = () => {
        const url = prompt('Enter URL:');
        if (!url) return;

        const editor = document.getElementById('content-editor') as HTMLDivElement;
        if (!editor) return;

        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
            alert('Please select text to create a link');
            return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        const link = document.createElement('a');
        link.href = url;
        link.textContent = selectedText;
        link.className = 'text-blue-600 hover:underline';

        try {
            range.deleteContents();
            range.insertNode(link);
            updateEditorContent();
            selection.removeAllRanges();
        } catch (e) {
            console.error('Error inserting link:', e);
        }
    };

    // Update editor content state
    const updateEditorContent = () => {
        const editor = document.getElementById('content-editor') as HTMLDivElement;
        if (!editor) return;

        const content = editor.innerHTML;
        setEditorState((prev) => {
            const newHistory = prev.history.slice(0, prev.historyIndex + 1);
            newHistory.push(content);
            return {
                content,
                history: newHistory,
                historyIndex: newHistory.length - 1,
            };
        });

        setFormData((prev) => ({ ...prev, content }));
    };

    // Undo
    const handleUndo = () => {
        setEditorState((prev) => {
            if (prev.historyIndex > 0) {
                const newIndex = prev.historyIndex - 1;
                const editor = document.getElementById('content-editor') as HTMLDivElement;
                if (editor) {
                    editor.innerHTML = prev.history[newIndex];
                }
                return { ...prev, historyIndex: newIndex, content: prev.history[newIndex] };
            }
            return prev;
        });
    };

    // Redo
    const handleRedo = () => {
        setEditorState((prev) => {
            if (prev.historyIndex < prev.history.length - 1) {
                const newIndex = prev.historyIndex + 1;
                const editor = document.getElementById('content-editor') as HTMLDivElement;
                if (editor) {
                    editor.innerHTML = prev.history[newIndex];
                }
                return { ...prev, historyIndex: newIndex, content: prev.history[newIndex] };
            }
            return prev;
        });
    };

    // Validate form
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Page name is required';
        }
        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        }
        if (!formData.metaTitle.trim()) {
            newErrors.metaTitle = 'Meta title is required';
        }
        if (!formData.metaDescription.trim()) {
            newErrors.metaDescription = 'Meta description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            if (isEditMode) {
                console.log('Updating page:', formData);
                alert('Page updated successfully!');
            } else {
                console.log('Creating new page:', formData);
                alert('Page created successfully!');
            }

            // Redirect to pages list
            router.push('/cms-pages/list');
        } catch (error) {
            console.error('Error saving page:', error);
            alert('Error saving page. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle delete
    const handleDelete = () => {
        if (!isEditMode) return;
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;

        alert('Page deleted successfully!');
        router.push('/pages');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                            >
                                <ArrowLeft size={20} className="text-slate-700" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {isEditMode ? 'Edit Page' : 'Create New Page'}
                                </h1>
                                <p className="text-sm text-slate-600 mt-0.5">
                                    {isEditMode ? `Editing: ${formData.name}` : 'Add a new page to your CMS'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditMode && (
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors duration-200 font-medium"
                                >
                                    <Trash2 size={18} />
                                    <span>Delete</span>
                                </button>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
                            >
                                <Save size={18} />
                                <span>{isSaving ? 'Saving...' : 'Save'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tab Navigation */}
                        <div className="flex gap-2 bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm">
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`flex-1 px-4 py-2.5 rounded font-medium transition-all duration-200 ${activeTab === 'content'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                Content
                            </button>
                            <button
                                onClick={() => setActiveTab('seo')}
                                className={`flex-1 px-4 py-2.5 rounded font-medium transition-all duration-200 ${activeTab === 'seo'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                SEO
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex-1 px-4 py-2.5 rounded font-medium transition-all duration-200 ${activeTab === 'preview'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                            >
                                Preview
                            </button>
                        </div>

                        {/* Content Tab */}
                        {activeTab === 'content' && (
                            <div className="space-y-6">
                                {/* Page Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Page Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter page name"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'
                                            }`}
                                    />
                                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Slug */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-semibold text-slate-900">
                                            Page Slug *
                                        </label>
                                        <button
                                            onClick={generateSlug}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Generate from name
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="page-slug"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errors.slug ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'
                                            }`}
                                    />
                                    {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Short Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter a short description for this page"
                                        rows={3}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'
                                            }`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Rich Text Editor */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                                        Page Content *
                                    </label>

                                    {/* Toolbar */}
                                    <div className="bg-slate-100 border border-slate-200 rounded-t-lg p-3 flex flex-wrap gap-1.5">
                                        <button
                                            onClick={() => applyFormat('bold')}
                                            title="Bold (Ctrl+B)"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Bold size={18} />
                                        </button>
                                        <button
                                            onClick={() => applyFormat('italic')}
                                            title="Italic (Ctrl+I)"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Italic size={18} />
                                        </button>
                                        <button
                                            onClick={() => applyFormat('underline')}
                                            title="Underline (Ctrl+U)"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Underline size={18} />
                                        </button>

                                        <div className="border-l border-slate-300 mx-1"></div>

                                        <button
                                            onClick={() => insertList(false)}
                                            title="Unordered List"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <List size={18} />
                                        </button>
                                        <button
                                            onClick={() => insertList(true)}
                                            title="Ordered List"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <ListOrdered size={18} />
                                        </button>

                                        <div className="border-l border-slate-300 mx-1"></div>

                                        <button
                                            onClick={insertLink}
                                            title="Insert Link"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Link2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => applyFormat('quote')}
                                            title="Quote"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Quote size={18} />
                                        </button>
                                        <button
                                            onClick={() => applyFormat('code')}
                                            title="Code"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Code size={18} />
                                        </button>

                                        <div className="border-l border-slate-300 mx-1"></div>

                                        <button
                                            onClick={handleUndo}
                                            title="Undo"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Undo2 size={18} />
                                        </button>
                                        <button
                                            onClick={handleRedo}
                                            title="Redo"
                                            className="p-2 bg-white hover:bg-blue-100 border border-slate-200 rounded text-slate-700 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            <Redo2 size={18} />
                                        </button>
                                    </div>

                                    {/* Editor Area */}
                                    <div
                                        id="content-editor"
                                        contentEditable
                                        onInput={updateEditorContent}
                                        className={`w-full min-h-96 px-4 py-3 border-l border-r border-b border-slate-200 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-transparent outline-none transition-all duration-200 bg-white text-slate-900 prose prose-sm max-w-none ${errors.content ? 'ring-2 ring-red-500' : ''
                                            }`}
                                        suppressContentEditableWarning
                                    >
                                        {formData.content || 'Start typing your content here...'}
                                    </div>
                                    {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}

                                    {/* Character Count */}
                                    <div className="mt-2 text-xs text-slate-600">
                                        Characters: {formData.content.length}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEO Tab */}
                        {activeTab === 'seo' && (
                            <div className="space-y-6 bg-white rounded-lg p-6 border border-slate-200">
                                {/* Meta Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Meta Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        placeholder="Page title for search engines"
                                        maxLength={60}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 ${errors.metaTitle ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'
                                            }`}
                                    />
                                    <p className="text-xs text-slate-600 mt-1">
                                        {formData.metaTitle.length}/60 characters
                                    </p>
                                    {errors.metaTitle && (
                                        <p className="text-red-600 text-sm mt-1">{errors.metaTitle}</p>
                                    )}
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Meta Description *
                                    </label>
                                    <textarea
                                        name="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={handleInputChange}
                                        placeholder="Page description for search engines"
                                        maxLength={160}
                                        rows={3}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none ${errors.metaDescription ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-white'
                                            }`}
                                    />
                                    <p className="text-xs text-slate-600 mt-1">
                                        {formData.metaDescription.length}/160 characters
                                    </p>
                                    {errors.metaDescription && (
                                        <p className="text-red-600 text-sm mt-1">{errors.metaDescription}</p>
                                    )}
                                </div>

                                {/* Meta Keywords */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                                        Meta Keywords
                                    </label>
                                    <input
                                        type="text"
                                        name="metaKeywords"
                                        value={formData.metaKeywords}
                                        onChange={handleInputChange}
                                        placeholder="keyword1, keyword2, keyword3"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
                                    />
                                    <p className="text-xs text-slate-600 mt-1">Separate keywords with commas</p>
                                </div>
                            </div>
                        )}

                        {/* Preview Tab */}
                        {activeTab === 'preview' && (
                            <div className="bg-white rounded-lg p-6 border border-slate-200 prose prose-sm max-w-none">
                                <div
                                    className="text-slate-900"
                                    dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet</p>' }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Status Card */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Page Settings</h3>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Status Badge */}
                            <div className="pt-4 border-t border-slate-200">
                                <p className="text-xs text-slate-600 mb-2">Current Status:</p>
                                <button className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${formData.isActive
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-slate-200 text-slate-700'
                                    }`}>
                                    {formData.isActive ? (
                                        <>
                                            <Eye size={16} />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff size={16} />
                                            Inactive
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Page Info */}
                            {isEditMode && (
                                <div className="pt-4 border-t border-slate-200 space-y-2">
                                    <div>
                                        <p className="text-xs text-slate-600">Page ID</p>
                                        <p className="text-sm font-mono text-slate-900">{formData.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-600">Last Modified</p>
                                        <p className="text-sm text-slate-900">Jan 15, 2024 10:30 AM</p>
                                    </div>
                                </div>
                            )}

                            {/* Quick Preview Toggle */}
                            <div className="pt-4 border-t border-slate-200">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg transition-colors duration-200 font-medium"
                                >
                                    {showPreview ? (
                                        <>
                                            <Eye size={18} />
                                            Hide Preview
                                        </>
                                    ) : (
                                        <>
                                            <Eye size={18} />
                                            Show Preview
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-6">
                            <h4 className="font-bold text-blue-900 mb-3">Editor Tips</h4>
                            <ul className="text-sm text-blue-800 space-y-2">
                                <li>• Use the toolbar for text formatting</li>
                                <li>• Click "Generate" to auto-create page slug</li>
                                <li>• Add SEO meta information for better rankings</li>
                                <li>• Preview your content before saving</li>
                                <li>• Use Undo/Redo for quick edits</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
