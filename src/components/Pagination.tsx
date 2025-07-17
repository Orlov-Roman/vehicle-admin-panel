import '../styles/Pagination.css';
import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { setPage } from '../features/vehicles/vehicleSlice';

interface PaginationProps {
  currentPage: number;
  total: number;
  perPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, total, perPage }) => {
  const dispatch = useAppDispatch();

  const totalPages = Math.ceil(total / perPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page: number) => {
    dispatch(setPage(page));
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4 justify-center">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-1 rounded ${
            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;