import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20242A',
  },
  header: {
    marginTop: 15,
    position: 'relative',
    alignItems: 'center',
    paddingBottom: 35,
  },
  wrapBg: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  TopTier: {
    flex: 1,
  },
  imgBg: {
    height: 225,
  },
  titleHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8F2EC',
  },
  btnGoBack: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -12}],
    left: 0,
    width: 30,
    height: 30,
  },
  topCard: {paddingHorizontal: 20},
  wrapInfo: {
    flexDirection: 'row',
    paddingBottom: 24,
  },
  wrapIcon: {
    width: 46,
    height: 46,
    backgroundColor: '#3E4247',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  address: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888889',
  },
  value: {
    fontSize: 18,
    color: '#F8F2EC',
    fontWeight: '700',
  },
  wrapInput: {
    paddingTop: 32,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#3E4247',
    paddingLeft: 16,
    borderRadius: 8,
  },
  wrapBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 30,
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
