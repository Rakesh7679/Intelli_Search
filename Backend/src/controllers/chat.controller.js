import {
  generateResponse,
  generateChatTitle,
} from "../services/ai.service.js";

import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chat: chatId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let chat;
    let title = null;

    // New Chat
    if (!chatId) {
      title = await generateChatTitle(message);

      chat = await chatModel.create({
        user: req.user.id,
        title,
      });
    } else {
      // Existing Chat
      chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }

      title = chat.title;
    }

    // Save User Message
    const userMessage = await messageModel.create({
      chat: chat._id,
      content: message,
      role: "user",
    });

    // Fetch all messages
    const messages = await messageModel
      .find({ chat: chat._id || chatId })
      .sort({ createdAt: 1 });

    // AI Response
    const result = await generateResponse(messages);

    // Save AI Message
    const aiMessage = await messageModel.create({
      chat: chat._id,
      content: result,
      role: "ai",
    });

    return res.status(201).json({
      success: true,
      title,
      chat,
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getChats(req, res) {
    const user = req.user
    const chats = await chatModel.find({ user: user.id });
    return res.status(200).json({
        message: "Chats fetched successfully",
        chats,
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({
        _id:chatId,
        user: req.user.id
        
    })
    if(!chat){
        return res.status(404).json({
            message: "Chat not found",
        });
    }
    const message = await messageModel.find({
        chat: chatId,
    })
    res.status(200).json({
        message: "Messages fetched successfully",
        messages: message,
    });
}

export async function deleteChat(req, res) {
   const { chatId} = req.params;
   const chat = await chatModel.findOneAndDelete({
      id: chatId,
      user: req.user.id
   })
   await messageModel.deleteMany({
      chat: chatId,
   })
   if(!chat){
      return res.status(404).json({
         message: "Chat not found",
      });
   }
    res.status(200).json({
      message: "Chat deleted successfully",
      
    })
}