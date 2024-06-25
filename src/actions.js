module.exports = {
	// Define and expose available actions to SPX
	initActions: function () {
		let self = this
		let actions = {}

		actions.play = {
			name: 'Start focused item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.play_ID = {
			name: 'Start item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '0123456789',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}
		actions.customApiFunc = {
			name: 'Run custom API function',
			options: [
				{
					type: 'textinput',
					label: 'api',
					id: 'api',
					default: 'item/play',
				},
				{
					type: 'dropdown',
					label: 'method',
					id: 'method',
					choices: [
						{ id: 'GET', label: 'GET' },
						{ id: 'POST', label: 'POST' },
					],
					default: 'GET',
				},
				{
					type: 'textinput',
					label: 'Body',
					id: 'body',
					default: '',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.continue = {
			name: 'Continue focused item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.continue_ID = {
			name: 'Continue item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '0123456789',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.stop = {
			name: 'Stop focused item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.stop_ID = {
			name: 'Stop item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '0123456789',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.focusFirst = {
			name: 'Focus on the first item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.focusNext = {
			name: 'Focus on the next item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.focusPrevious = {
			name: 'Focus on the previous item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.focusLast = {
			name: 'Focus on the last item',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.focus_ID = {
			name: 'Focus on item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '0123456789',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}
		actions.stopAllLayers = {
			name: 'Stop all layers',
			options: [],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.openRundown = {
			name: 'Open rundown',
			options: [
				{
					type: 'textinput',
					label: 'project/file',
					id: 'rundown',
					default: 'MyFirstProject/MyFirstRundown',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.controlRundownItem = {
			name: 'Play/Stop/Continue an item from a known rundown',
			options: [
				{
					type: 'textinput',
					label: 'Project/file',
					id: 'file',
					default: 'MyFirstProject/MyFirstRundown',
				},
				{
					type: 'textinput',
					label: 'Id',
					id: 'id',
					default: '0123456789',
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'command',
					choices: [
						{ id: 'play', label: 'Play' },
						{ id: 'stop', label: 'Stop' },
						{ id: 'continue', label: 'Continue' },
					],
					default: 'play',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.directplayout = {
			name: 'Direct playout',
			options: [
				{
					type: 'textinput',
					label: 'JSON body',
					id: 'body',
					default:
						'"casparServer": "OVERLAY", "casparChannel": "1", "casparLayer": "20", "webplayoutLayer": "20", "relativeTemplatePath": "vendor/pack/templatefile.html", "command": "play"',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		actions.invokeTemplateFunction = {
			name: 'Invoke template function',
			options: [
				{
					type: 'textinput',
					label: 'playserver',
					id: 'playserver',
					default: 'OVERLAY',
				},
				{
					type: 'textinput',
					label: 'playchannel',
					id: 'playchannel',
					default: '1',
				},
				{
					type: 'textinput',
					label: 'playlayer',
					id: 'playlayer',
					default: '19',
				},
				{
					type: 'textinput',
					label: 'webplayout',
					id: 'webplayout',
					default: '19',
				},
				{
					type: 'textinput',
					label: 'prepopulated',
					id: 'prepopulated',
					default: 'true',
				},
				{
					type: 'textinput',
					label: 'relpath',
					id: 'relpath',
					default: 'we_need_some_filename_here_to_prevent_errors.html',
				},
				{
					type: 'textinput',
					label: 'command',
					id: 'command',
					default: 'invoke',
				},
				{
					type: 'textinput',
					label: 'customFunction',
					id: 'customFunction',
					default: 'myCustomTemplateFunction',
				},
				{
					type: 'textinput',
					label: 'params',
					id: 'params',
					default: 'Hello World',
				},
			],
			callback: function (action) {
				self.doAction(action)
			},
		}

		self.setActionDefinitions(actions)
	},

	// Select action and make API call
	doAction: function (act) {
		const opt = act.options
		let cmd, method

		switch (act.actionId) {
			case 'play':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/item/play`
				break
			case 'play_ID':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/item/play/${opt.id}`
				break
			case 'continue':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/item/continue`
				break
			case 'continue_ID':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/item/continue/${opt.id}`
				break
			case 'stop':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/item/stop`
				break
			case 'stop_ID':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/item/stop/${opt.id}`
				break
			case 'focusFirst':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/focusFirst`
				break
			case 'focusNext':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/focusNext`
				break
			case 'focusPrevious':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/focusPrevious`
				break
			case 'focusLast':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/focusLast`
				break
			case 'focus_ID':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/focusByID/${opt.id}`
				break
			case 'stopAllLayers':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/stopAllLayers`
				break
			case 'openRundown':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/rundown/load?file=${opt.rundown}`
				break
			case 'directplayout':
				method = 'POST'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/directplayout`
				break
			case 'invokeTemplateFunction':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/invokeTemplateFunction?playserver=${opt.playserver}&playchannel=${opt.playchannel}&playlayer=${opt.playlayer}&webplayout=${opt.webplayout}&function=${opt.customFunction}&params=${opt.params}`
				break
			case 'controlRundownItem':
				method = 'GET'
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/controlRundownItemByID?file=${opt.file}&item=${opt.id}&command=${opt.command}`
				break
			case 'customApiFunc':
				method = `${opt.method}`
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/${opt.api}`
				break
		}
		console.log(cmd)

		if (cmd != undefined) {
			switch (method) {
				case 'GET':
					this.parseVariablesInString(cmd).then((cmd) => {
						fetch(cmd)
							.then((res) => res.text())
							.then((body) => this.log('info', body))
							.catch((err) => console.log(err))
					})
					break

				case 'POST':
					console.log(JSON.stringify(opt.body))
					this.parseVariablesInString(cmd).then((cmd) => {
						fetch(cmd, {
							method: 'post',
							body: JSON.stringify(opt.body),
							headers: { 'Content-Type': 'application/json' },
						})
							.then((res) => res.text())
							.then((body) => this.log('info', body))
							.catch((err) => console.log(err))
					})
					break
			}
		}
	},
}
