const { Telegraf } = require("telegraf")
const axios = require("axios")
const fs = require("fs")

let token = require("./data/token.json")
let groups = require("./data/facebook.json")
let logsFile = "./logs/logsFacebook.json"
let logs = require(logsFile)

const config = { post: 6, logs: 300, botIndex: 0, bot: {}, opank: "-1001962626950" }
const position = { group: 0, token: 0 }
const bot = [
  { name: "Timmy", token: "6107155056:AAHD_thIjVila1NoMfJKwVoXbeJEuyOyG_k" },
  { name: "Shiro", token: "6886385156:AAFXXiIVSjY4CNt40X5XcCeKIvDPWMls2hA" },
  { name: "Clara", token: "6544279962:AAER02Wpn8aM0M-Tf51QLf6tuGn5Er0Zzn4" },
]

let tokenPosition = 0
groups.forEach((x) => {
  x.tokenIndex = tokenPosition
  tokenPosition >= token.length - 1 ? (tokenPosition = 0) : tokenPosition++
})

bot.forEach(async (x) => {
  try {
    config.bot[x.name] = new Telegraf(x.token)
    await config.bot[x.name].launch()
  } catch (error) {
    console.log({ error, msg: "ERROR ON FOREACH BOT" + x.name })
  }
})

const daget = (data) =>
  data?.toLowerCase().includes("dana.id") ||
  data?.toLowerCase().includes("danaindonesia") ||
  data?.toLowerCase().includes("dana.id") ||
  data?.toLowerCase().includes("shope.ee") ||
  data?.toLowerCase().includes("sppay")

const minta = (data) => data?.toLocaleLowerCase().includes("dana.id/qr") || data?.toLocaleLowerCase().includes("dana.id/minta")

const check = async (data) => {
  try {
    const check = await logs.find((x) => x.message == data.message)

    if (!check) {
      if (logs.length > config.logs) logs = []

      console.log(data, "\n")

      config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++

      const text = `${data.message}\n\nFROM ${data.from.name}\nGROUP ${data.group}`

      // await config.bot[bot[config.botIndex].name].telegram.sendMessage(config.opank, text, {
      //   disable_web_page_preview: true,
      //   reply_markup: {
      //     inline_keyboard: [
      //       [
      //         {
      //           text: `${data.group} | FACEBOOK`,
      //           url: `https://www.facebook.com/groups/${data.id.split("_")[0]}/permalink/${data.id.split("_")[1]}/`,
      //         },
      //       ],
      //     ],
      //   },
      // })

      logs.push(data)
      fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))
    } else {
      console.log("DUPLICATE")
    }
  } catch (error) {
    console.log("📌 error: ", error)
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  }
}

const main = async () => {
  while (true) {
    try {
      const { data: posts } = await axios.get(`https://graph.facebook.com/v13.0/${groups[position.group].groupId}/feed`, {
        params: {
          access_token: token[groups[position.group].tokenIndex].token,
          limit: config.post,
          fields: "link, message, from, created_time, picture",
        },
      })

      for (x of posts.data) {
        const post = {
          id: x.id,
          from: x.from,
          message: x.message,
          group: groups[position.group].name,
        }

        console.log("POST ID :", x.id, token[position.token].name, groups[position.group].name)

        if (daget(x.message) && !minta(x.message)) check(post)
      }

      position.group >= groups.length - 1 ? (position.group = 0) : position.group++
    } catch (error) {
      console.log("\nERROR TOKEN", token[groups[position.group].tokenIndex].name, "GROUP", groups[position.group].name, "\n")
      groups[position.group].tokenIndex >= token.length - 1 ? (groups[position.group].tokenIndex = 0) : groups[position.group].tokenIndex++
      position.group >= groups.length - 1 ? (position.group = 0) : position.group++
    }
  }
}

main()
