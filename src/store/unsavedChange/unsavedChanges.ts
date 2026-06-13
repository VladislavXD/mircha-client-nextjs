import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UnsavedChangesState {
  isDirty: boolean;
  pendingTab: string | null; // ← добавить
}

const initialState: UnsavedChangesState = {
  isDirty: false,
  pendingTab: null
};

export const unsavedChangesSlice = createSlice({
  name: "unsavedChanges",
  initialState,
  reducers: {
    setChangesDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
    setPendingTab: (state, action: PayloadAction<string | null>) => {
      state.pendingTab = action.payload;
    },
  },
});

export const { setChangesDirty, setPendingTab } = unsavedChangesSlice.actions;
