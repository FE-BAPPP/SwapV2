import { useState } from "react";
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';  
import SimpleAMM from "./abi/SimpleAMM.json";
import MyToken1 from "./abi/MyToken1.json";
import MyToken2 from "./abi/MyToken2.json";
import { Container, Box, Typography, Button, TextField, CircularProgress, Paper, Grid, Divider } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AMM_ADDRESS = "0x7A8499985f135B9dF1725f85b511CF479d632616";
const TOKEN1_ADDRESS = "0x45e5d089D4702Bf5Dd001F8cd8b336Fcfd8f6508";
const TOKEN2_ADDRESS = "0x8Ec5d08A7DD1fD37bA5073CDb82b8C03fDC3c8D9";

// tao danh sach cac token va state swap
  const TOKENS = [
    {label: "Token1", address: TOKEN1_ADDRESS, abi: MyToken1.abi, symbol: "TK1"},
    {label: "Token2", address: TOKEN2_ADDRESS, abi: MyToken2.abi, symbol: "TK2"}
  ];

function App() {
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [balance1, setBalance1] = useState("0");
  const [balance2, setBalance2] = useState("0");
  const [poolBalance1, setPoolBalance1] = useState(0);
  const [poolBalance2, setPoolBalance2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputToken, setInputToken] = useState(TOKENS[0]);
  const [outputToken, setOutputToken] = useState(TOKENS[1]);
  const [swapDirection, setSwapDirection] = useState("AtoB");


  // Kết nối ví
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        await LoadBalances(address);
        setLoading(false);
        toast.success("Kết nối ví thành công!");
      } catch (error) {
        setLoading(false);
        toast.error("Lỗi khi kết nối ví: " + error.message);
      }
    } else {
      toast.error("Vui lòng cài đặt MetaMask!");
    }
  };

  // Load balances
  const LoadBalances = async (address) => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      const token1 = new Contract(TOKEN1_ADDRESS, MyToken1.abi, provider);
      const token2 = new Contract(TOKEN2_ADDRESS, MyToken2.abi, provider);
      const poolBalance1 = await token1.balanceOf(AMM_ADDRESS);
      const poolBalance2 = await token2.balanceOf(AMM_ADDRESS);
      setPoolBalance1(formatUnits(poolBalance1, 18));
      setPoolBalance2(formatUnits(poolBalance2, 18));
      setBalance1(formatUnits(await token1.balanceOf(address), 18));
      setBalance2(formatUnits(await token2.balanceOf(address), 18));
    } catch (error) {
      toast.error("Lỗi khi tải số dư: " + error.message);
    }
  };

  // Swap
  const swap = async () => {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenIn = new Contract(inputToken.address, inputToken.abi, signer);
      const amm = new Contract(AMM_ADDRESS, SimpleAMM.abi, signer);
      const amountIn = parseUnits(amount, 18);

      // Approve tokenIn for AMM
      let tx = await tokenIn.approve(AMM_ADDRESS, amountIn);
      await tx.wait();
      
      // goi ham swap
      let swapTx;
      if (inputToken.label === "Token1") {
        swapTx = await amm.swapAForB(amountIn);
      }else {
        swapTx = await amm.swapBForA(amountIn);
      }
      await swapTx.wait();

      setResult("Swap thành công!");
      toast.success("Swap thành công!");
      await LoadBalances(account);
    } catch (error) {
      toast.error("Lỗi khi swap: " + error.message);
      setResult("Lỗi khi swap: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Nạp thanh khoản
  const addLiquidity = async () => {
    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const token1 = new Contract(TOKEN1_ADDRESS, MyToken1.abi, signer);
      const token2 = new Contract(TOKEN2_ADDRESS, MyToken2.abi, signer);
      const amm = new Contract(AMM_ADDRESS, SimpleAMM.abi, signer);

      const amountA = parseUnits("1000", 18);
      const amountB = parseUnits("1000", 18);

      let tx = await token1.approve(AMM_ADDRESS, amountA);
      await tx.wait();
      tx = await token2.approve(AMM_ADDRESS, amountB);
      await tx.wait();
      tx = await amm.addLiquidity(amountA, amountB);
      await tx.wait();

      toast.success("Nạp thanh khoản thành công!");
      await LoadBalances(account);
    } catch (error) {
      toast.error("Lỗi khi nạp thanh khoản: " + error.message);
      setResult("Lỗi khi nạp thanh khoản: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5, mb: 5 }}>
      <ToastContainer />
      <Paper elevation={4} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
          AMM Swap UI (Testnet)
        </Typography>
        {account ? (
          <Box>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">Pool Token1</Typography>
                    <Typography variant="h6" color="primary">{poolBalance1} </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="subtitle2" color="text.secondary">Pool Token2</Typography>
                    <Typography variant="h6" color="primary">{poolBalance2} </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                <b>Ví:</b> {account}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography fontSize={15}>Token1 Balance: <b>{balance1}</b></Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography fontSize={15}>Token2 Balance: <b>{balance2}</b></Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
              <Grid item xs={5}>
                <TextField
                  select 
                  label="Tu"
                  value={inputToken.label}
                  onChange={(e) => {
                    const token = TOKENS.find(t => t.label === e.target.value);
                    setInputToken(token);
                    setOutputToken(TOKENS.find(t => t.label !== e.target.value));
                  }}
                  selectProps={{ native: true }}
                  fullWidth
                  disabled={loading}
                  > 
                  {TOKENS.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                  </TextField>
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button 
                  variant="outlined"
                  onClick={() => {
                    //Dao chieu
                    const temp = inputToken;
                    setInputToken(outputToken);
                    setOutputToken(temp);

                  }}
                  disabled={loading}
                  sx={{ minWidth: 0, p: 1 }}
                ></Button>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  select
                  label="Den"
                  value={outputToken.label}
                  disabled
                  selectProps={{ native: true }}
                  fullWidth
                  >
                  {TOKENS.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                </TextField>
              </Grid>
              <TextField
                fullWidth
                label={`Nhập số lượng ${inputToken.symbol} cần swap`}
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                />
              
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={swap}
                  disabled={loading || !amount || parseFloat(amount) <= 0}
                  sx={{ py: 1.2, fontWeight: 600 }}
                  >
                  {loading ? <CircularProgress size={24} /> : "Swap Token1 ➔ Token2"}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={addLiquidity}
                  disabled={loading}
                  sx={{ py: 1.2, fontWeight: 600 }}
                  >
                  {loading ? <CircularProgress size={24} /> : "Nạp thanh khoản"}
                </Button>
              </Grid>
            </Grid>
            {result && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography color={result.startsWith("Lỗi") ? "error" : "primary"}>
                  {result}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setResult("")}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  Xóa kết quả
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Button 
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Kết nối ví MetaMask"}
          </Button>
        )}
      </Paper>
    </Container>
  );
}

export default App;
