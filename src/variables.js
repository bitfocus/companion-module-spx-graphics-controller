const { UDPHelper } = require('@companion-module/base')

module.exports = {
	initVariables: function () {
		let variables = [{ variableId: 'preview_ID', name: 'ID of preview' }]
		for (let i = 1; i < 20; i++) {
			variables.push({
				variableId: `program_layer_${i}_ID`,
				name: `ID of Program on webplayout #${i}`,
			})
		}
		this.setVariableDefinitions(variables)
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

		this.log('info', `Recieved: ${JSON.stringify(data.playmode)}`)
		this.setVariableValues(changes)
	},
}
