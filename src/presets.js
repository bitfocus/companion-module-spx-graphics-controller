const fetch = require('node-fetch')

module.exports.initPresets = function (instance) {
	let presets = [
		{
			category: 'Playback',
			label: 'Start',
			bank: {
				style: 'text',
				text: 'Start',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'play' }]
		},
		{
			category: 'Playback',
			label: 'Stop',
			bank: {
				style: 'text',
				text: 'Stop',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'stop' }]
		},
		{
			category: 'Playback',
			label: 'Continue',
			bank: {
				style: 'text',
				text: 'Continue',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'continue' }]
		},
		{
			category: 'Playback',
			label: 'Stop All Layers',
			bank: {
				style: 'text',
				text: 'Stop All',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'stopAllLayers' }]
		},
		{
			category: 'Navigation',
			label: 'First',
			bank: {
				style: 'text',
				text: 'First',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'focusFirst' }]
		},
		{
			category: 'Navigation',
			label: 'Next',
			bank: {
				style: 'text',
				text: 'Next',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'focusNext' }]
		},
		{
			category: 'Navigation',
			label: 'Previous',
			bank: {
				style: 'text',
				text: 'Previous',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'focusPrevious' }]
		},
		{
			category: 'Navigation',
			label: 'Last',
			bank: {
				style: 'text',
				text: 'Last',
				size: '18',
				color: '16777215',
				bgcolor: this.rgb(0, 0, 0),
			},
			actions: [{ action: 'focusLast' }]
		},


	]

	return [
		...presets,
		...rundownPlay(this.rundownItems)
	]
}

function rundownPlay(rundownItems) {
	if (rundownItems == undefined) {
		rundownItems = []
	}
	return rundownItems.map((item) => {
		return {
			category: 'Play manual Rundown Items',
			label: "Play " + item.title,
			bank: {
				style: 'text',
				text: item.title,
				size: '14',
				color: '16777215',
				bgcolor: "#000000",
			},
			actions: [{
				action: 'play_ID',
				options: {
					id: item.itemID,
				}
			}]
		}
	})
}
/**
 * this function will get the Rundown JSON from a new rundown/get api
 * @param {String} host 
 * @param {Integer} port 
 * @returns the rundown Items with id and title or []
 */
module.exports.getRundown = async function (host, port) {
	try {
		const response = await fetch(`http://${host}:${port}/api/v1/rundown/get`)
		const rundown = await response.json();
		return convertRundown(rundown)
	}
	catch (error){
		// we might add error handling if the Rundown Feature is in use a lot.
	}
	return []
}

/**
 * this function converts the Rundown to only itemID and title
 * this will help to add more advanced methods
 * to decide how to create the title form the fields
 * @param {RundownObject} rundown 
 * @returns an array of {itemID: String, title: String}
 */
function convertRundown(rundown) {
	if(rundown["templates"] == undefined){
		return []
	}
	const templates = rundown.templates.filter((template) => {
		return template.out == "manual"
	})
	const ret = templates.map((template) => {
		const fields = template.DataFields.filter((field) => {
			return field.ftype == "textfield"
		})
		return {
			itemID: template.itemID,
			title: fields[0].value
		}
	})
	return ret
}
module.exports.convertRundown = convertRundown