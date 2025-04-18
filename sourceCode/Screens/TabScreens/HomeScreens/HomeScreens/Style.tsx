import {StyleSheet} from 'react-native';
import {moderateScale} from '../../../../utils/responsive';
import {Colors} from '../../../../constant';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  iconButton: {
    padding: moderateScale(10),
  },
  logoContainer: {
    alignItems: 'center',
  },
  ButtonView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buddiesTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: moderateScale(8),
  },
  buddiesSubtitle: {
    fontSize: moderateScale(16),
    color: Colors.gray,
    marginBottom: moderateScale(20),
  },
  cardItem: {
    width: '48%',
    height: moderateScale(120),
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
    justifyContent: 'space-between',
  },
  cardText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.white,
  },
  cardIcon: {
    width: moderateScale(24),
    height: moderateScale(24),
    alignSelf: 'flex-end',
  },
  grid: {
    flexGrow: 1,
  },
  bottomButton: {
    marginTop: moderateScale(20),
    marginBottom: moderateScale(40),
  },
  modalStyle: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(20),
  },
  modalupperline: {
    width: moderateScale(40),
    height: moderateScale(4),
    backgroundColor: Colors.gray,
    alignSelf: 'center',
    borderRadius: moderateScale(2),
    marginBottom: moderateScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeText: {
    fontSize: moderateScale(24),
    color: Colors.gray,
  },
  modallowerline: {
    height: moderateScale(1),
    backgroundColor: Colors.lightGray,
    marginBottom: moderateScale(20),
  },
  label: {
    fontSize: moderateScale(16),
    color: Colors.black,
    marginBottom: moderateScale(10),
  },
  sliderValue: {
    fontSize: moderateScale(14),
    color: Colors.gray,
    textAlign: 'right',
  },
  selectionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(12),
    borderWidth: moderateScale(1),
    borderColor: Colors.lightGray,
    borderRadius: moderateScale(8),
    marginBottom: moderateScale(20),
  },
  selectionText: {
    fontSize: moderateScale(16),
    color: Colors.black,
  },
  arrow: {
    fontSize: moderateScale(20),
    color: Colors.gray,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    marginTop: moderateScale(20),
  },
  applyText: {
    color: Colors.white,
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
}); 