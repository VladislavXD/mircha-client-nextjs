import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SettingsTab =
  | "profile"
  | "appearance"
  | "security"
  | "privacy"
  | "notifications"
  | string;

interface SettingsModalState {
  isOpen: boolean;
  activeTab: SettingsTab;
}

const initialState: SettingsModalState = {
  isOpen: false,
  activeTab: "profile",
};

export const settingsModalSlice = createSlice({
  name: "settingsModal",
  initialState,
  reducers: {
    openSettingsModal: (
      state,
      action: PayloadAction<SettingsTab | undefined>,
    ) => {
      state.isOpen = true;
      if (action.payload) {
        state.activeTab = action.payload;
      }
    },
    closeSettingsModal: (state) => {
      state.isOpen = false;
    },
    setSettingsTab: (state, action: PayloadAction<SettingsTab>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { openSettingsModal, closeSettingsModal, setSettingsTab } =
  settingsModalSlice.actions;

export default settingsModalSlice.reducer;

export const selectIsSettingsModalOpen = (state: {
  settingsModal: SettingsModalState;
}) => state.settingsModal.isOpen;
export const selectSettingsActiveTab = (state: {
  settingsModal: SettingsModalState;
}) => state.settingsModal.activeTab;
