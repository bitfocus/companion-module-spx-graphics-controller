var assert = require('assert');
const { expect } = require('chai');
const instance = require('..');
const { initPresets, getRundown, convertRundown } = require('../presets');


describe('Test Presets', function () {
    var presets = []
    beforeEach(async function () {
        var instance = {
            rgb: function (r, b, g) {
                return `#${r}${b}${b}`
            },
            initPresets: initPresets
        }
        presets = await instance.initPresets(instance);
        return presets
    }
    )
    it('Start and so on still in the List', async function () {
        const items = presets.map((preset) => {
            return preset.label
        })
        expect(items).to.be.an('array')
        expect(items).to.include.members([
            'Start',
            'Stop',
            'Continue',
            'Stop All Layers',
            'First',
            'Next',
            'Previous',
            'Last'
        ])
    });

});

describe('Test Rundown Presets', function () {
    var presets = []
    beforeEach(async function () {
        var instance = {
            rgb: function (r, b, g) {
                return `#${r}${b}${b}`
            },
            initPresets: initPresets,
            rundownItems: [{ itemID: '1612292117446', title: 'Testname' }]
        }
        presets = await instance.initPresets(instance);
        return presets
    }
    )
    it('Play Testname in the Preset List', async function () {
        
        const items = presets.map((preset) => {
            return preset.label
        })
        expect(items).to.be.an('array').that.includes("Play Testname")
    });

});

describe('Get rundown from SPX-GC API', async function(){
    it.skip('run against Standard local', async function(){
        const rundown = await getRundown("localhost",4000)
    })
    it('convert the Rundown JSON correct', function(){
        const rundown = {"warning":"Modifications done in the GC will overwrite this file.","smartpx":"(c) 2020-2021 SmartPX","updated":"2021-12-05T23:06:34.002Z","templates":[{"description":"Ticker","playserver":"OVERLAY","playchannel":"1","playlayer":"3","webplayout":"3","out":"manual","uicolor":"7","DataFields":[{"ftype":"instruction","value":"This is an example from the default template pack. For more templates see ▶ spxgc.com/store"},{"field":"f0","ftype":"textfield","title":"Headline","value":"LATER IN THE SHOW"},{"field":"f1","ftype":"textfield","title":"Content","value":"We will figure out how to update this manual ticker text"}],"onair":"false","dataformat":"xml","imported":"1638745537822","relpath":"smartpx/Template_Pack_1/SPX1_TICKER_MANUAL.html","itemID":"1638745575655"},{"description":"Ticker","playserver":"OVERLAY","playchannel":"1","playlayer":"3","webplayout":"3","out":"manual","uicolor":"7","DataFields":[{"ftype":"instruction","value":"This is an example from the default template pack. For more templates see ▶ spxgc.com/store"},{"field":"f0","ftype":"textfield","title":"Headline","value":"LATER IN THE SHOW 2"},{"field":"f1","ftype":"textfield","title":"Content","value":"We will figure out how to update this manual ticker text"}],"onair":"false","dataformat":"xml","imported":"1638745537822","relpath":"smartpx/Template_Pack_1/SPX1_TICKER_MANUAL.html","itemID":"1638745581074"}]}
        const items = convertRundown(rundown)
        expect(items).to.be.an('array').that.has.lengthOf(2)
        items.map((item)=>{
            expect(item).to.have.all.keys('itemID', 'title');
        })
        expect(items[0].itemID).to.be.equal('1638745575655')
        expect(items[1].itemID).to.be.equal('1638745581074')
        expect(items[0].title).to.be.equal('LATER IN THE SHOW')
        expect(items[1].title).to.be.equal('LATER IN THE SHOW 2')
    })
    it('test if convert Rundown can handle empty JSON', function(){
        const rundown = {}
        const items = convertRundown(rundown)
        expect(items).to.be.an('array').to.deep.equal([])
    })
});