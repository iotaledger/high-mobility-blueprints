# High-Mobility IOTA Integration Example - Payment and Charging

This demonstration app shows how you can use the High Mobility SDK in combination with IOTA transactions to pay for charging.

As you will see in the code, the Vehicle sends 1 IOTA to the Charger. After some time the transaction is confirmed and the vehicle starts the charging process. Once the transaction is confirmed you can see the startCharging command in the Vehicle emulator’s console log in your browser.

## Requirements:

 - Node 8.9+
 - A High-Mobility App Client Certificate
 - High-Mobility Emulator Access Certificates for a Vehicle and a Charger
 - An IOTA seed with test net tokens for the vehicle and another seed for the Charger

## How to run:

 - Replace the Client Certificate and Emulator Access Certificates (for Vehicle and Charger), as well as the seeds for the Vehicle and Charger in src/app.js
 - Open two tabs in your browser: One with your High Mobility Vehicle emulator and one with your High Mobility Charger Emulator.
 - Run `npm install` once to install the dependencies
 - Run `npm start`

## External resources

 - High-Mobility documentation / SDK Reference: https://high-mobility.com/learn
 - IOTA.js source code and documentation: https://github.com/iotaledger/iota.js

## How to get test tokens

How to get test tokens:

1.) First read about IOTA seeds and addresses: https://docs.iota.org/introduction/iota-token/seeds-private-keys-accounts

2.) Generate two seeds - one for the vehicle and one for the charger.

You can do this for example by using these commands in the terminal:

Linux Terminal
`cat /dev/urandom |tr -dc A-Z9|head -c${1:-81}`

macOS Terminal
`cat /dev/urandom |LC_ALL=C tr -dc 'A-Z9' | fold -w 81 | head -n 1`

Please do not use seeds on the mainnet, that were previously used on the testnet and vice versa!

3.) Generate an address from the vehicle seed:

To start we need to create a working directory:

`mkdir iota-example && cd iota-example`

Once in our directory we can use Node Package Manager (NPM) to fetch and install the required Node.js libraries for IOTA to the folder:

`npm install iota.lib.js --save`

This will result in a package.json file and a node_modules folder being created in your directory. After this we will create a 

new file called index.js in the current folder with the following contents:

```
const IOTA = require('iota.lib.js')
  
const iota = new IOTA({ provider: 'https://nodes.devnet.iota.org:443' })

let seed = 'PUTVEHICLESEEDHEREPUTVEHICLESEEDHEREPUTVEHICLESEEDHEREPUTVEHICLESEEDHEREPUTVEHICLESEE'

let addresses = iota.api.getNewAddress(seed, {index: 0 , total: 1, security: 2, checksum: true, returnAll: false},(error, success) => {
  if (error) {
    console.log(error)
  } else {
    console.log(success[0])
  }
});
```

Make sure you replace the seed in the file with the vehicle seed that you just generated.

After saving the file you can run this code using this command:

`node index.js`

This should give you an address.

4.) With this address go to https://faucet.devnet.iota.org/ and request some test net tokens.

## On pending transactions

My transaction has been pending for a long time, what is the problem?

New transactions choose two tips to validate randomly, so sometimes transactions, through no fault of their own, are simply unlucky and not selected for validation. This is a natural, expected and indeed important behavior of the Tangle. Because the algorithm for choosing tips favors fresh (newly issued) tips, if your transaction was not confirmed in the first few minutes, it is very likely it will never be confirmed without doing Reattach and/or Promote.

For more information on how to promote and reattach transactions using the IOTA Javascript library please take a look at isPromotable, promoteTransaction and attachToTangle on the iota.js reference page: https://github.com/iotaledger/iota.js/blob/next/api_reference.md
