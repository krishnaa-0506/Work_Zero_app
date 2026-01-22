import { Request, Response } from 'express';
import Message from '../models/Message';
import Conversation from '../models/Conversation';

export const sendMessage = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { recipientId, content } = req.body;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, recipientId] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [req.userId, recipientId]
      });
      await conversation.save();
    }

    const message = new Message({
      conversation: conversation._id,
      sender: req.userId,
      recipient: recipientId,
      content
    });

    await message.save();

    // Update conversation with last message
    await Conversation.findByIdAndUpdate(conversation._id, {
      $set: {
        lastMessage: message._id,
        updatedAt: new Date()
      }
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getConversations = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const conversations = await Conversation.find({
      participants: req.userId
    })
      .populate('participants', 'name avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessages = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });

    if (!conversation) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments({ conversation: conversationId });

    res.json({
      messages: messages.reverse(), // Return in chronological order
      total,
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const markAsRead = async (req: Request & { userId?: string }, res: Response) => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        recipient: req.userId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
