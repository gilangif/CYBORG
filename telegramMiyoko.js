const { Snake } = require("tgsnake")
const { Telegraf } = require("telegraf")
const fs = require("fs")

let bot = [
  { name: "Opank", token: "6516245543:AAEPXLHDut-6tyRQNIj7cqxqVVdoGfet1Es" },
  { name: "Kumang", token: "6659028719:AAFW_J7nr_KDHhC4QZfAmbM1Ozirg5P3QXs" },
  { name: "Oyen", token: "6293865566:AAGZQgNcYU3HmnmYw3V-B2DkWu7z_-WmGxo" },
  { name: "Amon", token: "6330855133:AAEhvPiovs-QJ8mMyACHdam0j76J76fk-W0" },
  { name: "Nunu", token: "6483002423:AAHr0FBQJO4RIelCJcAsB-uV8w45gmyOMgM" },
]

let config = { logs: 200, botIndex: 0, bot: {}, opank: "-1001962626950", oyen: "-1001909548840" }

let logfile = "./logs/logsTelegram.json"
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
        `${formattedText}\n\n😵‍💫 ${data.groupname}\n😍 ${data.username || data.name}`,
        {
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [{ text: data?.groupname?.toUpperCase() + " | TELEGRAM", url: "https://t.me/" + data.username, callback_data: "late" }],
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

config.bot["Opank"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnKjFlPTBapObLgtIx9714W9MUcJ_lAwACyQwAAhjhUFWyyCNFFeRI4jAE")
  } catch (err) {
    console.log("\n\nCOMMAND ERROR")
  }
})

const main = () => {
  try {
    const snake = new Snake({
      apiId: 18003934,
      apiHash: "cd9eb800a7b76384977738e6d3e94301",
      sessionName: "Miyoko",
      session:
        "1BQANOTEuMTA4LjU2LjE0MQG7xNkew0IVedIOQyVY0lFqdfodyEf82LtPPWl1o4cp7M+ojvsLSkv1019Kr+3Jc8rcIeTaiQix9RrN8mhoZkNnzc7Cmcu5ffLbQngS0xo8xY4f7tMre0zikA9aC707BHCRQjIqxqoCS5loiQ/o8h8Szf36oB0/6STYML7vdwIm6zkMO7KESDsZfiVmFFjTcs8A3w7LOJFvqiZfC7TDcciTJrCblSfJOmPzFjvjjX9SSSCpnjB8n+C5kIhAs93S6dFlEqrhfzjonDCqn9FPsIbJDTa6gRUlCjoK/0hKNXy7lFg4xQ3nH74pEB0c2kHQUDeuUe+P69WVW6O4YncDi6B+RA==",
    })

    snake.on("message", async (ctx) => {
      try {
        const data = {
          id: ctx?.id,
          chat: ctx?.text,
          name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "").trim() || "Anonymous",
          username: ctx?.from?.username || "Anonymous",
          groupname: ctx?.chat?.title || "PERSONAL CHAT",
          account: "Miyoko Akari",
        }

        fs.writeFileSync("./Miyoko/cache.json")

        console.log(`\x1b[34m# ${data.account} ${data.id}\x1b[32m\n\n  from      : ${data.name}\n  username  : ${data.username}\n  groupname : ${data.groupname}\n  chat      : ${data.chat}\n\n\x1b[0m`)

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
