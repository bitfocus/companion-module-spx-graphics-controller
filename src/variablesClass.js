// @ts-check
const { InstanceStatus } = require('@companion-module/base')
const { SPXModuleType } = require('./types')

class SPXVariables {
	/**
	 * @constructor
	 * @param {SPXModuleType} instance - parent instance of SPX Module.
	 */
	constructor(instance) {
		/** Connection Status
		 * @type {SPXModuleType}
		 */
		this.instance = instance
		/** DefaultVariableDefinitions
		 * @type {import('@companion-module/base').CompanionVariableDefinition[]}
		 * @private
		 */
		this.defaultVariablesDefinitions = []
		/** currentVariableDefinitions
		 * @type {import('@companion-module/base').CompanionVariableDefinition[]}
		 * @private
		 */
		this.currentRundownVariablesDefinitions = []
		/** DefaultVariableDefinitions
		 * @type {NodeJS.Timeout | undefined}
		 * @private
		 */

		this.pollInterval = undefined
		this.init()
	}
	init() {
		this.log('info', 'Initialization of variables...')
		this.instance.connection.on('SPXMessage2Client', (data) => {
			this.messageHandler(data)
		})
		this.instance.connection.on('connect', (data) => {
			this.fetchUpdateVariables()
			if (this.instance.config.pollInterval != undefined && Number(this.instance.config.pollInterval) > 250) {
				this.pollInterval = setInterval(() => {
					this.fetchUpdateVariables()
				}, Number(this.instance.config.pollInterval))
			}
		})

		this.instance.connection.on('disconnect', (data) => {
			clearInterval(this.pollInterval)
		})

		this.defaultVariablesDefinitions.push({ variableId: 'preview_ID', name: 'ID of preview' })
		for (let i = 1; i <= 20; i++) {
			this.defaultVariablesDefinitions.push({
				variableId: `program_layer_${i}_ID`,
				name: `ID of Program on webplayout #${i}`,
			})
		}

		this.instance.setVariableDefinitions(this.defaultVariablesDefinitions)
		this.currentVariablesDefinitions = this.defaultVariablesDefinitions
	}
	fetchUpdateVariables() {
		const SPXUrl = `http://${this.instance.config.host}:${this.instance.config.port}`
		const apiPostfix = `api/v1`

		const getlayerstate = `getlayerstate`
		const getRundown = 'rundown/get'

		fetch(`${SPXUrl}/${apiPostfix}/${getlayerstate}`)
			.then((res) => {
				return res.json()
			})
			.then((layerState) => {
				let changes = {}
				if (Array.isArray(layerState)) {
					for (let i = 1; i < layerState.length; i++) {
						changes[`program_layer_${layerState[i].layer}_ID`] = layerState[i].itemID
					}
				}
				//@ts-ignore
				this.instance.setVariableValues(changes)
			})
		// this.log('info', 'Getting active rundown info...')
		fetch(`${SPXUrl}/${apiPostfix}/${getRundown}`)
			.then((res) => {
				return res.json()
			})
			.then((rundownInfo) => {
				// let changes = { test: 'test' }
				let changes = {}
				let rundownVariablesDefinitions = []

				if (rundownInfo.templates != undefined) {
					if (Array.isArray(rundownInfo.templates)) {
						rundownInfo.templates.forEach((template, index) => {
							const itemIDprefix = `rundown_item_${index + 1}`
							const itemDescPrefix = `Rundown item № ${index + 1}`
							// this.log('warn', JSON.stringify(template.description))
							rundownVariablesDefinitions.push({
								variableId: `${itemIDprefix}_description`,
								name: `${itemDescPrefix} description`,
							})
							changes[`${itemIDprefix}_description`] = template.description
							rundownVariablesDefinitions.push({
								variableId: `${itemIDprefix}_playserver`,
								name: `${itemDescPrefix} playserver`,
							})
							changes[`${itemIDprefix}_playserver`] = template.playserver
							rundownVariablesDefinitions.push({
								variableId: `${itemIDprefix}_playchannel`,
								name: `${itemDescPrefix} playchannel`,
							})
							changes[`${itemIDprefix}_playchannel`] = template.playchannel
							rundownVariablesDefinitions.push({
								variableId: `${itemIDprefix}_playlayer`,
								name: `${itemDescPrefix} playlayer`,
							})
							changes[`${itemIDprefix}_playlayer`] = template.playlayer
							rundownVariablesDefinitions.push({
								variableId: `${itemIDprefix}_webplayout`,
								name: `${itemDescPrefix} webplayout`,
							})
							changes[`${itemIDprefix}_webplayout`] = template.webplayout
							rundownVariablesDefinitions.push({ variableId: `${itemIDprefix}_onair`, name: `${itemDescPrefix} onair` })
							changes[`${itemIDprefix}_onair`] = template.onair
							rundownVariablesDefinitions.push({
								variableId: `${itemIDprefix}_itemID`,
								name: `${itemDescPrefix} itemID`,
							})
							changes[`${itemIDprefix}_itemID`] = template.itemID
						})
					}
				}

				this.deleteUnusedValues(this.currentRundownVariablesDefinitions, rundownVariablesDefinitions)
				this.currentRundownVariablesDefinitions = rundownVariablesDefinitions
				this.setAllVariablesDefinition()
				//@ts-ignore
				this.instance.setVariableValues(changes)
			})
	}
	setAllVariablesDefinition() {
		let variableDefinitionsForSet = this.defaultVariablesDefinitions.concat(this.currentRundownVariablesDefinitions)

		this.instance.setVariableDefinitions(variableDefinitionsForSet)
	}
	/** handle IO Messages from SPX Server
	 * @param {import('@companion-module/base').CompanionVariableDefinition[]} oldVariablesDefinitions
	 * @param {import('@companion-module/base').CompanionVariableDefinition[]} newVariablesDefinitions
	 * @private
	 */
	deleteUnusedValues(oldVariablesDefinitions, newVariablesDefinitions) {
		if (newVariablesDefinitions != undefined) {
			oldVariablesDefinitions.forEach((variableDefinition) => {
				let found = false
				newVariablesDefinitions.forEach((newVariableDefinition) => {
					if (newVariableDefinition.variableId === variableDefinition.variableId) {
						found = true
					}
				})
				if (!found) {
					this.instance.setVariableValues({ [`${variableDefinition.variableId}`]: undefined })
				}
			})
		}
	}
	/** handle IO Messages from SPX Server
	 * @param {any} data
	 * @private
	 */
	messageHandler(data) {
		this.log('info', `Recieved ${JSON.stringify(data)}`)
		let changes = {}
		if (data.playmode != undefined) {
			if (data.playmode === 'preview') {
				let ID = undefined

				if (data.fields != undefined) {
					if (Array.isArray(data.fields)) {
						data.fields.forEach((datafield) => {
							if (datafield.epochID != undefined) {
								ID = datafield.epochID
							}
						})
					}
				}
				changes['preview_ID'] = ID
			}
		}
		if (data.playmode != undefined) {
			if (data.playmode === 'preview') {
				let ID = undefined
				if (data.spxcmd != undefined) {
					if (data.spxcmd === 'playTemplate') {
						if (data.fields != undefined) {
							if (Array.isArray(data.fields)) {
								data.fields.forEach((datafield) => {
									if (datafield.epochID != undefined) {
										ID = datafield.epochID
									}
								})
							}
						}
						changes['preview_ID'] = ID
					}
				}
			}
		} else {
			let ID = undefined
			let layer = undefined
			if (data.spxcmd != undefined) {
				if (data.fields != undefined) {
					if (Array.isArray(data.fields)) {
						data.fields.forEach((datafield) => {
							if (data.spxcmd === 'playTemplate' || data.spxcmd === 'nextTemplate') {
								if (datafield.epochID != undefined) {
									ID = datafield.epochID
								}
							}
						})
					}
				}
				if (data.webplayout != undefined) {
					layer = Number(data.webplayout)
				}

				if (layer != undefined) {
					changes[`program_layer_${layer}_ID`] = ID
				}
			}
		}
		//@ts-ignore
		this.instance.setVariableValues(changes)
		this.fetchUpdateVariables()
	}
	/**
	 * Variables log.
	 * @param {import('@companion-module/base').LogLevel} level - log Level.
	 * @param {string} message - message
	 */
	log(level, message) {
		return this.instance.log(level, message)
	}
	/**
	 * Updating status.
	 * @param {InstanceStatus} status - log Level.
	 */
	updateStatus(status) {
		this.instance.updateStatus(status)
		this.status = status
	}
}

module.exports = {
	SPXVariables,
}
