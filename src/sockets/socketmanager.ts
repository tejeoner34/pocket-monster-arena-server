import { Server, Socket } from 'socket.io';
import { RoomsManager } from '../models/roomsManager.js';
import { UsersManager } from '../models/usersManager.js';
import { Pokemon } from '../models/pokemon.model.js';

const roomManager = new RoomsManager();
const usersManager = new UsersManager();

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    usersManager.createUser(socket.id);

    socket.on(
      'challenge-user',
      ({ challengerId, rivalId }: { challengerId: string; rivalId: string }) => {
        const foundUser = usersManager.getUser(rivalId);
        if (foundUser) {
          socket.broadcast.to(foundUser.id).emit('receive-challenge', {
            challengerId,
            message: 'challengeMessage',
          });
        } else {
          socket.emit('no-user-found');
        }
      }
    );

    socket.on(
      'challenge-response',
      async ({
        userId,
        accept,
        challengerId,
      }: {
        userId: string;
        accept: boolean;
        challengerId: string;
      }) => {
        if (accept) {
          const room = await roomManager.createRoom([userId, challengerId]);
          // Add both users to the room
          socket.join(room.id);
          io.to(challengerId).socketsJoin(room.id);
          io.to(room.id).emit('challenge-accepted', { room: room.toPlainObject() });
        } else {
          io.to(challengerId).emit('challenge-rejected');
        }
      }
    );

    // socket.on('send-pokemon-data', ({userId, pokemonData, roomId}: {userId: string, pokemonData: Pokemon, roomId: string}) => {
    //   const room = roomManager.getRoom(roomId);
    //   if (room) {
    //     room.addPokemon(userId, pokemonData);
    //     // Need to check if the room is complete and the send the data to user
    //   }
    // });

    socket.on('disconnect', () => {
      usersManager.removeUser(socket.id);
      const disconnectedUser = usersManager.getUser(socket.id);
      if (disconnectedUser?.roomId) {
        roomManager.removeUserFromRoom(socket.id, disconnectedUser.roomId);
      }
    });
  });
};
