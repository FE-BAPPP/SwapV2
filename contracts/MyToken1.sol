// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;  // khai bao phien ban solidity

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// MyToken1 ke thua toan bo tinh nang tu ERC20
contract MyToken1 is ERC20 {
    constructor() ERC20("My Token 1", "TK1") {
        _mint(msg.sender, 1000000 * 10 ** decimals());    //tao 1 trieu token cho nguoi deploy contract
    }
}