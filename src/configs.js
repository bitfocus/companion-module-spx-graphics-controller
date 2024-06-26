module.exports = {
	getConfigFields: function () {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This modules connects to SPX',
			},
			{
				type: 'textinput',
				label: 'Target IP',
				id: 'host',
				width: 6,
				regex: this.REGEX_IP,
				default: '127.0.0.1',
				required: true,
			},
			{
				type: 'textinput',
				label: 'Target port',
				id: 'port',
				width: 6,
				regex: this.REGEX_PORT,
				default: '5000',
				required: true,
			},
			{
				type: 'textinput',
				id: 'pollInterval',
				width: 6,
				regex: this.NUMBER,
				label: 'Poll interval (update rundown info, other info updates by websockets)',
				default: '1000',
				required: true,
			},
		]
	},
}
