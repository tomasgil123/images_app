/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation'

const App: () => React$Node = () => {
  return (
    <>
        <NavigationContainer>
          <AppNavigator/>
      </NavigationContainer>
    </>
  );
};


export default App;
