import 'dotenv/config';
import { Server } from './presentation/server.js';
const PORT = process.env.PORT || 3001;
const server = new Server({ port: Number(PORT), router: null });
server.start();
