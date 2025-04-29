import React, {useCallback, useEffect, useState} from 'react';
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
import {createWork, editWork, getWork} from '../../../Api/helper';
import {useFocusEffect} from '@react-navigation/native';
import {setWork} from '../../../Redux/cookiesReducer';
import {useDispatch, useSelector} from 'react-redux';

const WorkAdding = ({route, navigation}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [titleError, setTitleError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const jobToEdit = route?.params?.jobToEdit;
  const jobIndex = route?.params?.jobIndex;
  const isEditing = jobToEdit && jobIndex !== undefined;

  const dispatch = useDispatch();
  const workdata = useSelector(state => state.cookies.work);
  const workId = workdata?._id;

  useEffect(() => {
    if (isEditing && jobToEdit) {
      setTitle(jobToEdit.title);
      setCompany(jobToEdit.company);
    }
  }, [jobToEdit]);

  useFocusEffect(
    useCallback(() => {
      if (jobToEdit && isEditing) {
        setTitle(jobToEdit.title);
        setCompany(jobToEdit.company);
      } else {
        setTitle('');
        setCompany('');
      }
    }, [route?.params]),
  );

  useEffect(() => {
    (async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        const parsedUserData = storedUserData
          ? JSON.parse(storedUserData)
          : null;
        if (parsedUserData?._id) {
          fetchWork(parsedUserData._id);
        }
      } catch (err) {
        console.warn('Failed to read userData', err);
      }
    })();
  }, []);

  const fetchWork = async userId => {
    try {
      const res = await getWork(userId);
      const data = res?.data?.data?.user?.work;
      dispatch(setWork(data));
      if (isEditing) {
        setTitle(data[0]?.title || '');
        setCompany(data[0]?.company || '');
      }
      if (res?.data?.work) {
        setJobs(res.data.work);
      }
    } catch (e) {
      console.warn('getWork failed', e);
    }
  };

  const validateFields = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!company.trim()) {
      setCompanyError('Company is required.');
      valid = false;
    } else {
      setCompanyError('');
    }

    return valid;
  };

  const handleEditJob = async newJob => {
    const payload = {
      title: newJob.title,
      company: newJob.company,
    };

    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      const userId = userData?._id;

      const response = await editWork(payload, jobToEdit?._id, userId);
      fetchWork(userId);
      if (response?.status === 200 && response?.data?.success) {
        const updatedJobs = jobs.map(job =>
          job._id === workId ? {...job, ...payload} : job,
        );
        setJobs(updatedJobs);
        await AsyncStorage.setItem('userJobs', JSON.stringify(updatedJobs));
      } else {
        console.log('Edit failed response:', response);
      }
    } catch (error) {
      console.error('Error editing job:', error);
    }
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);
    const newJob = {title: title.trim(), company: company.trim()};

    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

      if (!parsedUserData?._id) {
        console.error('User ID not found');
        return;
      }

      const userId = parsedUserData._id;

      if (isEditing) {
        await handleEditJob(newJob);
        navigation.navigate(ROUTE_NAMES.AddWork, {
          updatedJob: newJob,
          jobIndex,
        });
      } else {
        const data = {id: userId, title: newJob.title, company: newJob.company};
        const response = await createWork(data);
        if (response?.status === 200) {
          fetchWork(userId);
          setTitle('');
          setCompany('');
          navigation.navigate(ROUTE_NAMES.AddWork, {
            newJob: {userId, title: newJob.title, company: newJob.company},
          });
        } else {
          console.error('Failed to save work info');
        }
      }
    } catch (error) {
      console.error('Create/edit work error:', error);
    } finally {
      setIsLoading(false);
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
              style={[styles.input, titleError ? {borderColor: 'red'} : {}]}
              placeholder="Data Analyst"
              placeholderTextColor="#000"
              onChangeText={text => {
                setTitle(text);
                if (text.trim()) setTitleError('');
              }}
              value={title}
            />
            {titleError ? (
              <Text style={styles.errorText}>{titleError}</Text>
            ) : null}

            <Text style={styles.label}>Company / Industry</Text>
            <TextInput
              style={[styles.input, companyError ? {borderColor: 'red'} : {}]}
              placeholder="Tech"
              placeholderTextColor="#000"
              onChangeText={text => {
                setCompany(text);
                if (text.trim()) setCompanyError('');
              }}
              value={company}
            />
            {companyError ? (
              <Text style={styles.errorText}>{companyError}</Text>
            ) : null}
          </View>

          <OpacityButton
            name={isEditing ? 'Update' : 'Add'}
            button={styles.addButton}
            pressButton={handleAdd}
            loading={isLoading}
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
    marginHorizontal: moderateScale(14),
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
    height: verticalScale(39),
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: verticalScale(-14),marginBottom: verticalScale(10),
    marginLeft: moderateScale(14),
  },
});
