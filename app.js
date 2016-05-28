'use strict'
const bodyParser = require('body-parser')
const request = require('request')
const Config = require('./lib/config')

var app = require('express')()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(Config.port)
console.log(`app listening on port ${Config.port}`)

// API root
app.get('/', (req, res) => {
    res.send('this is the hello bot server')
})

// Facebook webhook verification
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === FB_MESSENGER_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('invalid verification token')
    }
})

// Handler for receiving events
app.post('/webhook', (req, res) => {
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
    
    getProfile(event.sender.id, (err, profile) => {
        if (err) {
            console.log(`error retrieving user profile: ${err}`)
            return
        }
                    
        sendMessage(event.sender.id, { text: `Hello ${profile.first_name}!` }, (err) => {
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
            access_token: Config.access_token
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
            access_token: Config.access_token
        },
        json: true
    }, (err, res, body) => {
        if (err) return cb(err)
        if (body.error) return cb(body.error)

        cb(null, body)
    })
}
