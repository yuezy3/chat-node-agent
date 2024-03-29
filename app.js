import dotenv from 'dotenv'
dotenv.config();
import express from "express"
import { ChatGPTAPI } from 'chatgpt'

const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    completionParams: {
        model: "gpt-4",
        temperature: 0.5,
    },
    systemMessage: `You are ChatGPT, a large language model trained by OpenAI. Try to answer in Chinese every time.\nCurrent date: ${new Date().toISOString()}\n\n`
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
    if (chatpool.hasOwnProperty(chatid) && chatpool[chatid]["timestamp"] > ((new Date()).getTime() - 15 * 60 * 1000)) { //has chatid and not in 15min ago
        chatres = await api.sendMessage(chatcontent, {
            parentMessageId: chatpool[chatid]["id"]
        })
    }
    else {
        chatres = await api.sendMessage(chatcontent);
        chatres.text = "新话题\n-----\n\n" + chatres.text;
        chatpool[chatid] = { "id": chatres.id };
    }
    chatpool[chatid]["timestamp"] = (new Date()).getTime();
    res.send({ status: "ok", msg: chatres.text })
})
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})
