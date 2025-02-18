import { ArenaPokemon, MoveDetail } from './pokemon.model.js';
import { User } from './user.js';

export interface OnlineArenaDataType {
  id: string;
  users: string[];
  pokemons: Map<string, ArenaPokemon>;
  isOver: boolean;
  turnOrder: User['id'][];
  isTurnOver: boolean;
  message: string;
  choseMoves: ChosenMovesType;
  isArenaReady: boolean;
}

export type ChosenMovesType = {
  [key: string]: MoveDetail;
};
