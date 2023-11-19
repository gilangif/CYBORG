const { Snake } = require("tgsnake")

const queue = []

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
        }, 1000)
      })
    }
  }

  processNextItem()
}

const task = async (url) => {
  let tapper

  console.log(url, "\n\n")
  await new Promise((resolve) => {
    const { exec } = require("child_process")
    exec(`su -c sh /sdcard/power.sh`, (error, stdout, stderr) => {
      exec(`su -c am start -a android.intent.action.VIEW -d https://${url}`, (error, stdout, stderr) => {
        setTimeout(() => {
          tapper = setInterval(() => {
            exec(`su -c input tap 551 873`, (error, stdout, stderr) => {})
            exec(`su -c input tap 621 1732`, (error, stdout, stderr) => {})
          }, 600)
        }, 4500)

        setTimeout(() => {
          clearInterval(tapper)
          clearInterval(tapper)
        }, 11500)

        setTimeout(() => {
          exec(`su -c am start -n com.termux/com.termux.app.TermuxActivity`, (error, stdout, stderr) => {})
          resolve()
        }, 14500)
      })
    })
  })
}

executeQueue()

const bot = new Snake({
  apiHash: "7ae3263135b270acdb4b42888fcf47fa",
  apiId: 25724580,
  logger: "none",
  session:
    "1BQANOTEuMTA4LjU2LjE0MQG7mHkay4hLPG3sb/hLvPKMA57HIooVp3IQ8eER5Q2QsQyeLjaEPNeVn1U+3zU2zvqR9E00nY+DSDC3IwfyQuhgAf762b17ndkzf7El431dK2HfiIzOUNpyiWyHDQ3Dh/yuJzpxWqzAHTAE4CfczlIs5guu1lYwEA77KC877vpW82sBL90tXdtfEYHsD6XPHWkIOFxFNVcE4B+AUHcC8Zl0pFlHwYkrzS9GuVlUWpqrdekws9rUQ74DkiWKV/KN38sk6wKoXD+hApYzISh6GTOFHrxPYZw+5E4AoAtUDppEu4fNV5MNfje5PLQZbmIeUqHAtReozmdVJcNsIeS6gtzpHQ==",
})

bot.run()

bot.command("bobycheck", async (ctx) => {
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

bot.command("bobyputratrak", async (ctx) => {
  try {
    ctx.reply("Agar tali silaturahmi tidak terputus pinjam dulu seratus...")
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.on("message", (ctx) => {
  let data = {
    id: ctx?.id,
    chat: ctx?.text,
    name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "").trim() || "Anonymous",
    username: ctx?.from?.username,
    groupname: ctx?.chat?.title || "PERSONAL CHAT",
  }

  console.log(data)

  const link = data?.chat?.match(/link\.dana\S+/g)

  if (link) {
    console.log(data, "\n\n")
    link.forEach((x) => queue.push(x))
  }
})
