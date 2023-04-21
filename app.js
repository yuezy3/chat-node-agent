import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import { ChatGPTAPI } from 'chatgpt'

async function example() {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY
  })
  const res = await api.sendMessage('Hello World!')
  console.log(res.text)
}

const app = express();
const port = 6006

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
