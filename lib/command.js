'use strict'
const Messenger = require('./messenger')

const HelpString = `Hi, I am Hello Bot. I understand the following commands:

"help" – print this help
"profile" – print your profile
    
Just type them in the chat and hit send.

–

    Hello Bot v1.0.0
    Made in the ❤ of Europe
    ©2016 FRFFR
`

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
        Messenger.sendMessage(userProfile.profileId, { text: HelpString }, (err) => {
            if (err) 
                return Messenger.reportSendErr(err)
        })
    }
    else if (Command[command] === Command.ViewMyProfile) {
        Messenger.sendMessage(userProfile.profileId, { text: buildProfile(userProfile) }, (err) => {
            if (err) 
                return Messenger.reportSendErr(err)
        })        
    }
}

function buildProfile(userProfile) {
    
    return `Here is your profile, ${userProfile.firstName}:

First name: ${userProfile.firstName}
Last name: ${userProfile.lastName}
Profile picture: ${userProfile.profilePic}
Time zone: ${userProfile.timezone}
Gender: ${userProfile.gender}
Age: ${userProfile.age}
Preference: ${userProfile.sexPreference}
`
}

module.exports = {
    isCommand,
    handleCommand 
}
