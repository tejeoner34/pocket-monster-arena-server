import { MoveDetail, Pokemon } from './pokemon.model.js';
import { User } from './user.js';

export interface OnlineArenaDataType {
  id: string;
  users: string[];
  pokemons: Map<string, Pokemon>;
  isOver: boolean;
  turnOrder: User['id'][];
  isTurnOver: boolean;
  message: string;
  choseMoves: ChosenMovesType;
  isRoomComplete: boolean;
}

export type ChosenMovesType = {
  [key: string]: MoveDetail;
};
