
import {useState} from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';  
import SimpleAMM from "./abi/SimpleAMM.json"; // Import the ABI of the SimpleAMM contract
import MyToken1 from "./abi/MyToken1.json"; // Import the ABI of MyToken1 contract
import MyToken2 from "./abi/MyToken2.json"; // Import the ABI of MyToken2 contract  

const AMM_ADDRESS = "0x995BdAbf69ad5B38a4605f04f960EfE38EB4ad13";
const TOKEN1_ADDRESS = "0x45e5d089D4702Bf5Dd001F8cd8b336Fcfd8f6508";
const TOKEN2_ADDRESS = "0x8Ec5d08A7DD1fD37bA5073CDb82b8C03fDC3c8D9";



//lưu dữ liệu động: địa chỉ ví, số dư token, số lượng token muốn swap, kết quả giao dịch
function App() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("0");
  const [result, setResult] = useState("");
  const [balance1, setBalance1] = useState("0");
  const [balance2, setBalance2] = useState("0");
  const [poolBalance1, setPoolBalance1] = useState(0);
  const [poolBalance2, setPoolBalance2] = useState(0);

  // ket noi metamask, lay dia chi vi dang dung
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum); //Yêu cầu Metamask cấp quyền
      const signer = await provider.getSigner(); //Yêu cầu Metamask cấp quyền
      setAccount(await signer.getAddress()); //lay dia chi vi dang dung
      LoadBalances(await signer.getAddress()); //load so du cua vi
    }
  }
  //load so du cua vi và pool
  const LoadBalances = async (address) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const token1 = new Contract(TOKEN1_ADDRESS, MyToken1.abi, provider);
      const token2 = new Contract(TOKEN2_ADDRESS, MyToken2.abi, provider);
      const poolBalance1 = await token1.balanceOf(AMM_ADDRESS);
      const poolBalance2 = await token2.balanceOf(AMM_ADDRESS);
      setPoolBalance1(formatUnits(poolBalance1, 18)); // Chuyển đổi số dư pool sang định dạng dễ đọc
      setPoolBalance2(formatUnits(poolBalance2, 18)); // Chuyển đổi số dư pool sang định dạng dễ đọc
      setBalance1(formatUnits(await token1.balanceOf(address), 18)); // Lấy số dư của Token1
      setBalance2(formatUnits(await token2.balanceOf(address), 18)); // Lấy số dư của Token2
    } catch (error) {
      console.error("Error loading balances:", error);
      setResult("Lỗi khi tải số dư: " + error.message);
    }
  }

  //Swap TokenA sang TokenB
  const swapAForB = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token1 = new Contract(TOKEN1_ADDRESS, MyToken1.abi, signer);
      const token2 = new Contract(TOKEN2_ADDRESS, MyToken2.abi, signer);
      const amm = new Contract(AMM_ADDRESS, SimpleAMM.abi, signer);
      const amountIn = parseUnits(amount, 18); // Chuyển đổi số lượng nhập vào sang định dạng wei

      //Kiem tra pool con du TokenB khong
      const poolBalance2 = await token2.balanceOf(AMM_ADDRESS);
      if (poolBalance2 === 0) {
        setResult("Pool không còn TokenB để swap");
        return;
      }

      //Approve Token1 cho AMM
      let tx = await token1.approve(AMM_ADDRESS, amountIn);
      await tx.wait(); // Chờ giao dịch approve hoàn tất
      //Gọi hàm swap trong AMM
      tx = await amm.swapAForB(amountIn);
      await tx.wait(); // Chờ giao dịch swap hoàn tất
      
      setResult("Swap thành công!"); // Hiển thị kết quả
      // Cập nhật số dư sau khi swap
      LoadBalances(account);
    }
    catch (error) {
      console.error("Error swapping:", error);
      setResult("Lỗi khi swap: " + error.message);
    }
  }

  //Nạp thanh khoản vào pool
  const addLiquidity = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token1 = new Contract(TOKEN1_ADDRESS, MyToken1.abi, signer);
      const token2 = new Contract(TOKEN2_ADDRESS, MyToken2.abi, signer);
      const amm = new Contract(AMM_ADDRESS, SimpleAMM.abi, signer);

      const amountA = parseUnits("1000", 18); // Số lượng TokenA muốn nạp
      const amountB = parseUnits("1000", 18); // Số lượng TokenB muốn nạp

      //Approve Token1 và Token2 cho AMM
      let tx = await token1.approve(AMM_ADDRESS, amountA);
      await tx.wait(); // Chờ giao dịch approve hoàn tất
      tx = await token2.approve(AMM_ADDRESS, amountB);
      await tx.wait(); // Chờ giao dịch approve hoàn tất

      //Gọi hàm addLiquidity trong AMM
      tx = await amm.addLiquidity(amountA, amountB);
      await tx.wait(); // Chờ giao dịch addLiquidity hoàn tất
      alert("Nap thanh khoản thành công!");
      // Cập nhật số dư sau khi nạp thanh khoản
      LoadBalances(account);
    } catch (error) {
      console.error("Error adding liquidity:", error);
      setResult("Lỗi khi nạp thanh khoản: " + error.message);
    }
  }


   return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>AMM Swap UI (Testnet)</h2>
      {account ? (
        <>
          <div>
            <b>Pool TokenA:</b> {poolBalance1}
          </div>
          <div>
            <b>Pool TokenB:</b> {poolBalance2}
          </div>
          <div>
            <b>Ví:</b> {account}
          </div>
          <div>
            <b>Số dư TokenA:</b> {balance1}
          </div>
          <div>
            <b>Số dư TokenB:</b> {balance2}
          </div>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Nhập số lượng TokenA"
            style={{ width: "100%", margin: "12px 0" }}
          />
          <button onClick={swapAForB} style={{ width: "100%" }}>
            Swap TokenA sang TokenB
          </button>
          <button onClick={addLiquidity} style={{ width: "100%", marginTop: 10 }}>
            Nạp thanh khoản (Add Liquidity)
          </button>
          <div style={{ marginTop: 10 }}>
            <b>Kết quả:</b> {result}
          </div>
          {result && <button onClick={() => setResult("")}>Xóa kết quả</button>}
          <br />

          <div style={{ color: "green", marginTop: 10 }}>{result}</div>
        </>
          ) : (
            <button onClick={connectWallet}>Kết nối MetaMask</button>
          )}
    </div>
    
  );
}

export default App;
