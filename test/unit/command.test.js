'use strict'
const expect = require('chai').expect

const Command = require('../../lib/command')

describe('Bot Command', () => {
    describe('Command matcher', () => {
        it ('recognizes help command', () => {
            let result = Command.isCommand("help")
            expect(result).to.equal('Help')
        })
        
        it ('recognizes view my profile command', () => {
            let result = Command.isCommand("  profile")
            expect(result).to.equal('ViewMyProfile')
        })
        
        it ('will not recognize non-command text as a command', () => {
            let result = Command.isCommand(" dasdsadasdas d as help")
            expect(result).to.be.undefined
        })
        
        it ('will not recognize non-text as a command', () => {
            let result = Command.isCommand(undefined)
            expect(result).to.be.undefined
        })
    })
})
