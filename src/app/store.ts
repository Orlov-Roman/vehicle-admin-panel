// Импортируем configureStore для создания Redux стора
import { configureStore } from '@reduxjs/toolkit';
// Импорт редьюсера, отвечающего за состояние транспорта (vehicles)
import vehiclesReducer from '../features/vehicles/vehicleSlice';

// Создаём и настраиваем Redux store
export const store = configureStore({
  reducer: {
    // Добавляем редьюсер в хранилище, указываем ключ 'vehicles' — по нему будем обращаться к данным
    vehicles: vehiclesReducer,
  },
});

// Тип для всего состояния приложения — понадобится для типизированного useSelector
export type RootState = ReturnType<typeof store.getState>;

// Тип для dispatch, понадобится для типизированного useDispatch
export type AppDispatch = typeof store.dispatch;
