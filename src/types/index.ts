type TxnData = {
  name: string;
  type: number;
  startDate: string;
  endDate: string;
};

type Transaction = {
  id: string;
  value: string;
  data: string;
};

export type {TxnData, Transaction};
