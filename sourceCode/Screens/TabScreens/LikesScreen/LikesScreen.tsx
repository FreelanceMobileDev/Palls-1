import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header';
import ToggleButtons from '../../../components/ToggleButtons';
import {moderateScale, scale, verticalScale} from '../../../utils/responsive';
import {Colors, FontsFamilys, ImageUrl} from '../../../constant';
import {useNavigation} from '@react-navigation/native';

const LikesScreen = () => {
  const [activeOption, setActiveOption] = useState('Liked You');

  const navigation = useNavigation();

  const profiles = {
    recentlyActive: [
      {
        id: '1',
        name: 'Anna, 22',
        status: 'Recently Active',
        image: ImageUrl.User1,
      },
      {
        id: '2',
        name: 'Gustave, 29',
        status: 'Recently Active',
        image: ImageUrl.User1,
      },
    ],
    mostMatches: [
      {
        id: '3',
        name: 'Julie, 26',
        match: '99% Match',
        distance: '1.3 km away',
        image: ImageUrl.User1,
      },
      {
        id: '4',
        name: 'Mayra, 33',
        match: '89% Match',
        distance: '3.2 km away',
        image: ImageUrl.User1,
      },
    ],
  };

  const Card = ({item, isMatch}: {item: any; isMatch?: boolean}) => (
    <TouchableOpacity
      style={[styles.card, isMatch && styles.matchCard]}
      onPress={() =>
        navigation.navigate(
          'ProfileDetailsScreen' as never,
          {profile: item} as never,
        )
      }>
      <Image source={item.image} style={styles.image} />

      {isMatch && (
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{item.match}</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradientOverlay}>
        <View style={styles.textRow}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {item.status === 'Recently Active' && (
                <View
                  style={{
                    height: 6,
                    width: 6,
                    backgroundColor: '#7BD576',
                    borderRadius: moderateScale(20),
                    marginRight: moderateScale(5),
                  }}
                />
              )}
              <Text
                style={[
                  styles.subText,
                  isMatch && {
                    opacity: 0.5,
                    backgroundColor: '#E0E0E0',
                    borderRadius: moderateScale(10),
                    paddingHorizontal: moderateScale(5),
                    paddingVertical: verticalScale(2),
                  },
                ]}>
                {item.status || item.distance}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.iconWrapper}>
            <Image source={ImageUrl.StarWhite} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.3]}
      style={styles.gradient}>
      <StatusBar
        backgroundColor="#FEB413"
        barStyle="dark-content"
        translucent={false}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header
            leftIcon={ImageUrl.threelinesicon}
            leftIconStyle={{
              width: moderateScale(45),
              height: moderateScale(45),
              marginLeft: moderateScale(22),
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

          <View
            style={{
              marginVertical: verticalScale(15),
              width: moderateScale(375),
            }}>
            <ToggleButtons
              options={['Liked You', 'Liked by You']}
              activeOption={activeOption}
              onChange={setActiveOption}
            />
          </View>
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <FlatList
              ListHeaderComponent={
                <>
                  <Text style={styles.sectionTitle}>Recently Active</Text>
                  <FlatList
                    data={profiles.recentlyActive}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{gap: moderateScale(16)}}
                    renderItem={({item}) => <Card item={item} />}
                  />

                  <Text
                    style={[
                      styles.sectionTitle,
                      {marginTop: verticalScale(24)},
                    ]}>
                    Most Matches
                  </Text>
                </>
              }
              data={profiles.mostMatches}
              keyExtractor={item => item.id}
              numColumns={2}
              renderItem={({item}) => <Card item={item} isMatch />}
              contentContainerStyle={{
                paddingBottom: verticalScale(30),
              }}
              columnWrapperStyle={{
                gap: moderateScale(16),
              }}
              showsVerticalScrollIndicator={false}
              bounces={true}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LikesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(3),
  },
  sectionTitle: {
    fontSize: moderateScale(14),
    fontFamily: FontsFamilys.Poppins_SemiBold,
    color: '#2C2C2C',
    marginBottom: verticalScale(10),
  },
  card: {
    width: Dimensions.get('window').width / 2 - moderateScale(45),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    backgroundColor: '#fff', // optional fallback
  },

  matchCard: {
    marginBottom: verticalScale(18),
    borderWidth: 3,
    borderColor: '#FDB515',
  },
  image: {
    width: '100%',
    height: verticalScale(160),
    borderRadius: moderateScale(16),
  },
  textContainer: {
    padding: moderateScale(10),
  },
  name: {
    color: '#fff',
    fontFamily: FontsFamilys.Poppins_SemiBold,
    fontSize: moderateScale(14),
  },
  subText: {
    color: '#FFFFFF',
    fontSize: moderateScale(10),
    marginTop: verticalScale(2),
    fontFamily: FontsFamilys.Poppins_Regular,
  },
  icon: {
    width: scale(32),
    height: scale(32),
  },
  matchBadge: {
    position: 'absolute',
    backgroundColor: '#FDB515',
    borderBottomLeftRadius: moderateScale(15),
    borderBottomRightRadius: moderateScale(15),
    paddingVertical: verticalScale(2),
    paddingHorizontal: moderateScale(10),
    alignSelf: 'center',
  },
  matchText: {
    fontSize: moderateScale(10),
    fontFamily: FontsFamilys.Poppins_SemiBold,
    color: '#fff',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(10),
    paddingTop: verticalScale(30),
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
