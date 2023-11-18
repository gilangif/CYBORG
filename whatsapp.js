const express = require("express")
const app = express()
const port = 3000

const { Telegraf } = require("telegraf")
const whatsapp = require("wa-multi-session")
const fs = require("fs")

let groups = require("./data/whatsapp.json")
let logsFile = "./logs/logsWhatsapp.json"
let logs = require(logsFile)

let history = []
let config = { logs: 50, bot: {}, botIndex: 0, history: [], oyen: "-1001909548840", opank: "-1001962626950" }

let bot = [
  { name: "Fang Fang", token: "6892133845:AAFLimtSlQ5iLnesvBk4qP_-YE5nwk_hH3Y" },
  { name: "Tn. In In", token: "6031592748:AAGscrN5FeJ8M1c6e-kCi-8emmjINF6jKXM" },
  { name: "Meyhang", token: "6565780808:AAFlxbwz3nMC3DY9nneVLZKT4nREPJQShJw" },
  { name: "Jenny", token: "6485261723:AAEmfkGPtZFtUBoPiWxc-TvM_SkHCgwNzxM" },
  { name: "Choco", token: "6443955175:AAGvudm3uzVnxzHAEdEHfCAQRiVOxthLz1A" },
  { name: "Yoko", token: "6691155059:AAFWi4m1K__yU2NPIif7P7Nub6JrA3UL2wI" },
]

const daget = (data) =>
  data?.chat?.toLowerCase().includes("dana.id") ||
  data?.chat?.toLowerCase().includes("danaindonesia") ||
  data?.chat?.toLowerCase().includes("dana.id") ||
  data?.chat?.toLowerCase().includes("shope.ee") ||
  data?.chat?.toLowerCase().includes("sppay")

const minta = (data) => data?.chat?.toLocaleLowerCase().includes("dana.id/qr") || data?.chat?.toLocaleLowerCase().includes("dana.id/minta")

const oyen = async (data, text) => {
  try {
    await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.oyen, text, {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: data?.group?.toUpperCase(), callback_data: "late" }]],
      },
    })

    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    console.log({ error, msg: "ERROR ON FUNCTION TELEGRAM" })
  }
}

const opank = async (data, text) => {
  try {
    await config.bot[bot[config.botIndex].name].telegram.sendChatAction(config.opank, "typing")
    await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.opank, text, {
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: data?.group?.toUpperCase(), callback_data: "late" }]],
      },
    })
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    console.log({ error, msg: "ERROR ON FUNCTION TELEGRAM" })
  }
}

const msgChecker = async (data) => {
  try {
    let text = `${data.chat}\n\n😻 ${data.groupname.toUpperCase().trim()}\n😹 ${data.name}`

    if (logs.length > config.logs) logs = []
    if (logs.find((x) => x.chat === data.chat)) return { msg: "DUPLICATE" }

    data.botSender = bot[config.botIndex].name

    await config.bot[bot[config.botIndex].name].telegram.sendChatAction(config.opank, "typing")

    if (config.group[data.from]) {
      opank(data, text)
    } else {
      oyen(data, text)
      text = `Chummm ada pesan di list blacklist, buruan cek !!!!\n\n${data.name}\n${data.groupname.toUpperCase().trim()}\n😹😻🐱🙀😺`
      opank(data, text)
    }

    logs.unshift(data)
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
    console.log(data)
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION SENDMSG" })
  }
}

const whatsappBOT = async () => {
  try {
    bot.forEach(async (x) => {
      config.bot[x.name] = new Telegraf(x.token)
      await config.bot[x.name].launch()
    })

    groups.forEach((x) => {
      if (!config.allGroup) config.allGroup = {}
      if (!config.group) config.group = {}
      if (!x.blacklist) config.group[x.from] = x.name

      config.allGroup[x.from] = x.name
    })

    const session = await whatsapp.startSession("whatsappSession")

    whatsapp.onConnected(async (sessionId) => console.log("# Connected"))

    whatsapp.onMessageReceived(async (msg) => {
      const data = {
        isMe: msg?.key?.fromMe || false,
        name: msg?.pushName?.toUpperCase().trim(),
        from: msg?.key?.remoteJid,
        participant: msg?.key?.participant,
        chat: msg?.message?.extendedTextMessage?.text || msg?.message?.conversation,
        sessionId: msg.sessionId,
        groupname: config?.allGroup[msg?.key?.remoteJid]?.toUpperCase().trim() || "UNKNOWN GROUP, PERSONAL OR STORY",
        group: config?.group[msg?.key?.remoteJid] || "BLACKLIST",
      }

      console.log(data)

      if (history.length >= 200) history = []
      if (daget(data) && !minta(data) && !data.isMe) msgChecker(data)

      history.unshift(data)
    })
  } catch (error) {
    console.log({ error, msg: "# ERROR ON MAIN PROCESS" })
  }
}

whatsappBOT()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
  const data = history.map(
    (x) =>
      `<ul><li>isMe: ${x.isMe}</li><li>Name: ${x.name}</li><li>From: ${x.from}</li><li>Participan: ${x.participant}</li><li>Chat: ${x.chat}</li><li>Group Name: ${x.groupname}</li><li>Group: ${x.group}</li><li>BOT: ${x.botSender}</li></ul>`
  )
  res.status(200).send("TOTAL: " + history.length + data.join("<br><br>"))
})

app.get("/logs", (req, res) => {
  const data = logs.map(
    (x) =>
      `<ul><li>isMe: ${x.isMe}</li><li>Name: ${x.name}</li><li>From: ${x.from}</li><li>Participan: ${x.participant}</li><li>Chat: ${x.chat}</li><li>Group Name: ${x.groupname}</li><li>Group: ${x.group}</li></ul>`
  )
  res.status(200).send(data.join("<br><br>"))
})

config.bot["Choco"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnKi9lPS_87TR55BBNQsGTEJbYEpPPYwACsgkAAlBbSFXIxqEm1BxeoTAE")
  } catch (err) {
    console.log("\n\nCOMMAND ERROR")
  }
})

app.listen(port, () => console.log("# Server listened on port", port))
