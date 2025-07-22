// Импорт CSS для стилизации переключателя вида
import '../styles/ViewToggle.css';

// Импорт React
import React from 'react';

// Интерфейс пропсов компонента ViewToggle
interface ViewToggleProps {
  // Выбранный режим отображения: либо "все авто", либо "новые авто"
  selected: 'all' | 'pending';

  // Функция-обработчик переключения режима
  // Принимает новый режим ('all' или 'pending') и сообщает его родителю
  onToggle: (mode: 'all' | 'pending') => void;
}

// Функциональный компонент ViewToggle с типизацией React.FC и пропсами ViewToggleProps
const ViewToggle: React.FC<ViewToggleProps> = ({ selected, onToggle }) => {
  return (
    // Обёртка с CSS классами для flex-контейнера и отступа между кнопками
    <div className="flex gap-2 view-toggle">

      {/* Кнопка "Новые авто" */}
      <button
        // Динамическое присвоение классов для стилей и состояния
        // Если выбран режим 'pending' (новые авто), кнопка подсвечивается синим и белым текстом
        // Иначе — серый фон и чёрный текст
        className={`px-4 py-2 rounded transition ${
          selected === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
        // При клике вызывается onToggle с параметром 'pending' — переключаемся на "Новые авто"
        onClick={() => onToggle('pending')}
      >
        Новые авто
      </button>

      {/* Кнопка "Все авто" */}
      <button
        // Аналогично кнопке выше, но проверяется выбран ли режим 'all'
        className={`px-4 py-2 rounded transition ${
          selected === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
        // При клике переключаемся на режим "Все авто"
        onClick={() => onToggle('all')}
      >
        Все авто
      </button>
    </div>
  );
};

// Экспорт компонента по умолчанию для использования в других местах приложения
export default ViewToggle;
