// Socket.io server for real-time chat and notifications
// This runs as a separate process on port 3001

import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { io } from 'socket.io-client';

interface UserSocketMap {
  [userId: string]: string[]; // userId -> socketIds[]
}

const userSockets: UserSocketMap = {};
const userInfo: { [socketId: string]: { userId: string; name: string; avatar?: string } } = {};

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // NOTE: for horizontal scaling, add the Redis adapter here
  // (install @socket.io/redis-adapter + redis and attach when REDIS_URL is set)

  io.use((socket, next) => {
    // Authentication middleware
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (token) {
      // Verify JWT token here
      // For now, attach user info from token
      socket.data.user = { id: 'user-id-from-token' };
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // User joins with their userId
    socket.on('user:join', (data: { userId: string; name: string; avatar?: string }) => {
      const { userId, name, avatar } = data;
      socket.data.userId = userId;
      socket.data.name = name;
      socket.data.avatar = avatar;

      // Track user sockets
      if (!userSockets[userId]) {
        userSockets[userId] = [];
      }
      userSockets[userId].push(socket.id);
      userInfo[socket.id] = { userId, name, avatar };

      // Join user's personal room for direct messages
      socket.join(`user:${userId}`);

      // Notify others user is online
      socket.broadcast.emit('user:online', { userId, name, avatar });

      // Send current online users to the new user
      const onlineUsers = Object.keys(userSockets).map((uid) => ({
        userId: uid,
        name: userInfo[userSockets[uid][0]]?.name,
        avatar: userInfo[userSockets[uid][0]]?.avatar,
      }));
      socket.emit('users:online', onlineUsers);
    });

    // Private messaging
    socket.on('message:send', (data: { to: string; content: string; type?: 'text' | 'image' | 'file' }) => {
      const { to, content, type = 'text' } = data;
      const from = socket.data.userId;

      if (!from || !to) return;

      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from,
        to,
        content,
        type,
        timestamp: new Date().toISOString(),
        read: false,
      };

      // Send to recipient
      io.to(`user:${to}`).emit('message:receive', message);

      // Confirm to sender
      socket.emit('message:sent', message);

      // If recipient is online, mark as delivered
      if (userSockets[to]?.length) {
        io.to(`user:${to}`).emit('message:delivered', { messageId: message.id });
      }
    });

    // Message read receipt
    socket.on('message:read', (data: { messageId: string; from: string }) => {
      io.to(`user:${data.from}`).emit('message:read', { messageId: data.messageId });
    });

    // Typing indicators
    socket.on('typing:start', (data: { to: string }) => {
      const from = socket.data.userId;
      if (from) {
        io.to(`user:${data.to}`).emit('typing:start', { from, name: socket.data.name });
      }
    });

    socket.on('typing:stop', (data: { to: string }) => {
      const from = socket.data.userId;
      if (from) {
        io.to(`user:${data.to}`).emit('typing:stop', { from });
      }
    });

    // Project comments real-time
    socket.on('comment:add', (data: { projectId: string; comment: any }) => {
      io.to(`project:${data.projectId}`).emit('comment:new', data.comment);
    });

    socket.on('comment:join', (projectId: string) => {
      socket.join(`project:${projectId}`);
    });

    socket.on('comment:leave', (projectId: string) => {
      socket.leave(`project:${projectId}`);
    });

    // Notifications
    socket.on('notification:send', (data: { userId: string; notification: any }) => {
      io.to(`user:${data.userId}`).emit('notification:new', data.notification);
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      const userId = socket.data.userId;
      if (userId && userSockets[userId]) {
        userSockets[userId] = userSockets[userId].filter((id) => id !== socket.id);
        if (userSockets[userId].length === 0) {
          delete userSockets[userId];
          // Notify others user went offline
          socket.broadcast.emit('user:offline', { userId, name: socket.data.name });
        }
      }
      delete userInfo[socket.id];
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Client-side socket connection helper
export function createSocketConnection(token?: string) {
  if (typeof window === 'undefined') return null;

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}

// Type definitions for client
export interface SocketMessage {
  id: string;
  from: string;
  to: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
}

export interface SocketUser {
  userId: string;
  name: string;
  avatar?: string;
}

export interface SocketNotification {
  id: string;
  type: string;
  title: string;
  content: string;
  link?: string;
  timestamp: string;
}