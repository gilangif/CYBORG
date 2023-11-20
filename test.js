const Slimbot = require("slimbot")
const slimbot = new Slimbot("6107155056:AAHD_thIjVila1NoMfJKwVoXbeJEuyOyG_k")

// Register listeners

slimbot.on("message", (message) => {
  console.log(message)
})

// Call API

slimbot.startPolling()
