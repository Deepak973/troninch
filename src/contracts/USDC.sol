// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 10_000 * 1e18); // Initial mint to deployer
    }

    // Anyone can mint more tokens
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
