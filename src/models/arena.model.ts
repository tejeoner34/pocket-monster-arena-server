import { ArenaPokemon, MoveDetail } from './pokemon.model.js';
import { User } from './user.js';

export interface OnlineArenaDataType {
  id: string;
  users: User[];
  pokemons: Map<User['id'], ArenaPokemon>;
  isOver: boolean;
  turnOrder: User['id'][];
  isTurnOver: boolean;
  message: string;
  chosenMoves: ChosenMovesType;
  isArenaReady: boolean;
}

export type ChosenMovesType = {
  [key: string]: MoveDetail;
};
