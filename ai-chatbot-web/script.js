import { apiKey } from "./config.js";
import { apiUrl } from "../constants/default.js";

async function getAIResponse(userMessage) {
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error from API:", errorData);
    return "Error: " + (errorData.error?.message || "Something went wrong");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response";
}

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const userMessage = inputField.value;
  if (!userMessage) return;

  addMessage(`You: ${userMessage}`);
  inputField.value = "";

  const aiResponse = await getAIResponse(userMessage);
  addMessage(`AI: ${aiResponse}`);
}

function addMessage(message) {
  const chatbox = document.getElementById("chatbox");
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  chatbox.appendChild(messageElement);
}

window.sendMessage = sendMessage;
