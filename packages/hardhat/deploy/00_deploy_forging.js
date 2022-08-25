// deploy/00_deploy_forging.js
require('dotenv').config();
const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {

  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  
  console.log("Deploying to chain id: ", chainId)

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

  console.log("Transfer ownership of the Token contract from the deployer to the Forging contract...")
  await token.transferOwnership(
    forging.address
  );

  const ownerOfToken = await token.owner();
  console.log("Owner of the Token contract: " + ownerOfToken);

  // // verify (if not localhost)
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: token.address,
  //       contract: "contracts/Token.sol:Token",
  //       constructorArguments: [],
  //     });

  //     await run("verify:verify", {
  //       address: forging.address,
  //       contract: "contracts/Forging.sol:Forging",
  //       constructorArguments: [token.address],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }

  console.log("All done!");

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

};
module.exports.tags = ["Forging"];
