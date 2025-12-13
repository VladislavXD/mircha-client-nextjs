import { createListenerMiddleware } from "@reduxjs/toolkit";
import { logoutAction } from "@/src/store/user/user.slice";


export const listenerMiddleware = createListenerMiddleware();

// Удалён listener для login (используется React Query)

listenerMiddleware.startListening({
    actionCreator: logoutAction,
    effect: async (action, listenerApi) => {
        localStorage.removeItem('token');
    }
});