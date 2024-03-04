export type IPlayer = {
  userName: string;
  gameId: string;
  socketId: string;
};

export type TokenUser = {
  id: string;
  email?: string;
  password?: string;
};

export type ICookieOption = {
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
};
