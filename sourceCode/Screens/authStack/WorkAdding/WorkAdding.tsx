import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import {moderateScale, scale, verticalScale} from '../../../utils/responsive';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header';
import {ImageUrl} from '../../../constant';
import OpacityButton from '../../../components/OpacityButton';
import {ROUTE_NAMES} from '../../../navigation/StackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createWork, getWork} from '../../../Api/helper';

const WorkAdding = ({route, navigation}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const jobToEdit = route?.params?.jobToEdit;
  const jobIndex = route?.params?.jobIndex;
  const isEditing = jobToEdit && jobIndex !== undefined;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (isEditing) {
      setTitle(jobToEdit.title);
      setCompany(jobToEdit.company);
    }
  }, [jobToEdit]);

  const fetchWork = async userId => {
    try {
      const res = await getWork(userId);
      console.log(
        res.data.data.user.work[0].title,
        '======>>>>>>>>>>>>qcsqqqe',
        res.data.data.user.work[0].company,
      );

      setTitle(res?.data?.data?.user?.work[0].title);
      setCompany(res?.data?.data?.user?.work[0].company);

      if (res?.data?.work) {
        setJobs(res.data.work);
      }
    } catch (e) {
      console.warn('getWork failed', e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const parsedUserData = storedUserData
          ? JSON.parse(storedUserData)
          : null;
        if (parsedUserData?._id) {
          fetchWork(parsedUserData._id); // call the API
        }
      } catch (err) {
        console.warn('Failed to read userData', err);
      }
    })();
  }, []);

  const handleAdd = async () => {
    if (title && company) {
      try {
        // Step 1: Retrieve stored user data
        const storedUserData = await AsyncStorage.getItem('userData');
        const parsedUserData = storedUserData
          ? JSON.parse(storedUserData)
          : null;
        parsedUserData._id;

        if (!parsedUserData || !parsedUserData._id) {
          Alert.alert('Error', 'User ID not found');
          return;
        }

        const userId = parsedUserData._id;
        const data = {
          id: parsedUserData._id,
          title: title,
          company: company,
        };
        // Step 2: Create the job object with userId
        const newJob = {userId, title, company};
        console.log(data, 'hdsbfhjsdbhj=====>');
        // Step 3: Call the API
        const response = await createWork(data);
        console.log(response?.data, '=============>');
        if (response?.status === 200) {
          // Step 4: Store in AsyncStorage
          const existingJobs = await AsyncStorage.getItem('userJobs');
          const jobsArray = existingJobs ? JSON.parse(existingJobs) : [];

          if (isEditing) {
            jobsArray[jobIndex] = newJob;
          } else {
            jobsArray.push(newJob);
          }

          await AsyncStorage.setItem('userJobs', JSON.stringify(jobsArray));

          // Step 5: Navigate back with data
          navigation.navigate(ROUTE_NAMES.AddWork, {
            ...(isEditing ? {updatedJob: newJob, jobIndex} : {newJob}),
          });
        } else {
          Alert.alert('Error', 'Failed to save work info');
        }
      } catch (error) {
        console.error('Create work error:', error);
        Alert.alert('Error', 'Something went wrong!');
      }
    } else {
      Alert.alert('Please fill in both title and company');
    }
  };

  return (
    <LinearGradient
      colors={['#FFB800', '#FFF3DA', '#FFF3DA']}
      locations={[0.1, 0.2, 0.1]}
      style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <Header
          leftIcon={ImageUrl.BackIcon}
          onPressLeftImg={() => navigation.goBack()}
          centerText="Add Work"
          centerTextStyle={{
            marginLeft: moderateScale(-30),
            marginTop: moderateScale(10),
          }}
          containerstyle={{
            marginTop: moderateScale(48),
            alignItems: 'flex-start',
          }}
        />

        <View style={styles.contentWrapper}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Data Analyst"
              placeholderTextColor="#000"
              onChangeText={setTitle}
              value={title}
            />

            <Text style={styles.label}>Company / Industry</Text>
            <TextInput
              style={styles.input}
              placeholder="Tech"
              placeholderTextColor="#000"
              onChangeText={setCompany}
              value={company}
            />
          </View>

          <OpacityButton
            name={'Add'}
            button={styles.addButton}
            pressButton={() => handleAdd()}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default WorkAdding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: verticalScale(30),
  },
  inputContainer: {
    marginTop: verticalScale(45),
    marginHorizontal: moderateScale(4),
  },
  label: {
    fontSize: moderateScale(12),
    marginBottom: verticalScale(10),
    color: '#555',
  },
  input: {
    height: verticalScale(43),
    borderRadius: moderateScale(50),
    backgroundColor: '#f2f2f2',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(20),
    justifyContent: 'center',
  },
  addButton: {
    alignSelf: 'center',
  },
});
