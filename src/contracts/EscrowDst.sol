// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./IERC20.sol";

contract EscrowDst {
    address public maker;
    address public taker;
    address public tokenAddress;
    uint256 public timelock;
    uint256 public amount;
    bytes32 public hashlock;
    bool public withdrawn;
    bool public canceled;

    constructor(
        address _maker,
        address _taker,
        bytes32 _hashlock,
        uint256 _timelock,
        address _tokenAddress,
        uint256 _amount
    ) {
        maker = _maker;
        taker = _taker;
        hashlock = _hashlock;
        timelock = _timelock;
        tokenAddress = _tokenAddress;
        amount = _amount;
    }

    modifier onlyTaker() {
        require(msg.sender == taker, "Only taker");
        _;
    }

    modifier onlyMaker() {
        require(msg.sender == maker, "Only maker");
        _;
    }

    modifier notInactive() {
        require(!withdrawn && !canceled, "Escrow inactive");
        _;
    }

    function withdraw(bytes32 secret) external onlyTaker notInactive {
        require(sha256(abi.encodePacked(secret)) == hashlock, "Invalid secret");
        withdrawn = true;

        // Transfer the tokens to the taker
        bool success = IERC20(tokenAddress).transfer(taker, amount);
        require(success, "Token transfer failed");
    }

    function cancel() external onlyMaker notInactive {
        require(block.timestamp >= timelock, "Too early to cancel");
        canceled = true;

        // Refund tokens to maker
        bool success = IERC20(tokenAddress).transfer(maker, amount);
        require(success, "Refund to maker failed");
    }
}
