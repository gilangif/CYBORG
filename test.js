const { Snake } = require("tgsnake")
const { Telegraf } = require("telegraf")

const amon = new Telegraf("6107155056:AAHD_thIjVila1NoMfJKwVoXbeJEuyOyG_k")

amon.launch()

const bot = new Snake({
  connectionRetries: 5,
  sessionName: "telegramSession",
  logger: "info",
  tgSnakeLog: true,
  storeSession: true,
  apiId: 9793611,
  apiHash: "e85c524bb4bd76de514a428f79b1af10",
  session:
    "1BQANOTEuMTA4LjU2LjExMQG7oBJwjvIaF9s+qy6DzBR/B5+sxhisZyMi/pS+9pFCx6KrScK+fTo5qKkVpb2+ey6OVw6dZbfi6ZzXaui551+2Lup/mmVqizOwG+sHylEmef5o6qbFQ5ZVxny30CqRanFfpel+XyLso12nrNbPc/5Ra0c0J1E0/O4pWmNymmmaUO7BiF97hHY7yyWj7NdVqHphw6mp7He2x/90ArsVth3yU4gZ2jh6h5sINrc4/0/WP7KfalgBT/jeM2uY25sXwHPoSWjnJrmXbj0H6aFzmsvrKeMbvdeAqlBH07xR0BELtnFss+jlh6/Ve9qo/XO38XTNglY+Z3Kk6kQcOqR2j1kFGw==",
})

bot.run()

bot.on("message", async (ctx) => {
  console.log("📌 ctx: ", ctx)
  if (ctx.media && ctx.media._ == "photo") {
    // let buffer = await ctx.telegram.download(ctx.media.fileId)
    // console.log(buffer)
    const test = await amon.telegram.getFileLink(ctx.chat.photo.fileId)
    console.log("📌 test: ", test)
  }
})

const photo = {
  out: true,
  mentioned: false,
  mediaUnread: false,
  silent: false,
  legacy: false,
  id: 4674,
  date: 1700790241,
  post: false,
  fromScheduled: false,
  editHide: false,
  pinned: false,
  noforward: false,
  viaBotId: 0n,
  text: "",
  mediaGroupId: 0n,
  from: {
    id: 572191161n,
    username: "CYBORG_GIF",
    firstName: "I'm Cyborg but It's Okay!",
    status: "online",
    self: true,
    deleted: false,
    fake: false,
    scam: false,
    bot: false,
    verified: false,
    restricted: false,
    dcId: 5,
    photo: {
      date: 1700790241,
      _: "chatPhoto",
      isBig: true,
      dcId: 5,
      fileId: "AQADBQADt6cxG7nxGiIACAEABwMAA7nxGiIABLV610o7_H-wAAQeBA",
      uniqueFileId: "AQADt6cxG7nxGiI",
    },
    accessHash: -5728582869403075915n,
  },
  chat: {
    id: 777000n,
    firstName: "Telegram",
    photo: {
      date: 1700790241,
      _: "chatPhoto",
      isBig: true,
      dcId: 1,
      fileId: "AQADAQADsacxGyjbCwAJAQAHAwADKNsLAAVDpHsiZGWfggAEHgQ",
      uniqueFileId: "AQADsacxGyjbCwAB",
    },
    dcId: 1,
    fake: false,
    scam: false,
    private: true,
    type: "user",
    accessHash: -9034390846732262333n,
  },
  media: {
    date: 1700790241,
    _: "photo",
    dcId: 5,
    hasStickers: false,
    fileId: "AgACAgUAAxkDAAISQmVf_-E3K70a0obSGRQlSgRlDalfAALzvDEb484BVz_fYl3cFCUGAQAHAQADAQADVEhVTUJOQUlMAQADHgQ",
    uniqueFileId: "AgAD87wxG-POAVc",
  },
}
