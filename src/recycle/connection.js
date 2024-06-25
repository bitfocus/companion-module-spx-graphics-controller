const { InstanceStatus } = require('@companion-module/base')
const { io } = require('socket.io-client')

module.exports = {
	initConnection: function () {
		this.isConnected = false
		this.log('info', `Connecting to SPX-GC: http://${this.config.host}:${this.config.port}...`)
		this.updateStatus(InstanceStatus.Connecting)
		setTimeout(() => {
			if (!this.isConnected) {
				this.reconnectToSPX()
			}
		}, 5000)

		this.socket = io(`http://${this.config.host}:${this.config.port}`)
		this.socket.on('connect_error', (error) => {
			if (this.socket.active) {
				// temporary failure, the socket will automatically try to reconnect
			} else {
				// the connection was denied by the server
				// in that case, `socket.connect()` must be manually called in order to reconnect
				this.log('warn', error.message)
			}
		})
		this.socket.on('connect', () => {
			this.log('info', `SPX-GC Connected: ${this.socket.id}`)
			this.isConnected = true
			this.updateStatus(InstanceStatus.Ok)
			this.socket.emit('SPXMessage2Server', { spxcmd: 'identifyClient', name: 'Companion-SPX-Module' })
		})

		// this.socket.on('SPXMessage2Client', (data) => {
		// 	this.updateVariablesFromSocket(data)
		// })

		this.socket.on('disconnect', () => {
			this.log('info', `Disconnected from SPX-GC`)
			this.isConnected = false
			this.updateStatus(InstanceStatus.Disconnected)
			this.reconnectToSPX()
		})
	},
	reconnectToSPX: function () {
		this.log('info', `Reconnect message...`)
		if (!this.isConnected) {
			this.socket.disconnect()
			this.initConnection()
		}
	},
}
