import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuthContext} from '../../providers/AuthProvider';
import {login} from '../../services/api/auth';
import Feather from 'react-native-vector-icons/Feather';

export default function LoginScreen() {
  const navigation = useNavigation();
  const {setToken} = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await login(email, password);
      await setToken(token);
      navigation.navigate('Home' as never);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.passwordInput}
        />
        <Pressable onPress={() => setShowPassword(prev => !prev)}>
          <Feather
            name={showPassword ? 'eye' : 'eye-off'}
            size={20}
            color="#888"
          />
        </Pressable>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Pressable
        onPress={handleLogin}
        style={({pressed}) => [
          styles.button,
          pressed && styles.buttonHover,
          loading && styles.disabledButton,
        ]}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
      <Pressable onPress={() => navigation.navigate('ForgotPassword' as never)}>
        <Text style={{color: '#072460', marginTop: 16, fontWeight: '500'}}>
          Forgot Password?
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // white background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#072460', // Patriotic Blue
    marginBottom: 32,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#072460',
    borderRadius: 8,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#072460', // Patriotic Blue
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#0A3161', // Old Glory Blue
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF', // White
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#AE2335', // Patriotic Red
    marginBottom: 12,
  },
  passwordContainer: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#072460',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    fontSize: 16,
    color: '#000000',
  },
});
