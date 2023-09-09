const ROUTES = {
  HOME: 'Home',
  SIGN_IN: 'SignIn',
  SIGN_UP: 'SignUp',
  SPLASH: 'Splash',
  SEND: 'Send',
  CONFIRM: 'Confirm',
};

const ROUTES_BAR = {
  ACCOUNT: 'Account',
  SESSIONS: 'Sessions',
  WALLET: 'Wallet',
  PAIRING: 'Pairing',
  SETTINGS: 'Settings',
  DETAIL: 'Detail',
  SESSION_DETAILS: 'SessionDetails',
  PAIRING_DETAILS: 'PairingDetails',
};

const STORAGE_KEYS = {
  ADDRESS_OWNER: 'addressOwner',
  ADDRESS: 'address',
  SALT: 'salt',
  ENCRYPT_PRIKEY: 'encryptPrivateKey',
};

const SESSION_TYPES = {
  VALID: 'Valid',
  UP_COMING: 'Upcoming',
  EXPIRED: 'Expired',
};

export {ROUTES, ROUTES_BAR, STORAGE_KEYS, SESSION_TYPES};
