// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/BridgeToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy with initial supply for faucet (e.g., 1 million tokens)
        uint256 initialSupply = 1_000_000 * 10**18;
        BridgeToken token = new BridgeToken(initialSupply);
        
        console.log("BridgeToken deployed to:", address(token));
        console.log("Owner:", token.owner());
        console.log("Total Supply:", token.totalSupply());
        console.log("Max Supply:", token.MAX_SUPPLY());
        
        vm.stopBroadcast();
    }
}
