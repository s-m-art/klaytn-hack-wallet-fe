import React, {useCallback, useEffect, useState} from 'react';
// import {View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Account from './Account/Account';
import {MyTabBar} from '../components/Tabbar';
import {ROUTES_BAR} from '../constants';
import Sessions from './Sessions/Sessions';
import Pairing from './Pairing';
import Settings from './Setting';
import {SignClientTypes, SessionTypes} from '@walletconnect/types';
import {currentETHAddress, web3wallet, _pair} from '../utils/Web3WalletClient';
import {getSdkError} from '@walletconnect/utils';
import {EIP155_SIGNING_METHODS} from '../data/EIP155';
import {handleDeepLinkRedirect} from '../utils/LinkingUtils';

const Tab = createBottomTabNavigator();

function Home({navigation}) {
  // Modal Visible State
  const [approvalModal, setApprovalModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const [signTypedDataModal, setSignTypedDataModal] = useState(false);
  const [sendTransactionModal, setSendTransactionModal] = useState(false);
  const [copyDialog, setCopyDialog] = useState(false);
  const [successPair, setSuccessPair] = useState(false);

  // Pairing State
  const [pairedProposal, setPairedProposal] =
    useState<SignClientTypes.EventArguments['session_proposal']>();

  const [requestEventData, setRequestEventData] =
    useState<SignClientTypes.EventArguments['session_request']>();
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
    setCopyDialog(false);

    // @notice iOS has an issue with modals, so we need to delay the approval modal
    setTimeout(() => {
      setApprovalModal(true);
    }, 1200);
    return pairing;
  }

  // ToDo / Consider: How best to move onSessionProposal() + onSessionRequest() + the if statement Listeners.
  // Know there is an events config we did in web-examples app
  const onSessionProposal = useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      setPairedProposal(proposal);
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <MyTabBar {...props} />}
      initialRouteName={ROUTES_BAR.ACCOUNT}>
      <Tab.Screen name={ROUTES_BAR.ACCOUNT} component={Account} />
      <Tab.Screen name={ROUTES_BAR.SESSIONS} component={Sessions} />
      <Tab.Screen name={ROUTES_BAR.WALLET} component={Account} />
      <Tab.Screen name={ROUTES_BAR.PAIRING} component={Pairing} />
      <Tab.Screen name={ROUTES_BAR.SETTINGS} component={Settings} />
    </Tab.Navigator>
  );
}

export default Home;
