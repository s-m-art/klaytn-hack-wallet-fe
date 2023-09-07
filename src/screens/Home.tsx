import React, {Suspense, useCallback, useEffect, useState} from 'react';
// import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Account from './Account/Account';
import {MyTabBar} from '../components/Tabbar';
import {ROUTES_BAR} from '../constants';
import Sessions from './Sessions/Sessions';
import Pairing from './Pairing';
import Settings from './Settings/Setting';
import {SignClientTypes, SessionTypes} from '@walletconnect/types';
import {currentETHAddress, web3wallet, _pair} from '../utils/Web3WalletClient';
import {getSdkError} from '@walletconnect/utils';
import {EIP155_SIGNING_METHODS} from '../data/EIP155';
import {handleDeepLinkRedirect} from '../utils/LinkingUtils';
import {ActivityIndicator, View} from 'react-native';
import {PairModal} from '../components/Modals/PairModal';
import {SendTransactionModal} from '../components/Modals/SendTransactionModal';
const ModalConnect = React.lazy(
  () => import('../components/ModalConnect/ModalConnect'),
);
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ENV_RPC} from '@env';

import Web3 from 'web3';
import {STORAGE_KEYS} from '../constants/index';
import {SignModal} from '../components/Modals/SignModal';
import {SignTypedDataModal} from '../components/Modals/SignTypedDataModal';

// import {signUserOpWeb3} from '../utils/signUserOp';

const Tab = createBottomTabNavigator();

function Home({navigation}) {
  // Modal Visible State
  const [approvalModal, setApprovalModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [signTypedDataModal, setSignTypedDataModal] = useState(false);
  const [sendTransactionModal, setSendTransactionModal] = useState(false);
  const [copyDialog, setCopyDialog] = useState(false);
  const [successPair, setSuccessPair] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  // Pairing State
  const [pairedProposal, setPairedProposal] =
    useState<SignClientTypes.EventArguments['session_proposal']>();

  const [requestEventData, setRequestEventData] = useState<
    SignClientTypes.EventArguments['session_request'] | any
  >();
  const [requestSession, setRequestSession] = useState<SessionTypes.Struct>();

  async function handleDecline() {
    setApprovalModal(false);

    if (!pairedProposal) {
      return;
    }

    web3wallet.rejectSession({
      id: pairedProposal.id,
      reason: getSdkError('USER_REJECTED_METHODS'),
    });
  }

  async function handleAccept() {
    const {id, params}: any = pairedProposal;
    const {requiredNamespaces, relays} = params;

    if (pairedProposal) {
      const namespaces: SessionTypes.Namespaces = {};
      Object.keys(requiredNamespaces).forEach(key => {
        const accounts: string[] = [];
        requiredNamespaces[key].chains.map((chain: any) => {
          [currentETHAddress].map(acc => accounts.push(`${chain}:${acc}`));
        });

        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events,
        };
      });

      const session = await web3wallet.approveSession({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });

      setApprovalModal(false);
      setSuccessPair(true);

      const sessionMetadata = session?.peer?.metadata;
      handleDeepLinkRedirect(sessionMetadata?.redirect);
    }
  }

  const handleCancel = () => {
    setCopyDialog(false);
  };

  async function pair(uri: string) {
    const pairing = await _pair({uri});
    // setCopyDialog(false);

    // @notice iOS has an issue with modals, so we need to delay the approval modal
    setTimeout(() => {
      setApprovalModal(true);
    }, 1200);
    return pairing;
  }

  const onPair = (uri: string) => {
    pair(uri);
    setModalVisible(false);
  };

  // ToDo / Consider: How best to move onSessionProposal() + onSessionRequest() + the if statement Listeners.
  // Know there is an events config we did in web-examples app
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      setPairedProposal(proposal);
      console.log('hihihihi session_proposal');
    },
    [],
  );

  const onSessionRequest = useCallback(
    async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
      const {topic, params} = requestEvent;
      const {request} = params;
      const requestSessionData =
        web3wallet.engine.signClient.session.get(topic);

      switch (request.method) {
        case EIP155_SIGNING_METHODS.ETH_SIGN:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          setRequestSession(requestSessionData);
          setRequestEventData(requestEvent);
          setSignModal(true);
          return;

        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
          setRequestSession(requestSessionData);
          setRequestEventData(requestEvent);
          setSignTypedDataModal(true);
          return;
        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
          setRequestSession(requestSessionData);
          setRequestEventData(requestEvent);
          setSendTransactionModal(true);
          return;
      }
    },
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const web3 = new Web3(ENV_RPC);
        const address = await AsyncStorage.getItem(STORAGE_KEYS.ADDRESS);

        const balanceData: string = await web3.eth.getBalance(address);
        setBalance(balanceData);
        console.log(balanceData, 'balanceData');
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (
      copyDialog ||
      approvalModal ||
      signTypedDataModal ||
      signModal ||
      sendTransactionModal
    ) {
      web3wallet.on('session_proposal', onSessionProposal);
      web3wallet.on('session_request', onSessionRequest);
    }
  }, [
    approvalModal,
    copyDialog,
    signModal,
    signTypedDataModal,
    sendTransactionModal,
    requestEventData,
    requestSession,
    onSessionProposal,
    onSessionRequest,
    successPair,
  ]);

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => (
          <MyTabBar setModalVisible={setModalVisible} {...props} />
        )}
        initialRouteName={ROUTES_BAR.ACCOUNT}>
        <Tab.Screen name={ROUTES_BAR.ACCOUNT}>
          {() => <Account balance={balance} />}
        </Tab.Screen>
        <Tab.Screen name={ROUTES_BAR.SESSIONS} component={Sessions} />
        <Tab.Screen name={ROUTES_BAR.PAIRING} component={Pairing} />
        <Tab.Screen name={ROUTES_BAR.SETTINGS} component={Settings} />
      </Tab.Navigator>

      <PairModal
        proposal={pairedProposal}
        open={setApprovalModal}
        visible={approvalModal}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
      />

      {requestEventData && requestSession && signModal && (
        <SignModal
          visible={signModal}
          setVisible={setSignModal}
          requestEvent={requestEventData}
          requestSession={requestSession}
          // setRequestEventData={setRequestEventData}
          // setRequestSession={setRequestSession}
        />
      )}

      {requestEventData && requestSession && sendTransactionModal && (
        <SendTransactionModal
          visible={sendTransactionModal}
          setVisible={setSendTransactionModal}
          requestEvent={requestEventData}
          requestSession={requestSession}
          // setRequestEventData={setRequestEventData}
          // setRequestSession={setRequestSession}
        />
      )}
      {requestEventData && requestSession && signTypedDataModal && (
        <SignTypedDataModal
          visible={signTypedDataModal}
          setVisible={setSignTypedDataModal}
          requestEvent={requestEventData}
          requestSession={requestSession}
          // setRequestEventData={setRequestEventData}
          // setRequestSession={setRequestSession}
        />
      )}

      <Suspense fallback={<ActivityIndicator />}>
        <ModalConnect
          onPair={onPair}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <Suspense />
      </Suspense>
    </View>
  );
}

export default Home;
