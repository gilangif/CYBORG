const { Telegraf } = require("telegraf")
const whatsapp = require("wa-multi-session")
const fs = require("fs")

let groups = require("./data/whatsappKufo.json")
let logsFile = "./logs/logsWhatsapp2.json"
let logs = require(logsFile)

let config = { logs: 50, bot: {}, botIndex: 0, AmonGroup: "-4084683464" }

let bot = [
  { name: "BpWang", token: "6788357813:AAEh7XAhteD_C_mAjDJE6F-819UN2AjviOY" },
  { name: "Oded", token: "6859777848:AAElFqbQkQP-28nQYWciMJ9cvd2HsjnDDMI" },
]

const daget = (data) =>
  data?.chat?.toLowerCase().includes("dana.id") ||
  data?.chat?.toLowerCase().includes("danaindonesia") ||
  data?.chat?.toLowerCase().includes("dana.id") ||
  data?.chat?.toLowerCase().includes("shope.ee") ||
  data?.chat?.toLowerCase().includes("sppay")

const minta = (data) => data?.chat?.toLocaleLowerCase().includes("dana.id/qr") || data?.chat?.toLocaleLowerCase().includes("dana.id/minta")

const BpWang = async (data, text) => {
  try {
    await config.bot[bot[config.botIndex].name].telegram.sendChatAction(config.AmonGroup, "typing")
    await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.AmonGroup, text, {
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

    BpWang(data, text)

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

    whatsapp.setCredentialsDir("wa_fitria")
    whatsapp.startSession("whatsappSession")

    whatsapp.onConnected(async (sessionId) => console.log("# Connected"))

    whatsapp.onMessageReceived(async (msg) => {
      const data = {
        isMe: msg?.key?.fromMe || false,
        name: msg?.pushName?.toUpperCase().trim() || "Anonymous",
        from: msg?.key?.remoteJid,
        participant: msg?.key?.participant,
        chat: msg?.message?.extendedTextMessage?.text || msg?.message?.conversation,
        sessionId: msg.sessionId,
        groupname: config?.allGroup[msg?.key?.remoteJid]?.toUpperCase().trim() || "UNKNOWN GROUP, PERSONAL OR STORY",
        group: config?.group[msg?.key?.remoteJid] || "BLACKLIST",
        account: "Fitria Marina",
      }

      console.log(data)

      if (daget(data) && !minta(data) && !data.isMe) msgChecker(data)
    })
  } catch (error) {
    console.log({ error, msg: "# ERROR ON MAIN PROCESS" })
  }
}

whatsappBOT()

config.bot["BpWang"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnKi9lPS_87TR55BBNQsGTEJbYEpPPYwACsgkAAlBbSFXIxqEm1BxeoTAE")
  } catch (err) {
    console.log("\n\nCOMMAND ERROR")
  }
})
