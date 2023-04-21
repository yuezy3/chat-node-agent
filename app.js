import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import { ChatGPTAPI } from 'chatgpt'

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    systemMessage: `You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response.\nCurrent date: ${new Date().toISOString()}\n\n`
})
const chatpool = {};

const app = express();
app.use(express.json());
const port = 6006;

app.get('/', (req, res) => {
    res.send('Hello World from chat-node-agent!')
})
app.post("/chat-node-agent/api/chat", async (req, res) => {
    //console.log(req.body);      // your JSON
    const chatid = req.body.chatid;
    const chatcontent = req.body.content;
    if (!chatcontent) { res.send({ status: "error", msg: "empty chat content!" }) }
    let chatres = {}
    if (chatpool.hasOwnProperty(chatid)) {
        chatres = await api.sendMessage(chatcontent, {
            parentMessageId: chatpool[chatid]
        })
    }
    else {
        chatres = await api.sendMessage(chatcontent);
        chatpool[chatid] = chatres.id;
    }
    res.send({ status: "ok", msg: chatres.text })
})
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})
