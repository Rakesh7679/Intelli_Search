import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";

const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

const mistralModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});

export async function generateResponse(messages) {
  if (!messages || messages.length === 0) {
    throw new Error("Messages array is empty");
  }

  const chatMessages = messages
    .map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      }

      if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }

      if (msg.role === "system") {
        return new SystemMessage(msg.content);
      }

      return null;
    })
    .filter(Boolean);

  try {
    // Primary AI (Groq)
    const response = await groqModel.invoke(chatMessages);
    return response.content;
  } catch (groqError) {
    console.error("Groq Error:", groqError.message);
    console.log("Switching to Mistral...");

    try {
      // Fallback AI (Mistral)
      const response = await mistralModel.invoke(chatMessages);
      return response.content;
    } catch (mistralError) {
      console.error("Mistral Error:", mistralError.message);
      throw new Error("All AI providers are currently unavailable.");
    }
  }
}

export async function generateChatTitle(message) {
  try {
    const response = await mistralModel.invoke([
      new SystemMessage(
        "You are a helpful assistant that generates concise chat titles. Return only the title in less than 10 words."
      ),
      new HumanMessage(message),
    ]);

    return response.content;
  } catch (error) {
    console.error("Title Generation Error:", error.message);
    return "New Chat";
  }
}