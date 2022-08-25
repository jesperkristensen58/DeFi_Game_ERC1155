<div align="center">
  <h1> Welcome to The Forge of Chains DeFi ERC1155 Game!</h1>

<img src="./background2.jpg" width="640"/>
</div>

This game lets you forge weaponry from raw materials.
See which weapons you can forge by combining various base elements!

The backend is 2 smart contracts, one called "Token.sol" and the other called "Forging.sol".
The token contract is an ERC1155 contract which handles all the minting and burning.

The forging contract handles all forgin logic, how elements are combined, etc.

## How to run this Game locally

```bash
git clone git@github.com:jesperkristensen58/DeFi_Game_ERC1155.git
cd DeFi_Game_ERC1155

yarn install
yarn chain
```
In a second terminal window run this:
```bash
cd DeFi_Game_ERC1155
yarn start
```
Now start a third terminal window and run:
```bash
cd DeFi_Game_ERC1155
yarn deploy
```

Now look at `localhost:3000`, the app will spin up there.

## Deployment to Polygon

First, deploy to the network of your choosing, here I chose Polygon:

```bash
yarn deploy

  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/hardhat deploy
  $ hardhat deploy --export-all ../react-app/src/contracts/hardhat_contracts.json
  Nothing to compile

  Deploying TOKEN contract...
  Deployer account: 0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA
  deploying "Token" (tx: 0xa6d187b95741c93687d0cd193837291aabd428df2215b8720d6ffe79a1721745)...: deployed at 0x252cD9F4652B4373485279BBc87b8C304b1bf04e with 2465818 gas
  TOKEN Deployed to address: 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  Deploying FORGING contract...
  deploying "Forging" (tx: 0x723a18676bcfbf3bcf987dd627c036c99b2d28cd9171b5683b1276d898100881)...: deployed at 0x36AD0C50E153D09E807274e698E12573c01B1c49 with 1220606 gas
  FORGING Deployed to address: 0x36AD0C50E153D09E807274e698E12573c01B1c49
  Transfer ownership from deployer on Token to Contract...
  Owner of the Token contract: 0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA
  All done
  ✨  Done in 16.08s.
```

Then, verify the Token and Forging contracts by running the following two commands:

First, verify the Token address:

```bash
yarn verify 0x252cD9F4652B4373485279BBc87b8C304b1bf04e

  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/hardhat verify 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  $ hardhat verify 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  Nothing to compile
  Compiling 1 file with 0.8.4
  Successfully submitted source code for contract
  contracts/Token.sol:Token at 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  for verification on the block explorer. Waiting for verification result...

  Successfully verified contract Token on Etherscan.
  https://polygonscan.com/address/0x252cD9F4652B4373485279BBc87b8C304b1bf04e#code
  ✨  Done in 131.82s.
```

Then, verify the Forging address (note how I pass in the address to the token address as a constructor argument):

```bash
yarn verify 0x36AD0C50E153D09E807274e698E12573c01B1c49 "0x252cD9F4652B4373485279BBc87b8C304b1bf04e"

  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/hardhat verify 0x36AD0C50E153D09E807274e698E12573c01B1c49 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  $ hardhat verify 0x36AD0C50E153D09E807274e698E12573c01B1c49 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  Nothing to compile
  Compiling 1 file with 0.8.4
  Successfully submitted source code for contract
  contracts/Forging.sol:Forging at 0x36AD0C50E153D09E807274e698E12573c01B1c49
  for verification on the block explorer. Waiting for verification result...

  Successfully verified contract Forging on Etherscan.
  https://polygonscan.com/address/0x36AD0C50E153D09E807274e698E12573c01B1c49#code
  ✨  Done in 27.98s.
```

Then build the frontend with:

```bash
yarn build
```

And finally deploy the frontend with:

```bash
yarn surge
  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/react-app surge
  warning package.json: No license field
  $ cp build/index.html build/200.html && surge ./build

    Running as jespertoftkristensen@gmail.com (Student)

          project: ./build
          domain: smelly-parcel.surge.sh
          upload: [====================] 100% eta: 0.0s (21 files, 29292434 bytes)
              CDN: [====================] 100%
      encryption: *.surge.sh, surge.sh (266 days)
              IP: 138.197.235.123

    Success! - Published to smelly-parcel.surge.sh

  ✨  Done in 6.78s.
```

I got the lucky name of "smelly-parcel" for my URI.

## Acknowledgements

This project is built on Scaffold-ETH, see this link: https://github.com/scaffold-eth/scaffold-eth

The Scaffold-ETH project made it possible to create this DeFi game in a few days of concentrated development.

It was a great experience and I learned a ton building it! Shoutout to the Scaffold-ETH team and project at large!

## Contact
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/cryptojesperk.svg?style=social&label=Follow%20%40cryptojesperk)](https://twitter.com/cryptojesperk)


## License
This project uses the following license: [MIT](https://github.com/bisguzar/twitter-scraper/blob/master/LICENSE).
