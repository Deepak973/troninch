// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract EscrowDst {
    address public maker;
    address public taker;
    uint256 public timelock;
    bytes32 public hashlock;
    bool public withdrawn;
    bool public canceled;

    constructor(address _maker, address _taker, bytes32 _hashlock, uint256 _timelock) payable {
        maker = _maker;
        taker = _taker;
        hashlock = _hashlock;
        timelock = _timelock;
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
        payable(taker).transfer(address(this).balance);
    }

    function cancel() external onlyMaker notInactive {
        require(block.timestamp >= timelock, "Too early to cancel");
        canceled = true;
        payable(maker).transfer(address(this).balance);
    }

    receive() external payable {}
}
