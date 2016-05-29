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
        
        this.age = undefined
        this.sexPreference = undefined
    }
}

class DB {
    constructor () {
        this.userProfiles = []
    }
    
    // Finds UserProfile by profile id
    findUserProfile(profileId) {
        return this.userProfiles.find((userProfile) => {
            return (userProfile.profileId == profileId)  
        })
    }
    
    // Adds UserProfile 
    addUserProfile(profile, profileId) {
        let userProfile = this.findUserProfile(profileId)        
        if (userProfile === undefined) {
            userProfile = new UserProfile(profile, profileId)
            this.userProfiles.push(userProfile)
        }
        
        return userProfile
    }
}

var db = new DB()

module.exports = {
    UserProfile,
    db
}
