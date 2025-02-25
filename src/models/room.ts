import { v4 as uuidv4 } from 'uuid';
import { ArenaPokemon, MoveDetail } from './pokemon.model.js';
import { OnlineArenaDataType, ChosenMovesType } from './arena.model.js';
import { getPokemon } from '../api/pokemon.js';
import { getTurnOrder, initiatePokemonForArena } from '../lib/arena.utils.js';
import { User } from './user.js';
import { BattleFlow, createBattleFlow } from './battleFlow.js';
import { updatePokemonHealth } from '../lib/pokemon.utils.js';
import { getMoveEffectivinesInfo } from '../lib/pokemon-moves-types-relationships.js';

export class Room implements OnlineArenaDataType {
  public readonly id: string = uuidv4();
  users: User[] = [];
  isOver: boolean = false;
  turnOrder: User['id'][] = [];
  isTurnOver: boolean = true;
  message: string = '';
  choseMoves: ChosenMovesType = {};
  pokemons: Map<User['id'], ArenaPokemon> = new Map();
  battleFlow: BattleFlow = [];
  isArenaReady: boolean = false;
  private _rivalId: { [key: User['id']]: User['id'] } = {};

  constructor() {}

  get bothUsersChoseMoves() {
    return Object.keys(this.choseMoves).length === 2;
  }

  async initialize(users: User[]) {
    this.users = users;
    this.users.forEach((user) => {
      this._rivalId[user.id] = user.rivalId!;
    });
    await this.setPokemonsForUsers();
    this.turnOrder = getTurnOrder(this.pokemons);
    this.isArenaReady = true;
  }

  removeUser(userId: string) {
    this.users = this.users.filter((user) => user.id !== userId);
    delete this._rivalId[userId];
  }

  setIsOver() {
    this.isOver = true;
  }

  setChosenMoves(userId: string, move: MoveDetail) {
    this.choseMoves[userId] = move;
    const rivalPokemon = this.getRivalPokemon(userId);
    rivalPokemon.receivedAttackData = {
      ...move,
      damageInfo: getMoveEffectivinesInfo(move.type.name, rivalPokemon.processedTypes[0]),
    };
    if (this.bothUsersChoseMoves) {
      this.updatePokemonsHealth();
    }
  }

  updatePokemonsHealth() {
    this.users.forEach((user) => {
      const pokemon = this.getPokemon(user.id);
      const rivalPokemon = this.getRivalPokemon(user.id);
      updatePokemonHealth(pokemon, rivalPokemon);
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
    const pokemon: ArenaPokemon = initiatePokemonForArena(await getPokemon(), userId);
    this.pokemons.set(userId, pokemon);
  }

  private async setPokemonsForUsers() {
    await Promise.all(
      this.users.map(async ({ id }) => {
        await this.addPokemon(id);
      })
    );
  }

  toPlainObject() {
    return {
      ...this,
      pokemons: Object.fromEntries(this.pokemons),
      battleFlow: this.battleFlow,
    };
  }

  private getPokemon(userId: string): ArenaPokemon {
    const pokemon = this.pokemons.get(userId);
    if (!pokemon) {
      throw new Error(`Pokemon for user ${userId} not found`);
    }
    return pokemon;
  }

  private getRivalPokemon(userId: string): ArenaPokemon {
    const rivalId = this._rivalId[userId];
    const rivalPokemon = this.pokemons.get(rivalId);
    if (!rivalPokemon) {
      throw new Error(`Rival Pokemon for user ${userId} not found`);
    }
    return rivalPokemon;
  }
}
