'use strict'
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')

const Schema = require('../../lib/schema')

describe('App Schema', () => {

    let profileFixture = undefined
    before(() => {
        const profileFixturePath = path.join(__dirname, '..', 'fixtures', 'userprofile.json')
        profileFixture = JSON.parse(fs.readFileSync(profileFixturePath, 'utf8'))
    })
    
    describe('User Profile', () => {
        describe('initialized with ctor', () => {
            let userProfile = null

            before(() => {
                userProfile = new Schema.UserProfile(profileFixture)
            })

            it('has correct first name', () => {
                expect(userProfile.firstName).to.equal('Peter')
            })

            it('has correct last name', () => {
                expect(userProfile.lastName).to.equal('Chang')
            })
        })
    })


    describe('Database', () => {
        describe('initialization', () => {
            it('starts with no user profile', () => {
                expect(Schema.db.userProfiles.length).to.equal(0)
            })
        })

        describe('add user profile', () => {
            before(() => {
                Schema.db.addUserProfile(profileFixture, 42)
            })

            it('has one profile', () => {
                expect(Schema.db.userProfiles.length).to.equal(1)
            })
            
            it('will not add the same profile again', () => {
                let profile = Schema.db.addUserProfile(profileFixture, 42)
                expect(profile).to.exist
                expect(Schema.db.userProfiles.length).to.equal(1)
                expect(profile.firstName).to.be.equal('Peter')
            })            
        })
        
        describe('find user by profile id', () => {
            it('finds existing id', () => {
                let profile = Schema.db.findUserProfile(42)
                expect(profile).to.exist
                expect(profile.firstName).to.be.equal('Peter')
            })
            
            it('will not find non-existent id', () => {
                let profile = Schema.db.findUserProfile(23)
                expect(profile).to.be.undefined
            })
            
        })
    })
})

