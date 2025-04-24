import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from '../../../utils/responsive';

export const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
    paddingTop: verticalScale(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#333',
  },
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 30,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4CD964',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CD964',
  },
  jobText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#333',
  },
  iconButton: {
    paddingHorizontal: moderateScale(6),
  },
  addJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 30,
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(16),
  },
  addJobText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#333',
  },
  saveText: {
    fontWeight: '600',
    fontSize: moderateScale(14),
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: moderateScale(50),
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: moderateScale(20),
  },
  saveButton: {
    width: '90%',
    alignSelf: 'center',
  },
  jobTextContainer: {
    flex: 1,
    marginLeft: moderateScale(10),
  },
  jobTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
  },
  jobCompany: {
    fontSize: moderateScale(14),
    color: '#555',
  },
  
  
});
