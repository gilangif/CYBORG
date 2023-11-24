const { Snake } = require("tgsnake")
const { exec } = require("child_process")

const fs = require("fs")
const axios = require("axios")
const express = require("express")

const port = 3000
const app = express()

let log = { batchNumber: {}, fundOrderId: {}, link: {} }
let process = { count: 0, status: false, delay: null, checker: null, mode: "START MODE", message: null, reply: null, link: null }

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/daget", async (req, res) => {
  const { data } = req.body

  try {
    const danaInput = {
      batchNumber: data?.result?.batchNumber || data?.result?.groupOrder?.batchNumber,
      comment: data?.result?.comment,
      payerNickname: data?.result?.payerNickname,
      payerAvatar: data?.result?.payerAvatar,
      ALIPAYJSESSION: data?.result?.ALIPAYJSESSION,
    }

    if (data && danaInput.ALIPAYJSESSION && danaInput.batchNumber && !log.batchNumber[danaInput.batchNumber]) {
      log.batchNumber[danaInput.batchNumber] = true

      console.log(`\n\x1b[32m# ${process.mode} PROCESS\x1b[0m`, process.count)
      process.count++

      const { data: claim } = await axios.post(
        "https://m.dana.id/wallet/api/alipayplus.mobilewallet.transferluckymoney.claim.json",
        {
          batchNumber: danaInput.batchNumber,
          payeeAvatar: "",
          payeeNickname: "",
          share: true,
        },
        {
          params: {
            ctoken: "YTepCUrnrJRNAAhz",
          },
          headers: {
            Host: "m.dana.id",
            "X-Local-Config": "0",
            "User-Agent":
              "Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12",
            "Content-Type": "application/json; charset=utf-8",
            "Content-Length": "108",
            Cookie: `ctoken=YTepCUrnrJRNAAhz; session.cookieNameId=ALIPAYJSESSIONID; ALIPAYJSESSIONID=${danaInput.ALIPAYJSESSION};`,
          },
        }
      )

      log.link[process.link] = true

      const danaOutput = {
        type: "DANA KAGET",
        batchNumber: claim?.result?.batchNumber,
        claimStatus: claim?.result?.claimedAmount?.amount || claim?.result?.claimStatus,
        orderId: claim?.result?.orderId,
        comment: claim?.result?.comment,
        payerAvatar: claim?.result?.payerAvatar,
        payerNickname: claim?.result?.payerNickname || "Anonymous",
      }

      const processText = `  type: \x1b[33m${danaOutput.type}\x1b[0m\n  batch: ${danaOutput.batchNumber}\n  orderId: ${danaOutput.orderId}\n  session: ${danaInput.ALIPAYJSESSION} \n  from: ${danaOutput.payerNickname}\n  amount: \x1b[33m${danaOutput.claimStatus}\x1b[0m\n  comment: ${danaOutput.comment}\n`
      console.log(processText)

      if (danaOutput.claimStatus) {
        process.status = true

        let text

        danaOutput.claimStatus === "EXPIRED" || danaOutput.claimStatus === "NO_FLOWS"
          ? (text = `LINK EXPIRED OR LATE from ${danaOutput.payerNickname}`)
          : (text = `Rp.${danaOutput.claimStatus} from ${danaOutput.payerNickname}`)

        if (parseInt(danaOutput.claimStatus.split(".").join("")) >= 100) text += " | @CYBORG_GIF"

        if (process.message?.group === "O P A N K") {
          process.reply.reply(text)
          exec(`termux-toast -b black -c white -g bottom "${text}"`, (error, stdout, stderr) => {})
        }
      }
    }

    process.delay = null
    process.checker = null

    res.status(200).json(data)
  } catch (error) {
    process.delay = null
    process.checker = null
    process.status = false

    delete log.batchNumber[data?.result?.batchNumber || data?.result?.groupOrder?.batchNumber]
    delete log.link[process.link]

    console.log(error)
    res.json(error)
  }
})

