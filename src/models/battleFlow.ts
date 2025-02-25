import { ArenaPokemon, DamageInfo, MoveDetail } from './pokemon.model.js';
import { Room } from './room.js';
import { User } from './user.js';

export interface BattleStep {
  action: string;
  userId: string;
  targetId?: string;
  waitTime: number; // in milliseconds
  isGameOver?: boolean;
  pokemonName: ArenaPokemon['name'];
  moveName: MoveDetail['name'];
  effectivinessInfo?: DamageInfo;
}

export type BattleFlow = BattleStep[];

const waitTime = 2000;

export const createBattleFlow = (
  userId1: User['id'],
  userId2: User['id'],
  onlineArenaData: Room
): BattleFlow => {
  const user1Pokemon = onlineArenaData.pokemons.get(userId1);
  const user2Pokemon = onlineArenaData.pokemons.get(userId2);
  if (!user1Pokemon || !user2Pokemon) {
    throw new Error('Invalid Pokemon');
  }
  return [
    {
      action: 'attack',
      userId: userId1,
      targetId: userId2,
      waitTime,
      pokemonName: user1Pokemon.name,
      moveName: onlineArenaData.choseMoves[userId1].name,
      effectivinessInfo: user2Pokemon.receivedAttackData.damageInfo,
    },
    {
      action: 'receiveDamage',
      userId: userId2,
      waitTime,
      pokemonName: user2Pokemon.name,
      moveName: onlineArenaData.choseMoves[userId1].name,
    },
    {
      action: 'updateHealthBar',
      userId: userId2,
      waitTime,
      isGameOver: !user2Pokemon.isAlive,
      pokemonName: user2Pokemon.name,
      moveName: onlineArenaData.choseMoves[userId1].name,
    },
    {
      action: 'attack',
      userId: userId2,
      targetId: userId1,
      waitTime,
      pokemonName: user2Pokemon.name,
      moveName: onlineArenaData.choseMoves[userId2].name,
      effectivinessInfo: user1Pokemon.receivedAttackData.damageInfo,
    },
    {
      action: 'receiveDamage',
      userId: userId1,
      waitTime,
      pokemonName: user1Pokemon.name,
      moveName: onlineArenaData.choseMoves[userId2].name,
    },
    {
      action: 'updateHealthBar',
      userId: userId1,
      waitTime,
      isGameOver: !user1Pokemon.isAlive,
      pokemonName: user1Pokemon.name,
      moveName: onlineArenaData.choseMoves[userId2].name,
    },
  ];
};
