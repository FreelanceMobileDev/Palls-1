import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, ImageUrl, Texts} from '../../../constant';
import OpacityButton from '../../../components/OpacityButton';
import {moderateScale} from '../../../utils/responsive';
import ProfileCard from '../../../components/ProfileCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import ToggleButtons from '../../../components/ToggleButtons';
import Swiper from 'react-native-deck-swiper';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {styles} from './Style';

const {width} = Dimensions.get('window');

const profiles = [
  {
    id: '1',
    name: 'Atylia, 32',
    isNew: true,
    tags: ['Travel', 'Cooking', 'Outdoor Sports', 'Pickleball'],
    image: ImageUrl.GirlImage,
  },
  {
    id: '2',
    name: 'Sophie, 29',
    isNew: true,
    tags: ['Travel', 'Cooking', 'Outdoor Sports', 'Pickleball'],
    image: ImageUrl.GirlImage,
  },
  {
    id: '3',
    name: 'Sophie, 29',
    isNew: true,
    tags: ['Travel', 'Cooking', 'Outdoor Sports', 'Pickleball'],
    image: ImageUrl.GirlImage,
  },
];

const HomeScreen = () => {
  const [activeOption, setActiveOption] = useState('Palls Buddy');
  const [showProfile, setShowProfile] = useState(false);
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [profilesData] = useState(profiles);

  const handleOptionChange = (option: string) => {
    setActiveOption(option);
    if (option === 'Palls Buddy') {
      setShowProfile(false);
    }
  };

  const renderProfileCard = (_: any) => {
    return (
      <ProfileCard
        image={ImageUrl.GirlImage}
        name={'Atylia, 32'}
        isNew={true}
        tags={['Travel', 'Cooking', 'Outdoor Sports', 'Pickleball']}
        onPressStar={() => {
          setShowProfile(false);
          console.log('Star clicked!');
        }}
        redCrossImage={ImageUrl.RedCross}
      />
    );
  };

  const ExploreBuddies = () => {
    const categories = [
      {
        title: 'Entertainment & Leisure',
        icon: ImageUrl.Entertainment,
        bg: Colors.category_yellow,
      },
      {
        title: 'Outdoor & Adventure',
        icon: ImageUrl.Camping,
        bg: Colors.category_green,
      },
      {
        title: 'Food & Drink Experiences',
        icon: ImageUrl.Fastfood,
        bg: Colors.category_orange,
      },
      {
        title: 'Learning & Creativity',
        icon: ImageUrl.Bulb,
        bg: Colors.category_blue,
      },
      {
        title: 'Active & Sporty Fun',
        icon: ImageUrl.Badminton,
        bg: Colors.category_cyan,
      },
      {
        title: 'Other Activities',
        icon: ImageUrl.NotesBook,
        bg: Colors.category_purple,
      },
    ];

    const renderCategory = ({item}: any) => (
      <View style={[styles.cardItem, {backgroundColor: item.bg}]}>
        <Text style={styles.cardText}>{item.title}</Text>
        <Image source={item.icon} style={styles.cardIcon} />
      </View>
    );

    const ListHeader = () => (
      <View style={{marginHorizontal: moderateScale(32)}}>
        <Text style={styles.buddiesTitle}>{Texts.Explore_Buddies}</Text>
        <Text style={styles.buddiesSubtitle}>{Texts.Connect_Friends}</Text>
      </View>
    );
    const ListFooter = () => (
      <OpacityButton
        name={Texts.Explore_buddies}
        pressButton={() => setShowProfile(true)}
        button={styles.button}
      />
    );

    return !showProfile ? (
      <View style={{flex: 1}}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(_item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            paddingHorizontal: moderateScale(25),
          }}
          contentContainerStyle={{
            paddingBottom: moderateScale(100),
            paddingTop: moderateScale(20),
            paddingHorizontal: moderateScale(4),
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          bounces
          alwaysBounceVertical
        />
      </View>
    ) : null;
  };

  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.3]}
      style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Image source={ImageUrl.threelinesicon} />
          </TouchableOpacity>
          <View
            style={[
              styles.logoContainer,
              {
                marginLeft:
                  activeOption === 'Palls Date' ? 0 : moderateScale(49),
              },
            ]}>
            <Image source={ImageUrl.PallsIcon} />
          </View>
          <View style={styles.ButtonView}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFilterModalVisible(true)}>
              <Image source={ImageUrl.filtericon} />
            </TouchableOpacity>
            <View style={{width: 10}} />
            {activeOption !== 'Palls Date' && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowProfile(true)}>
                <Image source={ImageUrl.Fourbox} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ToggleButtons
          options={['Palls Date', 'Palls Buddy']}
          activeOption={activeOption}
          onChange={handleOptionChange}
        />
        {activeOption === 'Palls Date' ? (
          <View style={{flex: 1}}>
            <Swiper
              cards={profilesData}
              renderCard={renderProfileCard}
              stackSize={3}
              backgroundColor="transparent"
              cardHorizontalMargin={20}
              cardVerticalMargin={80}
              onSwiped={cardIndex => console.log(cardIndex)}
              onSwipedAll={() => console.log('All swiped')}
              verticalSwipe={false}
              stackSeparation={0}
              infinite={true}
            />
          </View>
        ) : showProfile ? (
          <View style={styles.fourBoxcard}>
            <ProfileCard
              image={ImageUrl.GirlImage}
              name={'Atylia, 32'}
              isNew={true}
              tags={['Travel', 'Cooking', 'Outdoor Sports', 'Pickleball']}
              onPressStar={() => {
                setShowProfile(false);
                console.log('Star clicked!');
              }}
              redCrossImage={ImageUrl.RedCross}
            />
          </View>
        ) : (
          <ExploreBuddies />
        )}
        <Modal
          isVisible={isFilterModalVisible}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          onBackdropPress={() => setFilterModalVisible(false)}
          style={styles.modalStyle}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalupperline} />
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.closeText}>×</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modallowerline} />
              <Text style={styles.label}>Distance</Text>
              <MultiSlider
                values={[42]}
                sliderLength={width - 40}
                min={18}
                max={60}
                step={1}
                selectedStyle={{backgroundColor: '#F4B63F'}}
                markerStyle={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderColor: '#F4B63F',
                  borderWidth: 2,
                  backgroundColor: '#fff',
                }}
              />
              <Text style={styles.sliderValue}>40km</Text>
              <Text style={styles.label}>Show Me</Text>
              <TouchableOpacity style={styles.selectionBox}>
                <Text style={styles.selectionText}>Both gender</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <Text style={styles.label}>Age Range</Text>
                <Text style={styles.sliderValue}>22–38</Text>
              </View>
              <MultiSlider
                values={[22, 38]}
                sliderLength={width - 40}
                min={18}
                max={60}
                step={1}
                selectedStyle={{backgroundColor: '#F4B63F'}}
                markerStyle={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderColor: '#F4B63F',
                  borderWidth: 2,
                  backgroundColor: '#fff',
                }}
              />
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
