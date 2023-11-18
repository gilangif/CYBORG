buat claim daget dengan batchNumber

CURL

curl -i -s -k -X $'POST' \
    -H $'Host: m.dana.id' -H $'Referer: https://m.dana.id/n/dana-transfer/luckymoney/claim?orderId=20231108101214400415010300166946848173897&refer=Link' -H $'User-Agent: Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12' -H $'Content-Length: 108' \
    -b $'ctoken=emI2xGL9g0GeNw-K; ALIPAYJSESSIONID=GZ0006FCEDE376AA41EAB29E6C0E6860FAA4danabizpluginGZ00' \
    --data-binary $'{\"batchNumber\":\"20231108101214400415010300166946848173897\",\"payeeAvatar\":\"\",\"payeeNickname\":\"\",\"share\":true}' \
    $'https://m.dana.id/wallet/api/alipayplus.mobilewallet.transferluckymoney.claim.json?ctoken=emI2xGL9g0GeNw-K'




REQUEST BURP

POST /wallet/api/alipayplus.mobilewallet.transferluckymoney.claim.json?ctoken=emI2xGL9g0GeNw-K HTTP/2
Host: m.dana.id
Referer: https://m.dana.id/n/dana-transfer/luckymoney/claim?orderId=20231108101214400415010300166946848173897&refer=Link
User-Agent: Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12
Cookie: ctoken=emI2xGL9g0GeNw-K; ALIPAYJSESSIONID=GZ0006FCEDE376AA41EAB29E6C0E6860FAA4danabizpluginGZ00;
Content-Length: 108

{"batchNumber":"20231108101214400415010300166946848173897","payeeAvatar":"","payeeNickname":"","share":true}



SAMPLE RESPONSE BURP

HTTP/2 200 OK
Content-Type: application/json;charset=UTF-8
Strict-Transport-Security: max-age=31536000
Rpcid: 0a016d5c1699442271717122461897
X-Frontend-Config: VEHSwitch=100;UHRSwitch=100;EasterEgg=Y;BizMonitor=Y;WebpSetting=0;StorageCacheSwitch=TOPUP,POCKET;PCISwitch=100;AgentNearbymeSwitch=Y;MixpanelToken=ded2d68965bbd813d33d686ee165bae7;MixpanelTokenPre=500025290aa3354419b91ae3eeb185f1;KybQrNmid=N;isNewBankCard=Y;isRiskKeyboardSupportedFaceAuth=Y;SplitKey=slab1c3idbb9kpqmktkfj1nmoakjurkttd7m;CallbackTimerInSeconds=10;;PCIDomain=m.dana.id
X-Userrole: NormalUser
Oteltraceid: ea81d9121e382a6144187bda263389c1
X-Frame-Options: SAMEORIGIN
X-Xss-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
Referrer-Policy: no-referrer-when-downgrade
Expires: Wed, 08 Nov 2023 11:17:51 GMT
Cache-Control: max-age=0, no-cache, no-store
Pragma: no-cache
Date: Wed, 08 Nov 2023 11:17:51 GMT
Content-Length: 435
Set-Cookie: oneDayId=2649261059; Domain=m.dana.id; Expires=Thu, 07-Nov-2024 11:17:51 GMT; Path=/; HttpOnly; Secure; Secure
Server-Timing: cdn-cache; desc=MISS
Server-Timing: edge; dur=12
Server-Timing: origin; dur=126
Set-Cookie: ak_bmsc=5EC8122E0A8FFDC74BC5232BFBCC2395~000000000000000000000000000000~YAAQB60wF08xOq6LAQAAYianrhVXpxcSvITT1HFifHiGchDgB5gNZMhA+xP5WbicP0CuQ8/cB3PH89su5DowZBEZlcFm2lbIdf05OFiFicsGZcApK94rESr3oaiTnu+4DentbvDP6C238MJbJlSeuALzu+ceNsQYDegzHs2qQBAOik41MVhuvRSxPTv2rogzjr1qmtZXQacy0Q/Yi6Sq/r+Ozia3UblRt19JomY2UYac6TWqeSoru7P+l4+EApqaGPtrwVK1T4/GIp77FcvIpLJXBdvCPROi51cCQNWrXK+1ccIjmzycpBzTiFTMFUTA9cLTkKOSPnw48gbDrEEUKdKA0Zq+EY/SXGI2IgCNVEoqzPAXQjRwWpLhBJqw; Domain=.dana.id; Path=/; Expires=Wed, 08 Nov 2023 13:17:51 GMT; Max-Age=7200; HttpOnly
Server-Timing: ak_p; desc="1699442271697_389065991_32848761_13769_6284_0_0_15";dur=1

