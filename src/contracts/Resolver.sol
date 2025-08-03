// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./EscrowFactory.sol";

contract Resolver {
    address public owner;
    EscrowFactory public factory;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _factory) {
        owner = msg.sender;
        factory = EscrowFactory(_factory);
    }

    function deploySrcEscrow(address maker, address taker, bytes32 hashlock, uint256 timelock, address tokenAddress)
        external
        payable
        onlyOwner
        returns (address)
    {
        return factory.deployEscrowSrc{value: msg.value}(maker, taker, hashlock, timelock, tokenAddress);
    }

    function deployDstEscrow(
        address maker,
        address taker,
        bytes32 hashlock,
        uint256 timelock,
        address tokenAddress,
        uint256 amount
    ) external onlyOwner returns (address) {
        return factory.deployEscrowDst(maker, taker, hashlock, timelock, tokenAddress, amount);
    }

    function withdrawFromEscrow(address escrow, bytes32 secret) external onlyOwner {
        EscrowSrc(payable(escrow)).withdraw(secret);
    }

    function cancelEscrow(address escrow) external onlyOwner {
        EscrowSrc(payable(escrow)).cancel();
    }

    function changeOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    receive() external payable {}
}
