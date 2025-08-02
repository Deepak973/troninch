// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./IERC20.sol";

contract EscrowSrc {
    address public maker;
    address public taker;
    uint256 public timelock;
    bytes32 public hashlock;
    address public tokenAddress;
    bool public withdrawn;
    bool public canceled;
    bool private initialized;

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

    function initialize(address _maker, address _taker, bytes32 _hashlock, uint256 _timelock, address _tokenAddress)
        external
    {
        require(!initialized, "Already initialized");
        maker = _maker;
        taker = _taker;
        hashlock = _hashlock;
        timelock = _timelock;
        tokenAddress = _tokenAddress;
        initialized = true;
    }

    function withdraw(bytes32 secret) external onlyTaker notInactive {
        require(sha256(abi.encodePacked(secret)) == hashlock, "Invalid secret");
        withdrawn = true;

        if (tokenAddress == address(0)) {
            // Native token transfer
            payable(taker).transfer(address(this).balance);
        } else {
            // ERC20 transfer
            uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
            require(IERC20(tokenAddress).transfer(taker, balance), "Token transfer failed");
        }
    }

    function cancel() external onlyMaker notInactive {
        require(block.timestamp >= timelock, "Too early to cancel");
        canceled = true;

        if (tokenAddress == address(0)) {
            payable(maker).transfer(address(this).balance);
        } else {
            uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
            require(IERC20(tokenAddress).transfer(maker, balance), "Token transfer failed");
        }
    }

    receive() external payable {}
}
