import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#20242A',
  },
  btnCancel: {
    borderWidth: 1,
    borderColor: '#6A6E73',
    borderRadius: 100,
    alignItems: 'center',
    minWidth: 160,
  },
  textBtn: {
    fontSize: 16,
    color: '#F8F2EC',
    fontWeight: '600',
    paddingTop: 11,
    paddingBottom: 13,
  },
  btnConfirm: {
    backgroundColor: '#FF662B',
    borderWidth: 1,
    borderColor: '#FF662B',
    borderRadius: 100,
    alignItems: 'center',
    minWidth: 160,
  },
});

export default styles;
