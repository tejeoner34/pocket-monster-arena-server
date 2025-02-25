import { MoveDetail } from './pokemon.model.js';
import { Room } from './room.js';
import { User } from './user.js';

export const LISTENERS = {
  connection: 'connection',
  disconnect: 'disconnect',
  challengeUser: 'challenge-user',
  challengeResponse: 'challenge-response',
  chooseMove: 'choose-move',
  gameOver: 'game-over',
  leavesRoom: 'leaves-room',
};

export const EVENTS = {
  challengeAccepted: 'challenge-accepted',
  challengeRejected: 'challenge-rejected',
  receivedChallenge: 'received-challenge',
  newTurn: 'new-turn',
  gameOver: 'game-over',
  userDisconnected: 'user-disconnected',
  leavesRoom: 'leaves-room',
};

export type ChallengeResponseArgs = {
  accept: boolean;
  userId: User['id'];
  rivalId: User['id'];
};

export type ChooseMoveArgs = {
  userId: string;
  chosenMove: MoveDetail;
  roomId: Room['id'];
};

export type GameOverArgs = { userId: User['id']; roomId: Room['id'] };

export type UserLeavesRoomArgs = GameOverArgs;
