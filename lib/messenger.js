'use strict'
const request = require('request')
const Config = require('./config')

// Sends message to the recipient
// (https://developers.facebook.com/docs/messenger-platform/send-api-reference)
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

// Retrieves the users profile
// (https://developers.facebook.com/docs/messenger-platform/implementation#user_profile_api)
function getUserProfile(id, cb) {
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

module.exports = {
    sendMessage,
    getUserProfile
}