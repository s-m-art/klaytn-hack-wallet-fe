import {StyleSheet} from 'react-native';
import {COLOR} from '../../../styles/color';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 4,
    paddingTop: 4,
    backgroundColor: COLOR.neutral_2,
    borderRadius: 8,
    maxWidth: '100%',
  },
  inputLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  input: {
    backgroundColor: COLOR.neutral_2,
    color: COLOR.light,
    maxWidth: '100%',
    fontSize: 18,
  },
});
