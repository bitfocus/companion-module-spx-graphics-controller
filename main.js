const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const UpgradeScripts = require('./src/upgrades')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const { io } = require('socket.io-client')
class ModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...actions,
			...feedbacks,
			...variables,

			//...presets, //TODO: convert to companion 3
		})
	}

	async init(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		this.initActions() // export actions
		//this.updateFeedbacks() // export feedbacks
		this.initVariables() // export variable definitions
		this.log('info', `Connecting to socket http://${this.config.host}:${this.config.port}...`)
		this.socket = io(`http://${this.config.host}:${this.config.port}`)

		this.socket.on('connect', () => {
			this.log('info', `Connected: ${this.socket.id}`)
			this.updateStatus(InstanceStatus.Ok)
		})
		this.socket.on('SPXMessage2Client', (data) => {
			this.updateVariablesFromSocket(data)
		})
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'text',
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
		]
	}

	updateActions() {
		UpdateActions(this)
	}

	updateFeedbacks() {
		UpdateFeedbacks(this)
	}

	updateVariableDefinitions() {
		UpdateVariableDefinitions(this)
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts)
