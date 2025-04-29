import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {FontsFamilys, ImageUrl, Texts} from '../../constant';
import {moderateScale, scale} from '../../utils/responsive';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Header from '../../components/Header';
import OpacityButton from '../../components/OpacityButton';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Gender = ({route}) => {
  const {param} = route.params;
  console.log(param, 'param from DetailsFill');
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedGender) {
      setError('Please select a gender to continue');
      return;
    }
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      let updatedDetails = userDetails ? JSON.parse(userDetails) : {};

      updatedDetails.gender = selectedGender; // Add gender as a string

      await AsyncStorage.setItem('userDetails', JSON.stringify(updatedDetails));
      console.log('Gender updated:', updatedDetails);

      setError('');
      navigation.navigate(ROUTE_NAMES.UploadPicture, {
        param,
      });
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const renderGenderOption = label => {
    const isSelected = selectedGender === label;

    return (
      <TouchableOpacity
        style={[
          styles.genderView,
          isSelected && {borderColor: '#2A9D16', borderWidth: 2},
        ]}
        onPress={() => {
          setSelectedGender(label);
          setError('');
        }}>
        <Text
          style={{
            color: '#9A9A9A',
            fontFamily: FontsFamilys.Poppins_Regular,
          }}>
          {label}
        </Text>
        <Image
          source={isSelected ? ImageUrl.CheckBox : ImageUrl.BlankCheck}
          style={styles.checkIcon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.8]}
      style={styles.container}>
      <Header
        leftIcon={ImageUrl.BackIcon}
        onPressLeftImg={() => navigation.goBack()}
        containerstyle={{
          marginTop: moderateScale(28),
          marginLeft: moderateScale(22),
        }}
      />
      <View style={styles.Enter_Number_View}>
        <Text style={styles.Enter_Number}>{Texts.Gender}</Text>
      </View>

      {renderGenderOption(Texts.Women)}
      {renderGenderOption(Texts.Men)}

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}

      {/* Bottom button */}
      <View style={styles.bottomButton}>
        <OpacityButton name={Texts.Next} pressButton={handleSubmit} />
      </View>
    </LinearGradient>
  );
};

export default Gender;

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
  checkIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});
