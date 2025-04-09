// frontend/next.config.js
const withTM = require('next-transpile-modules')([
    'react-native',
    'react-native-web',
    'react-native-svg',
    'react-native-vector-icons',
    'react-native-gesture-handler',
    'react-native-safe-area-context',
    'react-native-screens'
  ]);
  
  module.exports = withTM({
    reactStrictMode: true,
    experimental: {
      legacyBrowsers: false
    }
  });