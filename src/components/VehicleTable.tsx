import '../styles/VehicleTable.css';
import React, { useState } from 'react';
import { Vehicle, updateVehicle } from '../features/vehicles/vehicleSlice'; // корректный импорт
import { useAppDispatch } from '../app/hooks';

interface Props {
  searchQuery: string;
//  showNew: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  vehicles: Vehicle[];
}

const TYPE_OPTIONS = [
  { value: 1, label: 'Легковой' },
  { value: 2, label: 'Грузовой' },
  { value: 3, label: 'Автобус' },
];

const CLASS_OPTIONS = [
  { value: 1, label: 'Эконом' },
  { value: 2, label: 'Средний' },
  { value: 3, label: 'Премиум' },
];

const VehicleTable: React.FC<Props> = ({ vehicles }) => {
  const dispatch = useAppDispatch();
  const [edited, setEdited] = useState<Record<number, Partial<Vehicle>>>({});

  const handleChange = (id: number, field: keyof Vehicle, value: any) => {
    setEdited((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSave = (id: number) => {
    const data = edited[id];
    if (data) {
      dispatch(updateVehicle({ id, data }));
    }
  };

  const renderTypeSelect = (vehicle: Vehicle) => (
    <select
      value={edited[vehicle.id]?.type_id ?? vehicle.type_id}
      onChange={(e) => handleChange(vehicle.id, 'type_id', Number(e.target.value))}
    >
      {TYPE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );

  const renderClassRadios = (vehicle: Vehicle) => (
    <div className="flex gap-2">
      {CLASS_OPTIONS.map((opt) => (
        <label key={opt.value}>
          <input
            type="radio"
            name={`class_${vehicle.id}`}
            value={opt.value}
            checked={(edited[vehicle.id]?.class_id ?? vehicle.class_id) === opt.value}
            onChange={() => handleChange(vehicle.id, 'class_id', opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );

  return (
    <table className="vehicle-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Марка</th>
          <th>Модель</th>
          <th>Годы выпуска</th>
          <th>Кузов</th>
          <th>Модификация</th>
          <th>Тип</th>
          <th>Класс</th>
          <th>Сохранить</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((v) => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.brand_id}</td>
            <td>{v.model_id}</td>
            <td>{v.production_start} - {v.production_end}</td>
            <td>{v.body_id}</td>
            <td>{v.modification_id}</td>
            <td>{renderTypeSelect(v)}</td>
            <td>{renderClassRadios(v)}</td>
            <td>
              <button onClick={() => handleSave(v.id)}>Сохранить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;
