import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    backgroundColor: '#000000',
    paddingHorizontal: 18,
    paddingTop: 15,
  },
  itemTab: {
    position: 'relative',
    width: 60,
    height: 60,
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  middleIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 25,
    borderRadius: 50,
    justifyContent: 'center',
    backgroundColor: '#FF662B',
    alignItems: 'center',
    shadowColor: '#FF662B',
    elevation: 10,
  },
  textTitle: {
    fontSize: 10,
  },
  textSelected: {
    color: '#FF662B',
    fontSize: 10,
  },
});

export default styles;
