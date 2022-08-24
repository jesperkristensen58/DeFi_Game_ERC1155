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

## Acknowledgements

This project is built on Scaffold-ETH, see this link: https://github.com/scaffold-eth/scaffold-eth

The Scaffold-ETH project made it possible to create this DeFi game in a few days of concentrated development.

It was a great experience and I learned a ton building it! Shoutout to the Scaffold-ETH team and project at large!

## Contact
[![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/cryptojesperk.svg?style=social&label=Follow%20%40cryptojesperk)](https://twitter.com/cryptojesperk)


## License
This project uses the following license: [MIT](https://github.com/bisguzar/twitter-scraper/blob/master/LICENSE).
