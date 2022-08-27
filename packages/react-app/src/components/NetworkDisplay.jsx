import { Alert, Button, Modal } from "antd";
import { React, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { NETWORK } from "../constants";

function NetworkDisplay({
  NETWORKCHECK,
  localChainId,
  selectedChainId,
  targetNetwork,
  USE_NETWORK_SELECTOR,
  logoutOfWeb3Modal,
}) {
  let networkDisplay = "";
  if (NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId) {
    const networkSelected = NETWORK(selectedChainId);
    const networkLocal = NETWORK(localChainId);

    if (selectedChainId === 1337 && localChainId === 31337) {
      networkDisplay = (
        <Alert
          banner
          showIcon
          message="⚠️ Wrong Network ID!"
          description={
            <div>
              You have <b>chain id 1337</b> for localhost and you need to change it to <b>31337</b> to work with
              HardHat.
              <div>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</div>
            </div>
          }
          type="error"
          closable={false}
        />
      );
    } else {
      networkDisplay = (
        <Modal
          title="Vertically centered modal dialog"
          // centered
          // visible={modal2Visible}
          // onOk={() => setModal2Visible(false)}
          // onCancel={() => setModal2Visible(false)}
        >
          <p>some contents...</p>
        </Modal>
      );

      networkDisplay = (
        <Alert
          banner
          showIcon
          message="⚠️ Wrong Network!"
          description={
            <div>
              You have <b>{networkSelected && networkSelected.name}</b> selected and you need to{" "}
              <Button
                shape="round"
                danger
                onClick={async () => {
                  const ethereum = window.ethereum;
                  const data = [
                    {
                      chainId: "0x" + targetNetwork.chainId.toString(16),
                      chainName: targetNetwork.name,
                      nativeCurrency: targetNetwork.nativeCurrency,
                      rpcUrls: [targetNetwork.rpcUrl],
                      blockExplorerUrls: [targetNetwork.blockExplorer],
                    },
                  ];

                  let switchTx;
                  // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
                  try {
                    switchTx = await ethereum.request({
                      method: "wallet_switchEthereumChain",
                      params: [{ chainId: data[0].chainId }],
                    });
                  } catch (switchError) {
                    // not checking specific error code, because maybe we're not using MetaMask
                    try {
                      switchTx = await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: data,
                      });
                    } catch (addError) {
                      // handle "add" error
                    }
                  }

                  if (switchTx) {
                    console.log(switchTx);
                  }
                }}
              >
                <b>connect to {networkLocal && networkLocal.name}</b>
              </Button>
            </div>
          }
          type="error"
          closable={false}
        />
      );
    }
  }

  return networkDisplay;
}

export default NetworkDisplay;
