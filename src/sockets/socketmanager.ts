import { Server, Socket } from 'socket.io';
import { Room } from '../models/room.js';
import { rooms, users } from '../state/state.js';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.id;
    users.set(userId, userId);

    console.log('User connected:', userId);

    // Example: Create room on request
    socket.on('create-room', (roomId: string) => {
      if (!rooms.has(roomId)) {
        const room = new Room(roomId);
        rooms.set(roomId, room);
        console.log(`Room created: ${roomId}`);
      } else {
        console.log(`Room ${roomId} already exists`);
      }
    });

    // Example: Join room
    socket.on('join-room', (roomId: string) => {
      const room = rooms.get(roomId);
      if (room) {
        room.addUser(userId);
        console.log(`${userId} joined room ${roomId}`);
      } else {
        console.log(`Room ${roomId} not found`);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', userId);
      users.delete(userId);

      // Clean up user from rooms
      rooms.forEach((room) => {
        room.removeUser(userId);
        if (room.users.length === 0) {
          rooms.delete(room.id);
        }
      });

      console.log('Current users:', Array.from(users.keys()));
    });
  });
};
