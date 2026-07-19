import { tavily } from "@tavily/core";

const tavilyClient = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export const searchInternet = async ({ input, query } = {}) => {
  const finalQuery = (input || query || "").trim();
  if (!finalQuery) {
    throw new Error("Query cannot be empty");
  }
  const results = await tavilyClient.search(finalQuery,{
        maxResults: 5,
        searchDepth: "advanced",
    });
    return JSON.stringify(results);
}