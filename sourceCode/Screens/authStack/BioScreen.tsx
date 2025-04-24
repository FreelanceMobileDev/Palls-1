import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {moderateScale, scale, verticalScale} from '../../utils/responsive';
import {FontsFamilys, FontSize, ImageUrl} from '../../constant';
import Header from '../../components/Header';
import OpacityButton from '../../components/OpacityButton';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userRegister} from '../../Api/helper';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL, REGISTER_USER} from '../../Api/url';
import {useSelector} from 'react-redux';

const BioScreen = ({route}) => {
  const param = route?.params;

  const navigation = useNavigation();
  const [bio, setBio] = useState('');
  const [selfie, setSelfie] = useState<string | null>(null);
  const {images, categeroies} = useSelector<any>(store => store?.cookies);

  console.log(images, '1111111data===============>', param);

  const [selectedIdentity, setSelectedIdentity] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [work, setWork] = useState('Add Job');

  const toggleSelection = (label, group) => {
    const current = group === 'identity' ? selectedIdentity : selectedEducation;
    const setFunc =
      group === 'identity' ? setSelectedIdentity : setSelectedEducation;

    if (current.includes(label)) {
      setFunc(current.filter(item => item !== label));
    } else {
      setFunc([...current, label]);
    }
  };

  console.log(selectedIdentity.join(','), 'selectedIdentity=======>');

  useFocusEffect(
    React.useCallback(() => {
      const loadJob = async () => {
        try {
          const savedJobs = await AsyncStorage.getItem('userJobs');
          if (savedJobs) {
            const jobsArray = JSON.parse(savedJobs);
            if (jobsArray.length > 0) {
              const latestJob = jobsArray[jobsArray.length - 1];
              setWork(`${latestJob.title} at ${latestJob.company}`);
            } else {
              setWork('Add Job');
            }
          } else {
            setWork('Add Job');
          }
        } catch (e) {
          console.log('Error retrieving job:', e);
          setWork('Add Job');
        }
      };
      loadJob();
    }, []),
  );

  const tagData = {
    identity: [
      'Parent',
      'Business Owner',
      'Have pet kids',
      'Working adult',
      'First job',
    ],
    education: ['Working & studying', 'University', 'Just graduated'],
  };

  const Tag = ({label, selected, onPress}) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tag,
        selected ? styles.tagSelected : styles.tagUnselected,
      ]}>
      <Text
        style={[
          styles.tagText,
          selected ? styles.tagTextSelected : styles.tagTextUnselected,
        ]}>
        {label}
      </Text>
      {selected && <Text style={styles.tagClose}>✕</Text>}
    </TouchableOpacity>
  );

  const handleSubmit = async () => {
    try {
      await AsyncStorage.setItem(
        'userIdentity',
        JSON.stringify(selectedIdentity),
      );
      await AsyncStorage.setItem(
        'userEducation',
        JSON.stringify(selectedEducation),
      );

      const userDetails = await AsyncStorage.getItem('userDetails');
      const storedUserData = await AsyncStorage.getItem('userData');
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

      console.log(parsedUserData?._id, 'storedUserData======>');
      const storedIdentity = await AsyncStorage.getItem('userIdentity');
      const storedEducation = await AsyncStorage.getItem('userEducation');
      const storedJobs = await AsyncStorage.getItem('userJobs');
      const data = await AsyncStorage.getItem('uploadedImageUrls');

      const parsedDetails = userDetails ? JSON.parse(userDetails) : {};
      const parsedIdentity = storedIdentity ? JSON.parse(storedIdentity) : [];
      const parsedEducation = storedEducation
        ? JSON.parse(storedEducation)
        : [];

      let workInfo = 'Add Job';
      if (storedJobs) {
        const jobsArray = JSON.parse(storedJobs);
        if (jobsArray.length > 0) {
          const latestJob = jobsArray[jobsArray.length - 1];
          workInfo = `${latestJob.title} at ${latestJob.company}`;
        }
      }

      const payload = {
        name: parsedDetails?.name,
        dob: '01-01-0101',
        location: 'Moscow',
        email: parsedDetails?.email,
        number: parsedDetails?.number,
        gender: parsedDetails?.gender,
        relationship: parsedDetails?.relationshipPreference,
        bio: bio,
        selfieImage: param.length > 0 ? param : '',
        image: images,
        deviceToken: 'test',
        step: parsedDetails?.step || 0,
        iam: selectedIdentity.join(','),
        education: parsedEducation.join(','),

        categories: categeroies,
      };
      const p = `${BASE_URL}${REGISTER_USER}?id=${parsedUserData?._id}`;

      console.log(p, 'sdvdsvds===========>', payload);

      const response = await axios.post(p, payload);
      console.log(response?.data, 'response=======>');
      if (response?.status) {
        navigation.navigate(ROUTE_NAMES.TabNavigation);
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
    }
  };

  useEffect(() => {
    const loadSelfie = async () => {
      try {
        const storedSelfie = await AsyncStorage.getItem('selfiePhoto');
        if (storedSelfie) {
          setSelfie(storedSelfie);
        }
      } catch (e) {
        console.log('Error retrieving selfie:', e);
      }
    };
    loadSelfie();
  }, []);

  return (
    <LinearGradient
      colors={['#FFC94D', '#FFE7B3', '#FFF3DA']}
      locations={[0.4, 0.75, 1]}
      style={styles.container}>
      <StatusBar backgroundColor="#FEB413" />

      <Header
        leftIcon={ImageUrl.BackIcon}
        onPressLeftImg={() => navigation.goBack()}
        containerstyle={{
          marginTop: moderateScale(48),
          alignItems: 'flex-start',
          marginHorizontal: moderateScale(15),
        }}
      />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {paddingBottom: verticalScale(40)},
            ]}
            keyboardShouldPersistTaps="handled">
            {/* Bio Section */}
            <Text style={styles.title}>
              Add something interesting about you
            </Text>
            <Text style={styles.subTitle}>
              Write interesting facts about yourself
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Start here"
              placeholderTextColor="#B5B5B5"
              multiline
              value={bio}
              onChangeText={setBio}
            />

            {/* I am.. Section */}
            <Text style={styles.heading}>I am..</Text>
            <View style={styles.tagsContainer}>
              {tagData.identity.map((item, index) => (
                <Tag
                  key={index}
                  label={item}
                  selected={selectedIdentity.includes(item)}
                  onPress={() => toggleSelection(item, 'identity')}
                />
              ))}
            </View>

            {/* Education Section */}
            <Text style={styles.heading}>Education</Text>
            <View style={styles.tagsContainer}>
              {tagData.education.map((item, index) => (
                <Tag
                  key={index}
                  label={item}
                  selected={selectedEducation.includes(item)}
                  onPress={() => toggleSelection(item, 'education')}
                />
              ))}
            </View>

            {/* Work Section */}
            <Text style={styles.heading}>Work</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTE_NAMES.AddWork)}
              style={styles.workInput}>
              <Text style={styles.workText}>
                {work === 'Add Job' ? 'Add Job' : work}
              </Text>
              <Image source={ImageUrl.RightArrow} />
            </TouchableOpacity>

            <View style={styles.bottomButton}>
              <OpacityButton name="Save" pressButton={handleSubmit} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default BioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flex: 1,
  },
  tagClose: {
    marginLeft: 6,
    color: 'white',
    fontSize: FontSize.twelve,
    fontFamily: FontsFamilys.Poppins_Medium,
  },
  scrollContent: {
    justifyContent: 'flex-start',
    paddingTop: moderateScale(30),
    marginHorizontal: moderateScale(30),
  },
  title: {
    fontSize: scale(20),
    textAlign: 'center',
    fontFamily: FontsFamilys.Poppins_SemiBold,
    color: '#000',
    width: '80%',
    alignSelf: 'center',
  },
  subTitle: {
    textAlign: 'center',
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Medium,
    marginVertical: moderateScale(20),
    color: '#6E6E6E',
  },
  textArea: {
    width: '100%',
    height: moderateScale(140),
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    fontFamily: FontsFamilys.Poppins_Regular,
    fontSize: FontSize.fourteen,
    color: '#000',
  },
  bottomButton: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: moderateScale(40),
  },
  innerContainer: {
    padding: moderateScale(16),
  },
  heading: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
    color: '#000',
    alignSelf: 'flex-start',
    marginHorizontal: moderateScale(5),
    marginVertical: moderateScale(20),
    fontFamily: FontsFamilys.Poppins_SemiBold,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
    marginBottom: verticalScale(10),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(20),
  },
  tagUnselected: {
    backgroundColor: '#E6F5E9',
  },
  tagSelected: {
    backgroundColor: '#2D6A4F',
  },
  tagText: {
    fontSize: moderateScale(12),
  },
  tagTextUnselected: {
    color: '#000',
  },
  tagTextSelected: {
    color: '#fff',
  },
  workInput: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(17),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workText: {
    fontSize: moderateScale(13),
    color: '#000',
  },
});
