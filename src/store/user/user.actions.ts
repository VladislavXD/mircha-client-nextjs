import { removeFromStorage } from "@/src/services/auth/auth.helper";
import { AuthService } from "@/src/services/auth/auth.service";
import { IAuthResponse, IAuthUser } from "@/src/services/user/user.interface";
import { createAsyncThunk } from "@reduxjs/toolkit";


import { AxiosError } from "axios";

/* register */
export const register = createAsyncThunk<IAuthResponse, IAuthUser>(
  "/register",
  async (data, thunkApi) => {
    try {
      const response = await AuthService.main("register", data)
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

/* login */
export const login = createAsyncThunk<IAuthResponse, IAuthUser>(
  "/login",
  async (data, thunkApi) => {
    try {
      const response = await AuthService.main("login", data);
      return response;
    } catch (error) {

			const err = error as AxiosError
      const errorData = err.response?.data as {message?: string} | undefined
      const errorMessage = errorData?.message || "error";
        return thunkApi.rejectWithValue(errorMessage);
    }
  }
);

/* logout */
export const logout = createAsyncThunk("auth/logout", async () => {
  removeFromStorage();
});

/* checkAuth */
// export const checkAuth = createAsyncThunk<IAuthResponse>(
//   "auth/check-auth",
//   async (_, thunkApi) => {
//     try {
//       const response = await AuthService.getNewTokens();
//       return response.data;
//     } catch (error) {
//       if (errorCatch(error) === "jwt expired") {
//         thunkApi.dispatch(logout());
//       }

//       return thunkApi.rejectWithValue(error);
//     }
//   }
// );

