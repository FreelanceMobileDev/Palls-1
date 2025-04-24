import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {toString} from 'lodash';
import {PermissionsAndroid, Platform} from 'react-native';
import {PERMISSIONS} from 'react-native-permissions';
import { setItem, getItem } from './handelFunction';

import store from '@redux/store';

interface RemoteMessage {
  data: {
    [key: string]: string;
  };
  notification?: Notification;
}

interface Notification {
  // Define properties for the Notification object
  title: string;
  body: string;
}

export async function requestUserPermission(callback = (_: boolean) => {}) {
  try {
    console.log('Requesting notification permissions...');
    
    if (Platform.OS === 'android') {
      // For Android 13 and above
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'Allow this app to post notifications?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        
        console.log('Android notification permission result:', granted);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          await getFcmToken();
          callback(false);
          return;
        } else {
          callback(true);
          return;
        }
      }
    }

    // For iOS and older Android versions
    const authStatus = await messaging().requestPermission();
    console.log('Firebase messaging permission status:', authStatus);
    
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await getFcmToken();
      callback(false);
    } else {
      callback(true);
    }
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    callback(true);
  }
}

export const getFcmToken = async () => {
  let fcmToken = await getItem('fcmToken');
  console.log('FcmToken', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        // setNotificationToken(fcmToken);
        await setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error in fcmToken');
    }
  }
};

async function onDisplayNotification(data: any) {
  try {
    console.log('Attempting to display notification:', data);
    
    // Request permissions if needed
    if (Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus < 2) {
        console.log('Notification permission denied on iOS');
        return;
      }
    }

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      importance: 4, // High importance
      vibration: true,
      vibrationPattern: [300, 500],
    });

    console.log('Created notification channel:', channelId);

    // Display a notification
    const notificationId = await notifee.displayNotification({
      title: data?.notification?.title || 'New Notification',
      body: data?.notification?.body || 'You have a new notification',
      data: data?.data || {},
      android: {
        channelId,
        sound: 'default',
        pressAction: {
          id: 'default',
        },
        importance: 4,
      },
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
        },
      },
    });

    console.log('Notification displayed successfully with ID:', notificationId);
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
}

export const notificationListener = async () => {
  const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
    onDisplayNotification(remoteMessage);

    const {data} = remoteMessage as RemoteMessage;
    if (!!data?.agoraTokenDetail || !!data?.consultData) {
      let newData = {
        ...JSON.parse(data?.agoraTokenDetail),
        ...JSON.parse(data?.consultData),
      };
      //   setNotificationData(newData);
    }

    console.log(
      JSON.stringify(remoteMessage),
      'remoteMessageremoteMessageremoteMessageremoteMessage',
    );
    //Redux action set for ntotidata

    if (data?.count) {
      //   setNotificationCount(Number(data?.count));
    }
    // if (data?.type == 'LeaveCall') {
    //     actions.leaveCallByAdmin(data)
    // }
    //   console.log("Forground Message - " + JSON.stringify(remoteMessage));
    // store.dispatch(saveNotiData(remoteMessage));
    return remoteMessage;
  });

  //Backgorund
  messaging().onNotificationOpenedApp((remoteMessage: any) => {
    const {notification} = remoteMessage;
    // setNotificationCount(notificationCount + 1)
    console.log(
      remoteMessage,
      'background remoteMessageremoteMessageddddddddddddd',
    );
    // store.dispatch(saveNotiData(remoteMessage));
  });

  //Kill or inactive
  messaging()
    .getInitialNotification()
    .then((remoteMessage: any) => {
      console.log(remoteMessage, 'remoteMessageremoteMessage');
      // setNotificationCount(notificationCount + 1)
      //   store.dispatch(saveNotiData(remoteMessage));
    });

  return unsubscribe;
};
