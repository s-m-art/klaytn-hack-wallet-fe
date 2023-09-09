import {StyleSheet} from 'react-native';
import {COLOR} from '../../styles/color';

const styles = StyleSheet.create({
  img: {
    zIndex: -1,
    position: 'absolute',
    backgroundColor: COLOR.neutral_3,
    height: '100%',
    width: '100%',
  },
  wrapper: {flex: 1, position: 'relative'},
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    position: 'absolute',
    top: '30%',
    bottom: '5%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  login: {display: 'flex', gap: 24},
  signUp: {fontSize: 16, fontWeight: '500', color: COLOR.orange},
  wrap: {width: '100%', gap: 32, display: 'flex'},
  text1: {
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 50,
    color: COLOR.light,
  },
  input: {width: '100%'},
  wrapInput: {display: 'flex', gap: 12, width: '100%'},
  textError: {
    color: '#FF662B',
    fontSize: 12,
  },
  btn: {
    borderRadius: 100,
    padding: 15,
    backgroundColor: COLOR.orange,
  },
  dontAcc: {
    fontSize: 16,
    fontWeight: '500',
    color: COLOR.neutral_1,
  },
  wrapTextBottom: {display: 'flex', flexDirection: 'row', gap: 2},
  loginBtn: {
    color: COLOR.light,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 4,
  },
  wrapBottom: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'center',
  },
});

export default styles;
