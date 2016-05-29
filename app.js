'use strict'
const bodyParser = require('body-parser')
const Config = require('./lib/config')
const Bot = require('./lib/bot')

var app = require('express')()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(Config.port, () => {
    console.log(`app listening on port ${Config.port}`)
    console.log(`using "${Config.facebookAPIHost}" as the FB Graph API host`)
})

// API root
app.get('/', (req, res) => {
    res.send('this is the hello bot server')
})

// Facebook webhook verification
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === process.env.FB_MESSENGER_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } 
    else {
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
                Bot.messageDispatcher(event)
            }

            // handle postbacks
            if (event.postback) {
                Bot.postbackDispatcher(event)
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