{"config":null,"memo":"","result":{"batchNumber":"20231108101214400415010300166946848173897","claimedAmount":{"amount":"2","currency":"Rp"},"comment":"Good Luck!","orderId":"20231108101214231415030400166946848910470","payerAvatar":"https://a.m.dana.id/avatar/p/JPEG_20230928_074102_4960_d723ab03-6299-46e5-93e8-55b5955d778c.png","payerFlag":false,"payerNickname":"SITI MAESAROH","shareEnable":false,"success":true},"resultStatus":1000}





adb shell dumpsys activity activities | grep mResumedActivity






CAWAT

CURL

POST /wallet/api/alipayplus.mobilewallet.biztransfer.accept.json?ctoken=emI2xGL9g0GeNw-K HTTP/2
Host: m.dana.id
User-Agent: Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12
Cookie: ctoken=emI2xGL9g0GeNw-K; session.cookieNameId=ALIPAYJSESSIONID; ALIPAYJSESSIONID=GZ00460EE95C36EA4B398B8FF0B2BACF2D78danabizpluginGZ00;
Content-Length: 108

{"fundOrderId":"2023110910121420010100166978938937170","fundType":"TRANSFER_P2L","transferMethod":"BALANCE"}


REQUEST BURP

POST /wallet/api/alipayplus.mobilewallet.biztransfer.accept.json?ctoken=emI2xGL9g0GeNw-K HTTP/2
Host: m.dana.id
User-Agent: Skywalker/2.46.1 EDIK/1.0.0 Dalvik/2.1.0 (Linux; U; Android 10; Mi 10 MIUI/V12.0.1.0.QJBIDXM) Ariver/2.52.0 LocalKit/1.5.1.3  Lang/en-US okhttp/3.12.12
Cookie: ctoken=emI2xGL9g0GeNw-K; session.cookieNameId=ALIPAYJSESSIONID; ALIPAYJSESSIONID=GZ00460EE95C36EA4B398B8FF0B2BACF2D78danabizpluginGZ00;
Content-Length: 108

{"fundOrderId":"2023110910121420010100166978938937170","fundType":"TRANSFER_P2L","transferMethod":"BALANCE"}



SAMPLE RESPONSE

HTTP/2 200 OK
Content-Type: application/json;charset=UTF-8
Strict-Transport-Security: max-age=31536000
Rpcid: 0a0270251699522459570176339608
X-Frontend-Config: VEHSwitch=100;UHRSwitch=100;EasterEgg=Y;BizMonitor=Y;WebpSetting=0;StorageCacheSwitch=TOPUP,POCKET;PCISwitch=100;AgentNearbymeSwitch=Y;MixpanelToken=ded2d68965bbd813d33d686ee165bae7;MixpanelTokenPre=500025290aa3354419b91ae3eeb185f1;KybQrNmid=N;isNewBankCard=Y;isRiskKeyboardSupportedFaceAuth=Y;SplitKey=slab1c3idbb9kpqmktkfj1nmoakjurkttd7m;CallbackTimerInSeconds=10;;PCIDomain=m.dana.id
X-Userrole: NormalUser
Access-Control-Expose-Headers: Server-Timing
Oteltraceid: a4e850d476b40c734ccaa4472a53d855
X-Frame-Options: SAMEORIGIN
X-Xss-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=63072000; includeSubdomains; preload
Referrer-Policy: no-referrer-when-downgrade
Expires: Thu, 09 Nov 2023 09:34:19 GMT
Cache-Control: max-age=0, no-cache, no-store
Pragma: no-cache
Date: Thu, 09 Nov 2023 09:34:19 GMT
Content-Length: 284
Set-Cookie: oneDayId=3460022213; Domain=m.dana.id; Expires=Fri, 08-Nov-2024 09:34:19 GMT; Path=/; HttpOnly; Secure; Secure
Server-Timing: cdn-cache; desc=MISS
Server-Timing: edge; dur=12
Server-Timing: origin; dur=146
Server-Timing: traceparent;desc="00-a4e850d476b40c734ccaa4472a53d855-81e431004717f4d2-01"
Set-Cookie: ak_bmsc=3A4E5B902C6A9BD6DC991A72434CCADA~000000000000000000000000000000~YAAQFa0wF/BRMLOLAQAASbhusxWk3RcfF0tzVkfg5XuoSDYo1wRG+9kO1gPHyclDB1GzefK9IJtMZLIHRyIb3b7JUQPG+pV5Tv+x0ohwWjwLm5f0QFs4MHLAzmlz3FFeaUKzj4AENTJD6pB1HQM2wZ68AxtUMNVTm0MqpkZzv0wvenSnfGTckAZIhvS5y6O1evxFEbc5dIzPSlL47bH4DlRrtdq9S/THGfex9LhsZ/k3Rm+H10hFEDDFAcHKCVc51OQltfkHGm3umIhH9wH6aqLxo8V3V+MKwy/K6jkz5enyZ+Mx54d0wJc4E2TVPf0d2Pxp9YvQvI9shw7/d4rX3QgYFl03Xo7ZQZnNZA2OPbzcm4uOBj4yN9QRSoq8; Domain=.dana.id; Path=/; Expires=Thu, 09 Nov 2023 11:34:19 GMT; Max-Age=7200; HttpOnly
Server-Timing: ak_p; desc="1699522459514_389066005_35484407_15844_5616_7_32_15";dur=1

