import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Colors, FontSize, FontsFamilys, ImageUrl} from '../constant';
import {moderateScale, verticalScale} from '../utils/responsive';

const ProfileCard = (props: {
  image: any;
  name: any;
  isNew: any;
  tags?: string[];
  onPressStar: () => void;
  redCrossImage: any;
}) => {
  const {image, name, isNew, tags = [], onPressStar} = props;

  return (
    <View style={styles.card}>
      <ImageBackground
        imageStyle={{borderRadius: moderateScale(15)}}
        source={image}
        style={styles.userImage}
        resizeMode="cover">
        <TouchableOpacity>
          {ImageUrl.RedCross && (
            <Image source={ImageUrl.RedCross} style={styles.redCross} />
          )}
        </TouchableOpacity>
        <View style={styles.userInfo}>
          {isNew && (
            <View style={styles.newTag}>
              <Text style={styles.newTagText}>New here</Text>
            </View>
          )}
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.tagContainer}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.floatingButton} onPress={onPressStar}>
          <Image source={ImageUrl.Star} style={{width: 55, height: 55,}} />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  card: {
    height: '82%',
    width: '89%',
    borderRadius: moderateScale(20),
    bottom: moderateScale(50),
    alignSelf: 'center',
  },
  userImage: {
    width: moderateScale(300),
    height: '100%',
  },
  userInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  newTag: {
    backgroundColor: Colors.dark_yellow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 5,
    width: 100,
  },
  newTagText: {
    fontFamily: FontsFamilys.Poppins_Bold,
    fontSize: FontSize.twelve,
    color: Colors.white,
  },
  userName: {
    fontSize: FontSize.T_four,
    fontFamily: FontsFamilys.Poppins_Bold,
    color: '#fff',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: moderateScale(5),
    width: '93%',
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(15),
    marginRight: moderateScale(5),
    color: '#fff',
    fontSize: FontSize.twelve,
    fontFamily: FontsFamilys.Poppins_Medium,
    marginBottom: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: moderateScale(10),
    right: moderateScale(10),
  },
  redCross: {
    height: 60,
    width: 60,
    position: 'absolute',
    top: moderateScale(12),
    right: moderateScale(10),
    zIndex: 1,
  },
});
