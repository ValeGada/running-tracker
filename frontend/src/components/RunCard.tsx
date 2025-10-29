import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from '@ui-kitten/components';
import { Run } from '../types';
import dayjs from 'dayjs';

interface RunCardProps {
  run: Run;
  onPress?: () => void;
}

export const RunCard: React.FC<RunCardProps> = ({ run, onPress }) => {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text category="h6">
          {dayjs(run.startTime).format('MMM DD, YYYY')}
        </Text>
        <Text category="c1" appearance="hint">
          {dayjs(run.startTime).format('HH:mm')}
        </Text>
      </View>
      
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {run.distance?.toFixed(2) || '0.00'}
          </Text>
          <Text category="c1" appearance="hint">
            km
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {formatDuration(run.duration)}
          </Text>
          <Text category="c1" appearance="hint">
            Duration
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text category="h5" style={styles.statValue}>
            {run.averagePace?.toFixed(2) || '0.00'}
          </Text>
          <Text category="c1" appearance="hint">
            min/km
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: '#DC3760',
    fontWeight: 'bold',
  },
});
