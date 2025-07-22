// Подключение CSS-стилей для компонента поисковой строки
import '../styles/SearchBar.css';

// Импорты из React
import React, { useState, useEffect } from 'react';

// Хуки из приложения
import { useAppDispatch } from '../app/hooks';

// Импорт экшенов для управления состоянием поиска и страницы
import { setSearch, setPage } from '../features/vehicles/vehicleSlice';

// Интерфейс пропсов, которые принимает компонент SearchBar
interface SearchBarProps {
  // Текущий поисковый запрос
  searchQuery: string;

  // Функция для обновления значения поискового запроса
  setSearchQuery: (value: string) => void;
}

// Функциональный компонент SearchBar
const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  // Локальное состояние input — для хранения текста, введённого пользователем
  const [input, setInput] = useState(searchQuery);

  // Получение диспатча из кастомного хука
  const dispatch = useAppDispatch();

  // Эффект обновляет локальный input при изменении внешнего searchQuery
  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  // Обработчик поиска — обновляет глобальный и локальный поиск, сбрасывает страницу на первую
  const handleSearch = () => {
    setSearchQuery(input);        // Обновление пропа во внешнем состоянии
    dispatch(setPage(1));         // Сброс на первую страницу
    dispatch(setSearch(input));   // Установка фильтра поиска
  };

  // Обработчик нажатия клавиши Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(); // Запуск поиска при нажатии Enter
    }
  };

  // JSX-верстка компонента
  return (
    <div className="search-bar">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)} // Изменение input при вводе
        onKeyDown={handleKeyDown}                 // Обработка Enter
        placeholder="Поиск по марке..."           // Подсказка в поле
      />
      <button onClick={handleSearch}>Найти</button> {/* Кнопка запуска поиска */}
    </div>
  );
};

export default SearchBar; // Экспорт компонента
