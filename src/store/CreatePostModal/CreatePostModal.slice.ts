import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreatePostModalState {
  isOpen: boolean;
  createPostView: boolean;
}

const initialState: CreatePostModalState = {
  isOpen: false,
  createPostView: true,
};

export const createPostModalSlice = createSlice({
  name: "createPostModal",
  initialState,
  reducers: {
    openCreatePostModal: (state) => {
      state.isOpen = true;
    },
    closeCreatePostModal: (state) => {
      state.isOpen = false;
    },
    setCreatePostView: (state, action: PayloadAction<boolean>) => {
      state.createPostView = action.payload;
    },
  },
});

export const { openCreatePostModal, closeCreatePostModal, setCreatePostView } =
  createPostModalSlice.actions;

export default createPostModalSlice.reducer;

export const selectIsCreatePostModalOpen = (state: {
  createPostModal: CreatePostModalState;
}) => state.createPostModal.isOpen;
