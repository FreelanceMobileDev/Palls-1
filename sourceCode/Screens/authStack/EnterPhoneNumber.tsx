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
import {Formik} from 'formik';
import * as Yup from 'yup';
import OpacityButton from '../../components/OpacityButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {sendOtp} from '../../Api/helper';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { setIsloading } from '../../Redux/reducer';

const validationSchema = Yup.object().shape({
  contactNumber: Yup.string()
    .matches(/^\d+$/, 'Contact number must contain only digits')
    .min(10, 'Contact number must be at least 10 digits')
    .max(16, 'Contact number must not exceed 16 digits')
    .required('Contact number is required'),
});

const EnterPhoneNumber = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState('MY');
  const [country, setCountry] = useState(null);
  const [isLoading, setIsloading] = useState(false);

  const handlePhoneSubmit = async (values: any) => {
    try {
      const payload = {phone: values.contactNumber};
      setIsloading(true);
      const response = await sendOtp(payload);
      console.log('Login API response:', response?.data);
      const userId = response?.data?.data?.response?._id;
      console.log('User ID:', userId);
      await storeApiResponse(response);

      if (response?.data?.status) {
        setIsloading(false);
        navigation.navigate('OTPScreen', {
          phone: values.contactNumber,
        });
      } else {
        setIsloading(false);
        // alert(
        //   response?.data?.message || 'Something went wrong. Please try again.',
        // );
      }
    } catch (error) {
      setIsloading(false);
      console.error('Login API error:', error);
      // alert('Something went wrong. Please try again.');
    }
  };

  const storeApiResponse = async response => {
    try {
      const fullData = response?.data?.data?.response;
      console.log(fullData, 'sjhfgvswjrgfuwg');

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
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex: 1}}>
              {/* Removed unnecessary string literal here: {' '} */}
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
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
                  <Text style={styles.Enter_Number}>{Texts.Enter_Number}</Text>
                </View>
                <Formik
                  initialValues={{contactNumber: ''}}
                  validationSchema={validationSchema}
                  onSubmit={handlePhoneSubmit}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <View style={styles.formContainer}>
                      <View>
                        <View style={styles.inputWrapper}>
                          <CustomTextInput
                            placeholder={Texts.Phone_Number}
                            keyboardType="numeric"
                            onChangeText={handleChange('contactNumber')}
                            onBlur={handleBlur('contactNumber')}
                            value={values.contactNumber}
                            length={16}
                            // ✅ Injecting country picker as leftComponent
                            leftComponent={
                              <>
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
                                {/* <Text style={{marginLeft: 4}}>
                                +{country?.callingCode?.[0] || ''}
                              </Text> */}
                              </>
                            }
                          />
                        </View>
                        {touched.contactNumber && errors.contactNumber && (
                          <Text style={styles.errorText}>
                            {errors.contactNumber}
                          </Text>
                        )}
                      </View>

                      <OpacityButton
                        name={Texts.Next}
                        pressButton={handleSubmit}
                        button={styles.bottomButton}
                        loading={isLoading}
                      />
                    </View>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EnterPhoneNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: moderateScale(120),
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
    alignSelf: 'center',
    marginTop: moderateScale(4),
  },
  inputWrapper: {
    width: '70%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: moderateScale(30),
  },
  bottomButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? moderateScale(40) : moderateScale(-30),
    alignSelf: 'center',
    width: '75%',
  },
  countryPickerStyle: {
    marginTop: moderateScale(14),
    marginLeft: moderateScale(-15),
  },
});
