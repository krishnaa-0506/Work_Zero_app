import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';
import Message from './models/Message';
import Conversation from './models/Conversation';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>) => {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Handle connections
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('User connected:', socket.userId);

    // Join user's personal room for direct messages
    if (socket.userId) {
      socket.join(socket.userId);
    }

    // Handle joining a conversation
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
    });

    // Handle leaving a conversation
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(conversationId);
    });

    // Handle new messages
    socket.on('send_message', async (data: { 
      conversationId: string;
      content: string;
    }) => {
      try {
        if (!socket.userId) throw new Error('Not authenticated');

        const message = await Message.create({
          conversation: data.conversationId,
          sender: socket.userId,
          content: data.content
        });

        await message.populate('sender');

        // Update conversation's last message
        await Conversation.findByIdAndUpdate(data.conversationId, {
          lastMessage: {
            content: data.content,
            sender: socket.userId,
            timestamp: new Date()
          },
          $inc: { [`unreadCount.${socket.userId}`]: 1 }
        });

        // Emit message to all users in the conversation
        io.to(data.conversationId).emit('new_message', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle read receipts
    socket.on('mark_read', async (data: {
      conversationId: string;
      messageIds: string[];
    }) => {
      try {
        if (!socket.userId) throw new Error('Not authenticated');

        await Message.updateMany(
          { 
            _id: { $in: data.messageIds },
            conversation: data.conversationId
          },
          {
            isRead: true,
            readAt: new Date()
          }
        );

        // Reset unread count for this user in the conversation
        await Conversation.findByIdAndUpdate(data.conversationId, {
          $set: { [`unreadCount.${socket.userId}`]: 0 }
        });

        io.to(data.conversationId).emit('messages_read', {
          userId: socket.userId,
          messageIds: data.messageIds
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (conversationId: string) => {
      socket.to(conversationId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true
      });
    });

    socket.on('typing_end', (conversationId: string) => {
      socket.to(conversationId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });
};
