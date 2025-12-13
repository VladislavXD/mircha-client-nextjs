import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnlineStatusState {
  statuses: Record<string, boolean>;
}

const initialState: OnlineStatusState = {
  statuses: {},
};

/**
 * Redux slice для управления онлайн статусами пользователей
 * Используется совместно с Socket.IO для отслеживания статусов в реальном времени
 */
const onlineStatusSlice = createSlice({
  name: 'onlineStatus',
  initialState,
  reducers: {
    /**
     * Установить статус одного пользователя
     */
    setUserStatus: (state, action: PayloadAction<{ userId: string; isOnline: boolean }>) => {
      state.statuses[action.payload.userId] = action.payload.isOnline;
    },

    /**
     * Установить статусы нескольких пользователей (массовое обновление)
     */
    setMultipleStatuses: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.statuses = {
        ...state.statuses,
        ...action.payload,
      };
    },

    /**
     * Очистить все статусы (при logout или переподключении)
     */
    clearStatuses: (state) => {
      state.statuses = {};
    },

    /**
     * Удалить статус конкретного пользователя
     */
    removeUserStatus: (state, action: PayloadAction<string>) => {
      delete state.statuses[action.payload];
    },
  },
});

export const { 
  setUserStatus, 
  setMultipleStatuses, 
  clearStatuses, 
  removeUserStatus 
} = onlineStatusSlice.actions;

export default onlineStatusSlice.reducer;
