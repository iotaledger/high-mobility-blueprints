// Hack to work around using the precompiled mam library when we already have the babel polyfill in use
global._babelPolyfill = false

// Catch unhandled promise rejections
require('./errorhandling')

// Import the MAM client and Tryte conversion tools need to encode the JSON message to Trytes
const Mam = require('@iota/mam')
const { trytesToAscii } = require('@iota/converter')

// Initialize the MAM library by providing the Node, mode and secret key to use
const mamType = 'restricted'
const mamSecret = 'DONTSHARETHIS'

// We keep track of our current and next root so we know what to listen to and when to
// output data to the screen
let root = null
let nextRoot = process.argv[2]

// Display coordinate data on our screen when we receive it
function showData (raw) {
  const data = JSON.parse(trytesToAscii(raw))
  console.log(data.ts, '-', data.coords)
}

// Connect to the IOTA node using this function
async function initMam () {
  console.log('\r\n\r\n')
  console.log('Listening to MAM stream for Porsche Cayenne Location Data...')
  console.log('\r\n')
  await Mam.init('https://nodes.devnet.iota.org:443')
}

// Check the MAM stream every 5 seconds for new data on the current root
// If a new root is returned we'll monitor that one from there on.
async function checkMam () {
  if (root !== nextRoot) {
    root = nextRoot
  }

  // The showData callback will be called in order for each message found
  const data = await Mam.fetch(root, mamType, mamSecret, showData)
  nextRoot = data.nextRoot

  // Check again in 5 seconds
  setTimeout(checkMam, 5000)
}

// Start the monitoring!
initMam()
checkMam()
