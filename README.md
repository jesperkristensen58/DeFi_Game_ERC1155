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

## Deployment to Mumbai

```bash
yarn deploy --reset

  $ yarn workspace @scaffold-eth/hardhat deploy --reset
  $ hardhat deploy --export-all ../react-app/src/contracts/hardhat_contracts.json --reset
  Nothing to compile
  Deploying TOKEN contract...
  Deployer account: 0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA
  deploying "Token" (tx: 0xd8acd59b3183727725284b1b57bfd486ea621382abe72f133b352318e6098dc7)...: deployed at 0x252cD9F4652B4373485279BBc87b8C304b1bf04e with 2070881 gas
  TOKEN Deployed to address: 0x252cD9F4652B4373485279BBc87b8C304b1bf04e
  Deploying FORGING contract...
  deploying "Forging" (tx: 0x87436dda8a55596f106d67ffdc1a055de3ee68d0616f29a81d0e875b8141506e)...: deployed at 0x36AD0C50E153D09E807274e698E12573c01B1c49 with 1052346 gas
  FORGING Deployed to address: 0x36AD0C50E153D09E807274e698E12573c01B1c49
  Transfer ownership from deployer on Token to Contract...
  Owner of the Token contract: 0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA
  All done
  ✨  Done in 23.50s.
```

## Acknowledgements

This project is built on Scaffold-ETH, see this link: https://github.com/scaffold-eth/scaffold-eth

The Scaffold-ETH project made it possible to create this DeFi game in a few days of concentrated development.

It was a great experience and I learned a ton building it! Shoutout to the Scaffold-ETH team and project at large!

## Contact
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/cryptojesperk.svg?style=social&label=Follow%20%40cryptojesperk)](https://twitter.com/cryptojesperk)


## License
This project uses the following license: [MIT](https://github.com/bisguzar/twitter-scraper/blob/master/LICENSE).
