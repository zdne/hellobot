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
        Messenger.sendMessage(userProfile.profileId, buildProfileViewMessage(userProfile), (err) => {
            if (err) 
                return Messenger.reportSendErr(err)
                
            Messenger.sendMessage(userProfile.profileId, { text: buildProfileText(userProfile) }, (err) => {
                if (err)
                    return Messenger.reportSendErr(err)
            })     
        })        
    }
}

function buildProfileText(userProfile) {
    return `
First name: ${userProfile.firstName}
Last name: ${userProfile.lastName}
Time zone: ${userProfile.timezone}
Gender: ${userProfile.gender}
Age: ${userProfile.age}
Preference: ${userProfile.sexPreference}
`
}

function buildProfileViewMessage(userProfile) {
    const SuggestionMessage = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": `${userProfile.firstName} (${userProfile.age})`,
                        "image_url": `${userProfile.profilePic}`,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Change Picture",
                                "payload": "change"
                            }                            
                        ]
                    }
                ]
            }
        }
    }
    
    return SuggestionMessage   
}

module.exports = {
    isCommand,
    handleCommand 
}