app.get("/cawat", async (req, res) => {
  const { data } = req.body

  console.log(`\n\x1b[32m# CAWAT DISABLE PROCESS\x1b[0m`, process.count)

  if (process.reply) process.reply.reply("CAWAT DISABLE !!!")

  res.status(200).json(data)

  // try {
  //   const danaInput = {
  //     fundOrderId: data?.result?.fundOrderId,
  //     fundAmount: data?.result.fundAmount?.amount,
  //     ALIPAYJSESSION: data?.result?.ALIPAYJSESSION,
  //   }

  //   if (data && danaInput.ALIPAYJSESSION && danaInput.fundOrderId && !log.fundOrderId[danaInput.fundOrderId]) {
  //     log.fundOrderId[danaInput.fundOrderId] = true

  //     console.log(`\n\x1b[32m# ${process.mode} PROCESS\x1b[0m`, process.count)

  //     const { data: claim } = await axios.post(
  //       "https://m.dana.id/wallet/api/alipayplus.mobilewallet.biztransfer.accept.json",
  //       {
  //         fundOrderId: danaInput.fundOrderId,
  //         fundType: "TRANSFER_P2L",
  //         transferMethod: "BALANCE",
  //       },
  //       {
  //         params: {
  //           ctoken: "emI2xGL9g0GeNw-K",
  //         },
  //         headers: {
  //           Host: "m.dana.id",
  //           "X-Local-Config": "0",
  //           "User-Agent":
  //             "Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12",
  //           "Content-Type": "application/json; charset=utf-8",
  //           "Content-Length": "108",
  //           Cookie: `ctoken=emI2xGL9g0GeNw-K; session.cookieNameId=ALIPAYJSESSIONID; ALIPAYJSESSIONID=${danaInput.ALIPAYJSESSION};`,
  //         },
  //       }
  //     )

  //     log.link[process.link] = true

  //     const danaOutput = {
  //       type: "DANA CAWAT",
  //       fundOrderId: claim?.result?.fundOrderId,
  //       fundAmount: claim?.result.fundAmount?.amount,
  //       payerNickname: claim?.result?.payerUserInfo?.nickname || "Anonymous",
  //     }

  //     const processText = `  type: \x1b[33m${danaOutput.type}\x1b[0m\n  fundOrderId: ${danaOutput.fundOrderId}\n  session: ${danaInput.ALIPAYJSESSION} \n  from: ${danaOutput.payerNickname}\n  amount: \x1b[33m${danaOutput.fundAmount}\x1b[0m\n`
  //     console.log(processText)

  //     if (danaOutput.fundAmount) {
  //       process.status = true

  //       let text = `Cawat Rp.${danaOutput.fundAmount} from ${danaOutput.payerNickname} | @CYBORG_GIF`

  //       if (process.message?.group === "O P A N K") {
  //         process.reply.reply(text)
  //         exec(`termux-toast -b black -c white -g bottom "${text}"`, (error, stdout, stderr) => {})
  //       }
  //     }
  //   }

  //   res.status(200).json(data)
  // } catch (error) {
  //   delete log.fundOrderId[data?.result?.fundOrderId]
  //   delete log.link[process.link]

  //   console.log(error)
  //   res.send(error)
  // }
})

app.listen(port, () => console.log("# Server listening on http://localhost:" + port, "\n\n"))

let queue = []

const executeQueue = async () => {
  let currentIndex = 0

  const processNextItem = async () => {
    if (currentIndex < queue.length) {
      const currentItem = queue[currentIndex]
      currentIndex++

      await task(currentItem)

      processNextItem()
    } else {
      await new Promise((resolve) => {
        const intervalId = setInterval(() => {
          if (currentIndex < queue.length) {
            clearInterval(intervalId)
            processNextItem()
            resolve()
          }
        }, 800)
      })
    }
  }

  processNextItem()
}

