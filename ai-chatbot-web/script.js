import { apiKey } from "./config.js";
import { apiUrl } from "../constants/default.js";

window.sendMessage = sendMessage;
document.addEventListener("DOMContentLoaded", loadMessages)

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
  saveMessage("You", userMessage)
  inputField.value = "";

  const aiResponse = await getAIResponse(userMessage);
  addMessage(`AI: ${aiResponse}`);
  saveMessage("AI", aiResponse)
  speakText(aiResponse)
}

function addMessage(message) {
  const chatbox = document.getElementById("chatbox");
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  chatbox.appendChild(messageElement);
}

function saveMessage(sender, text){
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || []
  chatHistory.push({sender, text})
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory))
}

function loadMessages(){
  const chatbox = document.getElementById("chatbox")
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || []
  chatHistory.forEach(message => {
    const messageElement = document.createElement("p")
    messageElement.textContent = `${message.sender}: ${message.text}`
    chatbox.appendChild(messageElement)
  })
}

document.getElementById("voiceButton").addEventListener("click", () => {
  let recorgnition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
  recorgnition.lang = "en-US"
  recorgnition.start()

  recorgnition.onresult = (event) => {
    const userMessage = event.results[0][0].transcript
    document.getElementById("userInput").value = userMessage
    sendMessage()
  }
})

function speakText(text){
  let speech = new SpeechSynthesisUtterance()
  speech.lang = "en-US"
  speech.text = text
  window.speechSynthesis.speak(speech)
}

document.getElementById("clearButton").addEventListener("click", () => {
  localStorage.removeItem("chatHistory")
  document.getElementById("chatbox").innerHTML = ""
})