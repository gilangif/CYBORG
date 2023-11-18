const { Snake } = require("tgsnake")
const { Telegraf } = require("telegraf")

const express = require("express")
const axios = require("axios")

const port = 3000
const app = express()

const amon = new Telegraf("6330855133:AAEhvPiovs-QJ8mMyACHdam0j76J76fk-W0")

const SESSION = "GZ004676AD5D32B4470087EDD1B04B87E5FFdanabizpluginGZ00"

let count = 0
let shoget = 100

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", async (req, res) => {
  try {
    const { data } = req.body

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

    const msg = {
      batchNumber: data,
      orderId: claim?.result?.orderId || "UNKNOWN",
      comment: claim?.result?.comment || "UNKNOWN",
      from: claim?.result?.payerNickname || "UNKNOWN",
      amount: claim?.result?.claimedAmount?.amount || claim?.result?.claimStatus || "UNKNOWN",
    }

    if (data) console.log(msg, "\n\n")

    if (msg.amount !== "UNKNOWN") {
      let text

      msg.amount && msg.amount === "EXPIRED" ? (text = `LINK EXPIRED from ${msg.from}`) : (text = `${msg.amount}p from ${msg.from}`)

      if (parseInt(text.split(".").join("")) >= 100) {
        text += `\n\n${msg.from} LOVE YOU 3000\n\n@Pluviophile90 @Amanojaku11 @dem3ter @Uoza3 @Geumflowers @AbductedByAliens2 @bobyputrapanca @CYBORG_GIF`
      }

      await amon.telegram.sendMessage("-1001962626950", text)
    }

    res.status(200).json({ msg: "OK" })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.get("/cawat", async (req, res) => {
  console.log("CAWAT DISABLE", req?.body?.data, "\n\n")
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

app.listen(port, () => console.log("# Love you", port))

//
//
// TASK
//
//

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
  count++
  console.log("# TASK", count, "\n\n")
  await new Promise((resolve) => {
    const { exec } = require("child_process")
    exec(`su -c sh /sdcard/power.sh`, (error, stdout, stderr) => {
      exec(`su -c am start -a android.intent.action.VIEW -d https://${url}`, (error, stdout, stderr) => {
        setTimeout(() => {
          // exec(`su -c am start -n com.termux/com.termux.app.TermuxActivity`, (error, stdout, stderr) => {})
          exec(`su -c am start -n tw.nekomimi.nekogram/org.telegram.ui.LaunchActivity`, (error, stdout, stderr) => {})
          resolve()
        }, 4500)
      })
    })
  })
}

executeQueue()

//
//
// SHOPEE
//
//

const shopee = async (data) => {
  try {
    const link = data?.match(/https:\/\/sppay\.shopee\.co\.id\/angbao\/\w+/g)

    if (link) {
      link.forEach((x) => shopeeLeaderBoard(x.split("/angbao/")[1].slice(0, 32)))
    }
  } catch (error) {
    console.log(error)
  }
}

const getXtoken = async () => {
  try {
    const { data } = await axios.post(
      "https://api.gw.airpay.co.id/user/v1/spw/token/refresh",
      '{"meta":{"source":"shopee","longitude":"106.72562044"},"data":{"device_info":{"device_os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","shopee_version":"30707"},"refresh_token":"7c7e7128c87b27683e7f1a589ab601cb68fa307777b5e651b42e3d91f0fda11189ecea4e3c2ed557f55ef553f65110ce8858361a9276312ef345c139547312caac238f0c3014b8c900860ebb5713f8f04bfc8215b87c19a474c6a34c51ee86a6590c957f01"}}',
      {
        headers: {
          Host: "api.gw.airpay.co.id",
          "Content-Length": "399",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    return data
  } catch (error) {
    console.log(error)
  }
}

const shopeeLeaderBoard = async (orderCode) => {
  try {
    const xtoken = await getXtoken()

    const { data } = await axios.post(
      "https://api.gw.airpay.co.id/wallet/v1/angbao_send_parent/get_leaderboard_details",
      `{"data":{"angbao_sn":"${orderCode}"},"meta":{"os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","source":"shopee","device_ip":"192.168.137.245"}}`,
      {
        headers: {
          Host: "api.gw.airpay.co.id",
          "X-Token": `${xtoken.data.access_token}`,
          "Content-Length": "180",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const result = {
      from: data?.data?.sender_detail?.display_name,
      amount: data?.data?.receive_amount / 100000,
      totalAmount: data?.data?.total_receive_amount / 100000,
      total: data?.data?.total_angbao_num,
      totalReceiver: data?.data?.success_claim_angbao_details.length,
      xtoken: xtoken.data.access_token,
      type: data?.data?.angbao_type, // 1 RANDOM, 2 FIXED
      orderCode,
    }

    if (result.type == 1) {
      const text = `SHOPEE ${result.type == 1 ? "RANDOM" : "FIXED"} TOTAL ${result.totalAmount} PERAK ${result.total} SLOT FROM ${result.from}`
      await amon.telegram.sendMessage("-1001962626950", text)
    } else {
      if (result.amount >= shoget) {
        shopeeOrderSN(result)
      } else {
        const text = `SHOPEE ${result.type == 1 ? "RANDOM" : "FIXED"} ${result.amount} PERAK FROM ${result.from}\n\nSKIPLAH GAK LEVEL...`
        await amon.telegram.sendMessage("-1001962626950", text)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const shopeeOrderSN = async (order) => {
  try {
    const { data } = await axios.post(
      "https://api.gw.airpay.co.id/wallet/v1/angbao_send_parent/validate",
      `{"data":{"angbao_sn":"${order?.orderCode}"},"meta":{"os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","source":"shopee","device_ip":"192.168.137.108"}}`,
      {
        headers: {
          Host: "api.gw.airpay.co.id",
          "X-Token": order?.xtoken,
          "Content-Length": "180",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const result = { ...order, order_sn: data?.data?.order_sn, msg: data?.msg }

    // console.log(data)
    shopeeClaim(result)
  } catch (error) {
    console.log(error)
  }
}

const shopeeClaim = async (order) => {
  try {
    const { data } = await axios.post(
      "https://api.gw.airpay.co.id/wallet/v1/angbao_receive/create_order",
      `{"data":{"send_parent_order_sn":"${order?.order_sn}"},"meta":{"os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","source":"shopee","device_ip":"192.168.137.108"}}`,
      {
        headers: {
          Host: "api.gw.airpay.co.id",
          "X-Token": order?.xtoken,
          "Content-Length": "188",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    const result = { ...order, status: data?.data?.debug_msg }

    console.log(result, "\n\n")

    const text = `SHOPEE ${result.type == 1 ? "RANDOM" : "FIXED"} ${result.amount} PERAK FROM ${result.from} UHUYYYY\n\nMESSAGE: ${result.msg}\n\n${
      result.totalReceiver
    } orang sudah claim dari ${result.total} slot.`
    await amon.telegram.sendMessage("-1001962626950", text)
  } catch (error) {
    console.log(error)
  }
}

//
//
// TELEGRAM
//
//

const bot = new Snake({
  apiHash: "e85c524bb4bd76de514a428f79b1af10",
  apiId: 9793611,
  session:
    "1BQANOTEuMTA4LjU2LjExMQG7oBJwjvIaF9s+qy6DzBR/B5+sxhisZyMi/pS+9pFCx6KrScK+fTo5qKkVpb2+ey6OVw6dZbfi6ZzXaui551+2Lup/mmVqizOwG+sHylEmef5o6qbFQ5ZVxny30CqRanFfpel+XyLso12nrNbPc/5Ra0c0J1E0/O4pWmNymmmaUO7BiF97hHY7yyWj7NdVqHphw6mp7He2x/90ArsVth3yU4gZ2jh6h5sINrc4/0/WP7KfalgBT/jeM2uY25sXwHPoSWjnJrmXbj0H6aFzmsvrKeMbvdeAqlBH07xR0BELtnFss+jlh6/Ve9qo/XO38XTNglY+Z3Kk6kQcOqR2j1kFGw==",
})

bot.run()

bot.on("message", (ctx) => {
  let data = {
    id: ctx?.id,
    chat: ctx?.text,
    name: (ctx?.from?.firstName ? ctx?.from?.firstName + " " : "" + ctx?.from?.lastName ? ctx?.from?.lastName : "").trim() || "Anonymous",
    username: ctx?.from?.username,
    groupname: ctx?.chat?.title || "PERSONAL CHAT",
  }

  const link = data?.chat?.match(/link\.dana\S+/g)

  // shopee(data?.chat)

  if (data.groupname !== "OYENNN" && link) {
    link.forEach((x) => queue.push(x))
  }
})

amon.launch()

setInterval(() => {
  queue.push("link.dana.id/kaget?c=xxx")
}, 1500000)
