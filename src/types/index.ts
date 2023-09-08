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

export type {SessionData, Transaction};
