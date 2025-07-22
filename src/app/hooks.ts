// Импортируем хуки из react-redux
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// Импортируем типы состояния и диспетчера из store.ts
import type { RootState, AppDispatch } from './store';

// Создаём обёртку над useDispatch с типизацией AppDispatch (для поддержки асинхронных операций, типа createAsyncThunk)
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Создаём типизированный useSelector, чтобы при обращении к глобальному состоянию (state) получать автоподсказки и типы
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;