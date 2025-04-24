import {Dimensions, Image, StatusBar, StyleSheet, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, FontSize, FontsFamilys, ImageUrl, Texts} from '../../constant';
import OpacityButton from '../../components/OpacityButton';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';

const SignIn = () => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.8]}
      style={styles.container}>
      <StatusBar backgroundColor={Colors.dark_yellow} />
      <Image
        source={ImageUrl.PallsSignupLogo}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>
        {Texts.Lets_meet}
        {'\n'}
        {Texts.People_aound}
      </Text>

      <OpacityButton
        name={Texts.Login_With_phone}
        img1={ImageUrl.CallIcon}
        pressButton={() => navigation.navigate(ROUTE_NAMES.EnterPhoneNumber)}
        button={styles.phonebuttonstyle}
      />
      <OpacityButton
        name={Texts.Login_with_Google}
        img1={ImageUrl.GoogleIcon}
        button={styles.googlebuttonstyle}
      />

      <Text style={styles.signupText}>
        {Texts.Dont_have_account}{' '}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate(ROUTE_NAMES.SignUp)}
        >
          {Texts.Sign_Up}
        </Text>
      </Text>
    </LinearGradient>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  logo: {
    // width: 150,
    height: '59%',
    width: '98%',
    // borderWidth:1
  },
  heading: {
    fontSize: FontSize.T_four,
    textAlign: 'center',
    fontFamily: FontsFamilys.Poppins_SemiBold,
    color: Colors.Main_Black,
    marginVertical: 10,
  },

  signupText: {
    marginTop: 20,
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Medium,
    color: 'rgba(34, 23, 42, 0.7)',
  },
  signupLink: {
    color: Colors.dark_yellow,
    fontFamily: FontsFamilys.Poppins_Bold,
  },
  googlebuttonstyle: {
    backgroundColor: 'rgb(247, 234, 199)',
    borderColor: 'rgba(60, 57, 58, 0.7)',
    width: '80%',
    borderWidth: 0.3,
  },
  phonebuttonstyle: {
    backgroundColor: Colors.dark_yellow,
    borderColor: 'rgba(60, 57, 58, 0.7)',
    width: '80%',
  },
});
