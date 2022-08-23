import React, { useState } from "react";
import { useBalance } from "eth-hooks";

const { utils } = require("ethers");

/** 
  ~ What it does? ~

  Displays a balance of given address in ether & dollar

  ~ How can I use? ~

  <Balance
    address={address}
    provider={mainnetProvider}
    price={price}
  />

  ~ If you already have the balance as a bignumber ~
  <Balance
    balance={balance}
    price={price}
  />

  ~ Features ~

  - Provide address={address} and get balance corresponding to given address
  - Provide provider={mainnetProvider} to access balance on mainnet or any other network (ex. localProvider)
  - Provide price={price} of ether and get your balance converted to dollars
**/

export default function Balance(props) {

  const balance = useBalance(props.provider, props.address);
  let floatBalance = parseFloat("0.00");
  let usingBalance = balance;

  let networkname = props.networkname;

  if (typeof props.balance !== "undefined") usingBalance = props.balance;
  if (typeof props.value !== "undefined") usingBalance = props.value;

  if (usingBalance) {
    const etherBalance = utils.formatEther(usingBalance);
    parseFloat(etherBalance).toFixed(2);
    floatBalance = parseFloat(etherBalance);
  }

  let displayBalance = floatBalance.toFixed(4);

  let balanceToShow = "";
  if (props.connected) {
    balanceToShow = `You have ${displayBalance} Matic`;
  }

  return (
    <span
      style={{
        verticalAlign: "middle",
        fontSize: props.size,
        color: "white",
        fontFamily: "futura"
      }}
    >
      {balanceToShow}
    </span>
  );
}
