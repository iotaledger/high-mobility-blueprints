// Import the High Mobility SDK, installed by yarn/npm
const HMKit = require('hmkit')

// Catch unhandled promise rejections
require('./errorhandling')

// Hack to work around using the precompiled mam library when we already have the babel polyfill in use
global._babelPolyfill = false

// Import the MAM client and Tryte conversion tools needed to encode the JSON message to Trytes
const Mam = require('../external/mam.client.js')
const { asciiToTrytes } = require('@iota/converter')

// Initialize the MAM library by providing the Node, mode and secret key to use
// A random seed is generated since we won't be providing one
// Keep in mind that if you use a dedicated seed you need to keep track of the
// state of MAM in order for the MAM stream to work correctly.
let mamState = Mam.init('https://nodes.devnet.iota.org:443')

// We are using MAM restricted mode with a shared secret in this example
const mamType = 'restricted'
const mamSecret = 'DONTSHARETHIS'

// Initialize the High Mobility SDK with our Cloud App Client Certificate
// FIXME: Change to your own HMKit Client Certificate
const hmkit = new HMKit('...',
  '...')

// The access certificate for our car simulator is defined here
// FIXME: Change to your own Vehicle Access Token
const accessToken = '...'

// You don't have to edit anything below this comment for this example

mamState = Mam.changeMode(mamState, mamType, mamSecret)

let lastCoords = null

// This function will take the High Mobility data and will publish it to the tangle
async function publish (data) {
  // We store the last sent coordinates so we won't have to send to the tangle unless we have a new position
  if (JSON.stringify(data.coordinates) === lastCoords) {
    console.log('Duplicate coordinates received, skipping...')
    return
  }

  // If these are new coordinates we create a new JSON string to send to the tangle
  console.log('Coordinates received:', data.coordinates)
  let toSend = JSON.stringify({ 'coords': data.coordinates, 'ts': new Date() })

  // Update the lastCoords variable to make sure we don't send duplicate data
  lastCoords = JSON.stringify(data.coordinates)
  console.log('Data to send to tangle:', toSend)

  // Convert the JSON to trytes and create a MAM message
  const trytes = asciiToTrytes(toSend)
  const message = Mam.create(mamState, trytes)

  // Update the MAM state to the state of this latest message
  // We need this so the next publish action knows it's state
  mamState = message.state

  // Attach the message to the MAM stream / Tangle
  try {
    await Mam.attach(message.payload, message.address)
    console.log('Attached to tangle!')
  } catch (e) {
    console.log(e)
  }

  // Display our new root to listen to
  if (mamState.channel.start === 1) {
    console.log('\r\nListen to this stream with\n\r\n\r   >  npm run receiver', message.root, '\r\n\r\n')
  } else {
    console.log('\r\nUpdated root: ', message.root, '\r\n')
  }
}

// This function polls our location through the High Mobility Node.js SDK
// We have our access certificate hard coded in here for demonstration purposes
// You can get your own access token by adding a car to your cloud app and
// looking at the "Access Token" item in the menu for that car.
async function updateLocation () {
  const accessCertificate = await hmkit.downloadAccessCertificate(accessToken)

  try {
    // Ask for the current Location based on the Auto API
    // https://high-mobility.com/learn/documentation/cloud-sdks/node-js/commands/
    const response = await hmkit.telematics.sendCommand(
      accessCertificate.getVehicleSerial(),
      hmkit.commands.VehicleLocationCommand.getLocation()
    )

    // If we receive a valid response we can publish it to our MAM stream
    publish(response.parse())
  } catch (e) {
    console.log('error', e)
  }
}

console.log('\r\n\r\nUpdating MAM stream with Porsche Cayenne location data\r\n')

// Run our updater service and let it check for a new coordinate every 30 seconds
updateLocation()
setInterval(updateLocation, 30000)
