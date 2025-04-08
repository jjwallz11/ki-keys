import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {requestPasswordReset} from '../../services/api/auth'; // Adjust if needed
import {logError} from '../../utils/log'; // You already have this!

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setMessage(null);
    setError(null);
    setSubmitting(true);

    try {
      await requestPasswordReset(email);
      setMessage('Check your email for reset instructions.');
    } catch (err: any) {
      const msg = err.message || 'Something went wrong.';
      setError(msg);
      logError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        placeholder="Enter your email"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {message && <Text style={styles.message}>{message}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        onPress={handleSubmit}
        disabled={submitting || !email}
        style={({pressed}) => [
          styles.button,
          (pressed || submitting) && styles.buttonHover,
          (!email || submitting) && styles.disabled,
        ]}>
        <Text style={styles.buttonText}>
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Login' as never)}>
        <Text style={{color: '#072460', marginTop: 24, fontWeight: '500'}}>
          Back to Login
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#072460',
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
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    backgroundColor: '#F9F9F9',
  },
  message: {
    color: '#0A3161',
    marginBottom: 12,
  },
  error: {
    color: '#AE2335',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#072460',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  buttonHover: {
    backgroundColor: '#0A3161',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
