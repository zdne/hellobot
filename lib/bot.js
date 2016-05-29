'use strict'
const db = require('./schema').db
const ConversationTopic = require('./schema').ConversationTopic
const Messenger = require('./messenger')
const Command = require('./command')

// Main message dispatcher
function messageDispatcher(event) {
    let userProfile = db.findUserProfile(event.sender.id)

    if (userProfile === undefined) {
        handleNewUser(event.sender.id)
    }
    else {

        const command = Command.isCommand(event.message.text)
        if (command !== undefined) {
            Command.handleCommand(userProfile, command)
            return
        }

        handleConversation(userProfile, event)
    }
}

// Main postback dispatcher
function postbackDispatcher(event) {
    let userProfile = db.findUserProfile(event.sender.id)
    if (userProfile === undefined) 
        return
    
    handlePostback(userProfile, event)
}

// Setup a new user
function handleNewUser(profileId) {
    Messenger.getUserProfile(profileId, (err, profile) => {
        if (err) {
            console.error(`error retrieving user profile: ${err}`)
            return
        }

        let userProfile = db.addUserProfile(profile, profileId)
        handleConversation(userProfile)
    })
}

// Main conversation handler
function handleConversation(userProfile, event) {
    switch (userProfile.conversationTopic) {
        case ConversationTopic.NoConversation:
            sayWelcomeOnBoard(userProfile)
            break

        case ConversationTopic.WelcomeOnBoard:
            askAboutAge(userProfile)
            break

        case ConversationTopic.SettingUpAge:
            handleAgeAnswer(userProfile, event)
            break

        case ConversationTopic.SettingUpSexPreference:
            askAboutSexPreference(userProfile)
            break
            
        case ConversationTopic.Browsing:
            suggestCandidate(userProfile)
            break

        default:
            break
    }
}

// Main postback handler
function handlePostback(userProfile, event) {
    switch (userProfile.conversationTopic) {
        case ConversationTopic.SettingUpSexPreference:
            handleSexPreferencePostback(userProfile, event)
            break

        default:
            break
    }
}

function sayWelcomeOnBoard(userProfile) {
    Messenger.sendMessage(userProfile.profileId, { text: `Hello ${userProfile.firstName}, it's great to meet you!\nBefore we'll continue I would like to ask you few questions:` }, (err) => {
        if (err)
            return Messenger.reportSendErr(err)

        userProfile.conversationTopic = ConversationTopic.WelcomeOnBoard
        handleConversation(userProfile)
    })
}

function askAboutAge(userProfile) {
    Messenger.sendMessage(userProfile.profileId, { text: `First, what is your age?` }, (err) => {
        if (err)
            return Messenger.reportSendErr(err)

        userProfile.conversationTopic = ConversationTopic.SettingUpAge
    })
}

function handleAgeAnswer(userProfile, event) {
    const age = Number(event.message.text)
    if (isNaN(age)) {
        Messenger.sendMessage(userProfile.profileId, { text: `I didn't quite get that. Please enter a number between 18 and 99` }, (err) => {
            if (err)
                return Messenger.reportSendErr(err)
        })
        return
    }

    userProfile.age = age
    Messenger.sendMessage(userProfile.profileId, { text: `Got it.` }, (err) => {
        if (err)
            return Messenger.reportSendErr(err)

        userProfile.conversationTopic = ConversationTopic.SettingUpSexPreference
        handleConversation(userProfile)
    })
}

function askAboutSexPreference(userProfile) {
    Messenger.sendMessage(userProfile.profileId, SexPreferenceMessage, (err) => {
        if (err)
            return Messenger.reportSendErr(err)
    })
}

const SexPreferenceMessage = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Are you looking for a girl or boy?",
            "buttons": [
                {
                    "type": "postback",
                    "title": "Girl",
                    "payload": "female"
                },
                {
                    "type": "postback",
                    "title": "Boy",
                    "payload": "male"
                }
            ]
        }
    }
}

function handleSexPreferencePostback(userProfile, event) {
    console.log("Postback received: " + JSON.stringify(event.postback));
    
    const sexPreference = event.postback.payload
    userProfile.sexPreference = sexPreference
    
    Messenger.sendMessage(userProfile.profileId, { text: `Noted.` }, (err) => {
        if (err)
            return Messenger.reportSendErr(err)

        userProfile.conversationTopic = ConversationTopic.Browsing
        
        Messenger.sendMessage(userProfile.profileId, { text: `All set. Let's start looking...` }, null);
        
        handleConversation(userProfile)
    })
}

function suggestCandidate(userProfile) {
    Messenger.sendMessage(userProfile.profileId, { text: `I might have someone for you...` }, (err) => {
        if (err)
            return Messenger.reportSendErr(err)
    })
}

module.exports = {
    messageDispatcher,
    postbackDispatcher
    
}