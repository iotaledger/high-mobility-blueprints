# High-Mobility IOTA MAM Stream Integration Example

This demonstration app shows how you can use the High Mobility SDK in combination with Masked Authentication Messaging on the IOTA Tangle.
The app consists of a sender and a receiver. The sender monitors a Car (emulator) through the High Mobility API and sends GPS coordinates
to a restricted MAM stream on the IOTA tangle if they changed since the last check. The receiver app allows you to monitor this stream;
Both sender and receiver can run on totally different systems as long as they are connected to the internet.

## Requirements:

 - Node 8.9+ / 9 / 10
 - A High-Mobility App Client Certificate
 - A High-Mobility Emulator Access Certificate

## How to run:

 - Replace the Client Certificate and Emulator Access Certificate in src/sender.js
 - Run `npm install` once to install the dependencies
 - Run `npm run sender`
 - Copy the `npm run receiver XXXXXX` command from the console output
 - Run that command in another terminal window to monitor the MAM Stream
 - While having the sender running emulate a ride in the High Mobility Emulator for new GPS coordinates

## External resources

 - High-Mobility documentation / SDK Reference: https://high-mobility.com/learn
 - IOTA.js source code and documentation: https://github.com/iotaledger/iota.js
