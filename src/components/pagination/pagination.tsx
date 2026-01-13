'use client';

import React from 'react';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
    pageCount: number;           // Total pages
    currentPage: number;         // Current active page (0-based index)
    onPageChange: (selectedPage: number) => void; // Callback when page changes
}

const Pagination: React.FC<PaginationProps> = ({
    pageCount,
    currentPage,
    onPageChange,
}) => {
    return (
        <div className="flex justify-center mt-6">
            <ReactPaginate
                previousLabel={'← Prev'}
                nextLabel={'Next →'}
                breakLabel={'...'}
                pageCount={pageCount}
                forcePage={currentPage} // important for controlled component
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(selected) => onPageChange(selected.selected)}
                containerClassName={'flex space-x-2'}
                pageClassName={'px-4 py-2 border rounded hover:bg-blue-500 hover:text-white cursor-pointer'}
                activeClassName={'bg-blue-500 text-white'}
                previousClassName={'px-4 py-2 border rounded hover:bg-gray-200 cursor-pointer'}
                nextClassName={'px-4 py-2 border rounded hover:bg-gray-200 cursor-pointer'}
                breakClassName={'px-2 py-2'}
                disabledClassName={'opacity-50 cursor-not-allowed'}
            />
        </div>
    );
};

export default Pagination;
