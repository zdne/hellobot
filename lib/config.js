'use strict'

// Apiary Documentation:
//  1. Facebook Messenger Graph API: http://docs.facebookgraph1.apiary.io
//  2. Hello Bot API: 

// Available FB Graph API Hosts:
//  1. https://graph.facebook.com/v2.6/
//  2. https://private-74662-facebookgraph1.apiary-mock.com/v2.6
//  3. https://private-74662-facebookgraph1.apiary-proxy.com/v2.6

const Config = {
    port: process.env.PORT || 3000,
    access_token: process.env.FB_PAGES_ACCESS_TOKEN || false,
    verify: process.env.FB_MESSENGER_VERIFY_TOKEN || false,
    facebookAPIHost: process.env.FB_API_HOST || 'https://graph.facebook.com/v2.6/'
}

module.exports = Config
