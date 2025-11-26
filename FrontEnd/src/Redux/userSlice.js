import  {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


 export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile',
     async (token, thunkAPI) => {
         console.log('Thunk received token:', token); // Add this
        try {
             const profile = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
        
      });
      return profile.data.user;
        } catch (error) {
            
          return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');

        }

    }
  );

const initialState = {
    profile:null,
    status: 'idle',
    error: null
}

const userSlice = createSlice({
    name: 'profile',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
    }
});

export default userSlice.reducer;