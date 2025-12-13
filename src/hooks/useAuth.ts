import { useTypedSelector } from "./useTypedSelektor";

export const useAuth = () => useTypedSelector((state)=> state.user)