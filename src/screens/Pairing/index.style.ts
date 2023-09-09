import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20242A',
    paddingHorizontal: 20,
    paddingTop: 10,
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
  infoWrap: {
    paddingTop: 14,
  },
  itemWrap: {
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTilte: {
    fontWeight: '400',
    color: '#C0BEBC',
  },
  textValue: {
    fontWeight: '600',
    color: '#F8F2EC',
  },
});

export default styles;
