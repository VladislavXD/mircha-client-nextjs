import { createListenerMiddleware } from "@reduxjs/toolkit";
import { userApi } from "@/src/services/user/user.service";
import { logout } from "@/src/store/user/user.slice";


export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
    matcher: userApi.endpoints.login.matchFulfilled,
    effect: async (action, listenerApi)=> {
        listenerApi.cancelActiveListeners();

        if(action.payload.token){
            localStorage.setItem('token', action.payload.token);
        }
    }
});

listenerMiddleware.startListening({
    actionCreator: logout,
    effect: async (action, listenerApi) => {
        localStorage.removeItem('token');
    }
});