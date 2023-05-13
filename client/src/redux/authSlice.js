import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      localStorage.clear();
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    register(state, action) {
      localStorage.clear();
      state.user = action.payload.others;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.clear();
    },
    handleFollow(state, action) {
      if (state.user.followings.includes(action.payload)) {
        state.user.followings = state.user.followings.filter(
          (id) => id !== action.payload
        );
      } else {
        console.log(action.payload);
        state.user.followings.push(action.payload);
      }
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    updatePost(state, action) {
      const updatedPost = action.payload;
      const postId = updatedPost.id;
      const updatedPosts = state.posts
        ? state.posts.map((post) => {
            if (post.id === postId) {
              return updatedPost;
            } else {
              return post;
            }
          })
        : [];
      return { ...state, posts: updatedPosts };
    },
  },
});

export const { login, register, logout, handleFollow, updateUser, updatePost } =
  authSlice.actions;

export default authSlice.reducer;
