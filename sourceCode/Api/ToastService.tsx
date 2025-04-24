
import { createRef } from "react";
import { Platform, ToastAndroid } from "react-native";
import Toast from "react-native-simple-toast";
export const toastRef = createRef();
//  import { toast } from 'react-toastify';
const web = Platform.OS === "web";
export const ShowToast = (message: any) => {
  if (web) {
  } else {
    Toast.LONG;
    Toast.SHORT;
    Toast.TOP;
    Toast.BOTTOM;
    Toast.CENTER;
    if (Platform.OS === "ios") {
      Toast.show(message, Toast.LONG);
    } else if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.TOP);
    }
  }
};