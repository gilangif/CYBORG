const { Telegraf } = require("telegraf")
const axios = require("axios")
const fs = require("fs")

let token = require("./data/token.json")
let groups = require("./data/facebook.json")
let logsFile = "./logs/logsFacebook.json"
let logs = require(logsFile)

const config = { post: 30, comment: 20, logs: 300, limit: 100, botIndex: 0, bot: {}, opank: "-1001962626950", oyen: "-1001909548840" }
const bot = [
  { name: "Timmy", token: "6107155056:AAHD_thIjVila1NoMfJKwVoXbeJEuyOyG_k" },
  { name: "Shiro", token: "6886385156:AAFXXiIVSjY4CNt40X5XcCeKIvDPWMls2hA" },
  { name: "Clara", token: "6544279962:AAER02Wpn8aM0M-Tf51QLf6tuGn5Er0Zzn4" },
]

token.forEach((x) => (x.used = x.error = 0))

bot.forEach(async (x) => {
  try {
    config.bot[x.name] = new Telegraf(x.token)
    await config.bot[x.name].launch()
  } catch (error) {
    console.log({ error, msg: "ERROR ON FOREACH BOT" + x.name })
  }
})

class Data {
  constructor(id, from, userId, message, group, type) {
    this.id = id
    this.from = from
    this.userId = userId
    this.message = message
    this.group = group
    this.type = type
  }
}

const daget = (data) =>
  data?.toLowerCase().includes("dana.id") ||
  data?.toLowerCase().includes("danaindonesia") ||
  data?.toLowerCase().includes("dana.id") ||
  data?.toLowerCase().includes("shope.ee") ||
  data?.toLowerCase().includes("sppay")

const minta = (data) => data?.toLocaleLowerCase().includes("dana.id/qr") || data?.toLocaleLowerCase().includes("dana.id/minta")

const check = async (group, data) => {
  try {
    group.process > config.limit ? (group.process = 0) : group.process++
    token[group.tokenIndex].used > config.limit ? (token[group.tokenIndex].used = 0) : token[group.tokenIndex].used++

    const check = await logs.find((x) => x.message == data.message)

    if (!check) {
      if (daget(data.message) && !minta(data.message)) {
        if (logs.length > config.logs) logs = []

        group.found >= config.limit ? (group.found = 0) : group.found++
        config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++

        const text = `${data.message}\n\n😍 PROCESS ${group.process} | ERRORS ${group.error} | FOUND ${group.found}\n😵‍💫 ${data.type} FROM ${data.from}\n😭 TOKEN ${group.tokenName}`

        await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.opank, text, {
          disable_web_page_preview: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `${group.name} | FACEBOOK`,
                  url: `https://www.facebook.com/groups/${group.postId.split("_")[0]}/permalink/${group.postId.split("_")[1]}/`,
                },
              ],
            ],
          },
        })

        console.log(data, "\n")

        logs.push(data)
        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
      }
    }
  } catch (error) {
    console.log("📌 error: ", error)
    console.log("\x1b[31m\nERROR ON CHECK PROCESS, GROUP " + group.name + ", TOKEN " + token[group.tokenIndex].name + "\n\x1b[37m")
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  }
}

const main = async (group) => {
  try {
    const { data: posts } = await axios.get(`https://graph.facebook.com/v13.0/${group.groupId}/feed`, {
      params: {
        access_token: group.token,
        limit: config.post,
        fields: "link, message, from, created_time, picture",
      },
    })

    for (x of posts.data) {
      const postData = new Data(x.id, x.from.name, x.from.id, ((x?.message || "") + "\n" + (x?.link || "")).trim(), group.name, "POST")

      group.postId = x.id

      check(group, postData)
    }

    main(group)
  } catch (error) {
    console.log("📌 err: ", error)

    console.log(`ERROR MAIN PROCESS, GROUP ${group.name}, TOKEN ${group.tokenName}`)

    group.error >= config.limit ? (group.error = 0) : group.error++
    group.tokenIndex >= token.length - 1 ? (group.tokenIndex = 0) : group.tokenIndex++
    group.token = token[group.tokenIndex].token
    group.tokenName = token[group.tokenIndex].name

    token[group.tokenIndex].error > config.limit ? (token[group.tokenIndex].error = 0) : token[group.tokenIndex].error++

    main(group)
  }
}

config.bot["Timmy"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnt_tlWMIqY1-39lUZdJlJyu5AjG6EyAACcA0AAklzIFa6hSAcL4-IHDME")
  } catch (err) {
    console.log("\nCOMMAND ERROR")
  }
})

groups.forEach((x, i) => {
  x.token = token[i].token
  x.tokenName = token[i].name
  x.tokenIndex = i
  x.process = x.error = x.found = 0

  main(x)
})