{"config":null,"memo":"","result":{"acceptExpiryTime":1699607427841,"acceptedTime":1699522459591,"attributes":{},"fundAmount":{"amount":"4","currency":"Rp"},"fundOrderId":"2023110910121420010100166978938916665","payExpiryTime":0,"status":"SUCCESS","success":true},"resultStatus":1000}







SHOGET

CEK ISI

CURL

curl -i -s -k -X $'POST' \
    -H $'Host: api.gw.airpay.co.id' -H $'X-Token: e0a6ea0d5a1270e3d5b168f98f9a5601abbffd9c80251bf9a7f5a816be3d70bdaa96eea070c1e63cf4decfc1f912c2e66e9aa9a40b0aef4535d31a3d77c377ec27e85765d952a2f99d03aef3c67fb9f9b05bd57919a90ed19fa4e114384ac672d606e965dd' -H $'Content-Length: 180' \
    --data-binary $'{\"data\":{\"angbao_sn\":\"GsjM7AxZuXu652qDyWBDnTvATO9EFsGl\"},\"meta\":{\"os\":2,\"device_id\":\"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=\",\"source\":\"shopee\",\"device_ip\":\"192.168.137.245\"}}' \
    $'https://api.gw.airpay.co.id/wallet/v1/angbao_send_parent/get_leaderboard_details'


BURP REQUEST

POST /wallet/v1/angbao_send_parent/get_leaderboard_details HTTP/2
Host: api.gw.airpay.co.id
X-Token: e0a6ea0d5a1270e3d5b168f98f9a5601abbffd9c80251bf9a7f5a816be3d70bdaa96eea070c1e63cf4decfc1f912c2e66e9aa9a40b0aef4535d31a3d77c377ec27e85765d952a2f99d03aef3c67fb9f9b05bd57919a90ed19fa4e114384ac672d606e965dd
Content-Length: 180

{"data":{"angbao_sn":"GsjM7AxZuXu652qDyWBDnTvATO9EFsGl"},"meta":{"os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","source":"shopee","device_ip":"192.168.137.245"}}


SAMPLE RESPONSE

HTTP/2 200 OK
Server: SGW
Date: Thu, 09 Nov 2023 14:58:46 GMT
Content-Type: application/json
Content-Length: 591
X-Ratelimit-Limit: 1214
X-Ratelimit-Remaining: 1212
X-Request-Id: 014952a209b970d627e83db0f84ca100
X-Resp-Code: 0
X-Timestamp-Ms: 1699541926968

