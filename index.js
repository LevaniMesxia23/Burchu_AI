require("dotenv").config()
const axios = require("axios")

async function getAiResponse(prompt) {
  const response = await axios.post(`https://api.openai.com/v1/chat/completions
`,
  {
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}]
  },
  {

    headers:{
      "Content-Type" : "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  }
)
console.log(`AI Response: ${response.data.choices[0].message.content}`);

}

getAiResponse("What the capital of Georgia?")