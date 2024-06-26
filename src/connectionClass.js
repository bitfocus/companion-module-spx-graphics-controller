// @ts-check
const EventEmitter = require('events')
const { InstanceStatus } = require('@companion-module/base')
const { io } = require('socket.io-client')
const { SPXModuleType } = require('./types')

class SPXConnection extends EventEmitter {
	/**
	 * @constructor
	 * @param {SPXModuleType} instance - parent instance of SPX Module.
	 */
	constructor(instance) {
		super()
		/** Parent instamce of SPX Module
		 * @type {SPXModuleType}
		 */
		this.instance = instance
		/** Connection Status
		 * @type {InstanceStatus}
		 * @public
		 */
		this.status = InstanceStatus.Disconnected
		/** Socket IO instance
		 * @type {import("socket.io-client").Socket | null  }
		 * @private
		 */
		this.socket = null
		/** Name of Companion module for SPX GC
		 * @type {string}
		 * @private
		 */
		this.name = 'Companion-SPX-Module'
		this.init()
	}
	init() {
		this.log('info', `Connecting to SPX-GC: http://${this.instance.config.host}:${this.instance.config.port}...`)
		this.updateStatus(InstanceStatus.Connecting)
		setTimeout(() => {
			if (this.status != InstanceStatus.Ok) {
				this.reconnectToSPX()
			}
		}, 5000)
		this.socket = io(`http://${this.instance.config.host}:${this.instance.config.port}`)
		this.socket.on('connect', () => {
			this.log('info', `SPX-GC Connected: ${this.socket?.id}`)
			this.isConnected = true
			this.updateStatus(InstanceStatus.Ok)
			if (this.socket != null) {
				this.socket.emit('SPXMessage2Server', { spxcmd: 'identifyClient', name: this.name })
			}
			this.emit('connect')
		})
		this.socket.on('SPXMessage2Client', (data) => {
			this.emit('SPXMessage2Client', data)
		})

		this.socket.on('SPXMessage2Controller', (data) => {
			// this is message for web controller. Recieved if someone make some external api request
			this.log('debug', `SPXMessage2Controller: ${JSON.stringify(data)}`)
		})
		this.socket.on('disconnect', () => {
			this.log('info', `Disconnected from SPX-GC`)
			this.isConnected = false
			this.updateStatus(InstanceStatus.Disconnected)
			this.reconnectToSPX()
			this.emit('disconnect')
		})
		this.socket.on('connect_error', (error) => {
			if (this.socket?.active) {
				// temporary failure, the socket will automatically try to reconnect
			} else {
				// the connection was denied by the server
				// in that case, `socket.connect()` must be manually called in order to reconnect
				this.log('warn', error.message)
			}
		})
	}
	/** Reconnects to SPX
	 * @private
	 */
	reconnectToSPX() {
		this.log('info', `Reconnecting to SPX GC...`)
		if (this.status != InstanceStatus.Ok) {
			if (this.socket != null) {
				this.socket.disconnect()
			}
			this.init()
		}
	}
	/**
	 * Connection log.
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
	SPXConnection,
}
