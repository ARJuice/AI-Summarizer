import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  selectedDocument: null,
  loading: false,
  error: null,
  searchQuery: '',
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    setSelectedDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setDocuments,
  addDocument,
  setSelectedDocument,
  setLoading,
  setError,
  setSearchQuery,
  clearError,
} = documentSlice.actions;

export default documentSlice.reducer;
