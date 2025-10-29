import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Card, Layout, Text, Spinner } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { runApi } from '../services/api';

interface Statistics {
  totalRuns: number;
  totalDistance: number;
  totalDuration: number;
  totalCalories: number;
  averageDistance: number;
  averagePace: number;
  averageCalories: number;
}

export const SummaryScreen: React.FC = () => {
  const { runs } = useSelector((state: RootState) => state.run);
  const [backendStats, setBackendStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  // Load statistics from backend
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const stats = await runApi.getStats();
        setBackendStats(stats);
      } catch (error) {
        console.error('Failed to load statistics from backend:', error);
        // Fall back to local calculation if backend fails
        setBackendStats(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadStatistics();
  }, []);
  
  // Calculate local statistics as fallback
  const localStats: Statistics = {
    totalRuns: runs.length,
    totalDistance: runs.reduce((sum, run) => sum + run.distance, 0),
    totalDuration: runs.reduce((sum, run) => sum + run.duration, 0),
    totalCalories: runs.reduce((sum, run) => sum + run.calories, 0),
    averageDistance: runs.length > 0 ? runs.reduce((sum, run) => sum + run.distance, 0) / runs.length : 0,
    averagePace: runs.length > 0 && runs.reduce((sum, run) => sum + run.distance, 0) > 0 
      ? runs.reduce((sum, run) => sum + run.duration, 0) / 60 / runs.reduce((sum, run) => sum + run.distance, 0) 
      : 0,
    averageCalories: runs.length > 0 ? runs.reduce((sum, run) => sum + run.calories, 0) / runs.length : 0,
  };
  
  // Use backend stats if available, otherwise use local stats
  const stats = backendStats || localStats;
  
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text category="h3">Your Statistics</Text>
          <Text category="s1" appearance="hint">
            Overall running summary
          </Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Spinner size="large" />
            <Text category="s1" style={styles.loadingText}>
              Loading statistics...
            </Text>
          </View>
        ) : (
          <>
            <Card style={styles.card}>
              <Text category="h6" style={styles.cardTitle}>
                Total Summary
              </Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats.totalRuns}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Total Runs
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats?.totalDistance?.toFixed(2) || '0.00'}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Total Distance (km)
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats?.totalDuration ? formatDuration(stats.totalDuration) : '0:00:00'}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Total Duration
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats?.totalCalories || 0}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Total Calories
                  </Text>
                </View>
              </View>
            </Card>
            
            <Card style={styles.card}>
              <Text category="h6" style={styles.cardTitle}>
                Averages
              </Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats?.averageDistance?.toFixed(2) || '0.00'}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Avg Distance (km)
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats?.averagePace?.toFixed(2) || '0.00'}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Avg Pace (min/km)
                  </Text>
                </View>
                
                <View style={styles.statItem}>
                  <Text category="h4" style={styles.statValue}>
                    {stats?.averageCalories?.toFixed(0) || '0'}
                  </Text>
                  <Text category="c1" appearance="hint">
                    Avg Calories
                  </Text>
                </View>
              </View>
            </Card>
            
            {stats.totalRuns === 0 && (
              <View style={styles.emptyContainer}>
                <Text category="h5" style={styles.emptyIcon}>
                  📊
                </Text>
                <Text category="s1" appearance="hint" style={styles.emptyText}>
                  Start running to see your statistics!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#DC3760',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
  },
});
