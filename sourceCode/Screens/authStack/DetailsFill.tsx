import {
  Alert,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import CustomTextInput from '../../components/CustomTextInput';
import {Colors, FontsFamilys, FontSize, Texts} from '../../constant';
import OpacityButton from '../../components/OpacityButton';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import {moderateScale} from '../../utils/responsive';
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import {ShowToast} from '../../Api/ToastService';
import MapView, {Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {FlatList, TextInput} from 'react-native-gesture-handler';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  // age: Yup.date()
  //   .required('Birth‑date is required')
  //   .max(dayjs().subtract(18, 'year').toDate(), 'You must be at least 18'),
  age: Yup.string()
    .required('Age should be 18 or older')
    .matches(
      /^[A-Za-z]+\s\d{1,2},\s\d{4}$/,
      'Enter a valid date format like April 24, 2025',
    ),
  location: Yup.string().required('Location is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  contactNumber: Yup.string()
    .matches(/^\d+$/, 'Contact number must contain only digits')
    .min(10, 'Contact number must be at least 10 digits')
    .max(16, 'Contact number must not exceed 16 digits')
    .required('Contact number is required'),
});

interface FormValues {
  name: string;
  age: string;
  location: string;
  email: string;
  contactNumber: string;
}

const DetailsFill = ({route}) => {
  const param = route.params?.param;

  const navigation = useNavigation();
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const [countryCode, setCountryCode] = useState('MY');
  const [country, setCountry] = useState(null);
  const [date, setDate] = useState(new Date());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const textInputRef = useRef<TextInput>(null);

  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate(),
  ); // 100 saal pehle

  const calculateAge = birthDate => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleFormSubmit = async (values: FormValues) => {
    console.log(values, '============>>>>>>>>>>>>>');

    try {
      const userData = {
        ...values,
        countryCode,
        country,
      };

      await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
      console.log('User details stored:', userData);

      navigation.navigate(ROUTE_NAMES.Gender, {
        param,
      });
    } catch (error) {
      console.error('Error storing user details:', error);
    }
  };

  const handleLocationSearch = async query => {
    if (query.trim()) {
      try {
        const response = await Geocoding.from(query);
        setLocationSuggestions(response.results);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = (location, handleChange) => {
    handleChange('location')(location.formatted_address);
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient
        colors={['#FEB413', '#F9F9F9']}
        locations={[0, 0.85]}
        style={styles.container}>
        <StatusBar backgroundColor="#FEB413" />
        <View style={styles.mainContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{Texts.Fill_your_details}</Text>
            <Text style={styles.subtitle}>{Texts.Please_ensure_that}</Text>
            <Formik
              innerRef={formikRef}
              initialValues={{
                name: '',
                age: '',
                location: '',
                email: '',
                contactNumber: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleFormSubmit}>
              {({
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <View style={styles.formContainer}>
                  <View style={styles.inputsContainer}>
                    <CustomTextInput
                      placeholder={Texts.Name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                    />
                    {touched.name && errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}

                    <TouchableOpacity onPress={() => setOpen(true)}>
                      <CustomTextInput
                        placeholder={Texts.Age}
                        onChangeText={handleChange('age')}
                        onBlur={handleBlur('age')}
                        value={values.age}
                        editable={false}
                        style={styles.dateInput}
                      />
                      <DatePicker
                        modal
                        mode="date"
                        open={open}
                        date={date}
                        minimumDate={minDate}
                        maximumDate={today}
                        onConfirm={selectedDate => {
                          setOpen(false);
                          setDate(selectedDate);

                          const age = calculateAge(selectedDate);
                          if (age >= 18) {
                            const formattedDate =
                              selectedDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              });
                            setFieldValue('age', formattedDate);
                          } else {
                            ShowToast;
                          }
                        }}
                        onCancel={() => {
                          setOpen(false);
                        }}
                      />
                    </TouchableOpacity>

                    {touched.name && errors.age && (
                      <Text style={styles.errorText}>{errors.age}</Text>
                    )}

                    <View style={{flex: 1}}>
                      {/* Your custom text input */}
                      <CustomTextInput
                        placeholder={Texts.Location}
                        onChangeText={text => {
                          handleChange('location')(text);
                          handleLocationSearch(text);
                        }}
                        onBlur={handleBlur('location')}
                        value={values.location}
                        onFocus={() => setModalVisible(true)}
                      />
                      {touched.location && errors.location && (
                        <Text style={styles.errorText}>{errors.location}</Text>
                      )}

                      {/* Location Search Modal */}
                      <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              justifyContent: 'flex-end',
                            }}>
                            <KeyboardAvoidingView
                              behavior={
                                Platform.OS === 'ios' ? 'padding' : undefined
                              }
                              style={{flex: 1}}>
                              <View
                                style={{
                                  backgroundColor: 'white',
                                  height: '60%',
                                  padding: 10,
                                }}>
                                <TextInput
                                  ref={textInputRef}
                                  style={{
                                    borderWidth: 1,
                                    padding: 8,
                                    marginBottom: 10,
                                  }}
                                  placeholder="Search for a location"
                                  onChangeText={text => {
                                    handleLocationSearch(text);
                                    formikRef.current?.setFieldValue(
                                      'location',
                                      text,
                                    );
                                  }}
                                  value={formikRef.current?.values.location}
                                  autoFocus // Helps with keyboard focus
                                />

                                <FlatList
                                  data={locationSuggestions}
                                  renderItem={({item}) => (
                                    <TouchableOpacity
                                      onPress={() =>
                                        handleLocationSelect(item)
                                      }>
                                      <Text style={{padding: 10}}>
                                        {item.formatted_address}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  keyExtractor={(item, index) =>
                                    index.toString()
                                  }
                                  keyboardShouldPersistTaps="handled"
                                />

                                <TouchableOpacity
                                  onPress={() => setModalVisible(false)}
                                  style={{marginTop: 10}}>
                                  <Text>Cancel</Text>
                                </TouchableOpacity>
                              </View>
                            </KeyboardAvoidingView>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    </View>

                    <CustomTextInput
                      placeholder={Texts.Email_Address}
                      onChangeText={text =>
                        handleChange('email')(text.replace(/\s+/g, ''))
                      }
                      onBlur={handleBlur('email')}
                      value={values.email}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                    <View>
                      <View style={styles.inputWrapper}>
                        <CustomTextInput
                          placeholder={Texts.Phone_Number}
                          keyboardType="numeric"
                          onChangeText={handleChange('contactNumber')}
                          onBlur={handleBlur('contactNumber')}
                          value={values.contactNumber}
                          length={16}
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
                  </View>

                  <View style={styles.bottomButtonContainer}>
                    <OpacityButton
                      button={{
                        width: '85%',
                        alignSelf: 'center',
                      }}
                      name={Texts.Continue}
                      pressButton={() => {
                        Keyboard.dismiss();
                        formikRef.current?.handleSubmit();
                      }}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default DetailsFill;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(40),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: moderateScale(20),
  },
  formContainer: {
    flex: 1,
  },
  inputsContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.T_four,
    fontFamily: FontsFamilys.Poppins_Bold,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 40,
    color: Colors.Main_Black,
  },
  subtitle: {
    fontSize: FontSize.twelve,
    fontFamily: FontsFamilys.Poppins_Regular,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: 'rgba(34, 23, 42, 0.7)',
  },
  errorText: {
    color: 'red',
    fontSize: FontSize.twelve,
    marginBottom: moderateScale(5),
    marginLeft: moderateScale(12),
  },
  bottomButtonContainer: {
    paddingBottom: moderateScale(5),
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 12,
  },
  placeholder: {color: '#999'},
  map: {
    width: '100%',
    height: 300,
    borderRadius: moderateScale(10),
    marginTop: moderateScale(10),
  },
  selectedLocation: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#000',
    fontFamily: FontsFamilys.Poppins_Regular,
  },
});
