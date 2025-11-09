import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const CategoryBar = () => {
  return (
    <View style={styles.categories}>
      <Link href="/client" asChild>
        <TouchableOpacity style={styles.categoryItem}>
          <Feather name="home" size={24} color="#FFB052" />
        </TouchableOpacity>
      </Link>

      <Link href="/request" asChild>
        <TouchableOpacity style={styles.categoryItem}>
          <Feather name="plus-circle" size={24} color="#00FFFF" />
        </TouchableOpacity>
      </Link>

      <Link href="/queue" asChild>
        <TouchableOpacity style={styles.categoryItem}>
          <Feather name="list" size={24} color="#FFB052" />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default CategoryBar;

const styles = StyleSheet.create({
  categories: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0d0d0d',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  categoryItem: {
    alignItems: 'center',
  },
});
