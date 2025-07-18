import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
  [key: string]: any; // Дополнительно
}

export interface VehicleState {
  vehicles: Vehicle[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  page: number;
  perPage: number;
  total: number;
  mode: 'all' | 'pending';
  search: string;
}

const initialState: VehicleState = {
  vehicles: [],
  status: 'idle',
  error: null,
  page: 1,
  perPage: 10,
  total: 0,
  mode: 'pending', // по умолчанию "новые авто"
  search: '',
};

    export const updateVehicle = createAsyncThunk(
    'vehicles/updateVehicle',
    async ({ id, data }: { id: number; data: Partial<Vehicle> }) => {
      const response = await axios.put(`/api/vehicles/${id}`, data);
      return response.data;
    }
  );

// 🔹 Загрузка авто
export const fetchVehicles = createAsyncThunk<
  { data: Vehicle[]; total: number },
  void,
  { state: { vehicles: VehicleState } }
>('vehicles/fetchVehicles', async (_, { getState, rejectWithValue }) => {
  const { page, perPage, mode, search } = getState().vehicles;

  let url = mode === 'pending'
    ? `https://api.rimeks.ru/vehicles/pending?page=${page}&perPage=${perPage}`
    : `https://api.rimeks.ru/vehicles?page=${page}&perPage=${perPage}`;

  if (search) {
    url += `&brand=${encodeURIComponent(search)}`;
  }

  try {
    const response = await axios.get(url);
    return {
      data: response.data.items || response.data,
      total: response.data.total || 0,
    };
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// 🔹 Сохранение изменений type_id и class_id по generation_id
export const updateVehiclesByGeneration = createAsyncThunk<
  void,
  { generation_id: number; type_id: number; class_id: number }
>('vehicles/updateVehicles', async (payload, { rejectWithValue }) => {
  try {
    await axios.post(`https://api.rimeks.ru/vehicles/update`, payload);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setMode(state, action: PayloadAction<'all' | 'pending'>) {
      state.mode = action.payload;
      state.page = 1;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.vehicles = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateVehiclesByGeneration.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(updateVehiclesByGeneration.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPage, setMode, setSearch, setPerPage } = vehicleSlice.actions;
export default vehicleSlice.reducer;