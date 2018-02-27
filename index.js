'use strict'

const debug = require('debug')('ilp-plugin-venmo')
const AbstractBtpPlugin = require('ilp-plugin-btp')
const VenmoAPI = require('./venmo-api')


class VenmoPlugin extends AbstractBtpPlugin {
	constructor (opts) {
		this.peerVenmoUsername = opts.peerVenmoUsername // TODO rename to 'peerAddress' for compatibility with crypto plugins?
		this.venmoApi = new VenmoAPI(opts.venmoUsername,
																opts.venmoPassword)
		// TODO do we need to set assetCode and assetScale?
		this.paymentMessage = opts.paymentMessage || 'an ILP transfer by the Kava Connector.'
		// call the btp constructor
		/* BTP expects opts to be:
			{listener: {
					port: port number,
					secret: athentication secret},
			server: url of connector,
			reconnectInterval: a number}
		*/
		super(opts)
	}
	
	async _connect () {
		// Called by the AbstractBtpPlugin's `connect()` method.
		// Perform any action beyond what the btp plugin needs to do.
		// No return value needed/
		await this.venmoApi.connect()
	}
	
	async _disconnect () {
		// Called by the AbstractBtpPlugin's `disconnect()` method.
		// Perform any action beyond what the btp plugin needs to do.
		// No return value needed.
		await this.venmoApi.disconnect()
	}
	
	async sendMoney(amount) {
		// Send money through venmo.
		await this.venmoApi.sendMoney(this.peerVenmoUsername, amount, this.paymentMessage)
		// TODO have the api check the payment has actually been sent.
		// Send a btp messge type TRANSFER and return a promise for the response from the peer.
		let response = this.call(stuff)
		return response
	}
	
	async _handleMoney(from, { requestId, data }) {
		// This is called when a BTP TRANSFER type message is recieved. (in _handleIncomingBtpPacket)
		// It calls the registered moneyHandler function and returns the result.
		// _handleIncomingBtpPacket then sends back a btp message type RESPONSE with data set to the return value here
		// The structure here is copied from the _handleData function in BTP plugin.
		// Could add in verification that the payment has been recieved.
    const { ilp, protocolMap } = protocolDataToIlpAndCustom(data) // might need this.protoco

    if (!this._moneyHandler) {
      throw new Error('no money handler registered')
    }

    const response = await this._moneyHandler(ilp) // TODO pass in amount instead?
    return ilpAndCustomToProtocolData({ ilp: response })
	}
}

Plugin.version = 2
module.exports = VenmoPlugin
