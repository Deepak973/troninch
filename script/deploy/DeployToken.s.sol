// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "forge-std/Script.sol";
import "../../src/contracts/USDC.sol";

contract DeployUSDC is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        USDC usdc = new USDC();
        console2.log("USDC deployed at:", address(usdc));

        vm.stopBroadcast();
    }
}
