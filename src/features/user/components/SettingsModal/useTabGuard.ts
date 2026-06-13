// useTabGuard.ts
import { selectIsDirty, selectPendingTab } from "@/src/store/unsavedChange/unsavedChanges.selector";
import { setChangesDirty, setPendingTab } from "@/src/store/unsavedChange/unsavedChanges";
import { selectSettingsActiveTab, setSettingsTab } from "@/src/store/settingsModal/settingsModal.slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TabValue } from "../../types/settings.type";

export function useTabGuard() {
  const dispatch = useDispatch();
  const activeTab = useSelector(selectSettingsActiveTab) as TabValue;
  const isDirty = useSelector(selectIsDirty);
  const pendingTab = useSelector(selectPendingTab) as TabValue | null; // ← из Redux

  const handleTabClick = (value: TabValue) => {
    if (isDirty && value !== activeTab) {
      dispatch(setPendingTab(value)); // ← диспатч вместо setState
    } else {
      dispatch(setSettingsTab(value));
    }
  };

  const handleSave = () => {
    window.dispatchEvent(new CustomEvent("settings:submit-active-form"));
  };

  const handleDiscard = () => {
    dispatch(setChangesDirty(false));
    window.dispatchEvent(new CustomEvent("settings:discard-active-form"));
    if (pendingTab) dispatch(setSettingsTab(pendingTab));
    dispatch(setPendingTab(null));
  };

  const handleCancel = () => dispatch(setPendingTab(null));

  // После сохранения формы isDirty → false, выполняем отложенный переход
  useEffect(() => {
    if (!isDirty && pendingTab) {
      dispatch(setSettingsTab(pendingTab));
      dispatch(setPendingTab(null));
    }
  }, [isDirty, pendingTab, dispatch]);

  return { activeTab, pendingTab, handleTabClick, handleSave, handleDiscard, handleCancel };
}