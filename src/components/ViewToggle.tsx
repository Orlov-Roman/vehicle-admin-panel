import '../styles/ViewToggle.css';
import React from 'react';

interface ViewToggleProps {
  selected: 'all' | 'pending';
  onToggle: (mode: 'all' | 'pending') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ selected, onToggle }) => {
  return (
    <div className="flex gap-2 view-toggle">
      <button
        className={`px-4 py-2 rounded transition ${
          selected === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
        onClick={() => onToggle('pending')}
      >
        Новые авто
      </button>
      <button
        className={`px-4 py-2 rounded transition ${
          selected === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
        }`}
        onClick={() => onToggle('all')}
      >
        Все авто
      </button>
    </div>
  );
};

export default ViewToggle;