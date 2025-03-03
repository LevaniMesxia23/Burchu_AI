import axios from "axios";
import dotenv from "dotenv"
import { apiKey } from "./constants/default.js";

dotenv.config()
async function getAIResponse(prompt) {
  const response = await axios.post(
    `https://api.openai.com/v1/chat/completions
`,
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  console.log(`AI Response: ${response.data.choices[0].message.content}`);
}

getAIResponse("What the capital of Georgia?");
