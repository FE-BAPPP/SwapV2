import logo from './logo.svg';
import './App.css';
import {useState} from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';  
import SimpleAMM from "./abi/SimpleAMM.json"; // Import the ABI of the SimpleAMM contract
import MyToken1 from "./abi/MyToken1.json"; // Import the ABI of MyToken1 contract
import MyToken2 from "./abi/MyToken2.json"; // Import the ABI of MyToken2 contract  

const AMM_ADDRESS = "0x7F94eb097E1a02E438F6a5f4d2B6Def70193cCEf";
const TOKEN1_ADDRESS = "0x2cCAB83BEF317Ce6aCeB006CF883f202dd24baA2";
const TOKEN2_ADDRESS = "0xCF012C4E83c343E335d39aC32989baf3F2eB44dE";

const [amount, setAmount] = useState("0");






function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
