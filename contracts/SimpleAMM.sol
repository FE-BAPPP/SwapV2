// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol"; //import thu vien openzeppelin de tao token chuan ERC20

contract SimpleAMM {
    IERC20 public token1; //token se duoc swap trong pool nay(interface chuan ERC20)
    IERC20 public token2;

    uint public reserve1; // bien luu so du cho pool1 
    uint public reserve2;

    // truyen dia chi 2 token khi deploy contract, luu vao state
    constructor(address _token1, address _token2) {
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
    }

    function addLiquidity(uint amount1, uint amount2) public {
        // approve truoc khi nap vao pool
        token1.transferFrom(msg.sender, address(this), amount1); //goi token1 chuyen do luong amount1 tu vi nguoi dung -> pool(la contract nay)
        token2.transferFrom(msg.sender, address(this), amount2);

        reserve1 += amount1;  // cap nhat lai so du trong pool
        reserve2 += amount2;
    }

    function swapAForB(uint amountAIn) public {
        uint amountBOut = getAmountOut(amountAIn, reserve1, reserve2); //gọi hàm getAmountOut tính số lượng token B gửi vào amountAIn
        require(amountBOut > 0, "Insufficient output"); //nếu pool không đủ tokenB thì revert giao dịch
        token1.transferFrom(msg.sender, address(this), amountAIn); //Lấy amountAIn token1 từ ví user chuyển vào pool
        token2.transfer(msg.sender, amountBOut);        //trả lại amountBOut token2 từ pool lại cho user
        reserve1 += amountAIn;
        reserve2 -= amountBOut;
    }

    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) public pure returns (uint) {
        uint amountInWithFee = amountIn * 997 / 1000; //ap dung phi 0.3%, chi co 99,7% token la duoc dung swap
        uint numerator = amountInWithFee *reserveOut;  //tài sản còn lại trong pool sau swap
        uint denominator = reserveIn + amountInWithFee;  //tài sản gốc cộng thêm số mới gửi vào
        return numerator / denominator;         //số token nhận được
    }

}
