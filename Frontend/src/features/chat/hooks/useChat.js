import {initializeSocketConnection} from '../service/chat.socket';
import {sendMessage, getChats, getMessages} from '../service/chat.api';
import {setChats, setCurrentChatId, setLoading, createNewChat, addNewMessage, addMessages} from '../chat.slice';
import {useDispatch} from 'react-redux';
import {useCallback} from 'react';


export const useChat = () => {
   
   const dispatch = useDispatch();

      const handleSendMessage = useCallback(async ({message, chatId}) => {
      dispatch(setLoading(true));
      const data = await sendMessage(message, chatId);
      const {chat, aiMessage} = data;
      if (!chatId) {
         dispatch(createNewChat({
            chatId: chat._id,
            title: chat.title
         }))
      }
      dispatch(addNewMessage({
         chatId: chat._id,
         content: message,
         role: 'user'
      }))
      dispatch(addNewMessage({
         chatId: chat._id,
         content: aiMessage.content,
         role: aiMessage.role
      }))
      dispatch(setCurrentChatId(chat._id));
   }, [dispatch]);

   const handleGetChats = useCallback(async () => {
      dispatch(setLoading(true));
      const data = await getChats();
      const {chats} = data;
      dispatch(setChats(chats.reduce((acc, chat) => {
         acc[chat._id] = {
            _id: chat._id,
            title: chat.title,
            messages: chat.messages || [],
            lastUpdated: chat.lastUpdated || new Date().toISOString(),
         }
         return acc;
      }, {})));
      dispatch(setLoading(false));
   }, [dispatch]);

   const handleOpenChat = useCallback(async (chatId, chats) => {
      if (!chatId) {
         return;
      }

      if (chats?.[chatId]?.messages?.length) {
         dispatch(setCurrentChatId(chatId));
         return;
      }

      const data = await getMessages(chatId);
      const {messages} = data;
      const formattedMessages = messages.map((message) => ({
         content: message.content,
         role: message.role
      }));
      dispatch(addMessages({
         chatId,
         messages: formattedMessages
      }));
      dispatch(setCurrentChatId(chatId));
   }, [dispatch]);

   const handleNewChat = useCallback(() => {
      dispatch(setCurrentChatId(null));
   }, [dispatch]);

   return {
      initializeSocketConnection,
      handleSendMessage,
      handleGetChats,
      handleOpenChat
      ,handleNewChat
   };
    
}
