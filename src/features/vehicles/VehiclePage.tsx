import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchVehicles, updateVehicle, setSearch, setMode, setPage } from './vehicleSlice';
import VehicleTable from '../../components/VehicleTable';
import SearchBar from '../../components/SearchBar';
import ViewToggle from '../../components/ViewToggle';
import Pagination from '../../components/Pagination';
import type { Vehicle } from './vehicleSlice';

const PER_PAGE_OPTIONS = [10, 25, 50, 100, 250, 500];

const VehiclePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { vehicles, total, page, perPage, mode, search } = useAppSelector(s => s.vehicles);
  const [edited, setEdited] = useState<Record<number, Partial<Vehicle>>>({});

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch, page, perPage, mode, search]);

  const handleChange = (id: number, field: keyof Vehicle, val: any) => {
    setEdited(prev => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
  };

  const handleSaveAll = () => {
    Object.entries(edited).forEach(([id, data]) => {
      dispatch(updateVehicle({ id: +id, data }));
    });
    setEdited({});
  };

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value));
    dispatch(setPage(1));
  };

  const handleModeToggle = (value: 'all' | 'pending') => {
  dispatch(setMode(value));
  dispatch(setPage(1));
};

  return (
    <div className="vehicle-page">
      <h1>Администрирование автомобилей</h1>

      <div className="controls-row">
        <SearchBar searchQuery={search} setSearchQuery={handleSearchChange} />
        <ViewToggle selected={mode} onToggle={handleModeToggle} />
      </div>

      <Pagination total={total} options={PER_PAGE_OPTIONS} />

      <VehicleTable
        vehicles={vehicles}
        edited={edited}
        onChange={handleChange}
      />

      <button className="save-all-btn" onClick={handleSaveAll} disabled={!Object.keys(edited).length}>
        Сохранить все изменения
      </button>

      <Pagination total={total} options={PER_PAGE_OPTIONS} />
    </div>
  );
};

export default VehiclePage;