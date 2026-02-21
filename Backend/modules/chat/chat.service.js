import { ChatModel } from "./chat.model.js";

export const getchats = async (page, limit, chatId) => {
  const skip = (page - 1) * limit;
 const chats = await ChatModel.aggregate([
  { $match: { roomId: chatId } },
  {
    $project: {
      messages: {
        $slice: ["$messages", Number(skip), Number(limit)]
      }
    }
  }
]);


  return chats[0];
};
