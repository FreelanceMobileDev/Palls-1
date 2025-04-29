import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale, scale, verticalScale} from '../../../utils/responsive';
import {Colors, FontsFamilys, ImageUrl} from '../../../constant';
import Header from '../../../components/Header';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as Progress from 'react-native-progress';
import {ROUTE_NAMES} from '../../../navigation/StackNavigation';

type RootStackParamList = {
  EditScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <LinearGradient
        colors={['#FFB100', '#fee8b8']}
        style={[styles.gradientContainer, {flex: 0.4}]}>
        {/* Header */}
        <Header
          leftIcon={ImageUrl.threelinesicon}
          onPressLeftImg={()=>navigation.dispatch(DrawerActions.openDrawer())}
          leftIconStyle={{
            width: moderateScale(45),
            height: moderateScale(45),
          }}
          containerstyle={{
            marginTop: moderateScale(8),
            alignItems: 'center',
          }}
          CenterImage={ImageUrl.PallsIcon}
          centerImageStyle={{
            marginRight: moderateScale(50),
          }}
        />

        <Text style={styles.profileText}>Profile</Text>

        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.settingsBtn}>
            <Image source={ImageUrl.SystemIcon} />
          </TouchableOpacity>

          <Progress.Circle
            progress={0.4}
            size={moderateScale(80)}
            color={Colors.dark_yellow}
            borderWidth={0}
            thickness={moderateScale(4)}
            strokeCap="round"
            unfilledColor="#F0F0F0"
            style={[styles.progressCircle, { transform: [{ rotate: '-200deg' }] }]}
          />
          <Image source={ImageUrl.GirlImage} style={styles.profileImage} />
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>40%</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditScreen')}>
            <Image source={ImageUrl.DesignIcon} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <Text style={styles.userName}>Azrul, 31</Text>
        <View style={styles.locationRow}>
          <Image
            source={ImageUrl.LocationIcon}
            tintColor={'#777'}
            style={{height: 16, width: 16}}
          />
          <Text style={styles.locationText}>Klang, Selangor</Text>
        </View>
      </LinearGradient>

      <View style={styles.whiteBackgroundContainer}>
        <View style={styles.featureContainer}>
          {[
            {icon: ImageUrl.LightStar, label: '0 Super Likes'},
            {icon: ImageUrl.Boost, label: 'My Boosts'},
            {icon: ImageUrl.BellWhite, label: 'Subscriptions'},
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureBox}
              onPress={() => {
                if (item.label === 'Subscriptions') {
                  navigation.navigate('Subscription');
                }
              }}>
              <Image source={item.icon} style={styles.featureIcon} />
              <Text style={styles.featureText}>{item.label}</Text>
              <Image source={ImageUrl.DotWhite} style={styles.dotWhite} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium Section */}
        <View style={styles.planContainer}>
          <Text style={styles.planTitle}>You're currently on Basic Plan</Text>
          <Text style={styles.planSubtitle}>
            Get Unlimited Likes, Passport and more!
          </Text>
          <TouchableOpacity style={styles.premiumBtn}>
            <Text style={styles.premiumText}>Get Premium</Text>
          </TouchableOpacity>

          {/* Dots */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {['home', 'magnify', 'star-outline', 'message', 'account'].map(
          (icon, index) => (
            <TouchableOpacity key={index} style={styles.navItem}>
              {/* <Icon
                name={icon}
                size={scale(24)}
                color={icon === 'account' ? '#FFB100' : '#555'}
              /> */}
            </TouchableOpacity>
          ),
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    padding: scale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: moderateScale(22),
    color: '#000',
    fontFamily: FontsFamilys.Poppins_SemiBold,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(5),
    marginHorizontal: moderateScale(30),
  },
  settingsBtn: {
    position: 'absolute',
    left: scale(10),
    top: scale(20),
    backgroundColor: '#fff',
    padding: scale(8),
    borderRadius: scale(25),
  },
  editBtn: {
    position: 'absolute',
    right: scale(10),
    top: scale(20),
    backgroundColor: '#fff',
    padding: scale(8),
    borderRadius: scale(25),
  },
  imageWrapper: {
    alignItems: 'center',
  },
  // profileImage: {
  //   width: scale(90),
  //   height: scale(90),
  //   borderRadius: scale(45),
  //   borderWidth: 3,
  //   borderColor: '#fff',
  // },
  progressBadge: {
    position: 'absolute',
    backgroundColor: Colors.dark_yellow,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(6),
    paddingVertical: moderateScale(1),
    borderWidth: 2,
    borderColor: Colors.white,
    marginTop: verticalScale(53),
  },
  progress: {
    backgroundColor: '#FFB100',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: scale(20),
    marginTop: verticalScale(-15),
    borderWidth: 2,
    borderColor: '#fff',
  },
  progressText: {
    fontSize: moderateScale(12),
    color: '#fff',
    fontFamily: FontsFamilys.Poppins_SemiBold,
    marginTop: verticalScale(1),
  },
  userName: {
    textAlign: 'center',
    fontSize: moderateScale(18),
    fontFamily: FontsFamilys.Poppins_SemiBold,
    marginTop: verticalScale(23),
    marginLeft: scale(4),
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    fontSize: moderateScale(14),
    color: '#777',
    marginLeft: scale(5),
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(15),
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(20),
  },
  featureBox: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: scale(12),
    paddingTop: verticalScale(12),
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: {width: 0, height: 2},
    // shadowRadius: 6,
    // elevation: 3,
    paddingHorizontal: moderateScale(10),
    borderWidth: 1,
    borderColor: '#D6D6D6',
  },
  featureIcon: {
    width: scale(60),
    height: scale(60),
  },
  featureText: {
    fontSize: moderateScale(12),
    textAlign: 'center',
    color: '#A3730B',
    fontFamily: FontsFamilys.Poppins_Medium,
    marginTop: verticalScale(10),
  },
  planContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    marginTop: verticalScale(20),
  },
  planTitle: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(4),
    color: '#333',
    fontFamily: FontsFamilys.Poppins_SemiBold,
  },
  planSubtitle: {
    fontSize: moderateScale(12),
    color: '#666',
    marginBottom: verticalScale(16),
    fontFamily: FontsFamilys.Poppins_Regular,
    textAlign: 'center',
  },
  premiumBtn: {
    backgroundColor: '#FFB100',
    borderRadius: scale(25),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(40),
    marginBottom: verticalScale(16),
    borderWidth: 2,
    borderColor: '#FEB413',
    opacity: 0.8,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowOffset: {width: 0, height: 3},
    // shadowRadius: 5,
    // elevation: 3,
  },
  premiumText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontFamily: FontsFamilys.Poppins_SemiBold,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(6),
  },
  dot: {
    width: scale(8),
    height: scale(8),
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#FFB100',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: verticalScale(60),
  },
  navItem: {
    padding: scale(8),
  },
  dotWhite: {
    width: scale(36),
    height: scale(36),
    borderRadius: 4,
    position: 'absolute',
    bottom: scale(-20),
  },
  whiteBackgroundContainer: {
    flex: 0.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    marginTop: -verticalScale(20),
    paddingTop: verticalScale(20),
  },
  profileText: {
    fontSize: moderateScale(16),
    color: '#000',
    fontFamily: FontsFamilys.Poppins_SemiBold,
    textAlign: 'center',
    marginTop: verticalScale(5),
  },
  container: {
    position: 'relative',
    width: moderateScale(80),
    height: moderateScale(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    position: 'absolute',
    top: -6,
    left: 110,
  },
  profileImage: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    resizeMode: 'cover',
  },
});
