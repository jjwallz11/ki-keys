import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { resetPassword } from '../../services/api/auth';
import { logError } from '../../utils/log';

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params as { token: string };

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword(token, password);
      setMessage('Password reset successful! You can now log in.');
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
      <Text style={styles.title}>Reset Password</Text>

      <TextInput
        placeholder="New Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#ccc"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />

      {message && <Text style={styles.message}>{message}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        onPress={handleSubmit}
        disabled={submitting || !password || !confirm}
        style={({ pressed }) => [
          styles.button,
          (pressed || submitting) && styles.buttonHover,
          (!password || !confirm || submitting) && styles.disabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Resetting...' : 'Reset Password'}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login' as never)}>
        <Text style={styles.link}>Back to Login</Text>
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
  link: {
    color: '#072460',
    marginTop: 24,
    fontWeight: '500',
  },
});