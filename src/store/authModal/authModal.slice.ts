// authModal.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// authModal.slice.ts
export type AuthModalIcon = "Heart" | "MessageCircle" | "Send" | "User" | "Repeat2" | "Pencil" | "Repeat";

interface AuthModalState {
  isOpen: boolean;
  title: string;
  description: string;
  icon?: AuthModalIcon;

}

const initialState: AuthModalState = {
  isOpen: false,
  title: "Требуется авторизация",
  description: "Войдите, чтобы продолжить.",
  icon: undefined,
};

export const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<Partial<AuthModalState>>) => {
      state.isOpen = true;
      state.title = action.payload.title ?? initialState.title;
      state.description = action.payload.description ?? initialState.description;
      state.icon = action.payload.icon ?? initialState.icon;
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openAuthModal, closeAuthModal } = authModalSlice.actions;