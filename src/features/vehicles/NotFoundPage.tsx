import '../../styles/NotFoundPage.css';
import React from 'react';

const NotFoundPage: React.FC = () => (
  <div className="notfound">
    <h2>404 – Страница не найдена</h2>
    <p>Кажется, вы заблудились. Вернитесь на <a href="/vehicles">список авто</a>.</p>
  </div>
);

export default NotFoundPage;