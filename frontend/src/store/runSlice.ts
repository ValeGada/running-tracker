import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Run, RunState, Location } from '../types';
import { runApi } from '../services/api';

const initialState: RunState = {
  runs: [],
  currentRun: null,
  isTracking: false,
  loading: false,
};

const runSlice = createSlice({
  name: 'run',
  initialState,
  reducers: {
    // Start a new run
    startRun: (state, action: PayloadAction<Run>) => {
      state.currentRun = action.payload;
      state.isTracking = true;
    },
    
    // Stop current run (without adding to runs array)
    stopRun: (state) => {
      state.currentRun = null;
      state.isTracking = false;
    },
    
    // Pause current run
    pauseRun: (state) => {
      if (state.currentRun) {
        state.currentRun.status = 'paused';
      }
      state.isTracking = false;
    },
    
    // Resume current run
    resumeRun: (state) => {
      if (state.currentRun) {
        state.currentRun.status = 'active';
      }
      state.isTracking = true;
    },
    
    // Update current run data
    updateCurrentRun: (state, action: PayloadAction<Partial<Run>>) => {
      if (state.currentRun) {
        state.currentRun = { ...state.currentRun, ...action.payload };
      }
    },
    
    // Add location to current run
    addLocation: (state, action: PayloadAction<Location>) => {
      if (state.currentRun) {
        state.currentRun.route.push(action.payload);
      }
    },
    
    // Load runs from backend
    setRuns: (state, action: PayloadAction<Run[]>) => {
      state.runs = action.payload;
    },
    
    // Add a single run (when saved to backend)
    addRun: (state, action: PayloadAction<Run>) => {
      state.runs.unshift(action.payload);
    },
    
    // Remove a run from the list
    removeRun: (state, action: PayloadAction<string>) => {
      state.runs = state.runs.filter(run => run.id !== action.payload);
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  startRun,
  stopRun,
  pauseRun,
  resumeRun,
  updateCurrentRun,
  addLocation,
  setRuns,
  addRun,
  removeRun,
  setLoading,
} = runSlice.actions;

// Async thunk for saving run to backend
export const saveRunToBackend = (run: Omit<Run, 'id'>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const savedRun = await runApi.saveRun(run);
    // Only add the run from backend response to avoid duplicates
    dispatch(addRun(savedRun));
  } catch (error) {
    console.error('Failed to save run to backend:', error);
    // If backend fails, add the local run to maintain data
    dispatch(addRun({ ...run, id: Date.now().toString() }));
  } finally {
    dispatch(setLoading(false));
  }
};

// Async thunk for deleting run from backend
export const deleteRunFromBackend = (runId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    console.log('🗑️ Attempting to delete run with ID:', runId);
    await runApi.deleteRun(runId);
    console.log('✅ Run deleted successfully from backend');
    dispatch(removeRun(runId));
    console.log('✅ Run removed from local state');
  } catch (error: any) {
    console.error('❌ Failed to delete run from backend:', error);
    console.error('Error details:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      runId: runId
    });
    throw error; // Re-throw to handle in component
  } finally {
    dispatch(setLoading(false));
  }
};

export default runSlice.reducer;
