import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Layout, Text } from '@ui-kitten/components';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export const SummaryScreen: React.FC = () => {
  const { runs } = useSelector((state: RootState) => state.run);
  
  // Calculate statistics
  const totalRuns = runs.length;
  const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
  const totalDuration = runs.reduce((sum, run) => sum + run.duration, 0);
  const totalCalories = runs.reduce((sum, run) => sum + run.calories, 0);
  
  const averageDistance = totalRuns > 0 ? totalDistance / totalRuns : 0;
  const averagePace =
    totalDistance > 0 ? totalDuration / 60 / totalDistance : 0;
  const averageCalories = totalRuns > 0 ? totalCalories / totalRuns : 0;
  
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
        
        <Card style={styles.card}>
          <Text category="h6" style={styles.cardTitle}>
            Total Summary
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text category="h4" style={styles.statValue}>
                {totalRuns}
              </Text>
              <Text category="c1" appearance="hint">
                Total Runs
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text category="h4" style={styles.statValue}>
                {totalDistance.toFixed(1)}
              </Text>
              <Text category="c1" appearance="hint">
                Total Distance (km)
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text category="h4" style={styles.statValue}>
                {formatDuration(totalDuration)}
              </Text>
              <Text category="c1" appearance="hint">
                Total Duration
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text category="h4" style={styles.statValue}>
                {totalCalories}
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
                {averageDistance.toFixed(2)}
              </Text>
              <Text category="c1" appearance="hint">
                Avg Distance (km)
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text category="h4" style={styles.statValue}>
                {averagePace.toFixed(2)}
              </Text>
              <Text category="c1" appearance="hint">
                Avg Pace (min/km)
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text category="h4" style={styles.statValue}>
                {averageCalories.toFixed(0)}
              </Text>
              <Text category="c1" appearance="hint">
                Avg Calories
              </Text>
            </View>
          </View>
        </Card>
        
        {totalRuns === 0 && (
          <View style={styles.emptyContainer}>
            <Text category="h5" style={styles.emptyIcon}>
              📊
            </Text>
            <Text category="s1" appearance="hint" style={styles.emptyText}>
              Start running to see your statistics!
            </Text>
          </View>
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
