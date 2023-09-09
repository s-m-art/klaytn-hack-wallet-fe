import {StyleSheet, Dimensions} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#101316',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  wrapBtn: {
    flexDirection: 'column-reverse',
  },
  btnConfirm: {
    marginBottom: 8,
    marginTop: 10,
  },
  qrContainer: {
    marginTop: 40,
  },
  connectUri: {
    marginTop: 110,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#3E4247',
  },
  input: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'rgba(62, 66, 71, 1)',
    borderRadius: 8,
    color: '#F8F2EC',
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#FF662B',
  },
  textOr: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#C0BEBC',
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(32, 36, 42, 1)',
    borderRadius: 20,
    padding: 20,

    shadowColor: 'rgba(32, 36, 42, 1)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    flex: 1,
    width: '100%',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  btnConnectUri: {
    backgroundColor: '#2B2F35',
    paddingVertical: 11,
    paddingHorizontal: 36,
    marginTop: 24,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  textBtn: {
    color: 'rgba(248, 242, 236, 1)',
    fontSize: 16,
    fontWeight: '600',
  },
  textError: {
    color: '#FF662B',
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
