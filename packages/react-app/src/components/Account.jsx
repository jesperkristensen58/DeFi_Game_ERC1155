import { Button } from "antd";
import React from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { PoweroffOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Balance from "./Balance";

export default function Account({
  address,
  localProvider,
  connected,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  setShowFlame
}) {

  let displayAddress;
  if (address) {
    displayAddress = address?.substr(0, 5) + "..." + address?.substr(-4);
  } else {
    displayAddress = "connecting...";
  }
  
  let accountButtonInfo;
  if (web3Modal?.cachedProvider) {
    accountButtonInfo = { state: "Logout", action: logoutOfWeb3Modal, mode: "danger" };
    setShowFlame(true);
  } else {
    accountButtonInfo = { state: "Connect", action: loadWeb3Modal, mode: "" };
    setShowFlame(false);
  }

  const display = !minimized && (
    <span>
      <Balance address={address} provider={localProvider} price={price} size={16} connected={connected} />
    </span>
  );

  return (
    <div>
      {display}
      {web3Modal && (accountButtonInfo.state == "Logout" ? (
        <>
        <Button style={{ marginLeft: 12 }} ghost shape="round" onClick={accountButtonInfo.action} danger icon={<PoweroffOutlined />}>
          {displayAddress}
        </Button>
        </>
      ) : (
        <Button style={{ marginLeft: 12 }} ghost shape="round" onClick={accountButtonInfo.action} icon={<PlayCircleOutlined />}>
          {accountButtonInfo.state}
        </Button>
      ))}
    </div>
  );
}
