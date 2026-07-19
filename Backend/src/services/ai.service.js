import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";
import {tool,createAgent} from "langchain";
import * as z from "zod";
import {searchInternet} from "./internet.service.js";
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

const searchInternetTool = tool({
  name: "searchInternet",
  description: "Search the internet for relevant information.",
  func: async (input) => searchInternet(input),
  inputSchema: z.object({
    input: z.string().min(1, "Query cannot be empty").optional(),
    query: z.string().min(1, "Query cannot be empty").optional(),
  }).refine((value) => Boolean(value.input || value.query), {
    message: "Query cannot be empty",
  }),
});

const agent = createAgent({
  model: groqModel,
  tools: [searchInternetTool],

});

function shouldUseWebSearch(message) {
  const text = message.toLowerCase();
  return [
    "latest",
    "recent",
    "current",
    "today",
    "now",
    "news",
    "update",
    "breaking",
    "live",
    "price",
    "weather",
    "who won",
    "score",
    "compare",
    "search",
  ].some((keyword) => text.includes(keyword));
}

export async function generateResponse(messages) {
  if (!messages || messages.length === 0) {
    throw new Error("Messages array is empty");
  }

  const latestUserMessage = [...messages].reverse().find((msg) => msg.role === "user");
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
    if (latestUserMessage && shouldUseWebSearch(latestUserMessage.content)) {
      const webResults = await searchInternet({ input: latestUserMessage.content });

      const response = await groqModel.invoke([
        new SystemMessage(
          "Use the provided web search results to answer the user. Prefer the web results for current facts, and say if the results are insufficient or conflicting."
        ),
        new SystemMessage(`Web search results:\n${webResults}`),
        ...chatMessages,
      ]);

      return response.content;
    }

    // Primary AI (Groq)
    const response = await agent.invoke({
      messages: messages.map(msg => {
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
      }).filter(Boolean)
    });
    return response.messages[response.messages.length - 1].content;
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