const task = async (data) => {
  try {
    if (!log.link[data.link]) {
      process.reply = data.ctx
      process.message = data.message
      process.link = data.link

      await new Promise((resolve) => {
        exec(`su -c sh /sdcard/power.sh`, (error, stdout, stderr) => {
          exec(`su -c am start -a android.intent.action.VIEW -d https://${data.link}`, (error, stdout, stderr) => {
            process.delay = setTimeout(() => {
              process.mode = "WAITING MODE"
              resolve()
            }, 5500)

            process.checker = setInterval(() => {
              if (process.status) {
                process.mode = "SKIP MODE"
                resolve()
              }
            }, 500)
          })
        })
      })

      process.status = false

      exec(`su -c input keyevent KEYCODE_HOME`, (error, stdout, stderr) => {})

      // exec(`su -c am start -n com.termux/com.termux.app.TermuxActivity`, (error, stdout, stderr) => {})
      // exec(`su -c am start -n com.termux/com.termux.app.TermuxActivity`, (error, stdout, stderr) => {})

      // exec(`su -c am start -n org.telegram.messenger/org.telegram.ui.LaunchActivity`, (error, stdout, stderr) => {})
      // exec(`su -c am start -n org.telegram.messenger/org.telegram.ui.LaunchActivity`, (error, stdout, stderr) => {})

      clearTimeout(process.delay)
      clearInterval(process.checker)
    } else {
      data.ctx.reply("Oopss Duplicate !")
      console.log("\n\x1b[34m# DUPLICATE LINK\x1b[0m")
    }
  } catch (error) {
    console.log(error)
  }
}

executeQueue()

const bot = new Snake({
  connectionRetries: 5,
  sessionName: "telegramSession",
  logger: "none",
  tgSnakeLog: true,
  storeSession: true,
  apiId: 9793611,
  apiHash: "e85c524bb4bd76de514a428f79b1af10",
  session:
    "1BQANOTEuMTA4LjU2LjExMQG7oBJwjvIaF9s+qy6DzBR/B5+sxhisZyMi/pS+9pFCx6KrScK+fTo5qKkVpb2+ey6OVw6dZbfi6ZzXaui551+2Lup/mmVqizOwG+sHylEmef5o6qbFQ5ZVxny30CqRanFfpel+XyLso12nrNbPc/5Ra0c0J1E0/O4pWmNymmmaUO7BiF97hHY7yyWj7NdVqHphw6mp7He2x/90ArsVth3yU4gZ2jh6h5sINrc4/0/WP7KfalgBT/jeM2uY25sXwHPoSWjnJrmXbj0H6aFzmsvrKeMbvdeAqlBH07xR0BELtnFss+jlh6/Ve9qo/XO38XTNglY+Z3Kk6kQcOqR2j1kFGw==",
})

bot.run()

bot.command("location", async (ctx) => {
  try {
    exec(`termux-location`, (error, stdout, stderr) => {
      if (stdout) {
        const location = JSON.parse(stdout)

        ctx.reply(`# CYBORG check location...\n\nhttps://www.google.com/maps?q=${location?.latitude},${location.longitude}`)
      }
    })
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.command("battery", async (ctx) => {
  try {
    exec(`termux-battery-status`, (error, stdout, stderr) => {
      if (stdout) {
        const battery = JSON.parse(stdout)

        ctx.reply(`Xiaomi MI 10 : ${battery.percentage}% ${battery.health}, ${battery.plugged} ${battery.status} ${battery.temperature} C`)
      }
    })
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.on("message", (ctx) => {
  fs.writeFileSync("telegramSession/cache.json", "[]")

  let message = {
    chat: ctx?.text,
    name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "") || "Anonymous",
    username: ctx?.from?.username ? "@" + ctx?.from?.username : "UNKNOWN USERNAME",
    group: ctx?.chat?.title || "PERSONAL CHAT",
  }

  const link = message?.chat?.match(/link\.dana\S+/g)

  if (message?.group !== "OYENNN" && message?.group !== "AMONNN" && link) {
    link.forEach((x) => queue.push({ link: x, message, ctx }))
  }
})

setInterval(() => {
  // remove log every 2 hours
  log = { batchNumber: {}, fundOrderId: {}, link: {} }
}, 2 * 60 * 60 * 1000)
