var HTTPS = require('https');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegexKya = /(.|)*(k|K)ya!~/;
  
  var waifuPhrases = [ "It's not like I l-like you or anything...", "_-kun is so moe!", "Do you think I'm kawaii, _?",
                      "B-B-baka!", "_-senpai is the best!", "But isn't that... lewd?", "Kemy-kun is sugoi, but not as sugoi as _-senpai!", "Noooo!",
                     "Your waifu is trashfu!", "http://i.imgur.com/8JIV2U5.png", "https://pbs.twimg.com/media/CmIzPnkUoAQAG0f.png",
                     "I could never hate you, _-kun!", "Do you really mean it, _-senpai?", "Rolls? Why do they call her Rolls?", 
                     "He's not really a mummy, is he?", "Happy waifu, happy laifu!", 
                     "http://i.imgur.com/N4fJ3.jpg",
                     "I m-made you tendies _-kun. I hope you like them...", "To me, you have all the goodboy points in the world.",
                     "Hitler-sama did nothing wrong."]

  if(request.text && botRegexKya.test(request.text)) {
    this.res.writeHead(200);
    postMessage(getReturnString(waifuPhrases[getRandomInt(0,waifuPhrases.length)], request.name));
    this.res.end();
  }
  else {
    console.log("Nothing happened");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(response) {
  var botResponse,options, body, botReq;

  botResponse = response

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function getReturnString(phrase, reqName){
  var indexOfHolder = phrase.indexOf('_');
  if(indexOfHolder != -1){
    return (phrase.substr(0, indexOfHolder) + reqName + phrase.substr(indexOfHolder+1, phrase.length));
  }
  return phrase;
}  

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


exports.respond = respond;
