/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers"); // su dung thu vien ethers.js trong script va test
require("dotenv").config(); // su dung dotenv de lay thong tin tu file .env
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // Thay thế bằng Infura Project ID của bạn
      accounts: [process.env.PRIVATE_KEY], // Thay thế bằng private key của ví Ethereum của bạn
      chainId: 11155111 // Sepolia testnet chain ID
    }
  }
};
