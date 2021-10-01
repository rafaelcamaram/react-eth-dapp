import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import Token from './artifacts/contracts/Token.sol/RCToken.json';

const greeterAddress = '0x3Aa5ebB10DC797CAC828524e59A333d0A371443c';
const tokenAddress = '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d';

function App() {
  const [greeting, setGreetingValue] = useState();
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  const requestAccount = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);

      try {
        const data = await contract.greet();
        console.log({ data });
      } catch (err) {
        console.log({ err });
      }
    }
  };

  const setGreeting = async () => {
    if (!greeting) return;

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      await transaction.wait();
      fetchGreeting();
    }
  };

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const balance = await contract.balanceOf(account);
      console.log('Balance: ', balance.toString());
    }
  };

  const getTotalSupply = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
      const totalSupply = await contract.totalSupply();
      console.log('Total Supply: ', totalSupply.toString());
    }
  };

  const sendCoins = async () => {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={(e) => setGreetingValue(e.target.value)} placeholder="Set greeting" />
        <br />
        <button onClick={getTotalSupply}>Get Total Supply</button>
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input onChange={(e) => setUserAccount(e.target.value)} placeholder="Account ID" />
        <input onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      </header>
    </div>
  );
}

export default App;
