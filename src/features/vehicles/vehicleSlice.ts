// Импортируем необходимые функции и типы из Redux Toolkit
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// Для HTTP-запросов используем axios
import axios from 'axios';
// Импорт типа RootState для доступа к глобальному состоянию
import { RootState } from '../../app/store'; // ✅ Проверь путь, чтобы он был корректным


interface VehicleType { id: number; name: string }
interface VehicleClass { id: number; name: string }

// Описание интерфейса автомобиля с обязательными полями
export interface Vehicle {
  id: number;
  brand_id: number;
  model_id: number;
  generation_id: number;
  body_id: number;
  modification_id: number;
  type_id: number;
  class_id: number;
  production_start: number;
  production_end: number;
  // [key: string]: any позволяет добавлять любые дополнительные поля
  [key: string]: any;
}

// Интерфейс состояния с ключевыми полями и типами
export interface VehicleState {
  vehicles: Vehicle[];                                  // Список автомобилей, загруженных из API
  status: 'idle' | 'loading' | 'succeeded' | 'failed';  // Статус загрузки
  error: string | null;                                 // Текст ошибки, если она есть
  page: number;                                         // Текущая страница пагинации
  perPage: number;                                      // Количество элементов на странице
  total: number;                                        // Общее количество автомобилей (для пагинации)
  mode: 'all' | 'pending';                              // Режим фильтрации (все или новые автомобили)
  search: string;                                       // Текст для поиска по brand_id
  edited: Record<number, Partial<Vehicle>>;             // Изменения локальных автомобилей (id -> частичные данные)
  hasUnsavedChanges: boolean;                           // Флаг, указывающий на несохранённые изменения
  vehicleTypes: VehicleType[];
  vehicleClasses: VehicleClass[];
}

// Начальное состояние slice с дефолтными значениями
const initialState: VehicleState = {
  vehicles: [],
  status: 'idle',
  error: null,
  page: 1,
  perPage: 10,
  total: 0,
  mode: 'pending',    // по умолчанию показываем "новые" авто
  search: '',
  edited: {},
  hasUnsavedChanges: false,
  vehicleTypes: [],
  vehicleClasses: [],
};

// --- Async thunk для загрузки автомобилей с пагинацией и фильтрами ---
// createAsyncThunk принимает тип возвращаемых данных, аргументов и тип getState
export const fetchVehicles = createAsyncThunk<
  { data: Vehicle[]; total: number }, // что вернёт
  void,                               // аргументы (нет)
  { state: RootState }                // extra аргументы с типом состояния