{"code":0,"data":{"request_id":"","errcode":0,"debug_msg":"Success","refund_order_sn":"","total_receive_amount":"0","total_refund_amount":"0","receive_amount":"600000","angbao_type":2,"sender_detail":{"display_name":"fitriamarina","profile_picture":"67ea59e286dd0cc34c6f2c7b2d0da323"},"success_claim_angbao_details":[],"virtual_card_image_url":"https://cf.shopee.co.id/file/2715495671684292022.png","description":"Semoga beruntung!","total_angbao_num":1,"is_angbao_sender":false,"expired_time":1699618596,"virtual_card_image_colour":"hsl(168,43%,33%)","total_send_amount":"600000"},"msg":""}





CLAIM DAGET



BUAT X TOKEN

CURL

curl -i -s -k -X $'POST' \
    -H $'Host: api.gw.airpay.co.id' -H $'Content-Length: 399' \
    --data-binary $'{\"meta\":{\"source\":\"shopee\",\"longitude\":\"106.72562044\"},\"data\":{\"device_info\":{\"device_os\":2,\"device_id\":\"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=\",\"shopee_version\":\"30707\"},\"refresh_token\":\"7c7e7128c87b27683e7f1a589ab601cb68fa307777b5e651b42e3d91f0fda11189ecea4e3c2ed557f55ef553f65110ce8858361a9276312ef345c139547312caac238f0c3014b8c900860ebb5713f8f04bfc8215b87c19a474c6a34c51ee86a6590c957f01\"}}' \
    $'https://api.gw.airpay.co.id/user/v1/spw/token/refresh'

BURP REQUEST

POST /user/v1/spw/token/refresh HTTP/2
Host: api.gw.airpay.co.id
Content-Length: 399

{"meta":{"source":"shopee","longitude":"106.72562044"},"data":{"device_info":{"device_os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","shopee_version":"30707"},"refresh_token":"7c7e7128c87b27683e7f1a589ab601cb68fa307777b5e651b42e3d91f0fda11189ecea4e3c2ed557f55ef553f65110ce8858361a9276312ef345c139547312caac238f0c3014b8c900860ebb5713f8f04bfc8215b87c19a474c6a34c51ee86a6590c957f01"}}



SAMPLE RESPONSE

HTTP/2 200 OK
Server: SGW
Date: Sun, 12 Nov 2023 11:19:46 GMT
Content-Type: application/json
Content-Length: 303
X-Ratelimit-Limit: 200
X-Ratelimit-Remaining: 187
X-Request-Id: 83b0f33909f2bb1978dfd7144e64e800
X-Resp-Code: 0
X-Timestamp-Ms: 1699787986015

{"code":0,"data":{"access_token":"c5d824ad147bbaff09a57b41892adffcbd905056ed22f6741ce29d422c44ab3fa12846291ea8fad4997073c6ff0ad3c13e045e715eada701f0bec6001c99f878785ad64e0b4ff330fb1c7a4ba237bafb33f23fa089cbb8fdaba2208d2153fde1d503a05a48","access_token_expire_at":"1699790431","uid":"39415118"},"msg":""}








BUAT ORDER SN, ANGPAO_SN DIAMBIL DARI KODE LINK

CURL

curl -i -s -k -X $'POST' \
    -H $'Host: api.gw.airpay.co.id' -H $'X-Token: e0a6ea0d5a1270e3d5b168f98f9a5601abbffd9c80251bf9a7f5a816be3d70bdaa96eea070c1e63cf4decfc1f912c2e66e9aa9a40b0aef4535d31a3d77c377ec27e85765d952a2f99d03aef3c67fb9f9b05bd57919a90ed19fa4e114384ac672d606e965dd' -H $'Content-Length: 185' \
    --data-binary $'{\"data\": {\"angbao_sn\":\"bcj3WPqcE3PToJvaUUHsNj8omaqGTY2Z\"},\"meta\":{\"os\":2,\"device_id\":\"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=\",\"source\":\"shopee\",\"device_ip\":\"192.168.137.245\"}}\x0d\x0a\x0d\x0a' \
    $'https://api.gw.airpay.co.id/wallet/v1/angbao_send_parent/validate'


BURP REQUEST


POST /wallet/v1/angbao_send_parent/validate HTTP/2
Host: api.gw.airpay.co.id
X-Token: e0a6ea0d5a1270e3d5b168f98f9a5601abbffd9c80251bf9a7f5a816be3d70bdaa96eea070c1e63cf4decfc1f912c2e66e9aa9a40b0aef4535d31a3d77c377ec27e85765d952a2f99d03aef3c67fb9f9b05bd57919a90ed19fa4e114384ac672d606e965dd
Content-Length: 185

