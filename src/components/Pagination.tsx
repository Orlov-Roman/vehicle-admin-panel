// Импорт стилей для пагинации
import '../styles/Pagination.css';
// Импорт React
import React from 'react';
// Импорт хуков из Redux
import { useAppDispatch, useAppSelector } from '../app/hooks';
// Импорт экшенов из слайса vehicles
import { setPage, setPerPage, fetchVehicles } from '../features/vehicles/vehicleSlice';

// Интерфейс пропсов компонента Pagination
interface PaginationProps {
  total: number;         // Общее количество элементов
  options: number[];     // Варианты выбора количества элементов на странице
}

// Основной компонент Pagination
const Pagination: React.FC<PaginationProps> = ({ total, options }) => {
  const dispatch = useAppDispatch();

  // Получаем текущую страницу и количество элементов на странице из Redux
  const { page, perPage } = useAppSelector(s => s.vehicles);

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(total / perPage);

  // Функция перехода на определённую страницу
  const go = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      dispatch(setPage(p));         // Устанавливаем новую страницу
      dispatch(fetchVehicles());    // Загружаем данные для этой страницы
    }
  };

  // Обработчик изменения количества элементов на странице
  const changePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPerPage(Number(e.target.value)));  // Меняем количество на странице
    dispatch(setPage(1));                          // Возвращаемся на первую страницу
    dispatch(fetchVehicles());                     // Загружаем данные
  };

  // === Расчёт диапазона отображаемых страниц ===
  const visibleRange = 5; // Сколько номеров страниц показывать
  let start = Math.max(1, page - Math.floor(visibleRange / 2)); // Начальная страница
  let end = start + visibleRange - 1;                            // Конечная страница

  // Корректировка границ если вышли за лимит
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - visibleRange + 1);
  }

  // Формируем массив отображаемых страниц
  const visiblePages = [];
  for (let i = start; i <= end; i++) {
    visiblePages.push(i);
  }

  // Возвращаем UI пагинации
  return (
    <div className="pagination">
      {/* Кнопка "в начало" */}
      <button onClick={() => go(1)} disabled={page === 1}>Начало</button>

      {/* Кнопка "предыдущая страница" */}
      <button onClick={() => go(page - 1)} disabled={page === 1}>←</button>

      {/* Отображение номеров страниц */}
      {visiblePages.map(p => (
        <button
          key={p}
          className={p === page ? 'active' : ''} // Подсвечиваем текущую
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}

      {/* Кнопка "следующая страница" */}
      <button onClick={() => go(page + 1)} disabled={page === totalPages}>→</button>

      {/* Кнопка "в конец" */}
      <button onClick={() => go(totalPages)} disabled={page === totalPages}>Конец</button>

      {/* Кнопка "показать все" */}
      <button
        onClick={() => {
          dispatch(setPerPage(total)); // Показываем все элементы
          dispatch(setPage(1));
          dispatch(fetchVehicles());
        }}
      >
        Все
      </button>

      {/* Выпадающий список для выбора количества на странице */}
      <select value={perPage} onChange={changePerPage}>
        {options.map(n => (
          <option key={n} value={n}>
            {n}/стр
          </option>
        ))}
      </select>
    </div>
  );
};

// Экспорт компонента
export default Pagination;