>(
  'vehicles/fetchVehicles',           // имя действия
  async (_, { getState, rejectWithValue }) => {
    // Получаем параметры из состояния (страница, фильтры)
    const { page, perPage, search, mode } = getState().vehicles;

    try {
      // 1. Получаем все данные с API
      const url =
        mode === 'pending'
          ? 'https://api.rimeks.ru/vehicles/v1/vehicles/pending'
          : 'https://api.rimeks.ru/vehicles/v1/vehicles';

      const allResp = await axios.get(url);
      let vehicles: Vehicle[] = allResp.data;

      // 2. Фильтруем по поиску по brand_id (поиск подстроки в строковом представлении)
      if (search) {
        vehicles = vehicles.filter(v =>
          v.brand_name?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // 3. Пагинация вручную: рассчитываем общее число, а потом "режем" нужный срез
      const total = vehicles.length;
      const start = (page - 1) * perPage;
      const data = vehicles.slice(start, start + perPage);

      // Возвращаем данные и общее количество
      return { data, total };
    } catch (err: any) {
      // В случае ошибки возвращаем reject с сообщением ошибки
      return rejectWithValue(err.message);
    }
  }
);

// --- Async thunk для загрузки типов кузова автомобилей ---
export const fetchVehicleTypes = createAsyncThunk<VehicleType[]>(
  'vehicles/fetchTypes',
  async () => {
    const res = await axios.get('https://api.rimeks.ru/vehicles/v1/types');
    return res.data;
  }
);

// --- Async thunk для загрузки классов автомобилей ---
export const fetchVehicleClasses = createAsyncThunk<VehicleClass[]>(
  'vehicles/fetchClasses',
  async () => {
    const res = await axios.get('https://api.rimeks.ru/vehicles/v1/classes');
    return res.data;
  }
);


// --- Async thunk для обновления одного автомобиля ---
export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async (
    { id, data }: { id: number; data: Partial<Vehicle> },
    { rejectWithValue }
  ) => {
    try {
      // 1. Получаем текущие данные автомобиля по ID (для получения полной записи)
      const getResp = await axios.get(`https://api.rimeks.ru/vehicles/v1/vehicles/${id}`);
      const vehicleToUpdate = getResp.data;

      // 2. Объединяем изменения с текущими данными
      const updatedVehicle = { ...vehicleToUpdate, ...data };

      // 3. Отправляем обновлённую запись на сервер методом PUT
      const response = await axios.put(`https://api.rimeks.ru/vehicles/v1/${id}`, updatedVehicle);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Async thunk для массового обновления автомобилей по generation_id ---
// (json-server не поддерживает массовые обновления, имитируем через запрос всех и поэтапное обновление)
export const updateVehiclesByGeneration = createAsyncThunk<
  void,
  {
    generation_id: number;
    type_id: number;
    class_id: number;
  }
>(
  'vehicles/updateByGeneration',
  async (payload, { rejectWithValue }) => {
    try {
      const { generation_id, ...data } = payload;

      // Получаем все автомобили с указанным generation_id
      const getResp = await axios.get(`https://api.rimeks.ru/vehicles/v1/vehicles?generation_id=${generation_id}`);

      // Формируем массив промисов на обновление каждого автомобиля
      const updatePromises = getResp.data.map((vehicle: Vehicle) =>
        axios.put(`https://api.rimeks.ru/vehicles/v1/vehicles/${vehicle.id}`, {
          ...vehicle,
          ...data,
        })
      );

      // Ждём завершения всех запросов
      await Promise.all(updatePromises);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Создаём срез с редьюсерами и экстра-редьюсерами для асинхронных операций ---
const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    // Устанавливаем текущую страницу пагинации
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    // Устанавливаем режим отображения и сбрасываем страницу на 1
    setMode(state, action: PayloadAction<'all' | 'pending'>) {
      state.mode = action.payload;
      state.page = 1;
    },
    // Устанавливаем поисковый запрос и сбрасываем страницу на 1
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    // Устанавливаем количество элементов на странице
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
    // Локально сохраняем изменения конкретного поля автомобиля
    setEditedField(state, action: PayloadAction<{ id: number; field: keyof Vehicle; value: any }>) {
      const { id, field, value } = action.payload;
      // Получаем предыдущие изменения, если были
      const prev = state.edited[id] || {};
      // Обновляем или создаём новую запись изменений для автомобиля
      state.edited[id] = { ...prev, [field]: value };
      // Устанавливаем флаг, что есть несохранённые изменения
      state.hasUnsavedChanges = true;
    },
    // Очищаем все локальные изменения и сбрасываем флаг
    clearEdited(state) {
      state.edited = {};
      state.hasUnsavedChanges = false;
    }
  },
  // Обработка состояний асинхронных thunk-ов
  extraReducers: (builder) => {
    builder
      // Загрузка автомобилей началась — меняем статус и очищаем текущий список
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
        state.vehicles = [];
      })
      // Загрузка успешна — обновляем данные и статус
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload.data;
        state.total = action.payload.total;
      })
      // Ошибка при загрузке — устанавливаем статус и текст ошибки
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Загрузка типов успешна — обновляем данные и статус
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
          state.vehicleTypes = action.payload;
      })

      // Загрузка классов успешна — обновляем данные и статус
      .addCase(fetchVehicleClasses.fulfilled, (state, action) => {
          state.vehicleClasses = action.payload;
      })

      // Успешное обновление автомобиля — меняем запись в массиве, удаляем локальные изменения, обновляем флаг
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updated = action.payload;
        state.vehicles = state.vehicles.map(v =>
          v.id === updated.id ? { ...v, ...updated } : v
        );
        

        // Удаляем локальные изменения для этого авто
        delete state.edited[updated.id];
        // Если изменений больше нет — сбрасываем флаг
        if (Object.keys(state.edited).length === 0) {
          state.hasUnsavedChanges = false;
        }
      })
      // Ошибка обновления автомобиля
      .addCase(updateVehicle.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Успешное массовое обновление
      .addCase(updateVehiclesByGeneration.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      // Ошибка массового обновления
      .addCase(updateVehiclesByGeneration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Экспорт действий для использования в компонентах
export const { setPage, setMode, setSearch, setPerPage, setEditedField, clearEdited } = vehicleSlice.actions;
// Экспорт редьюсера для подключения в store
export default vehicleSlice.reducer;
