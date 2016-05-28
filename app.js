'use strict'
const bodyParser = require('body-parser');
const request = require('request');

var app = require('express')();

const settings = {
    port: process.env.PORT || 3000,
    access_token: process.env.FB_PAGES_ACCESS_TOKEN || "0xdeadbeef",
    verify: process.env.FB_MESSENGER_VERIFY_TOKEN || "0xdeadbeef"
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(settings.port)
console.log(`app listening on port ${settings.port}`)

// API root
app.get('/', function (req, res) {
    res.send('this is the hello bot server')
})

// Facebook webhook verification
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === FB_MESSENGER_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('invalid verification token')
    }
})

// Handler for receiving events
app.post('/webhook', function (req, res) {
    let entries = req.body.entry

    entries.forEach((entry) => {
        let events = entry.messaging

        events.forEach((event) => {
            // handle inbound messages
            if (event.message) {
                handleMessage(event)
            }

            // handle postbacks
            if (event.postback) {
                handlePostback(event)
            }

            // handle message delivered
            // if (event.delivery) {
            //     this._handleEvent('delivery', event)
            // }

            // handle authentication
            // if (event.optin) {
            //     this._handleEvent('authentication', event)
            // }
        })
    })

    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
})

// Handle incoming message
function handleMessage(event) {
    
    getProfile(event.sender.id, function (err, profie) {
        if (err) {
            console.log(`error retrieving user profie: ${err}`)
            return
        }
                    
        sendMessage(event.sender.id, { text: `Hello ${profie.first_name}!` }, function (err) {
            if (err)
                console.log(`error sending message: ${err}`)
        })        
    })    
}

function handlePostback(event) {
    console.log('postback handle not implemented')
}

// Generic function to send message
function sendMessage(recipient, payload, cb) {
    if (!cb) cb = Function.prototype

    request({
        method: 'POST',
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: settings.access_token
        },
        json: {
            recipient: { id: recipient },
            message: payload
        }
    }, (err, res, body) => {
        if (err) return cb(err)
        if (body.error) return cb(body.error)

        cb(null, body)
    })
}


function getProfile(id, cb) {
    if (!cb) cb = Function.prototype

    request({
        method: 'GET',
        uri: `https://graph.facebook.com/v2.6/${id}`,
        qs: {
            fields: 'first_name,last_name,profile_pic,locale,timezone,gender',
            access_token: settings.access_token
        },
        json: true
    }, (err, res, body) => {
        if (err) return cb(err)
        if (body.error) return cb(body.error)

        cb(null, body)
    })
}


// Send rich message with kitten
// function kittenMessage(recipientId, text) {
//     text = text || "";
//     var values = text.split(' ');

//     if (values.length === 3 && values[0] === 'kitten') {
//         if (Number(values[1]) > 0 && Number(values[2]) > 0) {

//             var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);

//             message = {
//                 "attachment": {
//                     "type": "template",
//                     "payload": {
//                         "template_type": "generic",
//                         "elements": [{
//                             "title": "Kitten",
//                             "subtitle": "Cute kitten picture",
//                             "image_url": imageUrl,
//                             "buttons": [{
//                                 "type": "web_url",
//                                 "url": imageUrl,
//                                 "title": "Show kitten"
//                             }, {
//                                     "type": "postback",
//                                     "title": "I like this",
//                                     "payload": "User " + recipientId + " likes kitten " + imageUrl,
//                                 }]
//                         }]
//                     }
//                 }
//             };

//             sendMessage(recipientId, message);

//             return true;
//         }
//     }

//     return false;

// };