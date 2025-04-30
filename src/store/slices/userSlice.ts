import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (walletAddress: string, { rejectWithValue }) => {
    try {
      // In a real implementation, this would fetch the user profile from an API
      // For now, we'll just simulate a response
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Mock user profile
      const mockProfile: UserProfile = {
        id: 'usr_' + Math.random().toString(36).substring(2, 10),
        username: 'VerseAD_User',
        walletAddress,
        avatarUrl: `https://via.placeholder.com/150?text=${walletAddress.substring(0, 4)}`,
        bio: 'Metaverse idol creator and star-maker',
        idols: [],
        $vadBalance: '500.00',
        createdAt: new Date(),
        reputation: 75,
      };
      
      return mockProfile;
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile: ' + (error as Error).message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<UserProfile>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      
      if (!state.user.profile) {
        return rejectWithValue('No user profile to update');
      }
      
      // In a real implementation, this would send the updates to an API
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Return the updated profile
      return {
        ...state.user.profile,
        ...updates,
      };
    } catch (error) {
      return rejectWithValue('Failed to update profile: ' + (error as Error).message);
    }
  }
);

export const addIdolToProfile = createAsyncThunk(
  'user/addIdol',
  async (idolId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      
      if (!state.user.profile) {
        return rejectWithValue('No user profile');
      }
      
      // Check if idol already exists in profile
      if (state.user.profile.idols.includes(idolId)) {
        return rejectWithValue('Idol already in profile');
      }
      
      // In a real implementation, this would update the user's profile in an API
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      return idolId;
    } catch (error) {
      return rejectWithValue('Failed to add idol: ' + (error as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add idol to profile
      .addCase(addIdolToProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.idols.push(action.payload);
        }
      })
      .addCase(addIdolToProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer; 