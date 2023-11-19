const { Snake } = require("tgsnake")

const express = require("express")
const axios = require("axios")

const port = 3000
const app = express()

const SESSION = "GZ007F7CECBE25114001A727B4442BA3464AdanabizpluginGZ00"

let processStatus = false
let processReply
let processDelay
let processChecker
let processMode
let processMessage

let logging = {}
let count = 0

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  const { exec } = require("child_process")

  processStatus = false

  try {
    const { data } = req.body

    if (data && !logging[data]) {
      console.log(`\n\x1b[34m# ${processMode}\x1b[0m\n`)

      const { data: claim } = await axios.post(
        "https://m.dana.id/wallet/api/alipayplus.mobilewallet.transferluckymoney.claim.json",
        {
          batchNumber: data,
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
            Cookie: `ctoken=YTepCUrnrJRNAAhz; session.cookieNameId=ALIPAYJSESSIONID; ALIPAYJSESSIONID=${SESSION};`,
          },
        }
      )

      logging[data] = data

      const msg = {
        batch: data,
        orderId: claim?.result?.orderId || "UNKNOWN",
        from: claim?.result?.payerNickname || "UNKNOWN",
        amount: claim?.result?.claimedAmount?.amount || claim?.result?.claimStatus || "UNKNOWN",
        comment: claim?.result?.comment || "UNKNOWN",
      }

      console.log(
        `  batch: ${msg.batch}\n  orderId: ${msg.orderId}\n  from: ${msg.from}\n  amount: \x1b[33m${msg.amount}\x1b[0m\n  comment: ${msg.comment}\n\n`
      )

      if (msg.amount !== "UNKNOWN" && msg.orderId !== "UNKNOWN") {
        processStatus = true

        let text

        msg.amount && (msg.amount === "EXPIRED" || msg.amount === "NO_FLOWS")
          ? (text = `LINK EXPIRED OR LATE from ${msg.from}`)
          : (text = `Rp.${msg.amount} from ${msg.from}`)

        if (parseInt(msg.amount.split(".").join("")) >= 100) text += " | @CYBORG_GIF"

        if (processMessage?.groupname === "O P A N K") processReply.reply(text)

        exec(`termux-toast -b black -c white -g bottom "${text}"`, (error, stdout, stderr) => {})
      }
    } else {
      console.log("  Undefined, duplicate or error data.\n\n")
    }

    processReply = null
    processDelay = null
    processChecker = null
    processMessage = null

    res.status(200).json({ msg: "OK" })
  } catch (error) {
    processReply = null
    processDelay = null
    processChecker = null
    processMessage = null

    console.log(error)
    res.send(error)
  }
})

app.get("/cawat", async (req, res) => {
  console.log("\n#CAWAT DISABLE\n")
  res.json(req.body)

  // try {
  //   const { data } = req.body

  //   console.log("CAWAT NUMBER:", data, "\n\n")

  //   const { data: claim } = await axios.post(
  //     "https://m.dana.id/wallet/api/alipayplus.mobilewallet.biztransfer.accept.json",
  //     {
  //       fundOrderId: data,
  //       fundType: "TRANSFER_P2L",
  //       transferMethod: "BALANCE",
  //     },
  //     {
  //       params: {
  //         ctoken: "emI2xGL9g0GeNw-K",
  //       },
  //       headers: {
  //         Host: "m.dana.id",
  //         "X-Local-Config": "0",
  //         "User-Agent":
  //           "Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12",
  //         "Content-Type": "application/json; charset=utf-8",
  //         "Content-Length": "108",
  //         Cookie: `ctoken=emI2xGL9g0GeNw-K; session.cookieNameId=ALIPAYJSESSIONID; ALIPAYJSESSIONID=${SESSION};`,
  //       },
  //     }
  //   )

  //   const msg = {
  //     fundOrderId: claim?.result?.fundOrderId || "UNKNOWN",
  //     amount: claim?.result?.fundAmount?.amount || "UNKNOWN",
  //   }

  //   console.log(msg, "\n\n")

  //   if (msg.amount !== "UNKNOWN") {
  //     const text = `CAWAT ${msg.amount}`
  //     await amon.telegram.sendMessage("-1001962626950", text)
  //   }

  //   res.status(200).json({ msg: "OK" })
  // } catch (error) {
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
  const { exec } = require("child_process")

  console.log("\n\x1b[32m# Process", count, "\x1b[0m\n")
  count++

  processReply = data.ctx
  processMessage = data.message

  await new Promise((resolve) => {
    exec(`su -c sh /sdcard/power.sh`, (error, stdout, stderr) => {
      exec(`su -c am start -a android.intent.action.VIEW -d https://${data.url}`, (error, stdout, stderr) => {
        processDelay = setTimeout(() => {
          processMode = "WAITING MODE"
          resolve()
        }, 5500)

        processChecker = setInterval(() => {
          if (processStatus) {
            processMode = "SKIP MODE"
            resolve()
          }
        }, 500)
      })
    })
  })

  processStatus = false

  exec(`su -c am start -n org.telegram.messenger/org.telegram.ui.LaunchActivity`, (error, stdout, stderr) => {})
  exec(`su -c am start -n org.telegram.messenger/org.telegram.ui.LaunchActivity`, (error, stdout, stderr) => {})

  clearTimeout(processDelay)
  clearInterval(processChecker)
}

executeQueue()

const bot = new Snake({
  apiHash: "e85c524bb4bd76de514a428f79b1af10",
  apiId: 9793611,
  session:
    "1BQANOTEuMTA4LjU2LjExMQG7oBJwjvIaF9s+qy6DzBR/B5+sxhisZyMi/pS+9pFCx6KrScK+fTo5qKkVpb2+ey6OVw6dZbfi6ZzXaui551+2Lup/mmVqizOwG+sHylEmef5o6qbFQ5ZVxny30CqRanFfpel+XyLso12nrNbPc/5Ra0c0J1E0/O4pWmNymmmaUO7BiF97hHY7yyWj7NdVqHphw6mp7He2x/90ArsVth3yU4gZ2jh6h5sINrc4/0/WP7KfalgBT/jeM2uY25sXwHPoSWjnJrmXbj0H6aFzmsvrKeMbvdeAqlBH07xR0BELtnFss+jlh6/Ve9qo/XO38XTNglY+Z3Kk6kQcOqR2j1kFGw==",
})

bot.run()

bot.command("check", async (ctx) => {
  try {
    const { exec } = require("child_process")

    exec(`termux-battery-status`, (error, stdout, stderr) => {
      if (stdout) {
        const battery = JSON.parse(stdout)

        ctx.reply(`BATTERY: ${battery.health} ${battery.percentage}%, ${battery.plugged} ${battery.status} ${battery.temperature} C`)
      }
    })
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.on("message", (ctx) => {
  let data = {
    id: ctx?.id,
    chat: ctx?.text,
    name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "") || "Anonymous",
    username: ctx?.from?.username,
    groupname: ctx?.chat?.title || "PERSONAL CHAT",
  }

  const link = data?.chat?.match(/link\.dana\S+/g)

  if (data?.groupname !== "OYENNN" && data?.groupname !== "AMONNN" && link) {
    link.forEach((x) => queue.push({ url: x, ctx, message: data }))
  }
})

setInterval(() => {
  console.log("\n\x1b[34m# WAKEUP PROGRAM\x1b[0m\n")
  queue.push({ url: "link.dana.id/kaget?c=xxxxxx", ctx: "test" })
}, 1500000)
