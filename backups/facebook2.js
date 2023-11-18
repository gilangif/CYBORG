const { Telegraf } = require("telegraf")
const axios = require("axios")
const fs = require("fs")

let token = require("../data/token.json")
let groups = require("../data/facebook.json")
let logsFile = "./logs/logsFacebook.json"
let logs = require(logsFile)

const config = { post: 15, comment: 20, logs: 300, limit: 100, botIndex: 0, bot: {}, opank: "-1001962626950", oyen: "-1001909548840" }
const bot = [
  { name: "Opank", token: "6516245543:AAEPXLHDut-6tyRQNIj7cqxqVVdoGfet1Es" },
  { name: "Oyen", token: "6293865566:AAGZQgNcYU3HmnmYw3V-B2DkWu7z_-WmGxo" },
  { name: "Yuli", token: "6694843798:AAEHQChaaGX1HyK3kZUXnaLoweK6yVcm394" },
  { name: "Nunu", token: "6483002423:AAHr0FBQJO4RIelCJcAsB-uV8w45gmyOMgM" },
  { name: "Kumang", token: "6659028719:AAFW_J7nr_KDHhC4QZfAmbM1Ozirg5P3QXs" },
  { name: "Moncil", token: "6429928140:AAFmPqqikcaNNPCNG3KpuL8VAxgsB_UG_sA" },
  { name: "Gembul", token: "6429373393:AAESNtqq5Od4gr8ZBTA000zJGjaVLi-k6MI" },
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

        console.log(data)

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

      const { data: comments } = await axios.get(`https://graph.facebook.com/v13.0/${x.id.split("_")[1]}/comments`, {
        params: {
          access_token: group.token,
          limit: config.comment,
          fields: "message, from, attachment",
        },
      })

      for (y of comments.data) {
        const commentData = new Data(y.id, y.from.name, y.from.id, y.message.trim(), group.name, "COMMENT")

        check(group, commentData)
      }
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

config.bot["Oyen"].command("info", async (ctx) => {
  try {
    await config.bot["Oyen"].telegram.sendChatAction(config.opank, "typing")

    const counter = { on: 0, off: 0 }
    const check = token.map(async (x) => {
      try {
        const { data } = await axios("https://graph.facebook.com/v12.0/me?access_token=" + x.token)
        counter.on++
        return { ...data, active: true, token: x.token, used: x.used, error: x.error }
      } catch (error) {
        counter.off++
        return { name: x.name, active: false, token: x.token, used: x.used, error: x.error }
      }
    })

    const data = await Promise.all(check)
    const result = data
      .map(
        (x, i) =>
          `<b>${i + 1}</b>. ${x.name} | ${x.used}x used | ${x.error}x error | <b>${
            x.active
          }</b>  <a href="https://graph.facebook.com/v12.0/me?access_token=${x.token}"><b>CHECK HERE</b></a>`
      )
      .join("\n")

    const groupsData = groups.map((x, i) => `<b>${i + 1}. ${x.name}</b>\nPROCESS ${x.process}, ERRORS ${x.error}, FOUND ${x.found}`).join("\n\n")

    await ctx.replyWithHTML(result + `\n\n\n<b>TOTAL TOKEN ${counter.on} ACTIVE, ${counter.off} ERROR, FROM ${token.length} TOKEN.</b>`)
    await ctx.replyWithHTML(groupsData)
  } catch (err) {
    console.log("\nCOMMAND ERROR")
  }
})

config.bot["Oyen"].command("test", async (ctx) => {
  try {
    await ctx.replyWithSticker("CAACAgUAAxkBAAEnKh5lPS5JYWzWyHa7bYbxYvQOYA_D_gAC1QwAAgFCSFWISaPiIVHlvDAE")
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

const test = {}

logs.forEach((x) => {
  if (!test[x.id]) test[x.id] = 0
  test[x.id]++
})

console.log(test)
