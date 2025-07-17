import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VehiclePage from './features/vehicles/VehiclePage';
import NotFoundPage from './features/vehicles/NotFoundPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/vehicles" />} />
          <Route path="/vehicles" element={<VehiclePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;