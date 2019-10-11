var channel_token = ""
var url = "https://api.line.me/v2/bot/message/reply"
var pushUrl = "https://api.line.me/v2/bot/message/push"
var homepage = ""

function doPost(e) {
  var json = e.postData.contents
  var events = JSON.parse(json).events;
  
  events.forEach(function(event) {
    if(event.type == "follow") {
      follow(event);
      followmsg(event);
    } 
    else if(event.type == "message") {
      if(event.message.type == "text") { triggerWord(event) }
      else if(event.message.type == "location") { recPlace(event) }
    }
    else if(event.type == "unfollow") { unfollow(event) }
    else if(event.type == "postback") { postback(event) }
    
    minDbAsLogger(event);
 });
}

function postback(e) {
  if(e.postback.data == "places") {
    var bubbles = createBubbles(shuffleBubbles(6));
    var data = carouselHead(bubbles);
    postHookReply(e, [data]) 
  } 
  else if(e.postback.data == "cell3") { postHookReply(e, [aboutNoisee()]) }
  else if(e.postback.data == "cell5") { postHookReply(e, [quickReplyinfo()]) }
}

function triggerWord(e) {
  if(e.message.text == "Noiseeについて") { postHookReply(e, [aboutNoisee()]) }
  else if(e.message.text == "cell5") { postHookReply(e, [quickReplyinfo()]) }
  else if(e.message.text == "..crazyCoders") { pushMe() }
  else { postHookReply(e, [{"type": "text","text" : e.message.text + "\uDBC0\uDC39"}]) }
}




function headerOptions(method, data) {
  var hoptions = {
    "method" : method,
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channel_token
    },
    "payload" : JSON.stringify(data)
  };
  return hoptions
}

function postHookReply(e, datas) {
  var message = {
    "replyToken" : e.replyToken,
    "messages" : datas
  };
  var options = headerOptions("post", message);
  UrlFetchApp.fetch(url, options);
}

function pushInfo(to, datas) {
  var message = {
    "to" : to,
    "messages" : datas
  };
  var options = headerOptions("post", message);
  UrlFetchApp.fetch(pushUrl, options);
}

function minDbAsLogger(e) {
  var userId = e.source.userId;
  var now = new Date();
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('logger');
  ss.appendRow([userId, now, e.type, e.data]); 
}


/**pushエンジン**/
function pushMe() {
  var receivers = getAllUsers();
  //var receivers = ["Ud98e444e6192c7bf8585bb3a3505c8bd"];
  var datas = [{"type": "text","text" : "このようにpush配信を行うこともできます"},{"type": "sticker","packageId": "11539","stickerId": "52114131"}];
  receivers.forEach(function(receiver) {
    pushInfo(receiver, datas)
  });
}

function pushToAdminUser() {
  var receivers = ["Ucdb111e1dea48d945bfff4453b7ca179", "Ud98e444e6192c7bf8585bb3a3505c8bd", "Ue5e834c9d2d927b6a11386edfb0af4d7", "Ua32410e8680406ad6092eb08c1ae2d73"]
  receivers.forEach(function(receiver) {
    pushInfo(receiver, [quickReplyinfo()])
  });
}

function aboutNoisee(){
  var data = {"type": "text","text" : "Noisee(ノイシー)は静かで快適なコワーキングスペースのポータルサイトです。このアカウントでは、お近くのコワーキングスペースを探すことや、店舗の静かさを見比べること、その他お問い合わせができます😊ぜひNoisee(ノイシー)を体験してください！"}
  return data
}

function quickReplyinfo() {
  var data = {
  "type": "text",
  "text": "Noisee botの使い方",
  "quickReply": {
    "items": [
      {
        "type": "action",
        "action": {
          "type": "message",
          "label": "Noiseeについて",
          "text": "Noiseeについて"
        }
      },
      {
        "type": "action",
        "action": {
          "type": "location",
          "label": "近くの店舗を探す"
        }
      }
    ]
  }
}
    return data
}

function follow(e) {
  var userId = e.source.userId;
  var displayName = getUserName(userId);
  var now = new Date();
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('user');
  ss.appendRow([userId, displayName, now]); 
  return displayName
}

function unfollow(e) {
  var userId = e.source.userId;
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('user');
  var dat = ss.getDataRange().getValues();
  var flg = -1;
  
  for(var i=0;i<dat.length;i++){
    if(dat[i][0] === userId){//[行][列]
      ss.deleteRow(i+1);
    }
  }
}

