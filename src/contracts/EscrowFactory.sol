// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./EscrowSrc.sol";
import "./EscrowDst.sol";

contract EscrowFactory {
    event EscrowSrcDeployed(address indexed escrow);
    event EscrowDstDeployed(address indexed escrow);

    function deployEscrowSrc(address taker, bytes32 hashlock, uint256 timelock) external payable returns (address) {
        EscrowSrc escrow = new EscrowSrc();
        escrow.initialize(msg.sender, taker, hashlock, timelock);

        if (msg.value > 0) {
            (bool sent,) = address(escrow).call{value: msg.value}("");
            require(sent, "ETH transfer failed to escrow");
        }

        emit EscrowSrcDeployed(address(escrow));
        return address(escrow);
    }

    function deployEscrowDst(address maker, address taker, bytes32 hashlock, uint256 timelock)
        external
        payable
        returns (address)
    {
        EscrowDst escrow = new EscrowDst{value: msg.value}(maker, taker, hashlock, timelock);
        emit EscrowDstDeployed(address(escrow));
        return address(escrow);
    }
}
