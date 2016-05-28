'use strict'

const Config = {
    port: process.env.PORT || 3000,
    access_token: process.env.FB_PAGES_ACCESS_TOKEN || false,
    verify: process.env.FB_MESSENGER_VERIFY_TOKEN || false
}

module.exports = Config
