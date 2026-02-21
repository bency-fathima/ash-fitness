import { createSlice } from "@reduxjs/toolkit";
 import { getAllCategories, getCategory, getFounderCategories } from "./category.thunk";

const initialState = {
  allCategories: [],
  founderCategory: [],
  totalCategory:0,
  selectedCategory: null,
  error: null,
  status: "idle",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      //get all program slices
      .addCase(getCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCategory = action.payload.data;
        state.error = null;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allCategories = action.payload;
        state.error = null;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getFounderCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getFounderCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.founderCategory = action.payload.data.data;
        state.totalCategory = action.payload.data.totalCount;
        state.error = null;
      })
      .addCase(getFounderCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

       

      
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
