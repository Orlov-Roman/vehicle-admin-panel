// Подключение CSS для стилизации таблицы автомобилей
import '../styles/VehicleTable.css';

// Импорт React
import React from 'react';

// Импорт интерфейса Vehicle из слайса с данными автомобилей
import { Vehicle } from '../features/vehicles/vehicleSlice';

// Интерфейс пропсов компонента VehicleTable
interface Props {
  vehicles: Vehicle[]; // Список автомобилей для отображения
  edited: Record<number, Partial<Vehicle>>;                         // Объект с изменениями по id автомобиля (частичные данные)
  onChange: (id: number, field: keyof Vehicle, value: any) => void; // Колбэк для обработки изменений в таблице
  types: { id: number; name: string }[];                            // Объект с изменениями по типу автомобиля
  classes: { id: number; name: string }[];                          // Объект с изменениями по классу автомобиля
}

interface Props {
  vehicles: Vehicle[];
  edited: Record<number, Partial<Vehicle>>;
  onChange: (id: number, field: keyof Vehicle, value: any) => void;

}

// Компонент таблицы автомобилей
const VehicleTable: React.FC<Props> = ({ vehicles, edited, onChange, types, classes }) => {

  // Рендер селекта выбора типа кузова
  // Значение берётся из изменённого состояния, если есть, иначе из исходного объекта
  const renderTypeSelect = (v: Vehicle) => (
    <select
      value={edited[v.id]?.type_id ?? v.type_id}
      onChange={e => onChange(v.id, 'type_id', Number(e.target.value))}
    >
            {types.map(o => (
        <option key={o.id} value={o.id}>{o.name}</option>
      ))}
    </select>
  );

  // Рендер радио-кнопок для выбора класса автомобиля
  // Имя группируется по id автомобиля, чтобы радио работали только в пределах строки
  const renderClassRadios = (v: Vehicle) => (
    <div className="flex gap-2">
            {classes.map(o => (
        <label key={o.id}>
          <input
            type="radio"
            name={`class_${v.id}`}
            value={o.id}
            checked={(edited[v.id]?.class_id ?? v.class_id) === o.id}
            onChange={() => onChange(v.id, 'class_id', o.id)}
          /> {o.name}
        </label>
      ))}
    </div>
  );

  return (
    // Основная таблица с классом для стилей
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
        {/* Проходим по списку автомобилей и рендерим строки */}
        {vehicles.map(v => (
          <tr key={v.id}>
            <td>{v.brand_name}</td>                            {/* Отображение названия марки */}
            <td>{v.model_name}</td>                            {/* Отображение названия модели */}
            <td>{v.production_start} – {v.production_end}</td> {/* Годы выпуска */}
            <td>{v.body_id}</td>                               {/* Кузов (id) */}
            <td>{v.modification_id}</td>                       {/* Модификация (id) */}
            <td>{renderTypeSelect(v)}</td>                     {/* Выпадающий список для выбора типа кузова */}
            <td>{renderClassRadios(v)}</td>                    {/* Радио-кнопки для выбора класса */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;
