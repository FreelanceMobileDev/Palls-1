import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SpleshScreen from '../Screens/onboarding/SpleshScreen';
import SignIn from '../Screens/authStack/SignIn';
import SignUp from '../Screens/authStack/SignUp';
import OTPScreen from '../Screens/authStack/OTPScreen';
import VerifyHuman from '../Screens/authStack/VerifyHuman';
import DetailsFill from '../Screens/authStack/DetailsFill';
import EnterPhoneNumber from '../Screens/authStack/EnterPhoneNumber';
import Gender from '../Screens/authStack/Gender';
import UploadPicture from '../Screens/authStack/UploadPicture';
import RelationShipPrefrence from '../Screens/authStack/RelationShipPrefrence';
import HobbyScreen from '../Screens/authStack/HobbyScreen';
import BioScreen from '../Screens/authStack/BioScreen';
import DrawerNavigator from './DrawerNavigator';
import ReviewPhotoScreen from '../Screens/authStack/ReviewPhotoScreen';
import EventDetailsScreen from '../Screens/TabScreens/EventScreen/EventDetailsScreen';
import CheckIn from '../Screens/TabScreens/EventScreen/CheckIn';
import Checkout from '../Screens/TabScreens/EventScreen/Checkout';
import ProfileDetailScreen from '../Screens/TabScreens/LikesScreen/ProfileDetailScreen';
import EditScreen from '../Screens/TabScreens/ProfileScreen/EditProfile';
import PrivacyScreen from '../Screens/TabScreens/ProfileScreen/PrivacyScreen';
import Setting from '../Screens/TabScreens/ProfileScreen/Setting';
import Subscription from '../Screens/TabScreens/ProfileScreen/Subscription';
import ProfileScreen from '../Screens/TabScreens/ProfileScreen/ProfileScreen';
import ContactUs from '../Screens/TabScreens/ProfileScreen/Contact_Us';
import AddWork from '../Screens/authStack/Addwork/AddWork';
import WorkAdding from '../Screens/authStack/WorkAdding/WorkAdding';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTE_NAMES.SplashScreen}
      // initialRouteName={ROUTE_NAMES.AddWork}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        gestureDirection: 'horizontal',
      }}>
      <Stack.Screen name={ROUTE_NAMES.SplashScreen} component={SpleshScreen} />
      <Stack.Screen name={ROUTE_NAMES.SignIn} component={SignIn} />
      <Stack.Screen
        name={ROUTE_NAMES.EnterPhoneNumber}
        component={EnterPhoneNumber}
      />
      <Stack.Screen
        name={ROUTE_NAMES.ReviewPhotoScreen}
        component={ReviewPhotoScreen}
      />
      {/* <Stack.Screen name={ROUTE_NAMES.Add} */}
      <Stack.Screen name={ROUTE_NAMES.BioScreen} component={BioScreen} />
      <Stack.Screen name={ROUTE_NAMES.HobbyScreen} component={HobbyScreen} />
      <Stack.Screen
        name={ROUTE_NAMES.RelationShipPrefrence}
        component={RelationShipPrefrence}
      />
      <Stack.Screen
        name={ROUTE_NAMES.UploadPicture}
        component={UploadPicture}
      />
      <Stack.Screen name={ROUTE_NAMES.Gender} component={Gender} />
      <Stack.Screen name={ROUTE_NAMES.SignUp} component={SignUp} />
      <Stack.Screen name={ROUTE_NAMES.OTPScreen} component={OTPScreen} />
      <Stack.Screen name={ROUTE_NAMES.VerifyHuman} component={VerifyHuman} />
      <Stack.Screen name={ROUTE_NAMES.DetailsFill} component={DetailsFill} />
      <Stack.Screen name={ROUTE_NAMES.WorkAdding} component={WorkAdding} />
      <Stack.Screen
        name={ROUTE_NAMES.EventDetailsScreen}
        component={EventDetailsScreen}
      />
      <Stack.Screen
        name={ROUTE_NAMES.ProfileDetailsScreen}
        component={ProfileDetailScreen}
      />
      <Stack.Screen name={ROUTE_NAMES.AddWork} component={AddWork} />
      <Stack.Screen name={ROUTE_NAMES.CheckIn} component={CheckIn} />
      <Stack.Screen name={ROUTE_NAMES.Checkout} component={Checkout} />
      <Stack.Screen name={ROUTE_NAMES.EditScreen} component={EditScreen} />
      <Stack.Screen name={ROUTE_NAMES.Privacy} component={PrivacyScreen} />
      <Stack.Screen name={ROUTE_NAMES.Setting} component={Setting} />
      <Stack.Screen name={ROUTE_NAMES.Subscription} component={Subscription} />
      <Stack.Screen
        name={ROUTE_NAMES.TabNavigation}
        component={DrawerNavigator}
      />
      <Stack.Screen
        name={ROUTE_NAMES.ProfileScreen}
        component={ProfileScreen}
      />
      <Stack.Screen name={ROUTE_NAMES.ContactUs} component={ContactUs} />
    </Stack.Navigator>
  );
};

export default StackNavigation;

export const ROUTE_NAMES = {
  TabNavigation: 'TabNavigation',
  DetailsFill: 'DetailsFill',
  VerifyHuman: 'VerifyHuman',
  OTPScreen: 'OTPScreen',
  SplashScreen: 'SplashScreen',
  SignIn: 'SignIn',
  SignUp: 'SignUp',
  EnterPhoneNumber: 'EnterPhoneNumber',
  Gender: 'Gender',
  UploadPicture: 'UploadPicture',
  RelationShipPrefrence: 'RelationShipPrefrence',
  HobbyScreen: 'HobbyScreen',
  BioScreen: 'BioScreen',
  ReviewPhotoScreen: 'ReviewPhotoScreen',
  EventDetailsScreen: 'EventDetailsScreen',
  CheckIn: 'CheckIn',
  Checkout: 'Checkout',
  ProfileDetailsScreen: 'ProfileDetailsScreen',
  EditScreen: 'EditScreen',
  Privacy: 'Privacy',
  Setting: 'Setting',
  Subscription: 'Subscription',
  ProfileScreen: 'ProfileScreen',
  ContactUs: 'ContactUs',
  AddWork: 'AddWork',
  WorkAdding: 'WorkAdding',
};
