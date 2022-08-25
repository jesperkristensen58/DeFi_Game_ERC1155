#!/usr/bin/env node
const { ethers } = require("ethers");

console.log("sending funds to: ", process.argv[2]);

const provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner();
const tx = signer.sendTransaction({to: process.argv[2], value: ethers.utils.parseEther("1.0")});

console.log(tx);

console.log("Funds sent!");
