const { Snake } = require("tgsnake")
const { Telegraf } = require("telegraf")
const fs = require("fs")

let bot = [
  { name: "Gembul", token: "6429373393:AAESNtqq5Od4gr8ZBTA000zJGjaVLi-k6MI" },
  { name: "Romy", token: "6559515080:AAEcfv2LSTREpLX8cP2KCtWm3pKsNIgN5pQ" },
  { name: "Yuli", token: "6694843798:AAEHQChaaGX1HyK3kZUXnaLoweK6yVcm394" },
  { name: "Moncil", token: "6429928140:AAFmPqqikcaNNPCNG3KpuL8VAxgsB_UG_sA" },
]

let config = { logs: 200, botIndex: 0, bot: {}, opank: "-1001962626950", oyen: "-1001909548840" }

let logfile = "./logs/logsTelegram2.json"
let logs = require(logfile)

bot.forEach(async (x) => {
  config.bot[x.name] = new Telegraf(x.token)
  await config.bot[x.name].launch()
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
            inline_keyboard: [
              [{ text: data?.groupname?.toUpperCase() + " | TELEGRAM 2", url: "https://t.me/" + data.username, callback_data: "late" }],
            ],
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

config.bot["Gembul"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnKh5lPS5JYWzWyHa7bYbxYvQOYA_D_gAC1QwAAgFCSFWISaPiIVHlvDAE")
  } catch (err) {
    console.log("\n\nCOMMAND ERROR")
  }
})

const main = () => {
  try {
    const snake = new Snake({
      apiId: 18003934,
      apiHash: "cd9eb800a7b76384977738e6d3e94301",
      sessionName: "Pluviophile",
      session:
        "1BQANOTEuMTA4LjU2LjE0MQG7hGdWyiQQWENPNGiXVpgmU6btHH24NZ8mGP78Xcx+Tiv2LmJR8y09DasCsJCz0mzJ6PsylX8BkySg+3QtRVPo5J6BY1kuIvEHZfpBEJvYAXjzbcC65idwbxhtsi2GDanYFHzpYUXiRXHi44EQa3eTVZ5tahfpBJXvrsD5iwHfZoz+9OgUhaP6MQn0h050grm6hfQvEYCm2MFE8EC58duzOPO8MDx5f7MOYzLxf/YVLjDfEX7yxEapgJI3hDWnqfUL7k2dolpKK4JJNC1nTT742RvVcQI9RkmqkHOdZCnTj7gFzp/aSb4WJtz8SqgqaIwVg/ONLmeLTOSDzmSsTPBizw==",
    })

    snake.on("message", async (ctx) => {
      try {
        const data = {
          id: ctx?.id,
          chat: ctx?.text,
          name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "").trim() || "Anonymous",
          username: ctx?.from?.username || "Anonymous",
          groupname: ctx?.chat?.title || "PERSONAL CHAT",
          account: "Pluviophile",
        }

        console.log(`\x1b[34m# ${data.account} ${data.id}\x1b[33m\n\n  from      : ${data.name}\n  username  : ${data.username}\n  groupname : ${data.groupname}\n  chat      : ${data.chat}\n\n\x1b[0m`)


        if (ctx?.text && ctx?.entities) {
          if (ctx?.entities.map((x) => x.url).length > 0) {
            data.chat += "\n\nHIDE LINK: " + ctx?.entities.map((x) => x.url).join("\n")
          }
        }

        if (daget(data) && !minta(data)) sendMsg(data)
      } catch (error) {
        console.log(error)
      }
    })

    snake.run()
  } catch (error) {
    console.log(error)
  }
}

main()
