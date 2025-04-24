import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {Colors, FontsFamilys, FontSize, ImageUrl, Texts} from '../../constant';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';

type VerifyHumanProps = {
  navigation: NativeStackNavigationProp<any>;
};

const VerifyHuman: React.FC<VerifyHumanProps> = ({navigation}) => {
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const device = useCameraDevice('front', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });
  const cameraRef = useRef<Camera | null>(null);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status === 'authorized');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();
      const base64Image = await RNFS.readFile(photo.path, 'base64');
      try {
        await AsyncStorage.setItem('selfiePhoto', base64Image);
        console.log('Photo saved to AsyncStorage');
      } catch (error) {
        console.error('Error saving photo:', error);
      }
      navigation.navigate(ROUTE_NAMES.ReviewPhotoScreen, {photo});
    }
  };

  if (!device) return <Text style={styles.subtitle}>Loading camera...</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'black'} />
      <Text style={styles.title}>{Texts.Take_selfie_photo}</Text>
      <Text style={styles.subtitle}>
        {Texts.Your_face_must_be_clearly_visible}
      </Text>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
        <View style={styles.overlayContainer}>
          <Image source={ImageUrl.Cameraframe} style={styles.overlayImage} />
        </View>
      </View>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Image source={ImageUrl.PhotoClickbutton} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(ROUTE_NAMES.DetailsFill, {photo: null})
        }>
        <Text style={styles.skipText}>{Texts.Skip_for_now}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 0,
  },

  overlayImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    // borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.dark_yellow,
    fontSize: FontSize.T_four,
    fontFamily: FontsFamilys.Poppins_Bold,
  },
  subtitle: {
    color: '#fff',
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Regular,
    marginBottom: 20,
  },
  cameraContainer: {
    width: '92%',
    height: '60%',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  captureButton: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
  },
  skipText: {
    marginTop: 20,
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Regular,
    color: Colors.dark_yellow,
  },
});

export default VerifyHuman;
