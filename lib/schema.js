'use strict'

class UserProfile {
    constructor (profile, profileId) {
        this.firstName = profile.first_name
        this.lastName = profile.last_name
        this.profilePic = profile.profile_pic
        this.locale = profile.locale
        this.timezone = profile.timezone
        this.gender = profile.gender
        this.profileId = profileId
    }
}

class DB {
    constructor () {
        this.userProfiles = []
    }
    
    // Finds UserProfile by profile id
    findUserProfile(profileId) {
        return this.userProfiles.find((profile) => {
            return (profile.profileId == profileId)  
        })
    }
    
    // Adds UserProfile 
    addUserProfile(profile, profileId) {
        this.userProfiles.push(new UserProfile(profile, profileId))
    }
}

var db = new DB()

module.exports = {
    UserProfile,
    db
}
