// app/vehicle-result.tsx

import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function VehicleResultScreen() {
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Vehicle Info</Text>
      <Text>VIN: {params.vin}</Text>
      <Text>Make: {params.make}</Text>
      <Text>Model: {params.model}</Text>
      <Text>Year: {params.year}</Text>
      <Text>Body Type: {params.bodyType}</Text>
      <Text>Fuel Type: {params.fuelType}</Text>
      <Text>Manufacturer: {params.manufacturer}</Text>
      <Text>Plant Country: {params.plantCountry}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});