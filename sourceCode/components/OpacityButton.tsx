import {View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator} from 'react-native';
import React from 'react';
import {Colors, FontSize} from '../constant';

const OpacityButton = (props: any) => {
  const {img1, loading} = props;

  return (
    <TouchableOpacity
      style={[styles.container, props.button, {justifyContent: !img1 ? 'center' : 'space-between'}]}
      onPress={props.pressButton}
      disabled={props.disabled || loading}>
      {img1 && (
        <View style={styles.imageBackground}>
          <Image
            style={[props?.imgstyle]}
            resizeMode="contain"
            source={props?.img1}
          />
        </View>
      )}
      {loading ? (
        <ActivityIndicator size="small" color={props.loaderColor || '#fff'} />
      ) : (
        <Text style={[styles.myText, props.btnTextStyle]}>{props.name}</Text>
      )}
      <View />
    </TouchableOpacity>
  );
};

export default OpacityButton;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark_yellow,
    paddingVertical: 10,
    width: '90%',
    borderRadius: 30,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 5,
    borderColor: Colors.light_black,
    borderWidth: 2,
  },
  imageBackground: {
    backgroundColor: Colors.white,
    borderRadius: 60,
    // padding:7
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myText: {
    fontSize: FontSize.sixteen,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  
});
