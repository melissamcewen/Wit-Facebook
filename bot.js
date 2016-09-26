'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const Config = require('./const.js');
const FB = require('./facebook.js');


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
  /*send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },*/
  send({sessionId}, {text}) {
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    //const recipientId = context._fbid_;

    const recipientId = sessions[sessionId].fbid;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, text)
      .then(() => null)
      .catch((err) => {
        console.error(
          'Oops! An error occurred while forwarding the response to',
          recipientId,
          ':',
          err.stack || err
        );
      });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },
  spiderFact({context, entities}) {
    return new Promise(function(resolve, reject) {
      console.log(JSON.stringify(context));
      console.log(JSON.stringify(entities));
      console.log(firstEntityValue(entities, 'intent'));

      var intent = firstEntityValue(entities, 'intent')
      if (intent === 'spider fact') {
        console.log('grabbing a spider fact');
        var wantedFact = spiderFact['facts'];
        context.fact = wantedFact[Math.floor(Math.random() * wantedFact.length)]
      } else if (intent === 'spider picture') {
        console.log('grabbing a spider picture');
        var wantedFact = spiderFact['pics'];
        context.fact = wantedFact[Math.floor(Math.random() * wantedFact.length)]
      } else {
        var wantedFact = spiderFact['default'];
        context.fact = wantedFact[Math.floor(Math.random() * wantedFact.length)]
        console.log('other');
      };
      return resolve(context);
    });
  },

};



var accessToken = Config.WIT_TOKEN;

//const client = new Wit({accessToken, actions});
//interactive(client);

const getWit = () => {
  return new Wit({accessToken, actions});
};

exports.getWit = getWit;

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