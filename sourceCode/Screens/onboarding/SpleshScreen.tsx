import {
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ImageUrl } from '../../constant';
import { useNavigation } from '@react-navigation/native';
import { ROUTE_NAMES } from '../../navigation/StackNavigation';

const SpleshScreen = () => {
  const navigation = useNavigation();


  setTimeout(() => {
    navigation.replace(ROUTE_NAMES.SignIn);
  }, 1000);

  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.85]} // Ensures bottom is pure white
      style={styles.container}
    >
      <StatusBar backgroundColor="#FEB413" />
      <Image
        source={ImageUrl.PallsSpleshIcon}
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
};

export default SpleshScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '90%',  // Responsive image
    height: undefined,
    aspectRatio: 2
  },
});
