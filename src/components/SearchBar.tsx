import '../styles/SearchBar.css';
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../app/hooks';
import { setSearch, setPage } from '../features/vehicles/vehicleSlice';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const [input, setInput] = useState(searchQuery);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(input);
    dispatch(setPage(1));
    dispatch(setSearch(input));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Поиск по марке..."
      />
      <button onClick={handleSearch}>Найти</button>
    </div>
  );
};

export default SearchBar;