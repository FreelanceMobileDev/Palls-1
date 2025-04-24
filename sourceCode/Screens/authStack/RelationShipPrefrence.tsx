import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, FontsFamilys, FontSize, ImageUrl, Texts} from '../../constant';
import OpacityButton from '../../components/OpacityButton';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import Header from '../../components/Header';
import {moderateScale} from '../../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RelationshipPreference = ({ route }) => {
    const { param} = route.params;

    console.log(param,'========>>>>>>>>>>>',);
    

  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedOption) {
      setError('Please select an option to continue');
      return;
    }

    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      const parsedDetails = userDetails ? JSON.parse(userDetails) : {};

      parsedDetails.relationshipPreference = selectedOption;

      await AsyncStorage.setItem('userDetails', JSON.stringify(parsedDetails));
      setError('');
      navigation.navigate(ROUTE_NAMES.HobbyScreen,{
        param
      });
    } catch (err) {
      console.error('Failed to save relationship preference:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const options = [
    'Long-term partner',
    'Long-term, open to short',
    'Short-term, open to long',
    'New friends',
    'Still figuring it out',
  ];

  const renderOption = label => {
    const isSelected = selectedOption === label;
    return (
      <TouchableOpacity
        key={label}
        style={[
          styles.optionBox,
          isSelected && {borderColor: '#2A9D16', borderWidth: 2},
        ]}
        onPress={() => {
          setSelectedOption(label);
          setError('');
        }}>
        <Text style={styles.optionText}>{label}</Text>
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
      locations={[0, 0.85]}
      style={styles.container}>
      <StatusBar backgroundColor="#FEB413" />

      <Header
        leftIcon={ImageUrl.BackIcon}
        leftIconStyle={{left: 0}}
        onPressLeftImg={() => navigation.goBack()}
        containerstyle={{
          marginTop: moderateScale(48),
        }}
      />
      <Text style={styles.title}>{Texts.What_Looking}</Text>
      {options.map(renderOption)}
      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.bottomButton}>
        <OpacityButton name="Next" pressButton={handleSubmit} />
      </View>
    </LinearGradient>
  );
};

export default RelationshipPreference;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.T_four,
    fontFamily: FontsFamilys.Poppins_SemiBold,
    textAlign: 'center',
    marginTop: moderateScale(40),
    marginBottom: moderateScale(16),
    color: Colors.Main_Black,
    marginHorizontal: moderateScale(40),
  },
  optionBox: {
    backgroundColor: '#ffffff',
    padding: moderateScale(15),
    borderRadius: moderateScale(8),
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: moderateScale(6),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    alignSelf: 'center',
  },
  optionText: {
    color: '#9A9A9A',
    fontFamily: FontsFamilys.Poppins_Regular,
    fontSize: FontSize.fourteen,
  },
  checkIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    fontSize: FontSize.twelve,
    marginTop: moderateScale(1),
    marginHorizontal: moderateScale(25),
  },
  bottomButton: {
    position: 'absolute',
    bottom: moderateScale(30),
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
