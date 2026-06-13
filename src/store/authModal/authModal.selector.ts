import { RootState } from "../store";

// authModal.selector.ts
export const authModalisOpen = (state: RootState) => state.authModal.isOpen;
export const authModalTitle = (state: RootState) => state.authModal.title;
export const authModalDescription = (state: RootState) => state.authModal.description;
export const authModalIcon = (state: RootState) => state.authModal.icon;
