type SessionData = {
  id: string;
  startFrom: string;
  validUntil: string;
};

type Transaction = {
  id: string;
  value: string;
  data: string;
};

type PairData = {
  peerMetadata: any;
  expiry: string;
};

export type {SessionData, Transaction, PairData};
