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

First, deploy to the network of your choosing, here I chose Polygon.
Note: The following is an example deployment, not the final one.

```bash
yarn deploy

  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/hardhat deploy
  $ hardhat deploy --export-all ../react-app/src/contracts/hardhat_contracts.json
  Compiling 15 files with 0.8.4
  Compilation finished successfully
  Deploying TOKEN contract...
  Deployer account: 0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA
  deploying "Token" (tx: 0x9b112ddccf3163be17b87181d8d5afbb8f34e9b85d521dbd60634ad671acff6b)...: deployed at 0xDD6b46a008f737d0a21F9c5a330bf520C312979c with 2584025 gas
  TOKEN Deployed to address: 0xDD6b46a008f737d0a21F9c5a330bf520C312979c
  Deploying FORGING contract...
  deploying "Forging" (tx: 0xe44cc20514a962c064133013702722bffc02731132341e5e290dad47688a986c)...: deployed at 0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82 with 1220606 gas
  FORGING Deployed to address: 0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82
  Transfer ownership from deployer on Token to Contract...
  Owner of the Token contract: 0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA
  All done
  ✨  Done in 18.35s.
```

Then, verify the Token and Forging contracts by running the following two commands:

First, verify the Token address:

```bash
yarn verify 0xDD6b46a008f737d0a21F9c5a330bf520C312979c

  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/hardhat verify 0xDD6b46a008f737d0a21F9c5a330bf520C312979c
  $ hardhat verify 0xDD6b46a008f737d0a21F9c5a330bf520C312979c
  Nothing to compile
  Compiling 1 file with 0.8.4
  Successfully submitted source code for contract
  contracts/Token.sol:Token at 0xDD6b46a008f737d0a21F9c5a330bf520C312979c
  for verification on the block explorer. Waiting for verification result...

  Successfully verified contract Token on Etherscan.
  https://polygonscan.com/address/0xDD6b46a008f737d0a21F9c5a330bf520C312979c#code
  ✨  Done in 24.74s.
```

Then, verify the Forging address (note how I pass in the address to the token address as a constructor argument):

```bash
yarn verify 0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82 "0xDD6b46a008f737d0a21F9c5a330bf520C312979c"

  yarn run v1.22.19
  $ yarn workspace @scaffold-eth/hardhat verify 0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82 0xDD6b46a008f737d0a21F9c5a330bf520C312979c
  $ hardhat verify 0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82 0xDD6b46a008f737d0a21F9c5a330bf520C312979c
  Nothing to compile
  Compiling 1 file with 0.8.4
  Successfully submitted source code for contract
  contracts/Forging.sol:Forging at 0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82
  for verification on the block explorer. Waiting for verification result...

  Successfully verified contract Forging on Etherscan.
  https://polygonscan.com/address/0x89D99019B1ee1f5A5Df99C9e8B78c7b427a16d82#code
  ✨  Done in 40.83s.
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
          domain: productive-dock.surge.sh
          upload: [====================] 100% eta: 0.0s (21 files, 29292806 bytes)
            CDN: [====================] 100%
      encryption: *.surge.sh, surge.sh (266 days)
              IP: 138.197.235.123

    Success! - Published to productive-dock.surge.sh

  ✨  Done in 8.15s.
```

That is it. When I ran this in the final actual context I got the following website detials:
The website is now live at the address: <a href="https://soggy-hen.surge.sh/">soggy-hen.surge.sh</a>!

## Acknowledgements

This project is built on Scaffold-ETH, see this link: https://github.com/scaffold-eth/scaffold-eth

The Scaffold-ETH project made it possible to create this DeFi game in a few days of concentrated development.

It was a great experience and I learned a ton building it! Shoutout to the Scaffold-ETH team and project at large!

## Contact
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/cryptojesperk.svg?style=social&label=Follow%20%40cryptojesperk)](https://twitter.com/cryptojesperk)


## License
This project uses the following license: [MIT](https://github.com/bisguzar/twitter-scraper/blob/master/LICENSE).
