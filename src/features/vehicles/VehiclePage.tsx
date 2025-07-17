import React, { useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import VehicleTable from '../../components/VehicleTable';
import SearchBar from '../../components/SearchBar';
import ViewToggle from '../../components/ViewToggle';
import Pagination from '../../components/Pagination';

const VehiclePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  //const [showNew, setShowNew] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'new'>('all');

  const vehicles = useAppSelector((state) => state.vehicles.vehicles); // 🚀

  return (
    <div className="vehicle-page">
      <h1>Администрирование автомобилей</h1>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ViewToggle onToggle={(mode) => setViewMode(mode)} selected={viewMode} />
      <VehicleTable
        vehicles={vehicles}
        searchQuery={searchQuery}
   //     showNew={showNew}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Pagination 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={vehicles.length}
          perPage={10} 
      />
    </div>
  );
};

export default VehiclePage;
