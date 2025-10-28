import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { addLocation, updateCurrentRun } from '../store/runSlice';
import { LocationService } from '../services/locationService';
import { Location } from '../types';

// Custom hook for location tracking
export const useLocationTracking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentRun, isTracking } = useSelector((state: RootState) => state.run);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  
  // Request permissions on mount
  useEffect(() => {
    const requestPermissions = async () => {
      const granted = await LocationService.requestPermissions();
      setPermissionGranted(granted);
    };
    
    requestPermissions();
  }, []);
  
  // Start/stop tracking based on isTracking state
  useEffect(() => {
    if (isTracking && permissionGranted && currentRun) {
      startTracking();
    } else {
      LocationService.stopWatching();
    }
    
    return () => {
      LocationService.stopWatching();
    };
  }, [isTracking, permissionGranted, currentRun]);
  
  const startTracking = async () => {
    const success = await LocationService.startWatching((location: Location) => {
      // Add location to current run
      dispatch(addLocation(location));
      
      // Calculate distance if we have a previous location
      if (lastLocation) {
        const distance = LocationService.calculateDistance(
          lastLocation.latitude,
          lastLocation.longitude,
          location.latitude,
          location.longitude
        );
        
        // Update current run with new distance
        if (currentRun) {
          dispatch(
            updateCurrentRun({
              distance: currentRun.distance + distance,
            })
          );
        }
      }
      
      setLastLocation(location);
    });
    
    if (!success) {
      console.error('Failed to start location tracking');
    }
  };
  
  return {
    permissionGranted,
    currentLocation: lastLocation,
  };
};
