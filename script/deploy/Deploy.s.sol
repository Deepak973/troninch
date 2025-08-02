// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../../src/contracts/EscrowFactory.sol";
import "../../src/contracts/Resolver.sol";

contract Deploy is Script {
    function run() external {
        // Load deployer's private key from environment or CLI args
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the EscrowFactory
        EscrowFactory factory = new EscrowFactory();
        console2.log("EscrowFactory deployed at:", address(factory));

        // Deploy Resolver
        Resolver resolver = new Resolver(address(factory));
        console2.log("Resolver deployed at:", address(resolver));

        vm.stopBroadcast();
    }
}
