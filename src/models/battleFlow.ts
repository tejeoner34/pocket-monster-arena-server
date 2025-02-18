import { Room } from './room.js';
import { User } from './user.js';

export interface BattleStep {
  action: string;
  userId: string;
  targetId?: string;
  waitTime: number; // in milliseconds
  isGameOver?: boolean;
}

export type BattleFlow = BattleStep[];

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
    { action: 'attack', userId: userId1, targetId: userId2, waitTime: 1000 },
    {
      action: 'receiveDamage',
      userId: userId2,
      waitTime: 500,
    },
    {
      action: 'updateHealthBar',
      userId: userId2,
      waitTime: 500,
      isGameOver: !user2Pokemon.isAlive,
    },
    { action: 'attack', userId: userId2, targetId: userId1, waitTime: 1000 },
    { action: 'receiveDamage', userId: userId1, waitTime: 500 },
    {
      action: 'updateHealthBar',
      userId: userId2,
      waitTime: 500,
      isGameOver: !user1Pokemon.isAlive,
    },
  ];
};
