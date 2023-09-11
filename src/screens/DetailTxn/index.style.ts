import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20242A',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 15,
    position: 'relative',
    alignItems: 'center',
    paddingBottom: 24,
  },
  TopTier: {
    flex: 1,
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
  infoWrap: {
    paddingTop: 14,
  },
  itemWrap: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTilte: {
    fontWeight: '400',
    color: '#C0BEBC',
  },
  textValue: {
    fontWeight: '600',
    color: '#F8F2EC',
    fontSize: 12,
  },
});

export default styles;
