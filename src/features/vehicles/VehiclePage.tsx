// Импорт необходимых библиотек и модулей
import React, { useEffect, useState } from 'react';

// Импорт хукoв из настроенного Redux Toolkit для доступа к состоянию и диспатчу
import { useAppSelector, useAppDispatch } from '../../app/hooks';

// Импорт действий из среза vehicleSlice для работы с данными автомобилей
import { fetchVehicles, updateVehicle, fetchVehicleTypes, fetchVehicleClasses, setSearch, setMode, setPage, setEditedField, clearEdited } from './vehicleSlice';

// Импорт компонентов, используемых на странице
import VehicleTable from '../../components/VehicleTable';
import SearchBar from '../../components/SearchBar';
import ViewToggle from '../../components/ViewToggle';
import Pagination from '../../components/Pagination';

// Импорт типа Vehicle для типизации и CSS стилей таблицы
import type { Vehicle } from './vehicleSlice';
import '../../styles/VehicleTable.css';

// Определение вариантов количества элементов на странице для пагинации
const PER_PAGE_OPTIONS = [10, 25, 50, 100, 250, 500];

// Основной компонент страницы администрирования автомобилей
const VehiclePage: React.FC = () => {
  // Получаем функцию dispatch из Redux для отправки действий
  const dispatch = useAppDispatch();

  // Получаем нужные данные из состояния vehicles с помощью селектора
  const {
    vehicles,          // текущий список автомобилей для отображения
    total,             // общее количество автомобилей (для пагинации)
    page,              // текущая страница
    perPage,           // сколько элементов на странице
    mode,              // режим отображения ('all' или 'pending')
    search,            // строка поиска по марке
    edited,            // изменённые локально записи автомобилей (не сохранённые)
    hasUnsavedChanges, // есть ли несохранённые изменения
  } = useAppSelector(s => s.vehicles);

  const types = useAppSelector(s => s.vehicles.vehicleTypes); // строка возможных данных в типах автомобиля
  const classes = useAppSelector(s => s.vehicles.vehicleClasses); // строка возможных данных в классах автомобиля

  // useEffect для загрузки данных с сервера при изменении параметров пагинации, режима, поиска
  // или при изменении состояния сохранения изменений.
  useEffect(() => {
    // Чтобы не перезаписывать данные, если сейчас есть несохранённые изменения
    if (!hasUnsavedChanges) {
      dispatch(fetchVehicles());
      dispatch(fetchVehicleTypes());
      dispatch(fetchVehicleClasses());
    }
  }, [dispatch, page, perPage, mode, search, hasUnsavedChanges]);

  // Функция, которая вызывается при изменении какого-либо поля у автомобиля в таблице
  const handleChange = (
    id: number,
    field: keyof Vehicle,
    value: any,
  ) => {
    // Обновляем локальное состояние изменений (edited)
    dispatch(setEditedField({ id, field, value }));
  };

  // Локальный стейт для индикации процесса сохранения
  const [saving, setSaving] = useState(false);

  // Обработчик нажатия на кнопку "Сохранить все изменения"
  const handleSaveAll = async () => {
    try {
      setSaving(true); // ставим флаг, что сохранение началось

      // Формируем массив промисов для обновления каждого изменённого автомобиля
      const promises = Object.entries(edited).map(
        ([id, data]) =>
          dispatch(updateVehicle({ id: +id, data })).unwrap(),
      );

      // Ждём завершения всех запросов на сервер
      await Promise.all(promises);

      // После успешного сохранения очищаем локальные изменения и перезагружаем данные с сервера
      dispatch(clearEdited());
      dispatch(fetchVehicles());
    } catch (err) {
      // В случае ошибки выводим её в консоль (можно сделать уведомление для пользователя)
      console.error('Ошибка при сохранении:', err);
    } finally {
      // В любом случае сбрасываем флаг сохранения
      setSaving(false);
    }
  };

  // Обработчик изменения поисковой строки
  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value)); // обновляем значение поиска в состоянии
    dispatch(setPage(1));       // сбрасываем пагинацию на первую страницу при новом поиске
  };

  // Обработчик переключения режима отображения (все или новые авто)
  const handleModeToggle = (value: 'all' | 'pending') => {
    dispatch(setMode(value));
    dispatch(setPage(1)); // при переключении режима тоже возвращаемся на первую страницу
  };

  return (
    <div className="vehicle-page">
      {/* Заголовок страницы */}
      <h1>Администрирование автомобилей</h1>

      {/* Панель с контролами поиска и переключением режима */}
      <div className="controls-row">
        <SearchBar
          searchQuery={search}                 // текущее значение поиска
          setSearchQuery={handleSearchChange}  // обработчик изменения поиска
        />
        <ViewToggle
          selected={mode}                      // текущий выбранный режим
          onToggle={handleModeToggle}          // обработчик переключения режима
        />
      </div>

      {/* Пагинация сверху */}
      <Pagination
        total={total}                          // общее количество элементов для пагинации
        options={PER_PAGE_OPTIONS}             // варианты выбора количества элементов на странице
      />

      {/* Таблица с автомобилями и возможностью редактирования */}
      <VehicleTable
        vehicles={vehicles}                    // список текущих автомобилей
        edited={edited}                        // локально изменённые автомобили
        onChange={handleChange}                // обработчик изменения в таблице
        types={types}                          // список возможных типов
        classes={classes}                      // список возможных классов
      />

      {/* Кнопка для сохранения всех изменений */}
      <button
        className="save-all-btn"
        onClick={handleSaveAll}
        disabled={!hasUnsavedChanges || saving} // неактивна, если нет изменений или идёт сохранение
      >
        {/* Показ текста кнопки зависит от состояния сохранения */}
        {saving ? 'Сохраняем...' : 'Сохранить все изменения'}
      </button>
      
      {/* Пагинация снизу */}
      <Pagination
        total={total}
        options={PER_PAGE_OPTIONS}
      />
    </div>
  );
};

export default VehiclePage;
