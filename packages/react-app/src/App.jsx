import { Button, Col, Menu, Row, Modal } from "antd";
import "antd/dist/antd.css";
import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";
import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import React, { useCallback, useEffect, useState } from "react";
import { Link, Route, Switch, useLocation } from "react-router-dom";
import "./App.css";
import {
  Account,
  Contract,
  Faucet,
  Header,
} from "./components";

import { NETWORKS, ALCHEMY_KEY } from "./constants";
import externalContracts from "./contracts/external_contracts";

/****************************************************************************************
 *  CONTRACTS
 ****************************************************************************************/
import deployedContracts from "./contracts/hardhat_contracts.json";
import { Transactor, Web3ModalSetup } from "./helpers";
import { useStaticJsonRPC } from "./hooks";

/****************************************************************************************
 *  THE APP
 ****************************************************************************************/
 import { Home } from "./views"; // the main app

 const { ethers } = require("ethers");

/// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature

const web3Modal = Web3ModalSetup();

/****************************************************************************************
 *  THE APP
 ****************************************************************************************/
function App(props) {
  // specify all the chains the app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mumbai"];

  /****************************************************************************************
  *  DEFINE STATE
  ****************************************************************************************/
  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState(); // the address is set below where we call "setAddress" in a function after getting userSigner  
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const [modalVisible, setModalVisible] = useState(true);
  const [showFlame, setShowFlame] = useState(false);

  const targetNetwork = NETWORKS[selectedNetwork];

  // load all your providers
  const localProvider = useStaticJsonRPC([targetNetwork.rpcUrl]);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // How to log out from the Web3 Modal must then be called from a button or whatever:
  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");

  // Use your injected provider from 🦊 Metamask, get the signer here:
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  // get the address of the signer from the userSigner object:
  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId = userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // The transactor wraps transactions and provides notifications
  const tx = Transactor(userSigner, gasPrice);

  let yourLocalBalance = useBalance(localProvider, address);

  const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(userSigner, contractConfig);
  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  //
  // 🧫 DEBUG 👨🏻‍🔬
  //
  useEffect(() => {
    if (
      DEBUG &&
      address &&
      selectedChainId &&
      yourLocalBalance &&
      readContracts &&
      writeContracts
    ) {
      console.log("_____________________________________ 🏗 scaffold-eth _____________________________________");
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("💵 yourLocalBalance", yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : "...");
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [
    address,
    selectedChainId,
    yourLocalBalance,
    readContracts,
    writeContracts,
    localChainId
  ]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  // make faucet available when on local network
  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const connect = async () => {

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
  }

  // ****************************************************************
  //
  //                    RETURN THE APP
  //
  // ****************************************************************
  return (
    <div className="App">

      {/* ✏️ Edit the header and change the title to your project name */}
      <Header showFlame={showFlame}>


        {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flex: 1 }}>
            <Account
              useBurner={USE_BURNER_WALLET}
              address={address}
              localProvider={localProvider}
              connected={selectedChainId && localChainId == selectedChainId}
              web3Modal={web3Modal}
              loadWeb3Modal={loadWeb3Modal}
              logoutOfWeb3Modal={logoutOfWeb3Modal}
              setShowFlame={setShowFlame}
            />
          </div>
        </div>

      </Header>
      {/* {yourLocalBalance.lte(ethers.BigNumber.from("0")) && (
        <FaucetHint localProvider={localProvider} targetNetwork={targetNetwork} address={address} />
      )} */}

        {
        NETWORKCHECK && localChainId && selectedChainId && localChainId !== selectedChainId ?
          (selectedChainId === 1337 && localChainId === 31337 ?
            <Modal
              title="Wrong Network ID!"
              centered
              visible={modalVisible}
              onOk={() => setModalVisible(false)}
              cancelButtonProps={{ style: { display: 'none' } }}
              footer={[
                <Button onClick={logoutOfWeb3Modal} type="primary">
                  Ok
                </Button>
              ]}
            >
              <p>Your localhost Network ID is 1337 and does not match that used for Hardhat which is 31337.
              Please change your network ID in Metamask using the following steps:</p>
              <p>(MetaMask -&gt; Settings -&gt; Networks -&gt; Chain ID -&gt; 31337)</p>
            </Modal>
            :
            <Modal
              title="Wrong Network!"
              centered
              visible={modalVisible}
              onOk={() => setModalVisible(false)}
              cancelButtonProps={{ style: { display: 'none' } }}
              footer={[
                <Button onClick={connect} type="primary">
                  Connect
                </Button>
              ]}
            >
              <p>You are not connected to the Matic Network. Click below to switch networks</p>
            </Modal>)
        : null
      }

      <Route exact path="/">
        {/* pass in any web3 props to this Home component. For example, yourLocalBalance */}
        <Home
          address={address}
          readContracts={readContracts}
          writeContracts={writeContracts}
          tx={tx}
          deployedContracts={deployedContracts}
          localProvider={localProvider}
        />
      </Route>

      {/* give us a faucet: NOTE: FINE TO HAVE HERE -- WONT BE SHOWN ON NON-LOCAL NETWORKS */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet localProvider={localProvider} />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
