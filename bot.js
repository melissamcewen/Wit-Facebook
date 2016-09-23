'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const recipientId = context._fbid_;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }
        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const intent = firstEntityValue(entities, 'intent');
    if (intent) {
      context.intent = intent; // store it in context
    }

    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  // fetch-weather bot executes
  ['spider-fact'](sessionId, context, cb) {
    if (context.intent === 'spider fact') {
      console.log('grabbing a spider fact');
      var wantedFact = spiderFact['facts'];
      context.fact = wantedFact[Math.floor(Math.random() * wantedFact.length)]
    } else if (context.intent === 'spider picture') {
      console.log('grabbing a spider picture');
      var wantedFact = spiderFact['pics'];
      context.fact = wantedFact[Math.floor(Math.random() * wantedFact.length)]
    } else {
      var wantedFact = spiderFact['defulat'];
      context.fact = wantedFact[Math.floor(Math.random() * wantedFact.length)]
      console.log('other');
    };
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    //var wantedPics = allPics['spiders'];
    console.log(JSON.stringify(context));

    //context.pics = wantedPics[Math.floor(Math.random() * wantedPics.length)]
    cb(context);
  },

    // fetch-weather bot executes
/*  ['spider-facts'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.fact = 'spiders are awesome';
    cb(context);
  },

  ['fetch-pics'](sessionId, context, cb) {
    //var wantedPics = allPics[context.cat || 'default']
    //console.log('watchedpics');
    context.pics = wantedPics[Math.floor(Math.random() * wantedPics.length)]

    cb(context)
  },*/

};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}

// LIST OF ALL PICS
var spiderFact = {
  facts: [
    'spiders are so cool',
    'spiders forever',
    'NEVER kill a spider or the ghost will haunt you forever',
  ],
  pics: [
    'https://i.redditmedia.com/-Zf62lfqQ9PqoF2yiiY2XWcHD3-CJR0-o2BhINUIMEY.jpg?w=768&s=a49978d533c4015bc787fdb0b77686f5',
    'http://i.imgur.com/ZwRf93U.jpg',
  ],
  default: [
     'Sorry I do not understand that yet'
  ],
};