'use strict'

class UserProfile {
    constructor (profile) {
        this.first_name = profile.first_name
        this.last_name = profile.first_name
        this.profile_pic = profile.profile_pic
        this.locale = profile.locale
        this.timezone = profile.timezone
        this.gender = profile.gender
        this.profile_id = 0
    }
}

module.exports = {
    UserProfile
}
