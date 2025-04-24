import React, {useEffect, useState} from 'react';
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
import {ImageUrl} from '../../../constant';
import {useNavigation} from '@react-navigation/native';
import OpacityButton from '../../../components/OpacityButton';
import {ROUTE_NAMES} from '../../../navigation/StackNavigation';

const AddWork = ({route}) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState();

  const navigation = useNavigation();

  const handleAddJob = () => {
    navigation.navigate(ROUTE_NAMES.WorkAdding);
  };

  useEffect(() => {
    if (route?.params?.updatedJob && route?.params?.jobIndex !== undefined) {
      const updatedList = [...jobs];
      updatedList[route.params.jobIndex] = route.params.updatedJob;
      setJobs(updatedList);
    } else if (route?.params?.newJob) {
      const newJob = route.params.newJob;

      // Ensure no duplicates
      const isDuplicate = jobs.some(
        job => job.title === newJob.title && job.company === newJob.company,
      );

      if (!isDuplicate) {
        setJobs(prevJobs => [...prevJobs, newJob]); // ✅ Append, not overwrite
      }
    }
  }, [route?.params]);

  const handleDelete = jobToDelete => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setJobs(prevJobs =>
              prevJobs.filter(
                job =>
                  job.title !== jobToDelete.title ||
                  job.company !== jobToDelete.company,
              ),
            );

            if (
              selectedJob &&
              selectedJob.title === jobToDelete.title &&
              selectedJob.company === jobToDelete.company
            ) {
              setSelectedJob('');
            }
          },
        },
      ],
      {cancelable: true},
    );
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
              onPressLeftImg={() => navigation.goBack()}
              centerText="Work"
              centerTextStyle={{marginLeft: moderateScale(-30)}}
              containerstyle={{
                marginTop: moderateScale(48),
                alignItems: 'flex-start',
              }}
            />

            <View
              style={{
                marginHorizontal: moderateScale(10),
                marginTop: moderateScale(70),
                paddingBottom: verticalScale(150),
              }}>
              {jobs.map((job, index) => (
                <View style={styles.jobItem} key={index}>
                  <Text style={styles.jobText}>
                    {job.title}, {job.company}
                  </Text>

                  <View style={{flexDirection: 'row'}}>
                    {/* Edit Button */}
                    <TouchableOpacity
                      style={{marginRight: moderateScale(12)}}
                      onPress={() =>
                        navigation.navigate(ROUTE_NAMES.WorkAdding, {
                          jobToEdit: job,
                          jobIndex: index,
                        })
                      }>
                      <Image source={ImageUrl.Edit} />
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity onPress={() => handleDelete(job)}>
                      <Image source={ImageUrl.Delete} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addJobButton}
                onPress={() => navigation.navigate(ROUTE_NAMES.WorkAdding)}>
                <Text style={styles.addJobText}>Add job</Text>
                <Image source={ImageUrl.PlusIcon} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Save Button Fixed at Bottom */}
          <View style={styles.bottomButtonContainer}>
            <OpacityButton
              name="Save"
              style={styles.saveButton}
              pressButton={() => {
                navigation.navigate(ROUTE_NAMES.BioScreen);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AddWork;
