import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, onPageChange, onItemsPerPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };

    const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(event.target.value);
        setSelectedItemsPerPage(newItemsPerPage);
        onItemsPerPageChange(newItemsPerPage);
    };

    return (
        <div className="flex justify-center items-center space-x-4 mt-8 flex-wrap">
            {/* Sélection du nombre d'éléments par page */}
            <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">
                    Éléments par page :
                </label>
                <select
                    id="itemsPerPage"
                    className="px-2 py-1 border border-gray-300 rounded-md text-sm text-gray-700"
                    value={selectedItemsPerPage}
                    onChange={handleItemsPerPageChange}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </div>

            {/* Boutons de pagination centralisés et espacés */}
            <div className="flex items-center space-x-2">
                {/* Bouton Précédent */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    <FaChevronLeft />
                </button>

                {/* Boutons numérotés */}
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-3 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                    >
                        {index + 1}
                    </button>
                ))}

                {/* Bouton Suivant */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
};

export default Pagination;