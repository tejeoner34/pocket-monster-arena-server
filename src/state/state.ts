import { Room } from '../models/room.js';

// Use Map for O(1) access
export const users = new Map<string, string>(); // userId -> userId or UserData in the future
export const rooms = new Map<string, Room>();
