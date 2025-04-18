import {StyleSheet, Dimensions} from 'react-native';
import {Colors, FontsFamilys, FontSize} from '../../../constant';
import {moderateScale} from '../../../utils/responsive';

const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    marginTop:moderateScale(20)
  },
  iconButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: moderateScale(20),
    shadowColor: '#000',
    marginLeft: moderateScale(12),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginRight:moderateScale(10)
  },
  logoContainer: {
    alignItems: 'center',
  },
  ButtonView: {
    flexDirection: 'row',
  },
  button: {
    width: '40%',
    alignSelf: 'center',
    borderColor: '#FEB413',
    backgroundColor: '#FDC93A',
    borderWidth: 2,
  },
  card: {
    flex: 1,
  },
  cardItem: {
    width: width * 0.4,
    height: height * 0.2,
    borderRadius: moderateScale(15),
    padding: moderateScale(15),
    marginBottom: moderateScale(20),
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: FontSize.sixteen,
    fontFamily: FontsFamilys.Poppins_Regular,
    width: '100%',
  },
  cardIcon: {
    width: moderateScale(80),
    height: moderateScale(80),
    alignSelf: 'flex-end',
  },
  grid: {
    paddingVertical: moderateScale(20),
  },
  buddiesTitle: {
    fontSize: FontSize.T_three,
    fontFamily: FontsFamilys.Poppins_Bold,
    color: Colors.greyText,
    marginBottom: moderateScale(5),
  },
  buddiesSubtitle: {
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Regular,
    color: Colors.greyText,
    marginBottom: moderateScale(20),
  },
  // Modal Styles
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: moderateScale(20),
    width: '100%',
    height: '70%',
  },
  modalupperline: {
    width: '20%',
    backgroundColor: 'grey',
    height: 7,
    opacity: 0.2,
    marginBottom: moderateScale(25),
    marginTop: moderateScale(10),
    alignSelf: 'center',
    borderRadius: moderateScale(10),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: FontSize.twenty,
    fontFamily: FontsFamilys.Poppins_SemiBold,
  },
  closeText: {
    fontSize: moderateScale(24),
    color: '#000',
  },
  modallowerline: {
    width: '100%',
    backgroundColor: 'grey',
    height: 1,
    opacity: 0.2,
    marginBottom: moderateScale(25),
    marginTop: moderateScale(10),
  },
  label: {
    fontSize: moderateScale(FontSize.fourteen),
    fontFamily: FontsFamilys.Poppins_SemiBold,
    marginBottom: moderateScale(10),
  },
  sliderValue: {
    textAlign: 'right',
    color: Colors.light_black,
    fontSize: moderateScale(12),
  },
  selectionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E8F9F1',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(20),
  },
  selectionText: {
    fontFamily: FontsFamilys.Poppins_Medium,
    color: 'green',
    fontSize: moderateScale(14),
  },
  arrow: {
    fontSize: moderateScale(18),
    color: 'green',
  },
  applyButton: {
    backgroundColor: '#FEB413',
    borderRadius: moderateScale(30),
    paddingVertical: moderateScale(15),
    alignItems: 'center',
    marginHorizontal: moderateScale(30),
    marginTop: moderateScale(40),
    borderWidth: 2,
    borderColor: 'black',
  },
  applyText: {
    fontFamily: FontsFamilys.Poppins_Regular,
    color: '#000',
    fontSize: moderateScale(14),
  },
  fourBoxcard: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: moderateScale(20),
  },
});
