'use strict'
const Messenger = require('./messenger')

const Command = {
    Help: /^\s*help/i,
    ViewMyProfile: /^\s*profile/i
}

function isCommand(text) {    
    return Object.keys(Command).find((key) => {
        if (Command[key].test(text))
            return true
    })
}

function handleCommand(userProfile, command) {
    if (Command[command] === Command.Help) {
        Messenger.sendMessage(userProfile.profileId, { text: `Here is your help :-p.` }, (err) => {
            if (err) 
                return Messenger.reportSendErr(err)
        })
    }
    else if (Command[command] === Command.ViewMyProfile) {
        Messenger.sendMessage(userProfile.profileId, { text: `Here is your profile.` }, (err) => {
            if (err) 
                return Messenger.reportSendErr(err)
        })        
    }
}

module.exports = {
    isCommand,
    handleCommand 
}
