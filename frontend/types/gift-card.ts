export type GiftCard = {
  image?: string;
  status: string;
  minter: string;
  token?: string;
  token_contract: string;
  token_amount: number;
  token_symbol: string;
  token_id: string;
  category_id?: BigInt;
  value?: string;
};
