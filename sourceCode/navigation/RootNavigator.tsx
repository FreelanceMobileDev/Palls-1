import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './StackNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const RootNavigator = () => {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default RootNavigator;
