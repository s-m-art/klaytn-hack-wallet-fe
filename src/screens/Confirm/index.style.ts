import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20242A',
  },

  TopTier: {
    flex: 1,
    paddingHorizontal: 20,
  },
  wrapField: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F8F2EC',
    paddingBottom: 8,
  },
  wrapInput: {
    borderWidth: 1,
    borderColor: '#3E4247',
    borderRadius: 8,
    paddingLeft: 16,
    fontSize: 16,
    color: '#F8F2EC',
  },
  wrapInputEye: {
    borderWidth: 1,
    borderColor: '#3E4247',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#F8F2EC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#F8F2EC',
    flex: 1,
  },
});

export default styles;
