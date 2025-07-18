// VehicleTable.tsx
import '../styles/VehicleTable.css';
import React from 'react';
import { Vehicle } from '../features/vehicles/vehicleSlice';

interface Option {
  value: number;
  label: string;
}

interface Props {
  vehicles: Vehicle[];
  edited: Record<number, Partial<Vehicle>>;
  onChange: (id: number, field: keyof Vehicle, value: any) => void;
}

const TYPE_OPTIONS: Option[] = [
  { value: 1, label: 'Седан' },
  { value: 2, label: 'Хэтчбек' },
  { value: 3, label: 'Универсал' },
  // добавь нужные тебе типы
];

const CLASS_OPTIONS: Option[] = [
  { value: 1, label: 'Эконом' },
  { value: 2, label: 'Средний' },
  { value: 3, label: 'Премиум' },
  // добавь нужные тебе классы
];


const VehicleTable: React.FC<Props> = ({ vehicles, edited, onChange }) => {
  const renderTypeSelect = (v: Vehicle) => (
    <select
      value={edited[v.id]?.type_id ?? v.type_id}
      onChange={e => onChange(v.id, 'type_id', Number(e.target.value))}
    >
      {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
  const renderClassRadios = (v: Vehicle) => (
    <div className="flex gap-2">
      {CLASS_OPTIONS.map(o => (
        <label key={o.value}>
          <input
            type="radio"
            name={`class_${v.id}`} value={o.value}
            checked={(edited[v.id]?.class_id ?? v.class_id) === o.value}
            onChange={() => onChange(v.id, 'class_id', o.value)}
          /> {o.label}
        </label>
      ))}
    </div>
  );

  return (
    <table className="vehicle-table">
      <thead>
        <tr>
          <th>Марка</th>
          <th>Модель</th>
          <th>Годы выпуска</th>
          <th>Кузов</th>
          <th>Модификация</th>
          <th>Тип</th>
          <th>Класс</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map(v => (
          <tr key={v.id}>
            <td>{v.brand_id}</td>
            <td>{v.model_id}</td>
            <td>{v.production_start} – {v.production_end}</td>
            <td>{v.body_id}</td>
            <td>{v.modification_id}</td>
            <td>{renderTypeSelect(v)}</td>
            <td>{renderClassRadios(v)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;