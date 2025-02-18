import { v4 as uuidv4 } from 'uuid';
import { ArenaPokemon, MoveDetail, Pokemon } from './pokemon.model.js';
import { OnlineArenaDataType, ChosenMovesType } from './arena.model.js';
import { getPokemon } from '../api/pokemon.js';
import { getTurnOrder, initiatePokemonForArena } from '../lib/arena.utils.js';
import { User } from './user.js';
import { BattleFlow, createBattleFlow } from './battleFlow.js';
import { updatePokemonHealth } from '../lib/pokemon.utils.js';

export class Room implements OnlineArenaDataType {
  public readonly id: string;
  users: string[] = [];
  isOver: boolean;
  turnOrder: User['id'][];
  isTurnOver: boolean;
  message: string;
  choseMoves: ChosenMovesType;
  pokemons: Map<User['id'], ArenaPokemon>;
  battleFlow: BattleFlow = [];
  clientsFinished: Set<string> = new Set();
  isArenaReady: boolean;

  constructor() {
    this.id = uuidv4();
    this.isOver = false;
    this.turnOrder = ['', ''];
    this.isTurnOver = true;
    this.message = '';
    this.choseMoves = {};
    this.pokemons = new Map();
    this.isArenaReady = false;
  }

  get bothUsersChoseMoves() {
    return Object.keys(this.choseMoves).length === 2;
  }

  async initialize(users: string[]) {
    this.users = users;
    await this.setPokemonsForUsers();
    this.turnOrder = getTurnOrder(this.pokemons);
    this.isArenaReady = true;
  }

  removeUser(userId: string) {
    this.users = this.users.filter((id) => id !== userId);
  }

  setIsOver() {
    this.isOver = true;
  }

  setChosenMoves(userId: string, move: MoveDetail) {
    this.choseMoves[userId] = move;
    if (this.bothUsersChoseMoves) {
      this.updatePokemonsHealth();
    }
  }

  updatePokemonsHealth() {
    this.users.forEach((userId) => {
      const pokemon = this.pokemons.get(userId);
      if (pokemon) {
        updatePokemonHealth(pokemon);
      }
    });
    this.setTurnFlow();
  }

  setTurnFlow() {
    this.battleFlow = createBattleFlow(this.turnOrder[0], this.turnOrder[1], this);
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
  }

  clientFinished(userId: string) {
    this.clientsFinished.add(userId);
    if (this.clientsFinished.size === this.users.length) {
      this.clientsFinished.clear();
      // Proceed to the next set of actions or end the turn
    }
  }

  toPlainObject() {
    return {
      ...this,
      pokemons: Object.fromEntries(this.pokemons),
      battleFlow: this.battleFlow,
    };
  }
}
