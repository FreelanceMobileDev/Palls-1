import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import {FontsFamilys, ImageUrl, Texts} from '../../constant';
import {useNavigation} from '@react-navigation/native';
import {moderateScale, scale} from '../../utils/responsive';
import CustomTextInput from '../../components/CustomTextInput';
import OpacityButton from '../../components/OpacityButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {sendOtp} from '../../Api/helper';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EnterPhoneNumber = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState('MY');
  const [country, setCountry] = useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');

  const validatePhoneNumber = (number: string) => {
    if (!number) {
      return 'Please enter the number';
    }
    const onlyDigits = /^\d+$/;
    if (!onlyDigits.test(number)) {
      return 'Phone number must contain only digits';
    } else if (number.length < 10) {
      return 'Phone number must be at least 10 digits';
    } else if (number.length > 16) {
      return 'Phone number must not exceed 16 digits';
    }
    return '';
  };

  const handlePhoneSubmit = async () => {
    const validationError = validatePhoneNumber(contactNumber);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    try {
      const payload = {phone: contactNumber};
      setIsloading(true);
      const response = await sendOtp(payload);
      console.log('send otp API response:', response?.data);
      const userId = response?.data?.data?.response?._id;
      console.log('User ID:', userId);
      await storeApiResponse(response);

      if (response?.data?.status) {
        setIsloading(false);
        navigation.navigate('OTPScreen', {
          phone:
            (country?.callingCode?.[0] ? country.callingCode[0] : '60') +
            ' ' +
            contactNumber,
        });
      } else {
        setIsloading(false);
      }
    } catch (error) {
      setIsloading(false);
      console.error('Login API error:', error);
    }
  };

  const storeApiResponse = async (response: any) => {
    try {
      const fullData = response?.data?.data?.response;
      console.log(fullData, 'Saving to AsyncStorage');

      if (fullData) {
        await AsyncStorage.setItem('userData', JSON.stringify(fullData));
        console.log('User data saved to AsyncStorage');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FEB413'}}>
      <LinearGradient
        colors={['#FEB413', '#F9F9F9']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}>
                  <Header
                    leftIcon={ImageUrl.BackIcon}
                    onPressLeftImg={() => navigation.goBack()}
                    containerstyle={{
                      marginTop: moderateScale(48),
                      marginLeft: moderateScale(22),
                    }}
                  />

                  <View style={styles.Enter_Number_View}>
                    <Text style={styles.Enter_Number}>
                      {Texts.Enter_Number}
                    </Text>
                  </View>

                  <View style={styles.formContainer}>
                    <View style={styles.inputWrapper}>
                      <CustomTextInput
                        placeholder={Texts.Phone_Number}
                        keyboardType="numeric"
                        value={contactNumber}
                        onChangeText={text => {
                          if (/^\d*$/.test(text)) {
                            setContactNumber(text);
                          }
                        }}
                        length={16}
                        leftComponent={
                          <CountryPicker
                            withFlag
                            withCallingCode
                            withFilter
                            withCallingCodeButton
                            withCountryNameButton={false}
                            countryCode={countryCode}
                            onSelect={country => {
                              setCountryCode(country.cca2);
                              setCountry(country);
                            }}
                          />
                        }
                      />
                      {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                      ) : null}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <View style={styles.fixedButtonContainer}>
          <OpacityButton
            name={Texts.Next}
            pressButton={handlePhoneSubmit}
            button={styles.bottomButton}
            loading={isLoading}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EnterPhoneNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: moderateScale(10),
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  Enter_Number_View: {
    marginVertical: moderateScale(40),
    alignItems: 'center',
  },
  Enter_Number: {
    fontSize: scale(16),
    textAlign: 'center',
    fontFamily: FontsFamilys.Poppins_SemiBold,
    width: '75%',
  },
  errorText: {
    color: 'red',
    fontSize: scale(11),
    fontFamily: FontsFamilys.Poppins_Regular,
    marginTop: moderateScale(2),
  },
  inputWrapper: {
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomButton: {
    width: '75%',
    height: moderateScale(49),
  },
  countryPickerStyle: {
    marginTop: moderateScale(14),
    marginLeft: moderateScale(-15),
  },
  fixedButtonContainer: {
    position: 'static',
    left: 20,
    right: 20,
    alignItems: 'center',
    marginBottom: moderateScale(40),
  },
});