function followmsg(e) {
  var userId = e.source.userId;
  var displayName = getUserName(userId);
  var datas = [
      {"type": "text","text" : displayName + "さんフォローありがとうございます!!静かなコワーキングスペースのポータルサイト「Noisee(ノイシー)」です。"},
      {"type": "text","text" : "このアカウントでは、お近くのコワーキングスペースを探すことや、店舗の静かさを見比べること、その他お問い合わせができます😊ぜひNoisee(ノイシー)を体験してください！"},
      {"type": "sticker","packageId": "11539","stickerId": "52114131"}
    ];
  postHookReply(e, datas)
}

function getUserName(userId) {
  var options = {"headers" : {"Authorization" : "Bearer " + channel_token}};
  var json = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userId , options);
  var displayName = JSON.parse(json).displayName;
  return displayName
}
function temp(){
  Logger.log(getUserName("U4e06d212e0ce687eff35ed645ffcea32"))

}


function getAllUsers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('user');
  var lastRow = ss.getLastRow();
  var arr = ss.getRange(2, 1, lastRow-1).getValues();
  var dat = [].concat.apply([], arr)
  return dat
}

function recPlace(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('places');
  var dat = ss.getDataRange().getValues();
  
  var place1 = [e.message.latitude * 1, e.message.longitude * 1];
  var flg = searchClosedPlace(place1, dat);
  
  var datas = [{"type": "text","text": "一番近くの店舗は"+flg[0]+"です"}, {"type": "text","text": "【"+flg[0]+"】\n"+flg[1]+"\n"+flg[2]}]
 
  postHookReply(e, datas)
}

function searchClosedPlace(place1, dat){
  var minDis = 999999;
  var flag = ["見つかりませんでした", ""];
  
  for(var i=0;i<dat.length;i++){
    var place2 = [dat[i][2], dat[i][3]]
    var dis = calcDist(place1, place2);
    
    if(dis<minDis) { 
      minDis = dis;
      flag = [dat[i][0], dat[i][1], dat[i][4]]
      //店舗,住所,url
    }
  }
  return flag
}


function calcDist(place1, place2) {
  var beki = Math.pow(place1[0]-place2[0], 2) + Math.pow(place1[1]-place2[1], 2);
  var answer = Math.pow(beki, 1/2);
  return answer
}

function rrrr(){
  var bubbles = createBubbles(shuffleBubbles(1));
  var data = carouselHead(bubbles);

  var receivers = ["Ud98e444e6192c7bf8585bb3a3505c8bd"]  
  //var receivers = ["Ucdb111e1dea48d945bfff4453b7ca179", "Ud98e444e6192c7bf8585bb3a3505c8bd", "Ue5e834c9d2d927b6a11386edfb0af4d7", "Ua32410e8680406ad6092eb08c1ae2d73"]
  receivers.forEach(function(receiver) {
    pushInfo(receiver, [data])
  });
}
function fetchImage() {
  var box = [
    "https://tomowarkar.github.io/blog_content/assets/cm_hack/carousel.001.jpeg",
    "https://tomowarkar.github.io/blog_content/assets/cm_hack/carousel.002.jpeg",
    "https://tomowarkar.github.io/blog_content/assets/cm_hack/carousel.003.jpeg",
    "https://tomowarkar.github.io/blog_content/assets/cm_hack/carousel.004.jpeg",
    "https://tomowarkar.github.io/blog_content/assets/cm_hack/carousel.005.jpeg"
  ];
  return box[Math.floor(Math.random()*5)]  
}
function shuffleBubbles(num) {
  var flg = [0,1,2,3,4,5];
  var bub = [];

  for(var i = 0; i <= num-1; i++) {
    var temp = Math.floor(Math.random()*flg.length);
    bub.push(flg[temp]);
    flg.splice(temp,1);
  }
  
  return bub
}

function carouselHead(bubbles) {
  var data = {
    "type": "template",
    "altText": "店舗情報",
    "template": {"type": "carousel","columns": bubbles,"imageAspectRatio": "rectangle","imageSize": "cover"}
  };
  return data
}

function createBubbles(indexArr){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var ss = sheet.getSheetByName('places');
  var dat = ss.getDataRange().getValues();
  
  var bubbles = [];
  
  indexArr.forEach(function(index) {
    var row = dat[index];
    var fetchImg = fetchImage();
    var bubble = createBubble(fetchImg, row);
    bubbles.push(bubble);
  });
  return bubbles
}


function createBubble(img, row){
  var bubble = {
    "thumbnailImageUrl": img,
    "title": row[0],
    "text": "所在地： "+row[1]+"\n営業時間： "+row[6],
    "defaultAction": {"type": "uri","label": "View detail","uri": row[5]},
    "actions": createActions(row[4])
  }
  return bubble
}

function createActions(mapPath) {
  var actions = [
    {"type": "uri","label": "アクセス","uri": mapPath}
  ];
  return actions
}



