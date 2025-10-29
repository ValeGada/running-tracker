import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView, Alert } from 'react-native';
import { Button, Card, Layout, Text, Icon } from '@ui-kitten/components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setRuns, deleteRunFromBackend, removeRun } from '../store/runSlice';
import { runApi } from '../services/api';
import dayjs from 'dayjs';
import { Run } from '../types';
import { TouchableOpacity } from 'react-native';
import { GenericModal } from '../components';

export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { runs, loading } = useSelector((state: RootState) => state.run);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loadingModalVisible, setLoadingModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [runToDelete, setRunToDelete] = useState<Run | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Load runs from backend
  useEffect(() => {
    const loadRuns = async () => {
      try {
        const runs = await runApi.getRuns();
        dispatch(setRuns(runs));
      } catch (error) {
        console.error('Failed to load runs:', error);
        // Fallback to mock data if backend is not available
        const mockRuns: Run[] = [
          {
            id: '1',
            userId: user?.id || '1',
            startTime: Date.now() - 86400000,
            endTime: Date.now() - 84600000,
            distance: 5.2,
            duration: 1800,
            averagePace: 5.77,
            maxSpeed: 12.5,
            calories: 350,
            route: [],
            status: 'completed',
          },
          {
            id: '2',
            userId: user?.id || '1',
            startTime: Date.now() - 172800000,
            endTime: Date.now() - 170400000,
            distance: 8.5,
            duration: 2700,
            averagePace: 5.29,
            maxSpeed: 14.2,
            calories: 580,
            route: [],
            status: 'completed',
          },
          {
            id: '3',
            userId: user?.id || '1',
            startTime: Date.now() - 259200000,
            endTime: Date.now() - 256800000,
            distance: 3.8,
            duration: 1320,
            averagePace: 5.79,
            maxSpeed: 11.8,
            calories: 260,
            route: [],
            status: 'completed',
          },
        ];
        
        dispatch(setRuns(mockRuns));
      }
    };

    loadRuns();
  }, [dispatch, user]);
  
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleDeleteRun = (run: Run) => {
    setRunToDelete(run);
    setDeleteModalVisible(true);
  };

  const confirmDeleteRun = async () => {
    if (!runToDelete) return;
    
    // Cerrar modal de confirmación y mostrar loading
    setDeleteModalVisible(false);
    setLoadingModalVisible(true);
    
    try {
      await dispatch(deleteRunFromBackend(runToDelete.id) as any);
      
      // Cerrar loading y mostrar éxito
      setLoadingModalVisible(false);
      setSuccessModalVisible(true);
      
      // Auto-cerrar modal de éxito después de 2 segundos
      setTimeout(() => {
        setSuccessModalVisible(false);
        setRunToDelete(null);
      }, 2000);
      
    } catch (error) {
      setLoadingModalVisible(false);
      setErrorModalVisible(true);
      setRunToDelete(null);
    }
  };

  const cancelDeleteRun = () => {
    setDeleteModalVisible(false);
    setRunToDelete(null);
  };

  const renderRunCard = ({ item }: { item: Run }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardContent}>
          <Text category="h6">
            {dayjs(item.startTime).format('MMM DD, YYYY')}
          </Text>
          <Text category="c1" appearance="hint">
            {dayjs(item.startTime).format('HH:mm')}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteRun(item)}
        >
          <Icon 
            name="trash-2-outline" 
            style={styles.deleteIcon} 
            fill="#FF3D71"
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {item.distance?.toFixed(2) || '0.00'}
          </Text>
          <Text category="c1" appearance="hint">
            km
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {formatDuration(item.duration)}
          </Text>
          <Text category="c1" appearance="hint">
            Duration
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {item.averagePace?.toFixed(2) || '0.00'}
          </Text>
          <Text category="c1" appearance="hint">
            min/km
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {item.calories}
          </Text>
          <Text category="c1" appearance="hint">
            kcal
          </Text>
        </View>
      </View>
    </Card>
  );
  
  return (
    <Layout style={styles.container}>
      <View style={styles.header}>
        <Text category="h3">Welcome, {user?.name || 'Runner'}!</Text>
        <Text category="s1" appearance="hint">
          Your running history
        </Text>
      </View>
      
      {runs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text category="h5" style={styles.emptyText}>
            🏃‍♂️
          </Text>
          <Text category="s1" appearance="hint" style={styles.emptyText}>
            No runs yet. Start your first run!
          </Text>
        </View>
      ) : (
        <FlatList
          data={runs}
          renderItem={renderRunCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <GenericModal
        preset="delete"
        visible={deleteModalVisible}
        runToDelete={runToDelete}
        onConfirm={confirmDeleteRun}
        onCancel={cancelDeleteRun}
        formatDuration={formatDuration}
        onBackdropPress={cancelDeleteRun}
      />

      <GenericModal
        preset="loader"
        visible={loadingModalVisible}
        message="Eliminando sesión de running..."
      />

      <GenericModal
        preset="success"
        visible={successModalVisible}
        title="¡Eliminado!"
        message="La sesión de running se eliminó correctamente"
      />

      <GenericModal
        preset="error"
        visible={errorModalVisible}
        title="Error"
        message="No se pudo eliminar la sesión de running. Inténtalo de nuevo."
        onConfirm={() => setErrorModalVisible(false)}
        confirmText="Aceptar"
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#DC3760',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
