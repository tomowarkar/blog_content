[参考youtube](https://www.youtube.com/watch?v=LOn1GUsjOF4&t=3s)

# サーバーを立てる
```
$ make dev
```
# エンドポイント
```
GET /ping
GET /newsfeed
POST /newsfeed
```
# GET /ping
### response
```
{"hello":"Found me"}
```
# GET /newsfeed
### response
```
[]
```
# POST /newsfeed
### header
```
{
  "Content-Type" : "application/json"
}
```

### body
```
{ 
  "title": "",
  "post": ""
}
```