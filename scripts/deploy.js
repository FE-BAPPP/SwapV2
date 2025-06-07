async function main() {
    const [deployer] = await ethers.getSigners(); // Lấy địa chỉ ví của người triển khai hợp đồng
    const Token1 = await ethers.getContractFactory("MyToken1"); // Lấy contract factory cho Token1
    const token1 = await Token1.deploy(); // Triển khai hợp đồng Token1
    await token1.deployed(); // Chờ cho hợp đồng được triển khai xong
    console.log("Token1 deployed to: ", token1.address); // In địa chỉ của hợp đồng Token1

    const Token2 = await ethers.getContractFactory("MyToken2"); // Lấy contract factory cho Token2
    const token2 = await Token2.deploy(); // Triển khai hợp đồng Token2
    await token2.deployed(); // Chờ cho hợp đồng được triển khai xong
    console.log("Token2 deployed to: ", token2.address); // In địa chỉ của hợp đồng Token2
}
main()
    .then(() => process.exit(0)) // Nếu thành công, thoát khỏi quá trình
    .catch((error) => {
        console.error(error); // In lỗi nếu có
        process.exit(1); // Thoát với mã lỗi 1
    });