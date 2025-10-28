import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Run, RunState, Location } from '../types';

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
    
    // Stop current run
    stopRun: (state) => {
      if (state.currentRun) {
        state.runs.unshift({ ...state.currentRun, status: 'completed' });
        state.currentRun = null;
      }
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
    
    // Load runs history (mock)
    setRuns: (state, action: PayloadAction<Run[]>) => {
      state.runs = action.payload;
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
  setLoading,
} = runSlice.actions;

export default runSlice.reducer;
