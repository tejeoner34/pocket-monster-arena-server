import { v4 as uuidv4 } from 'uuid';
import { ArenaPokemon, MoveDetail, Pokemon } from './pokemon.model.js';
import { OnlineArenaDataType, ChosenMovesType } from './arena.model.js';
import { getPokemon } from '../api/pokemon.js';
import { getTurnOrder, initiatePokemonForArena } from '../lib/arena.utils.js';
import { User } from './user.js';

export class Room implements OnlineArenaDataType {
  public readonly id: string;
  users: string[] = [];
  isOver: boolean;
  turnOrder: User['id'][];
  isTurnOver: boolean;
  message: string;
  choseMoves: ChosenMovesType;
  pokemons: Map<User['id'], Pokemon>;

  constructor() {
    this.id = uuidv4();
    this.isOver = false;
    this.turnOrder = ['', ''];
    this.isTurnOver = false;
    this.message = '';
    this.choseMoves = {};
    this.pokemons = new Map();
  }

  async initialize(users: string[]) {
    this.users = users;
    await this.setPokemonsForUsers();
  }

  removeUser(userId: string) {
    this.users = this.users.filter((id) => id !== userId);
  }

  setIsOver() {
    this.isOver = true;
  }

  get isRoomComplete() {
    return this.users.length === 2 && this.pokemons.size === 2;
  }

  setChosenMoves(userId: string, move: MoveDetail) {
    this.choseMoves[userId] = move;
  }

  setMessage(message: string) {
    this.message = message;
  }

  setIsTurnOver(isTurnOver: boolean) {
    this.isTurnOver = isTurnOver;
  }

  private async addPokemon(userId: string) {
    const pokemon: ArenaPokemon = initiatePokemonForArena(await getPokemon());
    this.pokemons.set(userId, pokemon);
  }

  private async setPokemonsForUsers() {
    await Promise.all(
      this.users.map(async (userId) => {
        await this.addPokemon(userId);
      })
    );
    this.turnOrder = getTurnOrder(this.pokemons);
  }

  toPlainObject() {
    return {
      ...this,
      pokemons: Object.fromEntries(this.pokemons),
    };
  }
}
