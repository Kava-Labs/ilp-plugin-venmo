"use strict";

const VenmoAPI = require('./venmo-api.js')
// Define these in your PATH
const venmo_email = process.env.VENMO_EMAIL
const venmo_pass = process.env.VENMO_PASS


async function sendMoney(
        api_email, api_pass, destinationUsername, amount) {
    let venmo = await new VenmoAPI(api_email, api_pass)
    await venmo.connect()
    let balance = await venmo.getBalance()
    if (balance < amount) {
        console.log("Insufficient funds.")
        return
    }
    await venmo.sendMoney(destinationUsername, amount)
    await venmo.disconnect()
}


sendMoney(venmo_email, venmo_pass, "ruaridh", 0.10)


