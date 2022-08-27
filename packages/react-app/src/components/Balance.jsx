import React, { useState } from "react";
import { useBalance } from "eth-hooks";

const { utils } = require("ethers");

export default function Balance(props) {
  const balance = useBalance(props.provider, props.address);
  let floatBalance = parseFloat("0.00");
  let usingBalance = balance;

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
        fontFamily: "futura",
      }}
    >
      {balanceToShow}
    </span>
  );
}
