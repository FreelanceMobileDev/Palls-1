import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {FontsFamilys, FontSize, ImageUrl, Texts} from '../../constant';
import {moderateScale, scale} from '../../utils/responsive';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import Header from '../../components/Header';
import OpacityButton from '../../components/OpacityButton';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {imageUpload} from '../../Api/helper';
import {useDispatch} from 'react-redux';
import {setImages} from '../../Redux/cookiesReducer';

const UploadPicture = ({route}) => {
  const {param} = route.params;
  console.log(param, 'param from DetailsFill=========>>>>>>');
  const navigation = useNavigation<any>();
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{[key: number]: string}>(
    {},
  );
  const dispatch = useDispatch();
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // For Android 13 and above, we don't need storage permissions
        if (Platform.Version >= 33) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'App needs access to your storage to pick images',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async () => {
    const hasPermission = await requestStoragePermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Please grant storage permission to select or take a photo.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return;
    }

    Alert.alert(
      'Upload Photo',
      'Choose a method',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await launchCamera({
              mediaType: 'photo',
              cameraType: 'back',
              quality: 1,
            });

            handleImageResult(result);
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            const result = await launchImageLibrary({
              mediaType: 'photo',
              quality: 1,
            });

            handleImageResult(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );

    // console.log('====>>>test')
  };

  const handleImageResult = result => {
    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const selectedImage = result.assets[0];
    if (!selectedImage.uri) {
      setError('No image selected or invalid file.');
      return;
    }

    setSelectedImages(prev => {
      const newImages = {...prev};
      const usedKeys = Object.keys(newImages).map(k => parseInt(k));
      let nextKey = 0;

      while (usedKeys.includes(nextKey) && newImages[nextKey]) {
        nextKey++;
      }

      if (nextKey >= 6) {
        setError('Maximum of 6 images allowed.');
        return prev;
      }

      newImages[nextKey] = selectedImage.uri;

      return newImages;
    });

    setError('');
  };

  const handleSubmit = async () => {
    const selectedURIs = Object.values(selectedImages).filter(uri => uri);
    if (selectedURIs.length < 2) {
      setError('Please select at least two photos');
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      selectedURIs.forEach((image, index) => {
        formData.append('files', {
          uri: image,
          type: image.type || 'image/jpeg',
          name: image.name || `image_${index}.jpg`,
        });
      });
      const response = await imageUpload(formData);
      console.log(response, 'response======>');
      const resUrls = response?.data?.data?.urls;
      console.log(resUrls, 'resUrls=====>');
      dispatch(setImages(resUrls));

      setIsLoading(false);
      navigation.navigate('RelationShipPrefrence', {
        single: param,
        multi: resUrls,
      });
    } catch (err) {
      setIsLoading(false);
      // setError('Failed to upload images. Please try again.');
    }
  };

  const renderPhotoBox = (key: number, isLarge = false) => (
    <TouchableOpacity
      key={key}
      style={[styles.photoBox, isLarge && styles.largeBox]}
      onPress={handleImagePick}>
      {' '}
      {/* ← No need for key here anymore */}
      {selectedImages[key] ? (
        <Image
          source={{uri: selectedImages[key]}}
          style={[styles.image, isLarge && styles.largeImage]}
          resizeMode="cover"
        />
      ) : (
        <Image source={ImageUrl.PlusIcon} style={styles.plusIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.8]}
      style={styles.container}>
      <Header
        leftIcon={ImageUrl.BackIcon}
        onPressLeftImg={() => navigation.goBack()}
        containerstyle={{
          marginTop: moderateScale(48),
          marginLeft: moderateScale(22),
        }}
      />
      <View style={styles.Enter_Number_View}>
        <Text style={styles.Enter_Number}>{Texts.Recent_pic}</Text>
        <Text style={styles.UploadText}>{Texts.Upload_Photo}</Text>
      </View>

      <View style={styles.photoGrid}>
        <View style={styles.leftColumn}>
          {renderPhotoBox(0, true)}
          <View style={styles.bottomRow}>
            {renderPhotoBox(1)}
            {renderPhotoBox(2)}
          </View>
        </View>
        <View style={styles.rightColumn}>
          {renderPhotoBox(3)}
          {renderPhotoBox(4)}
          {renderPhotoBox(5)}
        </View>
      </View>

      {/* Error message if any */}
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      {/* Bottom button */}
      <View style={styles.bottomButton}>
        <OpacityButton
          name={Texts.Next}
          loading={isLoading}
          pressButton={handleSubmit}
        />
      </View>
    </LinearGradient>
  );
};

export default UploadPicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  Enter_Number_View: {
    marginVertical: moderateScale(40),
  },
  Enter_Number: {
    fontSize: scale(20),
    textAlign: 'center',
    fontFamily: FontsFamilys.Poppins_SemiBold,
  },
  genderView: {
    backgroundColor: '#ffffff',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: moderateScale(8),
  },
  errorText: {
    color: 'red',
    marginTop: moderateScale(10),
    fontFamily: FontsFamilys.Poppins_Regular,
  },
  bottomButton: {
    position: 'absolute',
    bottom: moderateScale(30),
    width: '85%',
    alignItems: 'center',
  },
  UploadText: {
    textAlign: 'center',
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Medium,
    marginVertical: moderateScale(28),
    marginHorizontal: moderateScale(15),
  },
  photoBox: {
    height: scale(95),
    width: scale(95),
    backgroundColor: '#fff',
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: '#9A9A9A',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  largeBox: {
    height: scale(200),
    width: scale(200),
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: '#9A9A9A',
  },
  plusIcon: {
    width: scale(24),
    height: scale(24),
    tintColor: '#9A9A9A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  largeImage: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  photoGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: moderateScale(12),
  },
  leftColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    marginTop: moderateScale(12),
    gap: moderateScale(8),
  },
  rightColumn: {
    flexDirection: 'column',
    gap: moderateScale(10),
  },
});
