import { v4 as uuidv4 } from 'uuid';
import { MoveDetail, Pokemon } from './pokemon.model.js';
import { OnlineArenaDataType, ChosenMovesType } from './arena.model.js';
import { getPokemon } from '../api/pokemon.js';

export class Room implements OnlineArenaDataType {
  public readonly id: string;
  users: string[] = [];
  isOver: boolean;
  turnOrder: [string, string];
  isTurnOver: boolean;
  message: string;
  choseMoves: ChosenMovesType;
  pokemons: Map<string, Pokemon>;

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
    const pokemon = await getPokemon();
    this.pokemons.set(userId, pokemon);
  }

  private async setPokemonsForUsers() {
    await Promise.all(
      this.users.map(async (userId) => {
        await this.addPokemon(userId);
      })
    );
  }

  toPlainObject() {
    return {
      ...this,
      pokemons: Object.fromEntries(this.pokemons),
    };
  }
}
