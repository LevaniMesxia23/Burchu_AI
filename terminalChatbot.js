import axios from "axios";
import dotenv from "dotenv";
import readline from "readline-sync";

import { apiKey, apiUrl } from "./constants/default.js";
dotenv.config();

async function getAIResponse(prompt) {
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (err) {
    console.log("Error:", err.response ? err.response.data : err.message);
  }
}

console.log("AI chatbot is running... for exit type 'exit'");

while (true) {
  let userInput = readline.question("You: ");
  if (userInput.toLocaleLowerCase() == "exit") break;

  getAIResponse(userInput).then(res => console.log("AI", res));
}
