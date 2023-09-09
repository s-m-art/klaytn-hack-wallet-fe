import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20242A',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    paddingBottom: 16,
    color: '#F8F2EC',
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#3E4247',
    paddingLeft: 16,
    borderRadius: 8,
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
  },
  textTilte: {
    fontWeight: '400',
    color: '#C0BEBC',
  },
  textValue: {
    fontWeight: '600',
    color: '#F8F2EC',
  },
  btnRemove: {
    borderWidth: 1,
    borderColor: '#6A6E73',
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 100,
  },
  textRemove: {
    paddingTop: 11,
    fontSize: 16,
    fontWeight: '600',
    color: '#F8F2EC',
    paddingBottom: 13,
  },
  textActive: {
    fontWeight: '600',
    color: '#00D987',
  },
  textUpcoming: {
    fontWeight: '600',
    color: '#F6C000',
  },
  textExp: {
    fontWeight: '600',
    color: '#FF662B',
  },
  textEmpty: {
    color: '#888889',
  },
});

export default styles;
