export interface BattleStep {
  action: string;
  userId: string;
  targetId?: string;
  waitTime: number; // in milliseconds
}

export type BattleFlow = BattleStep[];

export const createBattleFlow = (userId1: string, userId2: string): BattleFlow => {
  return [
    { action: 'attack', userId: userId1, targetId: userId2, waitTime: 1000 },
    { action: 'receiveDamage', userId: userId2, waitTime: 500 },
    { action: 'updateHealthBar', userId: userId2, waitTime: 500 },
    { action: 'attack', userId: userId2, targetId: userId1, waitTime: 1000 },
    { action: 'receiveDamage', userId: userId1, waitTime: 500 },
    { action: 'updateHealthBar', userId: userId1, waitTime: 500 },
    // Add more steps as needed
  ];
};
