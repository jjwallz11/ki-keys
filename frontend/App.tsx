import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import { AuthProvider } from './providers/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <RootNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}