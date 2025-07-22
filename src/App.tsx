import React from 'react';
// Импортируем необходимые компоненты из react-router-dom для маршрутизации
import { Routes, Route, Navigate } from 'react-router-dom';

// Импортируем основные страницы приложения
import VehiclePage from './features/vehicles/VehiclePage';
import NotFoundPage from './features/vehicles/NotFoundPage';

// Основной компонент приложения — здесь описывается маршрутизация
const App: React.FC = () => {
  return (
    // Обёртка для всего приложения, можно использовать для общих стилей или сетки
    <div className="app-container">
      {/* Компонент Routes содержит список Route — определяют, какой компонент показывать по какому пути */}
      <Routes>
        {/* При заходе на корень сайта ("/") — перенаправляем пользователя на /vehicles */}
        <Route path="/" element={<Navigate to="/vehicles" />} />

        {/* Основной маршрут страницы с таблицей автомобилей */}
        <Route path="/vehicles" element={<VehiclePage />} />

        {/* Если пользователь попал на любой другой адрес, которого нет — показываем страницу 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
