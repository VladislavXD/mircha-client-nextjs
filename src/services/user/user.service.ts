import type { User } from "@/src/types/types";
import { api } from "@/src/services/api";

interface LoginRequest { email: string; password: string }
interface LoginResponse { token: string }
interface RegisterRequest { email: string; password: string; name: string }
interface RegisterResponse { email: string; password: string; name: string }
interface UpdateUserRequest { userData: FormData; id: string }
interface UpdateAppearanceRequest { id: string; avatarFrameUrl?: string; backgroundUrl?: string }

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (userData) => ({
                url: '/login',
                method: 'POST',
                body: userData
            })
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/register',
                method: 'POST',
                body: userData,
            })
        }),
        current: builder.query<User, void>({
            query: () => ({
                url: '/current',
                method: 'GET'
            }),
            providesTags: ['User']
        }),
        getUserById: builder.query<User, string>({
            query: (id) => ({
                url: `/user/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, id) => [{ type: 'User', id }]
        }),
        updateUser: builder.mutation<User, UpdateUserRequest>({
            query: ({userData, id}) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body: userData
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'User', id }, 'User']
        }),
        updateAppearance: builder.mutation<User, UpdateAppearanceRequest>({
            query: ({id, avatarFrameUrl, backgroundUrl}) => ({
                url: `/user/${id}`,
                method: 'PUT',
                body: { avatarFrameUrl, backgroundUrl }
            }),
            invalidatesTags: (result, error, {id}) => [{ type: 'User', id }, 'User']
        }),
        searchUsers: builder.query<User[], string>({
            query: (q) => ({
                url: `/user/search?query=${encodeURIComponent(q)}`,
                method: 'GET'
            }),
            providesTags: ['User']
        })
    }),
    overrideExisting: false
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useCurrentQuery,
    useLazyCurrentQuery,
    useGetUserByIdQuery,
    useUpdateUserMutation,
    useLazyGetUserByIdQuery,
    useUpdateAppearanceMutation,
    useSearchUsersQuery
} = userApi

export const {
    endpoints: {login, register, current, getUserById, updateUser, updateAppearance, searchUsers}
} = userApi