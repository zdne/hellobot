'use strict'
const db = require('./schema').db
const messenger = require('./messenger')

// Main message dispatcher
function messageDispatcher(event) {
    let userProfile = db.findUserProfile(event.sender.id)
         
    if(userProfile === undefined) {
        // New user
        handleNewUser(event.sender.id)
    }
    else {
        // Existing user
        messenger.sendMessage(event.sender.id, { text: `Good to see you again ${userProfile.firstName}!` }, (err) => {
            if (err)
                console.log(`error sending message: ${err}`)
        })        
    }
}

// Setup a new user
function handleNewUser(profileId) {
    messenger.getUserProfile(profileId, (err, profile) => {
        if (err) {
            console.log(`error retrieving user profile: ${err}`)
            return
        }

        let userProfile = db.addUserProfile(profile, profileId)
        messenger.sendMessage(profileId, { text: `Hello ${userProfile.firstName}, it's great to meet you!` }, (err) => {
            if (err)
                console.log(`error sending message: ${err}`)
        })
    })    
}

module.exports = {
    messageDispatcher
}