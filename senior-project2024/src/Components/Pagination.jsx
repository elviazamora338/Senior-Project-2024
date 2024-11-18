import React from 'react';

const Pagination = ({ postsPerPage, length, handlePagination, currentPage }) => {
    const totalPages = Math.ceil(length / postsPerPage);

    return (
        <div className="pagination">
            {/* Backward Arrow */}
            <button
                className="page-arrow"
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage === 1} // Disable if on the first page
            >
                &lsaquo; {/* Left arrow */}
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages).keys()].map((i) => {
                const pageNumber = i + 1;
                return (
                    <button
                        key={pageNumber}
                        className={`page-number ${currentPage === pageNumber ? 'active' : ''}`}
                        onClick={() => handlePagination(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Forward Arrow */}
            <button
                className="page-arrow"
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage === totalPages} // Disable if on the last page
            >
                &rsaquo; {/* Right arrow */}
            </button>
        </div>
    );
};

export default Pagination;
