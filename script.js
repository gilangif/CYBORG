let ALIPAYJSESSION

setTimeout(function () {
  try {
    Java.perform(() => {
      function getInterceptor() {
        try {
          const HttpLoggingInterceptor = Java.use("okhttp3.logging.HttpLoggingInterceptor")
          const Level = Java.use("okhttp3.logging.HttpLoggingInterceptor$Level")

          const MyLogger = Java.registerClass({
            name: "MyLogger",
            superClass: Java.use("java.lang.Object"),
            implements: [Java.use("okhttp3.logging.HttpLoggingInterceptor$Logger")],
            methods: {
              log: [
                {
                  returnType: "void",
                  argumentTypes: ["java.lang.String"],
                  implementation: function (message) {
                    if (message.includes("ALIPAYJSESSIONID=")) {
                      const regex = /ALIPAYJSESSIONID=([^;]+)/
                      const match = message.match(regex)

                      if (match[1]) ALIPAYJSESSION = match[1]
                    }

                    if (message.includes("fundOrderId") && message.includes("fundAmount")) {
                      try {
                        console.log("sadasdas", message)
                        const data = JSON.parse(message)

                        if (data.result) {
                          data.result.ALIPAYJSESSION = ALIPAYJSESSION

                          console.log(message, "\n\n\n")
                          const Runtime = Java.use("java.lang.Runtime")
                          Runtime.getRuntime().exec([
                            "curl",
                            "-X",
                            "GET",
                            "http://localhost:3000/cawat",
                            "-H",
                            "Content-Type: application/json",
                            "-d",
                            `{ "data": ${JSON.stringify(data)} }`,
                          ])
                        }
                      } catch (error) {
                        console.log(error)
                      }
                    }

                    if (message.includes("batchNumber")) {
                      try {
                        const data = JSON.parse(message)

                        if (data.result) {
                          data.result.ALIPAYJSESSION = ALIPAYJSESSION

                          console.log(message, "\n\n\n")
                          const Runtime = Java.use("java.lang.Runtime")
                          Runtime.getRuntime().exec([
                            "curl",
                            "-X",
                            "GET",
                            "http://localhost:3000/daget",
                            "-H",
                            "Content-Type: application/json",
                            "-d",
                            `{ "data": ${JSON.stringify(data)} }`,
                          ])
                        }
                      } catch (error) {
                        console.log(error)
                      }
                    }
                  },
                },
              ],
            },
          })

          var logInstance = HttpLoggingInterceptor.$new(MyLogger.$new())

          logInstance.setLevel(Level.BODY.value)

          return logInstance
        } catch (err) {
          console.log(err)
          console.log(err.stack)
          return null
        }
      }

      try {
        var Builder = Java.use("okhttp3.OkHttpClient$Builder")
        var build = Builder.build.overload()
        build.implementation = function () {
          try {
            this.addInterceptor(getInterceptor())
          } catch (err) {
            console.log(err)
          }

          return build.call(this)
        }
      } catch (err) {
        console.log(err)
      }
    })
  } catch (error) {
    console.log(error)
  }
}, 1000)
