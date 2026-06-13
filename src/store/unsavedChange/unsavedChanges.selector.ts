import { RootState } from "../store";

// unsavedChanges.selector.ts
export const selectIsDirty = (state: RootState) => state.unsavedChanges.isDirty;
export const selectPendingTab = (state: RootState) => state.unsavedChanges.pendingTab;
