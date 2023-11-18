const { Snake } = require("tgsnake")
const { Telegraf } = require("telegraf")
const fs = require("fs")

let bot = [
  { name: "Timmy", token: "6107155056:AAHD_thIjVila1NoMfJKwVoXbeJEuyOyG_k" },
  { name: "Shiro", token: "6886385156:AAFXXiIVSjY4CNt40X5XcCeKIvDPWMls2hA" },
  { name: "Clara", token: "6544279962:AAER02Wpn8aM0M-Tf51QLf6tuGn5Er0Zzn4" },
]

let config = { logs: 100, botIndex: 0, bot: {}, opank: "-1001962626950", oyen: "-1001909548840" }
let logfile = "./logs/logsTelegram.json"
let logs = require(logfile)

bot.forEach(async (x) => {
  config.bot[x.name] = new Telegraf(x.token)
  await config.bot[x.name].launch()
})

const snake = new Snake({
  apiId: 18003934,
  apiHash: "cd9eb800a7b76384977738e6d3e94301",
  session:
    "1BQANOTEuMTA4LjU2LjEyNAG7GEtbSPyyiexq1wA0v0e2hmoxTDQ/Aqe4xURhEfH6vCT24/ov9uu6giR/bF/CTHk0ni3w7/FcUIoTLzxp6jS+Y9JyCf+D4i8v7REJkbGScehCZInpcLIEdjzJ81aqAQYqD75y2LnDqZEQivGGOdZCfD01IugxzM+CsepT4umsAmo0fOTIGA44UHFyXiAVZFDMjrvbStrT7OndED4VntALq8IaqyQU+zP34hKz2CCzThFlR/uj0WA3LwHS86doLH5RhezU0oamHfVu5D+G87MTht19YdOkxi+UeEBmpKr238943GI48W9vb3429TLhuCOHaM9tCodvL8g98dH/Zq4gyg==",
})

const daget = (data) =>
  data?.chat?.toLowerCase().includes("dana.id") ||
  data?.chat?.toLowerCase().includes("danaindonesia") ||
  data?.chat?.toLowerCase().includes("dana.id") ||
  data?.chat?.toLowerCase().includes("shope.ee") ||
  data?.chat?.toLowerCase().includes("sppay")

const minta = (data) => data?.chat?.toLocaleLowerCase().includes("dana.id/qr") || data?.chat?.toLocaleLowerCase().includes("dana.id/minta")

const sendMsg = async (data) => {
  try {
    if (logs.length > config.logs) logs = []

    if (!logs.find((x) => x.chat === data.chat) && data.groupname !== "OYENNN" && data.groupname !== "O P A N K") {
      const formattedText = data?.chat?.replace(/(https?:\/\/)?(link\.dana\.id\/[^\s]+)/gi, " https://$2")

      await config.bot[bot[config.botIndex].name].telegram.sendChatAction(config.opank, "typing")
      await config.bot[bot[config.botIndex].name].telegram.sendMessage(
        config.opank,
        `${formattedText}\n\n${data.groupname}\n${data.username || data.name}`,
        {
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [[{ text: data?.groupname?.toUpperCase() + " | TELEGRAM", url: "https://t.me/" + data.username }]],
          },
        }
      )

      logs.push(data)
      fs.writeFileSync(logfile, JSON.stringify(logs, null, 2))
    }

    console.log(data)
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    console.log({ error, msg: "ERROR ON FUNCTION SENDMSG" })
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  }
}

config.bot["Timmy"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnKjFlPTBapObLgtIx9714W9MUcJ_lAwACyQwAAhjhUFWyyCNFFeRI4jAE")
  } catch (err) {
    console.log("\n\nCOMMAND ERROR")
  }
})

snake.on("message", async (ctx) => {
  const data = {
    id: ctx?.id,
    chat: ctx?.text,
    name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "").trim() || "Anonymous",
    username: ctx?.from?.username,
    groupname: ctx?.chat?.title || "PERSONAL CHAT",
    account: "AMELIA CITRA",
  }

  console.log(data, "\n")

  if (ctx?.text && ctx?.entities) {
    if (ctx?.entities.map((x) => x.url).length > 0) {
      data.chat += "\n\nHIDE LINK: " + ctx?.entities.map((x) => x.url).join("\n")
    }
  }

  if (daget(data) && !minta(data)) sendMsg(data)
})

snake.run()
