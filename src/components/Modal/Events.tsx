import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Tag} from '../Tag';

interface IEventProps {
  events: [];
}

export function Events({events}: IEventProps) {
  return (
    <View style={styles.methodsContainer}>
      <Text style={styles.methodEventsTitle}>Events</Text>
      <View style={styles.flexRowWrapped}>
        {events?.map((method: string, index: number) => (
          <Tag key={index} value={method} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  methodsContainer: {
    backgroundColor: 'rgba(43, 47, 53, 1)',
    borderRadius: 20,
    padding: 8,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  methodEventsTitle: {
    color: 'white',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    paddingLeft: 6,
    paddingVertical: 4,
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
