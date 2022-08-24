// deploy/00_deploy_forging.js
require('dotenv').config();
const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  
  // First deploy the token
  console.log("Deploying TOKEN contract...");
  console.log("Deployer account: " + deployer);

  await deploy("Token", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  const token = await ethers.getContract("Token", deployer);
  console.log("TOKEN Deployed to address: " + token.address);

  console.log("Deploying FORGING contract...");
  await deploy("Forging", {
    from: deployer,
    args: [token.address],
    log: true,
    waitConfirmations: 5,
  });

  const forging = await ethers.getContract("Forging", deployer);
  console.log("FORGING Deployed to address: " + forging.address);

  console.log("Transfer ownership from deployer on Token to Contract...")
  await token.transferOwnership(
    forging.address
  );

  const ownerOfToken = await token.owner();
  console.log("Owner of the Token contract: " + ownerOfToken);

  console.log("All done");

  // console.log("Transfer ownership to metamask dev deployer account...");
  // const forging = await ethers.getContract("Forging", deployer);

  // Getting a previously deployed contract
  // const YourContract = await ethers.getContract("YourContract", deployer);
  /*  await YourContract.setPurpose("Hello");
  
    // To take ownership of yourContract using the ownable library uncomment next line and add the 
    // address you want to be the owner. 
    
    await YourContract.transferOwnership(
      "ADDRESS_HERE"
    );

    //const YourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["Forging"];
