import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.get('/', (req, res) => {
    res.send('Hello, Express + Socket.io with ESM + TypeScript!');
});
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
