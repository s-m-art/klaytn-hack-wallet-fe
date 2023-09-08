import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20242A',
  },
  topContent: {
    paddingTop: 30,
    alignItems: 'center',
    paddingBottom: 36,
    borderBottomColor: '#3E4247',
    borderBottomWidth: 1,
  },
  outSite: {
    width: 232,
    height: 232,
    borderColor: '#3E4247',
    borderWidth: 1,
    borderRadius: 1000,
    padding: 12,
    position: 'relative',
  },
  circleITem: {
    width: '100%',
    height: '100%',
    borderColor: '#FF662B',
    borderWidth: 12,
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20242A',
    shadowColor: '#FF662B',
    shadowOffset: {
      width: 1,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
  },
  buttonSend: {
    backgroundColor: '#FF662B',
    paddingHorizontal: 60,
    paddingBottom: 13,
    paddingTop: 11,
    borderRadius: 100,
    marginTop: 24,
  },
  textSend: {
    fontSize: 16,
    color: '#F8F2EC',
  },
  txnContainer: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  titleNet: {
    fontSize: 14,
    color: '#888889',
    fontWeight: '500',
    paddingBottom: 6,
  },
  valuePrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F8F2EC',
  },
  titleTxn: {
    fontSize: 18,
    color: '#F8F2EC',
    fontWeight: '700',
    paddingBottom: 20,
  },
  textActive: {
    fontSize: 14,
    color: '#00D987',
  },
  textUpcoming: {
    fontSize: 14,
    color: '#F6C000',
  },
  textExp: {
    fontSize: 14,
    color: '#888889',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#2B2F35',
    borderRadius: 10,
  },
  img: {width: 40, height: 40, borderRadius: 6},
  wrapName: {
    marginLeft: 10,
    gap: 4,
  },
  date: {
    fontSize: 12,
    fontWeight: '400',
  },
  name: {
    fontWeight: '700',
    color: '#F8F2EC',
  },
  status: {
    fontWeight: '500',
    color: '#00D987',
  },
  wrapTxnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapTxnRight: {
    gap: 2,
  },
  priceKlaytn: {
    textAlign: 'right',
    fontWeight: '700',
    letterSpacing: 0.1,
    color: '#F8F2EC',
  },
  priceUSD: {
    fontWeight: '500',
    color: '#C0BEBC',
    letterSpacing: 0.1,
    textAlign: 'right',
  },
  ldsRipple: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 220,
    height: 220,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [
      {
        translateX: -110,
      },
      {
        translateY: -110,
      },
    ],
  },
  rippleInner: {
    width: 220,
    height: 220,
    borderRadius: 120,
    borderWidth: 0,
    borderColor: 'rgba(255, 102, 43, 1)',
    opacity: 1,
    shadowColor: 'rgba(255, 102, 43, 1)',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    margin: 2,
    backgroundColor: 'transparent',
  },
  rippleInnerDelayed: {
    marginLeft: -10,
  },
});

export default styles;
