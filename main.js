const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const configs = require('./src/configs')
const UpgradeScripts = require('./src/upgrades')
const feedbacks = require('./src/feedbacks')
const { SPXConnection } = require('./src/connectionClass')
const { SPXVariables } = require('./src/variablesClass')
const { SPXActions } = require('./src/actionsClass')
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

		this.connection = new SPXConnection(this)
		this.variables = new SPXVariables(this)
		this.variables = new SPXActions(this)

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
