import './App.css';
import NavBar from './components/NavBar';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers'
import { Banner } from './components/Banner';
import { networks } from './networks';
import Home from './components/Home';
import Web3 from 'web3'
import ZwalletContractBuild from './abi/ZWallet.json';

let zwalletcontract;
function App() {
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [isConnected, setIsConnected] = useState(false);
  const [accountName, setAccountName] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [ZcoinBalance, setZcoinBalance] = useState(0);
  let isInitialized = false;
  let web3;

  const ConnWalletHandler = async () => {
    if (window.ethereum) {
      const result = await window.ethereum.request({ method: 'eth_requestAccounts' });
      accountChangeHandler(result[0]);
      setConnButtonText("Wallet Connected");
      setIsConnected(true);

      web3 = new Web3(window.ethereum);
      web3.eth.defaultAccount = defaultAccount;
      const networkId = await web3.eth.net.getId();
      zwalletcontract = new web3.eth.Contract(ZwalletContractBuild.abi, '0x6BA6b2263DBBaa56cB4c18303CbdaCCDB891Ce66');
      zwalletcontract.options.address = '0x6BA6b2263DBBaa56cB4c18303CbdaCCDB891Ce66'; // Set the contract address
      isInitialized = true;
    } else {
      const confirmDownload = window.confirm("You need to install MetaMask to use this wallet. Do you want to download it now?");
      if (confirmDownload) {
        window.location.href = "https://metamask.io/download.html";
      }
    }
  }

  const accountChangeHandler = (newAccount) => {
    getNetworkId();
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  }

  const getNetworkId = () => {
    window.ethereum.request({ method: 'net_version' }).then(async id => {
      setNetworkName(networks[id] || "ganache");
    });
  }

  const getUserBalance = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(address);
      setUserBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error retrieving the user balance:", error);
    }
  };


  const chainChangeHandler = () => {
    window.location.reload();
  }

  window.ethereum.on('accountsChanged', accountChangeHandler);
  window.ethereum.on('chainChanged', chainChangeHandler);

  const buyTokens = async () => {
    try {
      if (!isInitialized) {
        await ConnWalletHandler();
      }
      const amountToSend = Web3.utils.toWei("1", "ether");

      const result = await zwalletcontract.methods.buyZCoin().send({
        from: defaultAccount,
        value: amountToSend,
      });

      console.log("Tokens bought:", result);
    } catch (error) {
      console.error("Error buying tokens:", error);
    }
  };

  const getZcoinBalance = async () => {
    try {
      if (!isInitialized) {
        await ConnWalletHandler();
      }

      const balance = await zwalletcontract.methods.getZCoinBalance(defaultAccount).call();
      const parsedBalance = web3.utils.toBN(balance).toString();
      setZcoinBalance(parsedBalance);
    } catch (error) {
      console.error("Error retrieving the balance:", error);
    }
  };
  const mintNFT = async (url, nftData) => {
    if (!isInitialized) {
      await ConnWalletHandler();
    }
    console.log(url);
    console.log(nftData);
    if (nftData.mintWithZTK) {
      console.log("minting with ztk");
      const id = await zwalletcontract.methods.mintNFTWithZToken(
        url,
        nftData.name,
        nftData.description,
        nftData.cost,
        nftData.isForSale
      ).send({ from: defaultAccount });
      console.log("minted");
      console.log(id);
    }

    else {
      const amountToSend = Web3.utils.toWei("1", "ether");
      await zwalletcontract.methods
        .mintNFTWithEth(
          url,
          nftData.name,
          nftData.description,
          nftData.cost,
          nftData.isForSale
        )
        .send({
          from: defaultAccount,
          value: amountToSend,
        });
    }
  }

  const getNFTs = async () => {
    if (!isInitialized) {
      await ConnWalletHandler();
    }
    const nftsNumber = await zwalletcontract.methods.tokenCounter().call();
    console.log(nftsNumber);
    const id = Math.floor(Math.random() * nftsNumber)
    console.log(id);
    const nft = await zwalletcontract.methods.allNFTs(id).call();
    console.log(nft);
    return nft;
  }
  const buyNFT = async (id) => {
    await zwalletcontract.methods.transferNFT(id).send({ from: defaultAccount });
  };


  return (
    <div className="App">
      <NavBar connectHandler={ConnWalletHandler} connButtonText={connButtonText} />
      {isConnected ? <Home buyNFT={buyNFT} user={defaultAccount} getNFT={getNFTs} mintNFTHandler={mintNFT} connectHandler={ConnWalletHandler} userBalance={userBalance} userAddress={defaultAccount} networkname={networkName} BuyToken={buyTokens} getzcoinBalance={getZcoinBalance} ZcoinBalance={ZcoinBalance} /> : <Banner />}
    </div>
  );
}

export default App;
