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
  apiHash: "ee3fb758d3e90a2bfd8202cf4ad4dce5",
  apiId: 22021572,
  logger: "none",
  session:
    "1BQANOTEuMTA4LjU2LjE0OAG7OjfXVCsgAQhKPA41oBXl8KlZUYAlOIoCp8zPP8MF9bcY+BM0bV1tVu8xTzzSq6+TEwwGDbrlBhsjwYEHtFE1EJkvp8B01AQVT+AZiebKQSfUqcr1EPahbN4vPJukgpudEpCJSMBjDx++66HFZJbOjNcF/m1/qzKOxb8Tz9NwDFrlOYYeMRAIeS5XmoccmTE1uBu0Mj0H5f3IOTaf6Kl2BCzH62TCTY3iI3LfMfipLtduo1I76A9JJyQGPOzVqJZJYSTd1JdnhDUqPFMU5p6LxskPWIvqzLZ+zt3ighmNNWtplHYCXWu1rsy3LRvQdhd1r3umlFBr7jV8jLChr0E9bQ==",
})

bot.run()

bot.command("test", async (ctx) => {
  try {
    ctx.reply(`User Bot Active!`)
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.command("battery", async (ctx) => {
  try {
    const { exec } = require("child_process")

    exec(`termux-battery-status`, (error, stdout, stderr) => {
      if (stdout) {
        const battery = JSON.parse(stdout)

        ctx.reply(`Xiaomi MI 8 Lite : ${battery.percentage}% ${battery.health}, ${battery.plugged} ${battery.status} ${battery.temperature} C`)
      }
    })
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.command("locationboby", async (ctx) => {
  try {
    const { exec } = require("child_process")
    exec(`termux-location`, (error, stdout, stderr) => {
      if (stdout) {
        const location = JSON.parse(stdout)

        ctx.reply(`# Chuwnwen check location...\n\nhttps://www.google.com/maps?q=${location?.latitude},${location.longitude}`)
      }
    })
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.command("vdown", async (ctx) => {
  try {
    const { exec } = require("child_process")
    exec(`su -c input keyevent KEYCODE_VOLUME_DOWN`, (error, stdout, stderr) => {})
  } catch (error) {
    console.log("COMMAND ERROR")
  }
})

bot.command("vup", async (ctx) => {
  try {
    const { exec } = require("child_process")
    exec(`su -c input keyevent KEYCODE_VOLUME_UP`, (error, stdout, stderr) => {})
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
