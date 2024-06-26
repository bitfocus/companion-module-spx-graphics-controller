'use strict'
const { InstanceBase, Regex, runEntrypoint, InstanceStatus } = require('@companion-module/base')
const { SPXConnection } = require('./connectionClass')

/**
 * @typedef {Object} SPXConfig - type of config
 * @property {string} host - host IP of SPX GC
 * @property {string} port - port
 * @property {number} pollInterval - poll Interval
 */

/**
 * @class SPXModuleType
 * @augments InstanceBase
 */
class SPXModuleType extends InstanceBase {
	constructor() {
		/**@type {SPXConfig} */
		this.config = {}
		/**@type {SPXConnection} */
		this.connection = {}
	}
}
module.exports = {
	SPXModuleType,
}
