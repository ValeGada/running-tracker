import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { startRun, stopRun, pauseRun, resumeRun, saveRunToBackend } from '../store/runSlice';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { useAutoStart } from '../hooks/useAutoStart';
import { Run } from '../types';
import MapView, { Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';

export const RunSessionScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const { currentRun, isTracking } = useSelector((state: RootState) => state.run);
  const { user } = useSelector((state: RootState) => state.auth);
  const { permissionGranted, currentLocation } = useLocationTracking();
  
  // Hook de autoStart
  const { 
    isMonitoring, 
    movementDetected, 
    movementIntensity, 
    isWaitingForAutoStart,
    autoStartEnabled 
  } = useAutoStart();
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,  // Más zoom (menor valor = más zoom)
    longitudeDelta: 0.005, // Más zoom (menor valor = más zoom)
  });
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && currentRun) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentRun.startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentRun]);

  // Update map region when user location changes
  useEffect(() => {
    if (currentLocation) {
      setMapRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.005,  // Más zoom para seguimiento de ubicación
        longitudeDelta: 0.005, // Más zoom para seguimiento de ubicación
      });
    }
  }, [currentLocation]);

  // Center map on route when run starts
  useEffect(() => {
    if (currentRun && currentRun.route.length > 0) {
      const lastLocation = currentRun.route[currentRun.route.length - 1];
      setMapRegion({
        latitude: lastLocation.latitude,
        longitude: lastLocation.longitude,
        latitudeDelta: 0.005,  // Más zoom para seguimiento de ruta
        longitudeDelta: 0.005, // Más zoom para seguimiento de ruta
      });
    }
  }, [currentRun?.route]);
  
  const handleStart = () => {
    const newRun: Run = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      startTime: Date.now(),
      endTime: Date.now(),
      distance: 0,
      duration: 0,
      averagePace: 0,
      maxSpeed: 0,
      calories: 0,
      route: [],
      status: 'active',
    };
    
    dispatch(startRun(newRun));
  };
  
  const handleStop = () => {
    if (currentRun) {
      const completedRun = {
        ...currentRun,
        endTime: Date.now(),
        duration: elapsedTime,
        status: 'completed' as const,
      };
      
      // First stop the run (clears currentRun)
      dispatch(stopRun());
      
      // Then save to backend (which will add to runs array)
      dispatch(saveRunToBackend(completedRun));
    }
    
    setElapsedTime(0);
  };
  
  const handlePause = () => {
    dispatch(pauseRun());
  };
  
  const handleResume = () => {
    dispatch(resumeRun());
  };
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const calculatePace = (): string => {
    if (!currentRun || currentRun.distance === 0) return '--:--';
    const paceMinutes = elapsedTime / 60 / currentRun.distance;
    const minutes = Math.floor(paceMinutes);
    const seconds = Math.floor((paceMinutes - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const calculateSpeed = (): string => {
    if (!currentRun || elapsedTime === 0) return '0.0';
    const speed = (currentRun.distance / (elapsedTime / 3600));
    return formatSpeed(speed);
  };
  
  const formatSpeed = (speed: number | undefined): string => {
    if (!speed || isNaN(speed)) return '0.0';
    return speed.toFixed(1);
  };
  
  return (
    <Layout style={[styles.container, { paddingTop: Platform.OS === 'android' ? Math.max(insets.top, 44) : insets.top }]}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          region={mapRegion}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          showsCompass
          onRegionChangeComplete={setMapRegion}
        >
          {currentRun && currentRun.route && currentRun.route.length > 1 && (
            <Polyline
              coordinates={currentRun.route.map((loc) => ({
                latitude: loc.latitude,
                longitude: loc.longitude,
              }))}
              strokeColor="#DC3760"
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          )}
        </MapView>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.mainStat}>
          <Text category="h1" style={styles.mainStatValue}>
                  {currentRun ? (currentRun.distance?.toFixed(2) || '0.00') : '0.00'}
                </Text>
          <Text category="s1" appearance="hint">
            kilometers
          </Text>
        </View>
        
        <View style={styles.secondaryStats}>
          <View style={styles.stat}>
            <Text category="h5" style={styles.statValue}>
              {formatTime(elapsedTime)}
            </Text>
            <Text category="c1" appearance="hint">
              Time
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text category="h5" style={styles.statValue}>
              {calculatePace()}
            </Text>
            <Text category="c1" appearance="hint">
              Pace (min/km)
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Text category="h5" style={styles.statValue}>
              {calculateSpeed()}
            </Text>
            <Text category="c1" appearance="hint">
              Speed (km/h)
            </Text>
          </View>
        </View>
        
        {/* Indicador de AutoStart */}
        {autoStartEnabled && !currentRun && (
          <View style={styles.autoStartIndicator}>
            <View style={[
              styles.autoStartDot, 
              { backgroundColor: isMonitoring ? (movementDetected ? '#4CAF50' : '#FFC107') : '#9E9E9E' }
            ]} />
            <Text category="c2" appearance="hint" style={styles.autoStartText}>
              {isMonitoring 
                ? (isWaitingForAutoStart 
                    ? 'Detectando actividad...' 
                    : (movementDetected ? 'Movimiento detectado' : 'Auto-start activo'))
                : 'Auto-start deshabilitado'
              }
            </Text>
            {movementDetected && (
              <Text category="c2" appearance="hint" style={styles.intensityText}>
                Intensidad: {Math.round(movementIntensity * 100)}%
              </Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.controls}>
        {!currentRun ? (
          <Button
            size="giant"
            style={styles.startButton}
            onPress={handleStart}
            disabled={!permissionGranted}
          >
            {permissionGranted ? 'Start Run' : 'Location Permission Required'}
          </Button>
        ) : (
          <View style={styles.activeControls}>
            {currentRun.status === 'active' ? (
              <Button
                size="large"
                appearance="outline"
                style={styles.controlButton}
                onPress={handlePause}
              >
                Pause
              </Button>
            ) : (
              <Button
                size="large"
                style={styles.controlButton}
                onPress={handleResume}
              >
                Resume
              </Button>
            )}
            
            <Button
              size="large"
              status="danger"
              style={styles.controlButton}
              onPress={handleStop}
            >
              Stop
            </Button>
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainStatValue: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#DC3760',
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
  },
  controls: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
  },
  startButton: {
    width: '100%',
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  autoStartIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  autoStartDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  autoStartText: {
    fontSize: 12,
    marginRight: 8,
  },
  intensityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
