import '../styles/ViewToggle.css';
import React from 'react';


interface ViewToggleProps {
  selected: 'all' | 'new';
  onToggle: (mode: 'all' | 'new') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ selected, onToggle }) => {
  return (
    <div className="flex gap-2">
      <button
        className={`px-4 py-2 rounded ${
          selected === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
        onClick={() => onToggle('new')}
      >
        Новые авто
      </button>
      <button
        className={`px-4 py-2 rounded ${
          selected === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
        onClick={() => onToggle('all')}
      >
        Все авто
      </button>
    </div>
  );
};

export default ViewToggle;