const { UDPHelper } = require('@companion-module/base')

module.exports = {
	initVariables: function () {
		this.defaultVariablesDefinitions = []
		this.defaultVariablesDefinitions.push({ variableId: 'preview_ID', name: 'ID of preview' })
		for (let i = 1; i <= 20; i++) {
			this.defaultVariablesDefinitions.push({
				variableId: `program_layer_${i}_ID`,
				name: `ID of Program on webplayout #${i}`,
			})
		}

		this.setVariableDefinitions(this.defaultVariablesDefinitions)
		// this.fetchUpdateVariables()

		if (this.config.pollInterval != undefined && Number(this.config.pollInterval) > 250) {
			setInterval(() => {
				this.fetchUpdateVariables()
			}, Number(this.config.pollInterval))
		}
	},
	fetchUpdateVariables() {
		const SPXUrl = `http://${this.config.host}:${this.config.port}`
		const apiPostfix = `api/v1`

		const getlayerstate = `getlayerstate`
		const getRundown = 'rundown/get'
		// this.log('info', 'Getting info from active web layers...')
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
				this.setVariableValues(changes)
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
				this.setVariableDefinitions(this.defaultVariablesDefinitions.concat(rundownVariablesDefinitions))
				this.setVariableValues(changes)
			})
	},
	checkVariableDefinitionExistance(variableId) {
		let isExist = false

		return isExist
	},
	updateVariablesFromSocket: function (data) {
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

		this.log('info', `Recieved: ${JSON.stringify(data)}`)
		this.setVariableValues(changes)

		this.fetchUpdateVariables()
		// this.log('warn', this.getVariableValue('preview_ID'))
		// this.setVariableDefinitions(this.defaultVariablesDefinitions)
	},
}

// TODO:
// 1. INIT: collect all info before start (layers active, layers in preview)
// 2. ADD rundown based variables (memners, it's fields etc...)
