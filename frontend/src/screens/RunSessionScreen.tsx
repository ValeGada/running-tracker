import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { startRun, stopRun, pauseRun, resumeRun } from '../store/runSlice';
import { useLocationTracking } from '../hooks/useLocationTracking';
import { Run } from '../types';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';

export const RunSessionScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { currentRun, isTracking } = useSelector((state: RootState) => state.run);
  const { user } = useSelector((state: RootState) => state.auth);
  const { permissionGranted } = useLocationTracking();
  const [elapsedTime, setElapsedTime] = useState(0);
  
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
    dispatch(stopRun());
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
    return speed.toFixed(1);
  };
  
  return (
    <Layout style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation
          followsUserLocation
        >
          {currentRun && currentRun.route.length > 0 && (
            <Polyline
              coordinates={currentRun.route.map((loc) => ({
                latitude: loc.latitude,
                longitude: loc.longitude,
              }))}
              strokeColor="#DC3760"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.mainStat}>
          <Text category="h1" style={styles.mainStatValue}>
            {currentRun ? currentRun.distance.toFixed(2) : '0.00'}
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
});