{"data": {"angbao_sn":"bcj3WPqcE3PToJvaUUHsNj8omaqGTY2Z"},"meta":{"os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","source":"shopee","device_ip":"192.168.137.245"}}



SAMPLE RESPONSE

HTTP/2 200 OK
Server: SGW
Date: Thu, 09 Nov 2023 15:03:44 GMT
Content-Type: application/json
Content-Length: 353
X-Ratelimit-Limit: 1416
X-Ratelimit-Remaining: 1415
X-Request-Id: 6ee4cddc09b9828e4e370a8c25a3f300
X-Resp-Code: 547
X-Timestamp-Ms: 1699542224237

{"code":547,"data":{"request_id":"","errcode":547,"debug_msg":"user has claimed","order_sn":"UWSE5KPM2ULXJJYQWRCRIS3UAFVLM","expired_time":0,"description":"","sender_detail":null,"virtual_card_image_url":"https://cf.shopee.co.id/file/2715495671684292022.png","virtual_card_image_colour":"hsl(168,43%,33%)","kyc_business_id":""},"msg":"user has claimed"}





CLAIM DAGET DARI ORDER_SN HASIL DARI RESPONSE FIELD ORDER_SN DIATAS

CURL

curl -i -s -k -X $'POST' \
    -H $'Host: api.gw.airpay.co.id' -H $'X-Token: e0a6ea0d5a1270e3d5b168f98f9a5601abbffd9c80251bf9a7f5a816be3d70bdaa96eea070c1e63cf4decfc1f912c2e66e9aa9a40b0aef4535d31a3d77c377ec27e85765d952a2f99d03aef3c67fb9f9b05bd57919a90ed19fa4e114384ac672d606e965dd' -H $'Content-Length: 190' \
    --data-binary $'\x0d\x0a{\"data\":{\"send_parent_order_sn\":\"UWSET55ULAPQDV5OTJYSVGIXAMGCM\"},\"meta\":{\"os\":2,\"device_id\":\"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=\",\"source\":\"shopee\",\"device_ip\":\"192.168.137.245\"}}' \
    $'https://api.gw.airpay.co.id/wallet/v1/angbao_receive/create_order'


BURP REQUEST

POST /wallet/v1/angbao_receive/create_order HTTP/2
Host: api.gw.airpay.co.id
X-Token: e0a6ea0d5a1270e3d5b168f98f9a5601abbffd9c80251bf9a7f5a816be3d70bdaa96eea070c1e63cf4decfc1f912c2e66e9aa9a40b0aef4535d31a3d77c377ec27e85765d952a2f99d03aef3c67fb9f9b05bd57919a90ed19fa4e114384ac672d606e965dd
Content-Length: 190


{"data":{"send_parent_order_sn":"UWSET55ULAPQDV5OTJYSVGIXAMGCM"},"meta":{"os":2,"device_id":"T0b8NPdcLYVdqf1PpwSKFRg3QIK27mLpJ3a3UqcPXSg=","source":"shopee","device_ip":"192.168.137.245"}}


SAMPLE RESPONSE

HTTP/2 200 OK
Server: SGW
Date: Thu, 09 Nov 2023 15:09:40 GMT
Content-Type: application/json
Content-Length: 524
X-Ratelimit-Limit: 166
X-Ratelimit-Remaining: 165
X-Request-Id: 2a7aa16c09b997c49109725697c9de00
X-Resp-Code: 547
X-Timestamp-Ms: 1699542580123

{"code":547,"data":{"errcode":547,"debug_msg":"user has claimed","order":{"order_id":"1018383740725118","order_sn":"UWSE5KPM2ULXJJYQWRCRIS3UAFVLM","client_id":1,"user_id":"39415118","related_order_id":"1018378428248078","reference_id":"1000032402438665118","order_type":16,"amount":"300000","fee_amount":"0","order_status":7,"order_substatus":0,"create_time":1699541936,"update_time":1699541936,"completed_time":1699541936,"metadata":"","callback_status":0,"fund_transactions":[],"fail_reason":""}},"msg":"user has claimed"}
