import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritesScreen = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Your favorite movies will appear here.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18 },
});

export default FavoritesScreen;
