# Cryptomon

This is a rudimentary Pokemon clone, using ERC-721 tokens to give players full ownership of their monsters. The current focus is implementing a multiplayer battle feature, rather than open world exploration.

# Setup

Requiremments:
    Truffle Suite
    Ganache
    Node/NPM
    CouchDB
    Metamask for browser (tested on Firefox)

First, run `npm install` in the api/ and client/ directories, then `npm run start`

With Ganache running, make sure the development network in truffle-config.js points toward your local chain.

In metamask extension, import an account from ganache using a private key.

Run `truffle migrate --reset` to compile contracts and deploy to your local chain.

Move contents of build/contracts/ to client/src/contracts/

Update the backend variable in client/App.js to point it to your backend address (localhost if not using WSL2)

Now, opening the react frontend should open a window for metamask to confirm a transaction to mint your new token.

You can open app in a new private window and press 'Find Battle' once on each window to open a battle, allowing you to interact real time with another "player".