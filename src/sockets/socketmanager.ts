import { Server, Socket } from 'socket.io';
import { RoomsManager } from '../models/roomsManager.js';
import { UsersManager } from '../models/usersManager.js';
import { MoveDetail } from '../models/pokemon.model.js';

const roomManager = new RoomsManager();
const usersManager = new UsersManager();

const LISTENERS = {
  connection: 'connection',
  disconnect: 'disconnect',
  challengeUser: 'challenge-user',
  challengeResponse: 'challenge-response',
  chooseMove: 'choose-move',
};

const EVENTS = {
  challengeAccepted: 'challenge-accepted',
  challengeRejected: 'challenge-rejected',
  receivedChallenge: 'received-challenge',
  newTurn: 'new-turn',
};

export const setupSocketHandlers = (io: Server) => {
  io.on(LISTENERS.connection, (socket: Socket) => {
    usersManager.createUser(socket.id);

    socket.on(
      LISTENERS.challengeUser,
      ({ challengerId, rivalId }: { challengerId: string; rivalId: string }) => {
        const foundUser = usersManager.getUser(rivalId);
        if (foundUser) {
          socket.broadcast.to(foundUser.id).emit(EVENTS.receivedChallenge, {
            challengerId,
            message: 'challengeMessage',
          });
        } else {
          socket.emit('no-user-found');
        }
      }
    );

    socket.on(
      LISTENERS.challengeResponse,
      async ({ userId, accept, rivalId }: { userId: string; accept: boolean; rivalId: string }) => {
        if (accept) {
          const room = await roomManager.createRoom([userId, rivalId]);
          // Add both users to the room
          socket.join(room.id);
          io.to(rivalId).socketsJoin(room.id);
          io.to(room.id).emit(EVENTS.challengeAccepted, { ...room.toPlainObject() });
        } else {
          io.to(rivalId).emit(EVENTS.challengeRejected);
        }
      }
    );

    socket.on(
      LISTENERS.chooseMove,
      ({
        userId,
        chosenMove,
        roomId,
      }: {
        userId: string;
        chosenMove: MoveDetail;
        roomId: string;
      }) => {
        console.log({ userId, chosenMove: chosenMove.name, roomId });
        const room = roomManager.getRoom(roomId);
        if (!room) return;

        room.setChosenMoves(userId, chosenMove);
        console.log('both users selected move', room.bothUsersChoseMoves);
        if (room.bothUsersChoseMoves) {
          console.log('both users chose moves');
          io.to(room.id).emit(EVENTS.newTurn, { ...room.toPlainObject() });
        }
      }
    );

    socket.on(LISTENERS.disconnect, () => {
      usersManager.removeUser(socket.id);
      const disconnectedUser = usersManager.getUser(socket.id);
      if (disconnectedUser?.roomId) {
        roomManager.removeUserFromRoom(socket.id, disconnectedUser.roomId);
      }
    });
  });
};
