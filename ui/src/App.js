import './App.css';
import NavBar from './components/NavBar';
import { useState } from 'react';
import { ethers } from 'ethers'
import { Banner } from './components/Banner';
function App() {
  const [defaulterrorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet')
  const ConnWalletHandler = () => {
    console.log("hello");
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
        accountChangeHandler(result[0])
        setConnButtonText("Wallet Connected")
      })
    }
    else {
      const confirmDownload = window.confirm("You need to install MetaMask to use this wallet. Do you want to download it now?");
      if (confirmDownload) {
        window.location.href = "https://metamask.io/download.html";}
    }
  }
  const accountChangeHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString())
  }
  const getUserBalance = (address) => {
    window.ethereum.request({method:'eth_getBalance',params:[address,'latest']}).then(balance=>{
      setUserBalance(ethers.utils.formatEther(balance));
    })
  }
  const chainChangeHandler=()=>{
    window.location.reload();
  }
  window.ethereum.on('accountsChanged', accountChangeHandler);
  window.ethereum.on('chainChanged', chainChangeHandler);

  return (
    <div className="App">
      <NavBar connectHandler={ConnWalletHandler} connButtonText={connButtonText}/>
      <Banner/>
    </div>
  );
}

export default App;
