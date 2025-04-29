import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, verticalScale} from '../../../utils/responsive';
import {styles} from './styles';
import Header from '../../../components/Header';
import {FontSize, ImageUrl} from '../../../constant';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import OpacityButton from '../../../components/OpacityButton';
import {ROUTE_NAMES} from '../../../navigation/StackNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {deleteWork, editWork, getWork} from '../../../Api/helper';
import {setWork} from '../../../Redux/cookiesReducer';
import {ShowToast} from '../../../Api/ToastService';

const AddWork = ({route}) => {
  const [jobs, setJobs] = useState([]);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [selectedJob, setSelectedJob] = useState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const work = useSelector(state => state.cookies.work);
  const [selectedJobKey, setSelectedJobKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleSelectJob = (jobKey: string, jobData: any) => {
    setSelectedJobKey(jobKey);
    setSelectedJob(jobData);
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (!jobsLoaded) return;

    const saveJobsToStorage = async () => {
      setIsLoading(true);
      try {
        await AsyncStorage.setItem('userJobs', JSON.stringify(jobs));
        setIsLoading(false);
      } catch (e) {
        console.log('Error saving jobs to AsyncStorage:', e);
      }
    };
    saveJobsToStorage();
  }, [jobs, jobsLoaded]);

  useEffect(() => {
    if (!jobsLoaded) return;
    if (route?.params?.updatedJob && route?.params?.jobIndex !== undefined) {
      const updatedList = [...jobs];
      updatedList[route.params.jobIndex] = route.params.updatedJob;
      setJobs(updatedList);
    } else if (route?.params?.newJob) {
      const newJob = route.params.newJob;

      const isDuplicate = jobs.some(
        job => job.title === newJob.title && job.company === newJob.company,
      );
      if (!isDuplicate) {
        setJobs(prevJobs => [...prevJobs, newJob]);
      }
    }
  }, [route?.params, jobsLoaded]);

  const handleDelete = async jobToDelete => {
    console.log(jobToDelete, 'jobToDelete====>');
    try {
      const storedUserData = await AsyncStorage.getItem('userData');
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      const userId = userData?._id;

      console.log(userId, 'userId=====>');
      console.log(jobToDelete._id, 'jobToDelete._id=====>');
      // return
      const respodelete = await deleteWork(jobToDelete._id, userId);
      console.log(respodelete?.data, 'respodelete=====>');
      fetchWork(userId);
    } catch (error) {
      console.log('Error deleting job:', error);
    }
  };
  const fetchWork = async userId => {
    try {
      const res = await getWork(userId);
      const data = res?.data?.data?.user?.work;
      console.log(data, '======>>>>>>getWork');
      dispatch(setWork(data));
    } catch (error) {
      console.log('Error fetching work:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#FFB800', '#FFF3DA', '#FFF3DA']}
      style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFB800" />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.container}>
            {/* Header and job list */}
            <Header
              leftIcon={ImageUrl.BackIcon}
              onPressLeftImg={() => navigation.navigate(ROUTE_NAMES.BioScreen)}
              centerText="Work"
              centerTextStyle={{
                marginTop: moderateScale(20),
                fontSize: moderateScale(16),
                marginRight: moderateScale(25),
              }}
              containerstyle={{
                marginTop: moderateScale(20),
                alignItems: 'flex-start',
              }}
            />
            <View
              style={{
                marginHorizontal: moderateScale(10),
                marginTop: moderateScale(50),
                paddingBottom: verticalScale(110),
              }}>
              {Array.isArray(work) && work.length > 0 ? (
                work?.map((job, index) => {
                  const jobKey = `${job.title}-${index}`;
                  const isSelected = selectedJobKey === jobKey;

                  return (
                    <View>
                      <View style={styles.jobItem} key={jobKey}>
                        <TouchableOpacity
                          onPress={() => handleSelectJob(jobKey, job)}>
                          <Image
                            source={
                              isSelected
                                ? ImageUrl.CheckBox
                                : ImageUrl.BlankCheck
                            }
                            style={{height: 20, width: 20}}
                          />
                        </TouchableOpacity>

                        <Text style={styles.jobText}>
                          {job.title}, {job.company}
                        </Text>

                        <View style={{flexDirection: 'row'}}>
                          {/* Edit Button */}
                          <TouchableOpacity
                            style={{marginRight: moderateScale(12)}}
                            onPress={() => {
                              navigation.navigate(ROUTE_NAMES.WorkAdding, {
                                jobToEdit: job,
                                jobIndex: index,
                              });
                            }}>
                            <Image source={ImageUrl.Edit} />
                          </TouchableOpacity>

                          <TouchableOpacity onPress={() => handleDelete(job)}>
                            <Image source={ImageUrl.Delete} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      {error ? (
                        <Text
                          style={{
                            color: 'red',
                            marginTop: moderateScale(-10),
                            marginLeft: moderateScale(12),
                            marginBottom: moderateScale(10),
                          }}>
                          {error}
                        </Text>
                      ) : null}
                    </View>
                  );
                })
              ) : (
                <></>
              )}

              <TouchableOpacity
                style={styles.addJobButton}
                onPress={() => navigation.navigate(ROUTE_NAMES.WorkAdding)}>
                <Text style={styles.addJobText}>Add job</Text>
                <Image source={ImageUrl.PlusIcon} tintColor={'black'} />
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.bottomButtonContainer}>
            <OpacityButton
              name="Save"
              style={styles.saveButton}
              pressButton={() => {
                if (!selectedJob) {
                  setError('Please select a job.');
                } else {
                  setError('');
                  navigation.navigate(ROUTE_NAMES.BioScreen, {
                    ...route?.params,
                    selectedJob: selectedJob,
                  });
                }
              }}
              loding={isLoading}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AddWork;
