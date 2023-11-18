const { Telegraf } = require("telegraf")
const fs = require("fs")
const axios = require("axios")

let token = require("./data/token.json")
let groups = require("./data/facebook.json")
let logsFile = "./logs/logsFacebook.json"
let logs = require(logsFile)

const config = {
  logs: 300,
  limit: 123456789,
  post: 15,
  comment: 30,
  botIndex: 0,
  bot: {},
  opank: "-1001962626950",
  oyen: "-1001909548840",
}

const bot = [
  { name: "Amon", token: "6330855133:AAEhvPiovs-QJ8mMyACHdam0j76J76fk-W0" },
  { name: "Opank", token: "6516245543:AAEPXLHDut-6tyRQNIj7cqxqVVdoGfet1Es" },
  { name: "Oyen", token: "6293865566:AAGZQgNcYU3HmnmYw3V-B2DkWu7z_-WmGxo" },
  { name: "Yuli", token: "6694843798:AAEHQChaaGX1HyK3kZUXnaLoweK6yVcm394" },
  { name: "Nunu", token: "6483002423:AAHr0FBQJO4RIelCJcAsB-uV8w45gmyOMgM" },
  { name: "Kumang", token: "6659028719:AAFW_J7nr_KDHhC4QZfAmbM1Ozirg5P3QXs" },
  { name: "Moncil", token: "6429928140:AAFmPqqikcaNNPCNG3KpuL8VAxgsB_UG_sA" },
  { name: "Gembul", token: "6429373393:AAESNtqq5Od4gr8ZBTA000zJGjaVLi-k6MI" },
]

bot.forEach(async (x) => {
  try {
    config.bot[x.name] = new Telegraf(x.token)
    await config.bot[x.name].launch()
  } catch (error) {
    console.log({ error, msg: "ERROR ON FOREACH BOT" + x.name })
  }
})

token.forEach((x) => (x.used = x.error = 0))

const msgChecker = async (group) => {
  try {
    const link = group.message.match(/https?:\/\/link\.dana\S+/g)

    if (link) {
      const danalink = link.join("\n")

      if (!logs.find((x) => x === danalink)) {
        if (logs.length > config.logs) logs = []

        group.found++
        console.log(group)

        logs.push(danalink)
        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2))

        const text = `${danalink}\n😍 PROCESS ${group.process} | ERRORS ${group.error} | ERRORS SENDING ${group.sendError} | FOUND ${group.found}\n😭 TOKEN ${group.tokenName}\n😎 ${group.type}`

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
      }
    }

    !token[group.tokenIndex].used >= config.limit ? (token[group.tokenIndex].used = 0) : token[group.tokenIndex].used++
    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
  } catch (error) {
    console.log("\x1b[31m\nERROR ON PROCESS MSG CHECKER, GROUP " + group.name + ", TOKEN " + token[group.tokenIndex].name + "\n\x1b[37m")

    config.botIndex >= bot.length - 1 ? (config.botIndex = 0) : config.botIndex++
    group.sendError >= config.limit ? (group.sendError = 0) : group.sendError++
  }
}

const facebook = async (group) => {
  try {
    const postURL = `https://graph.facebook.com/v13.0/${group.groupId}/feed?access_token=${group.token}&limit=${config.post}`
    const { data: feeds } = await axios(postURL)

    group.process >= config.limit ? (group.process = 0) : group.process++

    for (x of feeds.data) {
      group.message = x.message || "UNKNOWN MESSAGE"
      group.type = "POST"
      group.postId = x.id
      group.process >= config.limit ? (group.process = 0) : group.process++

      msgChecker(group)

      const checkPostURL = `https://graph.facebook.com/v13.0/${x.id}?fields=link&access_token=${group.token}&limit=${config.post}`
      const { data: postLinks } = await axios(checkPostURL)

      group.message += "\n" + postLinks.link || "UNKNOWN MESSAGE"
      group.type = "POST LINK"
      group.postId = x.id
      group.process >= config.limit ? (group.process = 0) : group.process++

      msgChecker(group)

      const commentURL = `https://graph.facebook.com/v13.0/${x.id}/comments?access_token=${group.token}&limit=${config.comment}`
      const { data: comments } = await axios(commentURL)

      group.process >= config.limit ? (group.process = 0) : group.process++

      for (y of comments.data) {
        group.message = y.message || "UNKNOWN MESSAGE"
        group.type = "COMMENT"
        group.process >= config.limit ? (group.process = 0) : group.process++

        msgChecker(group)
      }
    }

    facebook(group)
  } catch (error) {
    console.log("\x1b[31m\nERROR ON PROCESS FACEBOOK, GROUP " + group.name + ", TOKEN " + token[group.tokenIndex].name + "\n\x1b[37m")

    group.tokenIndex >= token.length - 1 ? (group.tokenIndex = 0) : group.tokenIndex++
    group.error >= config.limit ? (group.error = 0) : group.error++
    group.tokenName = token[group.tokenIndex].name
    group.token = token[group.tokenIndex].token

    !token[group.tokenIndex].error > config.limit ? (token[group.tokenIndex].error = 0) : token[group.tokenIndex].error++

    facebook(group)
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

    const groupsData = groups.map((x, i) => `<b>${i + 1}. ${x.name}</b>\nPROCESS ${x.process}, ERRORS ${x.error}, FOUND ${x.found}`).join("\n")

    await ctx.replyWithHTML(result)
    await ctx.replyWithHTML(groupsData + `\n\n<b>TOTAL TOKEN ${counter.on} ACTIVE, ${counter.off} ERROR, FROM ${token.length} TOKEN.</b>`)
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
  x.tokenIndex = i
  x.tokenName = token[i].name
  x.token = token[i].token
  x.found = x.process = x.error = x.sendError = 0

  facebook(x)
})
