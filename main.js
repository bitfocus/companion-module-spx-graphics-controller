const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const configs = require('./src/configs')
const UpgradeScripts = require('./src/upgrades')
const actions = require('./src/actions')
const feedbacks = require('./src/feedbacks')
const variables = require('./src/variables')
const { SPXConnection } = require('./src/connectionClass')

class SPXModuleInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		// Assign the methods from the listed files to this class
		Object.assign(this, {
			...configs,
			// ...actions,
			// ...feedbacks,
			// ...variables,
			// ...connection,

			//...presets, //TODO: convert to companion 3
		})
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)

		// this.initConnection()
		this.connection = new SPXConnection(this)
		// this.initVariables() // export variable definitions
		// this.initActions() // export actions
		//this.updateFeedbacks() // export feedbacks
	}
	// When module gets deleted
	async destroy() {
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
	}
}

runEntrypoint(SPXModuleInstance, UpgradeScripts)
