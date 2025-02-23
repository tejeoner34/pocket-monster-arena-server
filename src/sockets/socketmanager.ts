import { Server, Socket } from 'socket.io';
import { RoomsManager } from '../models/roomsManager.js';
import { UsersManager } from '../models/usersManager.js';
import { MoveDetail } from '../models/pokemon.model.js';
import { Room } from '../models/room.js';
import { User } from '../models/user.js';
import {
  LISTENERS,
  EVENTS,
  ChooseMoveArgs,
  ChallengeResponseArgs,
  GameOverArgs,
} from '../models/sockets.model.js';

const roomManager = new RoomsManager();
const usersManager = new UsersManager();

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
      async ({ userId, accept, rivalId }: ChallengeResponseArgs) => {
        if (accept) {
          const room = await roomManager.createRoom([
            usersManager.getUser(userId)!,
            usersManager.getUser(rivalId)!,
          ]);
          // Add both users to the room
          socket.join(room.id);
          io.to(rivalId).socketsJoin(room.id);
          io.to(room.id).emit(EVENTS.challengeAccepted, { ...room.toPlainObject() });
        } else {
          io.to(rivalId).emit(EVENTS.challengeRejected);
        }
      }
    );

    socket.on(LISTENERS.chooseMove, ({ userId, chosenMove, roomId }: ChooseMoveArgs) => {
      const room = roomManager.getRoom(roomId);
      if (!room) return;

      room.setChosenMoves(userId, chosenMove);
      if (room.bothUsersChoseMoves) {
        io.to(room.id).emit(EVENTS.newTurn, { ...room.toPlainObject() });
      }
    });

    socket.on(LISTENERS.gameOver, ({ userId, roomId }: GameOverArgs) => {
      const room = roomManager.getRoom(roomId);
      if (room) {
        room.isOver = true;
        io.to(room.id).emit(EVENTS.gameOver, { winner: userId });
      }
    });

    socket.on(LISTENERS.disconnect, () => {
      usersManager.removeUser(socket.id);
      const disconnectedUser = usersManager.getUser(socket.id);
      if (disconnectedUser?.roomId) {
        roomManager.removeUserFromRoom(socket.id, disconnectedUser.roomId);
      }
    });
  });
};
