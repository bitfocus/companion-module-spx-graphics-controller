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
			actions: [{	action: 'play'}]
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
			actions: [{	action: 'stop'}]
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
			actions: [{	action: 'continue'}]
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
			actions: [{	action: 'stopAllLayers'}]
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
			actions: [{	action: 'focusFirst'}]
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
			actions: [{	action: 'focusNext'}]
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
			actions: [{	action: 'focusPrevious'}]
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
			actions: [{	action: 'focusLast'}]
		},
	
	
	]



	return presets
}
