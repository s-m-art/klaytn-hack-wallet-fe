import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
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
});

export default styles;
