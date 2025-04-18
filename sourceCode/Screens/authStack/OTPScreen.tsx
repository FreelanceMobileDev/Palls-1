import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, FontsFamilys, FontSize, ImageUrl, Texts} from '../../constant';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/Header';
import OpacityButton from '../../components/OpacityButton';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {moderateScale} from '../../utils/responsive';
import {useRoute} from '@react-navigation/native';
import {Login, VerifyOtp} from '../../Api/helper';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputsRef = useRef([]);
  const navigation = useNavigation();
  const hasStarted = useRef(false);
  const route = useRoute();
  const {phone} = route.params || {};

  useEffect(() => {
    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 10);
  }, []);

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length < 4) {
      alert('Please enter the complete OTP');
      return;
    }

    const payload = {
      phone: phone,
      otp: otpCode,
    };

    try {
      const response = await VerifyOtp(payload); // ✅ correct API now

      console.log('OTP Verified:', response?.data);

      if (response?.data?.status) {
        navigation.navigate(ROUTE_NAMES.VerifyHuman);
      } else {
        alert(response?.data?.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP Verify Error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if available
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Optional: reset flag after last input
    if (newOtp.every(val => val !== '')) {
      hasStarted.current = false; // Ready for next reset
    }
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    1;
  };

  const focusNext = (index, value) => {
    handleOtpChange(value, index);

    // Move to next if value entered
    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={{flex: 1}}>
      {/* Background Layer */}
      <LinearGradient
        colors={['#FEB413', '#F9F9F9']}
        locations={[0, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <Header
                leftIcon={ImageUrl.BackIcon}
                onPressLeftImg={() => navigation.goBack()}
                leftIconStyle={{
                  marginLeft: moderateScale(20),
                  marginTop: moderateScale(30),
                }}
              />
              <Text style={styles.title}>{Texts.Enter_OTP}</Text>
              <Text style={styles.subtitle}>
                {Texts.We_sent_OTP_email},{'\n'}
                random3321@gmail.com
              </Text>
              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputsRef.current[index] = ref)}
                    style={styles.otpInput}
                    keyboardType="numeric"
                    maxLength={1}
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                  />
                ))}
              </View>

              <Text style={styles.resendText}>
                {Texts.Didnt_receive_code}{' '}
                <Text style={styles.resendLink}>{Texts.Resend}</Text>
              </Text>

              <OpacityButton
                button={{marginVertical: 22, width: '76%'}}
                name={Texts.Verify}
                pressButton={
                  // handleVerifyOTP
                  () => navigation.navigate(ROUTE_NAMES.VerifyHuman)
                }
              />

              <Text style={styles.signInText}>
                {Texts.Remembered_Password}
                <Text style={styles.signInLink}> {Texts.Sign_In}</Text>
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.T_four,
    fontFamily: FontsFamilys.Poppins_Bold,
    color: Colors.light_black,
    marginTop: '27%',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: FontSize.fourteen,
    color: Colors.light_black,
    marginTop: 10,
    fontFamily: FontsFamilys.Poppins_Regular,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    width: '75%',
  },
  otpInput: {
    width: 60,
    height: 55,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#000',
    textAlign: 'center',
    fontSize: moderateScale(20),
    fontFamily: FontsFamilys.Poppins_Bold,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    includeFontPadding: false,
  },
  resendText: {
    fontSize: FontSize.fourteen,
    color: Colors.light_black,
    fontFamily: FontsFamilys.Poppins_Regular,
  },
  resendLink: {
    fontFamily: FontsFamilys.Poppins_Bold,
    color: Colors.light_black,
  },
  signInText: {
    fontSize: FontSize.fourteen,
    color: Colors.light_black,
    fontFamily: FontsFamilys.Poppins_Regular,
  },
  signInLink: {
    fontFamily: FontsFamilys.Poppins_Bold,
    color: Colors.light_black,
  },
});
