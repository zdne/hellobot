'use strict'
const bodyParser = require('body-parser')
const Config = require('./lib/config')
const messenger = require('./lib/messenger')

const UserProfile = require('./lib/schema').UserProfile

var app = require('express')()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(Config.port, () => {
    console.log(`app listening on port ${Config.port}`)    
})

// API root
app.get('/', (req, res) => {
    res.send('this is the hello bot server')
})

// Facebook webhook verification
app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === process.env.FB_MESSENGER_VERIFY_TOKEN) {
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

function handleMessage(event) {
    messenger.getUserProfile(event.sender.id, (err, profile) => {
        
        if (err) {
            console.log(`error retrieving user profile: ${err}`)
            return
        }

        console.log(profile)
        console.log(JSON.stringify(profile,"",0))
        user = new UserProfile(profile)
        messenger.sendMessage(event.sender.id, { text: `Hello ${user.first_name}!` }, (err) => {
            if (err)
                console.log(`error sending message: ${err}`)
        })        
    })    
}

function handlePostback(event) {
    console.log('postback handle not implemented')
}
