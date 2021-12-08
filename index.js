const instance_skel = require('../../instance_skel')
const { initPresets, getRundown } = require('./presets')
const fetch = require('node-fetch')
let debug = () => {}

class instance extends instance_skel {
	/**
	 * Create an instance of the module
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config)
		this.actions() // export actions
		
	}

	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.0.0
	 */
	actions(system) {
		const actions = {}

		actions['play'] = { label: 'Start focused item' }
		actions['continue'] = { label: 'Continue' }
		actions['stop'] = { label: 'Stop focused item' }
		actions['play_ID'] = {
			label: 'Start item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '0123456789',
				},
			],
		}
		actions['continue_ID'] = {
			label: 'Continue to item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '01234656789',
				},
			],
		}
		actions['stop_ID'] = {
			label: 'Stop item by ID',
			options: [
				{
					type: 'textinput',
					label: 'ID',
					id: 'id',
					default: '0123456789',
				},
			],
		}
		actions['focusFirst'] = { label: 'Move focus to the first item on the rundown' }
		actions['focusNext'] = { label: 'Move focus down to the next item' }
		actions['focusPrevious'] = { label: 'Move focus up to the previous item' }
		actions['focusLast'] = { label: 'Move focus to the last item on the rundown' }
		actions['stopAllLayers'] = { label: 'Animate all layers out (does not clear layers)' }
		actions['openRundown'] = {
			label: 'Open rundown from project / file.',
			options: [
				{
					type: 'textinput',
					label: 'project/file',
					id: 'rundown',
					default: 'MyFirstProject/MyFirstRundown',
				},
			],
		}
		actions['directplayout'] = {
			label: 'Execute a direct play/continue/stop -command to a template without current rundown',
			options: [
				{
					type: 'textinput',
					label: 'JSON body',
					id: 'body',
					default:
						'"casparServer": "OVERLAY", "casparChannel": "1", "casparLayer": "20", "webplayoutLayer": "20", "relativeTemplatePath": "vendor/pack/templatefile.html", "command": "play"',
				},
			],
		}
		actions['invokeTemplateFunction'] = {
			label: 'Uses an invoke handler to call a function in a template',
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
		}
		this.setActions(actions)
	}

	/**
	 * Executes the provided action.
	 *
	 * @param {Object} action - the action to be executed
	 * @access public
	 * @since 1.0.0
	 */
	async action(action) {
		const opt = action.options
		let cmd, method

		switch (action.action) {
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
				cmd = `http://${this.config.host}:${this.config.port}/api/v1/invokeTemplateFunction?playserver=${playserver}&playchannel=${playchannel}&playlayer=${playlayer}&webplayout=${webplayout}&function=${customfunction}&params=${params}`
				break
		}
		if (cmd != undefined) {
			switch (method) {
				case 'GET':
					fetch(cmd)
						.then((res) => res.text())
						.then((body) => this.log('info', body))
						.catch((err) => console.log(err))
					break

				case 'POST':
					console.log(JSON.stringify(opt.body))
					fetch(cmd, {
						method: 'post',
						body: JSON.stringify(opt.body),
						headers: { 'Content-Type': 'application/json' },
					})
						.then((res) => res.text())
						.then((body) => this.log('info', body))
						.catch((err) => console.log(err))
					break
			}
		}
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This modules connects to SPX-GC',
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
			}
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		debug('destroy', this.id)
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	init() {
		debug = this.debug

		try {
			this.status(this.STATUS_WARNING, 'Connecting')
			this.initPresets()
		} catch (e) {
			console.error(e)
		}
		this.initConnection()
	}

	/**
	 * INTERNAL: initialize presets.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	async initPresets() {
		this.rundownItems = await getRundown(this.config.host,this.config.port)
		this.setPresetDefinitions(initPresets.bind(this)())
	}

	/**
	 * INTERNAL: initalize the connection.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initConnection() {
		this.status(this.STATUS_OK, 'Connected')
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		if (this.config.host !== config.address) {
			this.status(this.STATUS_WARNING, 'Connecting')
		}

		this.config = config
		this.actions()
		this.initPresets()
		this.initConnection()
	}
}

exports = module.exports = instance
