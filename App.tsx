import React, {useEffect} from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import {ThemeProvider, useTheme} from './sourceCode/utils/ThemeProvider';
import RootNavigator from './sourceCode/navigation/RootNavigator';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Store, {persistor} from './sourceCode/Redux/store';
import {
  notificationListener,
  requestUserPermission,
} from './sourceCode/utils/notificationServices';

const App = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        console.log('Setting up notifications...');
        await requestUserPermission(denied => {
          if (denied) {
            console.log('Notification permission was denied');
            // You can show a toast or alert here to inform the user
          } else {
            console.log('Notification permission granted');
          }
        });
        notificationListener();
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    };

    setupNotifications();
  }, []);

  return (
   
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
    
  );
};

const AppContent = () => {
  const theme = useTheme();
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>

    
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={
          theme.colors.background === '#000' ? 'light-content' : 'dark-content'
        }
      />
      <RootNavigator />
    </GestureHandlerRootView>
 
    </PersistGate>
    </Provider>
    
  );
};

export default App;
const styles = StyleSheet.create({
  container: {flex: 1},
});
