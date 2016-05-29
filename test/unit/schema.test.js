'use strict'
const expect = require('chai').expect
const fs = require('fs')
const path = require('path')

const Schema = require('../../lib/schema')

describe('User Profile', () => {
    context('initialized with ctor', () => {
       
        let userProfile = null
        
        before(() => {
            const profileFixturePath = path.join(__dirname, '..', 'fixtures', 'userprofile.json')
            const profileFixture = JSON.parse(fs.readFileSync(profileFixturePath, 'utf8'))
            userProfile = new Schema.UserProfile(profileFixture)
        })
        
        it ('has correct first name', () => {
            expect(userProfile.first_name).to.equal('Peter')
        })
        
        it ('has correct last name', () => {
            expect(userProfile.last_name).to.equal('Chang')
        })        
    })
})
