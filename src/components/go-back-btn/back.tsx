'use client';

export default function GoBackButton() {
    return (
        <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300"
        >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Go Back</span>
        </button>
    );
}