import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#2220208f',
  },
  centeredViewHide: {
    // display: 'none',
  },
  wrapBtn: {
    flexDirection: 'column-reverse',
  },
  btnConfirm: {
    marginBottom: 8,
    marginTop: 10,
  },
  wrapInput: {},
  qrContainer: {
    width: '100%',
    flex: 1,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(62, 66, 71, 1)',
    marginBottom: 20,
  },
  input: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: 'rgba(62, 66, 71, 1)',
    borderRadius: 8,
  },
  textOr: {
    paddingHorizontal: 10,
    fontSize: 16,
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'rgba(32, 36, 42, 1)',
    borderRadius: 20,
    padding: 35,

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
    backgroundColor: 'rgba(43, 47, 53, 1)',
    paddingVertical: 11,
    paddingHorizontal: 36,
    marginTop: 24,
    borderRadius: 8,
  },
  textBtn: {
    color: 'rgba(248, 242, 236, 1)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
