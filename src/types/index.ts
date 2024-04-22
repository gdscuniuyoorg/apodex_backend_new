import { IUser } from '../models/userModel';
import { IChallangeTeam } from '../models/challengeTeamModel';
import { Request } from 'express';

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

export interface CustomRequest extends Request {
  user?: IUser;
  team?: IChallangeTeam;
}
