<!-- frontend/requirements.md -->
# React Native Frontend Requirements (Expo + TypeScript)

## Core Packages

- `expo`
- `react`
- `react-native`
- `typescript`

## PDF/File Picker

- `react-native-document-picker`

## Navigation

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-screens`
- `react-native-safe-area-context`
- `react-native-gesture-handler`
- `react-native-reanimated` _(+ babel config)_

## State & Storage

- `@react-native-async-storage/async-storage` _(optional)_

## HTTP Requests

- `axios` _(optional – you can also use `fetch`)_

---

## Babel Config

Make sure `babel.config.js` includes:

```js
plugins: ['react-native-reanimated/plugin']

```

## Install Commands

```js
npm install react-native-document-picker

npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

npm install @react-native-async-storage/async-storage
npm install axios
```