import readline from 'node:readline/promises';
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generate(userMessage) {

  const messages = [
    {
      role: "system",
      content: `You are Marved, a smart personal assistance. Be always polite and provide answers to the asked questions. 
          You have access to following tools:
          1.searchWeb({query} : {query: string}) //Search the latest information and real-time data on the internet.
          current date and time: ${new Date().toUTCString()}`,
    },
    // {
    //   role: "user",
    //   content: "what is Delhi's AQI right now?",
    // },
  ];

    messages.push({
      role: 'user',
      content: userMessage,
    })

    while (true) {//loop for tool-calling
      const completions = await groq.chat.completions.create({
        temperature: 0,
        model: "llama-3.3-70b-versatile",
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and real-time data on the internet",
              parameters: {
                // JSON Schema object
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform search on",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto", //llm decides bw tool-calling or normal response
      });

      messages.push(completions.choices[0].message);
      //pushing llm response into messages array
      const toolCalls = completions.choices[0].message.tool_calls;

      if (!toolCalls) {
        //if no more tool calls, it means llm has got final response
        return completions.choices[0].message.content;
      }
      for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if (functionName === "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));
          //console.log(toolResult);

          //pushing tool result into messages like this
          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: toolResult,
          });
        }
      }
    }
}

async function webSearch({ query }) {
  console.log("Calling web search");
  const response = await tvly.search(query); //making tavily api call

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  return finalResult;
}
