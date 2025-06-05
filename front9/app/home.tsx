import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.first_name}!</Text>
      <Text style={styles.subtitle}>Email: {user?.email}</Text>
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 24 },
});