import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VehiclePage from './features/vehicles/VehiclePage';
import NotFoundPage from './features/vehicles/NotFoundPage';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Navigate to="/vehicles" />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;