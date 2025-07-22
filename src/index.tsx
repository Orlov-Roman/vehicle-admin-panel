import React from 'react';
import ReactDOM from 'react-dom/client';
// Импортируем главный компонент приложения
import App from './App';
// Импортируем Redux store
import { store } from './app/store';
// Импортируем компонент Provider для интеграции Redux
import { Provider } from 'react-redux';
// Импортируем BrowserRouter для маршрутизации в браузере
import { BrowserRouter } from 'react-router-dom';

// Находим корневой HTML-элемент, куда будем рендерить React-приложение
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Запускаем рендеринг приложения
root.render(
  // React.StrictMode — инструмент разработки, который помогает выявлять потенциальные проблемы
  <React.StrictMode>
    {/* Оборачиваем приложение в Provider, чтобы Redux store был доступен всем компонентам */}
    <Provider store={store}>
      {/* Оборачиваем приложение в BrowserRouter для поддержки маршрутизации через History API */}
      <BrowserRouter>
        {/* Сам главный компонент приложения */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
