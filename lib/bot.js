'use strict'
const db = require('./schema').db
const ConversationTopic = require('./schema').ConversationTopic
const messenger = require('./messenger')

// Main message dispatcher
function messageDispatcher(event) {
    let userProfile = db.findUserProfile(event.sender.id)
         
    if(userProfile === undefined) {
        handleNewUser(event.sender.id)
    }
    else {
        handleConversation(userProfile, event)   
    }
}

// Setup a new user
function handleNewUser(profileId) {
    messenger.getUserProfile(profileId, (err, profile) => {
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
            break;

        case ConversationTopic.WelcomeOnBoard:
            askAboutAge(userProfile)
            break;
            
        case ConversationTopic.SettingUpAge:
            handleAgeAnswer(userProfile, event)
            break;
            
        case ConversationTopic.SettingUpSexPreference:
            askAboutSexPreference(userProfile)
            break             

        default:
            break;
    }
}

function reportSendErr(err) {
    console.error(`error sending message: ${err}`)
}

function sayWelcomeOnBoard(userProfile) {
    messenger.sendMessage(userProfile.profileId, { text: `Hello ${userProfile.firstName}, it's great to meet you!\nBefore we'll continue I would like to ask you few questions:` }, (err) => {
        if (err) 
            return reportSendErr(err)

        userProfile.conversationTopic = ConversationTopic.WelcomeOnBoard
        handleConversation(userProfile)
    })
}

function askAboutAge(userProfile) {
    messenger.sendMessage(userProfile.profileId, { text: `What is your age?` }, (err) => {
        if (err) 
            return reportSendErr(err)
        
        userProfile.conversationTopic = ConversationTopic.SettingUpAge
    })
}

function handleAgeAnswer(userProfile, event) {
    const age = Number(event.message.text)
    if (isNaN(age)) {
        messenger.sendMessage(userProfile.profileId, { text: `I didn't quite get that. Please enter a number between 18 and 99` }, (err) => {
            if (err) 
                return reportSendErr(err)    
        })
        return   
    }

    userProfile.age = age
    messenger.sendMessage(userProfile.profileId, { text: `Got it.` }, (err) => {
        if (err) 
            return reportSendErr(err)
        
        userProfile.conversationTopic = ConversationTopic.SettingUpSexPreference
        handleConversation(userProfile)
    })
}

function askAboutSexPreference(userProfile) {
    messenger.sendMessage(userProfile.profileId, { text: `Sure.` }, (err) => {
        if (err) 
            return reportSendErr(err)
    })
}

module.exports = {
    messageDispatcher
}