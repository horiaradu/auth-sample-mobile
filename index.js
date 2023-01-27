/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import App from './App';
import Toast from 'react-native-toast-message';
import { name as appName } from './app.json';

export default function Main() {
  return (
    <PaperProvider>
      <App />
      <Toast />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
