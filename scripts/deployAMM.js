async function main() {
    const [deployer] = await ethers.getSigners(); // Lấy địa chỉ ví của người triển khai hợp đồng
    const token1Address = "0x2cCAB83BEF317Ce6aCeB006CF883f202dd24baA2";
    const token2Address = "0xCF012C4E83c343E335d39aC32989baf3F2eB44dE";

    const AMM = await ethers.getContractFactory("SimpleAMM"); // Lấy contract factory cho AMM
    const amm = await AMM.deploy(token1Address, token2Address); // Triển khai hợp đồng AMM với địa chỉ của Token1 và Token2
    await amm.deployed(); // Chờ cho hợp đồng được triển khai xong
    console.log("AMM deployed to: ", amm.address); // In địa chỉ của hợp đồng AMM
}

main()
    .catch((error) => {
        console.error(error); // In lỗi nếu có
        process.exit(1); // Thoát với mã lỗi 1
    });