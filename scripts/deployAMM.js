async function main() {
    const [deployer] = await ethers.getSigners(); // Lấy địa chỉ ví của người triển khai hợp đồng
    const token1Address = "0x45e5d089D4702Bf5Dd001F8cd8b336Fcfd8f6508";
    const token2Address = "0x8Ec5d08A7DD1fD37bA5073CDb82b8C03fDC3c8D9";

    const AMM = await ethers.getContractFactory("SimpleAMM"); // Lấy contract factory cho AMM
    const amm = await AMM.deploy(token1Address, token2Address); // Triển khai hợp đồng AMM với địa chỉ của Token1 và Token2
    await amm.deployed(); // Chờ cho hợp đồng được triển khai xong
    console.log("AMM deployed to: ", amm.address); // In địa chỉ của hợp đồng AMM
}
// AMM contract: 0x7F94eb097E1a02E438F6a5f4d2B6Def70193cCEf
main()
    .catch((error) => {
        console.error(error); // In lỗi nếu có
        process.exit(1); // Thoát với mã lỗi 1
    });