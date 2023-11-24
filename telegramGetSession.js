const { TelegramClient } = require("telegram")
const { StringSession } = require("telegram/sessions")
const input = require("input")

const apiId = 22021572
const apiHash = "ee3fb758d3e90a2bfd8202cf4ad4dce5"
const stringSession = new StringSession("")

;(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 })

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () => await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  })
  console.log("You should now be connected.")
  console.log(client.session.save())
  console.log(client)
  // await client.sendMessage("me", { message: "Hello!" });
  // const res = await client.getMessages()
  // console.log("📌 res: ", res)

  //   for await (const message of client.iterMessages()){
  //     console.log(message.id, message.text)
  //  }

  const res = await client.getMessages()
})()
