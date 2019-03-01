# Websocket-chat

<br>

### Setup

1. npm install -g serverless (> v1.38.0)
2. npm install -g wscat

#

<br>

### serverless commands & websocket contention command

1. sls deploy
2. sls remove
3. wscat -c wss://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev

#

<br>

### Test json api data

```json
{ "action": "sendMessage", "data": "hello!!!" }
```

#

<br>
<br>

<img src="https://camo.githubusercontent.com/b52d19ed03e87e155987ef9136997a08d5d8e95a/68747470733a2f2f7261776769742e636f6d2f6a7573747365727665726c6573732f617765736f6d652d7365727665726c6573732f6d61737465722f6c6f676f2d7365727665726c6573732e6a7067" align="center" width="300" data-canonical-src="https://rawgit.com/justserverless/awesome-serverless/master/logo-serverless.jpg" style="max-width:100%;padding: 10px 50%;">
