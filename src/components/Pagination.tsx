import '../styles/Pagination.css';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setPage, setPerPage } from '../features/vehicles/vehicleSlice';

interface PaginationProps {
  total: number;
  options: number[];
}

const Pagination: React.FC<PaginationProps> = ({ total, options }) => {
  const dispatch = useAppDispatch();
  const { page, perPage } = useAppSelector(s => s.vehicles);
  const totalPages = Math.ceil(total / perPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const go = (p: number) => {
    if (p >= 1 && p <= totalPages) dispatch(setPage(p));
  };

  const changePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPerPage(Number(e.target.value)));
    dispatch(setPage(1));
  };

  return (
    <div className="pagination">
      <button onClick={() => go(1)} disabled={page === 1}>Начало</button>
      <button onClick={() => go(page - 1)} disabled={page === 1}>←</button>
      {pages.map(p => (
        <button
          key={p}
          className={p === page ? 'active' : ''}
          onClick={() => go(p)}
        >{p}</button>
      ))}
      <button onClick={() => go(page + 1)} disabled={page === totalPages}>→</button>
      <button onClick={() => go(totalPages)} disabled={page === totalPages}>Конец</button>
      <button onClick={() => dispatch(setPerPage(total))}>Все</button>

      <select value={perPage} onChange={changePerPage}>
        {options.map(n => <option key={n} value={n}>{n}/стр</option>)}
      </select>
    </div>
  );
};

export default Pagination;