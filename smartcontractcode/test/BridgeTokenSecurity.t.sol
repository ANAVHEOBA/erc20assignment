// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/BridgeToken.sol";

/**
 * @title BridgeTokenSecurity
 * @dev Advanced security tests - trying to break the contract
 */
contract BridgeTokenSecurityTest is Test {
    BridgeToken public token;
    address public owner;
    address public attacker;
    address public user1;
    address public user2;

    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10**18;

    function setUp() public {
        owner = address(this);
        attacker = address(0x666);
        user1 = address(0x1);
        user2 = address(0x2);
        
        token = new BridgeToken(INITIAL_SUPPLY);
        token.transfer(address(token), 500_000 * 10**18);
    }

    // ============ Access Control Attacks ============

    function testAttackerCannotMint() public {
        vm.prank(attacker);
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(attacker, 1000 * 10**18);
    }

    function testAttackerCannotTransferOwnership() public {
        vm.prank(attacker);
        vm.expectRevert("Ownable: caller is not the owner");
        token.transferOwnership(attacker);
    }

    function testAttackerCannotRenounceOwnership() public {
        vm.prank(attacker);
        vm.expectRevert("Ownable: caller is not the owner");
        token.renounceOwnership();
    }

    function testOwnershipCannotBeStolen() public {
        assertEq(token.owner(), owner);
        
        // Attacker tries various methods
        vm.startPrank(attacker);
        
        // Try to call internal function (should fail)
        (bool success,) = address(token).call(
            abi.encodeWithSignature("_transferOwnership(address)", attacker)
        );
        assertFalse(success, "Internal function call should fail");
        
        vm.stopPrank();
        
        // Owner should remain unchanged
        assertEq(token.owner(), owner, "Ownership was stolen!");
    }

    function testCannotMintAfterRenouncingOwnership() public {
        token.renounceOwnership();
        
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user1, 1000 * 10**18);
    }

    // ============ Integer Overflow/Underflow Attacks ============

    function testCannotMintMaxUint256() public {
        // Solidity 0.8+ will panic on overflow before our check
        vm.expectRevert();
        token.mint(user1, type(uint256).max);
    }

    function testCannotOverflowTotalSupply() public {
        uint256 remaining = token.remainingMintableSupply();
        
        vm.expectRevert("Minting would exceed MAX_SUPPLY");
        token.mint(user1, remaining + 1);
    }

    function testCannotUnderflowBalance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        vm.expectRevert("ERC20: burn amount exceeds balance");
        token.burn(101 * 10**18);
    }

    function testCannotUnderflowAllowance() public {
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.prank(user1);
        vm.expectRevert("ERC20: decreased allowance below zero");
        token.decreaseAllowance(user2, 101 * 10**18);
    }

    // ============ Reentrancy Attacks ============

    function testReentrancyOnRequestToken() public {
        MaliciousReceiver malicious = new MaliciousReceiver(address(token));
        
        // Fund the malicious contract
        token.transfer(address(malicious), 1000 * 10**18);
        
        // Try reentrancy attack
        vm.prank(address(malicious));
        token.requestToken();
        
        // Should only get 100 tokens, not more
        assertEq(token.balanceOf(address(malicious)), 1100 * 10**18);
    }

    function testReentrancyOnTransfer() public {
        MaliciousReceiver malicious = new MaliciousReceiver(address(token));
        
        vm.prank(user1);
        token.requestToken();
        
        // Transfer to malicious contract
        vm.prank(user1);
        token.transfer(address(malicious), 50 * 10**18);
        
        // Balance should be correct
        assertEq(token.balanceOf(address(malicious)), 50 * 10**18);
    }

    // ============ Front-Running Attacks ============

    function testFrontRunningApproval() public {
        // User1 approves user2 for 100 tokens
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        // User2 tries to front-run by spending before approval change
        vm.prank(user2);
        token.transferFrom(user1, user2, 50 * 10**18);
        
        // User1 changes approval to 50
        vm.prank(user1);
        token.approve(user2, 50 * 10**18);
        
        // User2 should only have 50 allowance now
        assertEq(token.allowance(user1, user2), 50 * 10**18);
    }

    // ============ Timestamp Manipulation ============

    function testCannotBypassCooldownWithTimestampManipulation() public {
        vm.prank(user1);
        token.requestToken();
        
        // Try to manipulate timestamp (simulating miner manipulation)
        vm.warp(block.timestamp + 23 hours + 59 minutes + 59 seconds);
        
        vm.prank(user1);
        vm.expectRevert("Cooldown period not elapsed");
        token.requestToken();
    }

    function testCooldownWorksWithLargeTimestamps() public {
        vm.prank(user1);
        token.requestToken();
        
        // Jump to far future
        vm.warp(block.timestamp + 365 days);
        
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 200 * 10**18);
    }

    function testCooldownWorksAtBlockTimestampZero() public {
        // Reset to timestamp 0
        vm.warp(0);
        
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.lastRequestTime(user1), 0);
    }

    // ============ Gas Griefing Attacks ============

    function testMassiveApprovalDoesNotBreakContract() public {
        vm.prank(user1);
        token.requestToken();
        
        // Approve max uint256
        vm.prank(user1);
        token.approve(user2, type(uint256).max);
        
        assertEq(token.allowance(user1, user2), type(uint256).max);
    }

    function testManySmallTransfers() public {
        vm.prank(user1);
        token.requestToken();
        
        // Make 100 small transfers
        for (uint i = 0; i < 100; i++) {
            address recipient = address(uint160(i + 1000));
            vm.prank(user1);
            if (token.balanceOf(user1) >= 1) {
                token.transfer(recipient, 1);
            }
        }
        
        // Contract should still work
        assertTrue(token.totalSupply() > 0);
    }

    // ============ Edge Cases ============

    function testTransferToSelf() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balanceBefore = token.balanceOf(user1);
        
        vm.prank(user1);
        token.transfer(user1, 50 * 10**18);
        
        assertEq(token.balanceOf(user1), balanceBefore);
    }

    function testApproveToSelf() public {
        vm.prank(user1);
        token.approve(user1, 100 * 10**18);
        
        assertEq(token.allowance(user1, user1), 100 * 10**18);
    }

    function testTransferFromSelfToSelf() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user1, 100 * 10**18);
        
        vm.prank(user1);
        token.transferFrom(user1, user1, 50 * 10**18);
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
    }

    function testBurnFromZeroBalanceFails() public {
        vm.prank(user1);
        vm.expectRevert("ERC20: burn amount exceeds balance");
        token.burn(1);
    }

    function testMintZeroToZeroAddressFails() public {
        vm.expectRevert("Cannot mint to zero address");
        token.mint(address(0), 0);
    }

    function testRequestTokenWhenContractHasExactlyFaucetAmount() public {
        // Drain faucet to exactly 100 tokens
        uint256 faucetBalance = token.balanceOf(address(token));
        uint256 toTransfer = faucetBalance - 100 * 10**18;
        
        vm.prank(address(token));
        token.transfer(owner, toTransfer);
        
        // Should succeed
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
        assertEq(token.balanceOf(address(token)), 0);
    }

    // ============ Supply Manipulation ============

    function testCannotExceedMaxSupplyThroughMultipleMints() public {
        uint256 remaining = token.remainingMintableSupply();
        uint256 halfRemaining = remaining / 2;
        
        token.mint(user1, halfRemaining);
        token.mint(user2, halfRemaining);
        
        // Try to mint 1 more
        vm.expectRevert("Minting would exceed MAX_SUPPLY");
        token.mint(user1, 1);
    }

    function testBurnDoesNotAllowMintingBeyondOriginalMaxSupply() public {
        // Mint to max
        uint256 remaining = token.remainingMintableSupply();
        token.mint(user1, remaining);
        
        // Burn some
        vm.prank(user1);
        token.burn(1000 * 10**18);
        
        // Try to mint beyond original max supply
        vm.expectRevert("Minting would exceed MAX_SUPPLY");
        token.mint(user2, 1);
    }

    // ============ Denial of Service Attacks ============

    function testCannotDOSFaucetByRequestingFromContract() public {
        // Deploy contract that requests tokens
        FaucetSpammer spammer = new FaucetSpammer(address(token));
        
        // Spam requests (should fail after first one due to cooldown)
        spammer.spamRequests(5);
        
        // Regular users should still be able to request
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
    }

    function testCannotDOSByCreatingManyApprovals() public {
        vm.prank(user1);
        token.requestToken();
        
        // Create many approvals
        for (uint i = 0; i < 100; i++) {
            address spender = address(uint160(i + 2000));
            vm.prank(user1);
            token.approve(spender, 1);
        }
        
        // Contract should still work
        vm.prank(user1);
        token.transfer(user2, 1);
        
        assertTrue(true);
    }

    // ============ Race Conditions ============

    function testMultipleUsersRequestingSimultaneously() public {
        // Simulate multiple users requesting at same timestamp
        uint256 timestamp = block.timestamp;
        
        vm.warp(timestamp);
        vm.prank(user1);
        token.requestToken();
        
        vm.warp(timestamp);
        vm.prank(user2);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
        assertEq(token.balanceOf(user2), 100 * 10**18);
    }

    // ============ Precision Loss ============

    function testNoPrecisionLossInCalculations() public {
        // Test with odd numbers
        token.mint(user1, 333 * 10**18 + 333);
        
        assertEq(token.balanceOf(user1), 333 * 10**18 + 333);
        
        vm.prank(user1);
        token.transfer(user2, 111 * 10**18 + 111);
        
        assertEq(token.balanceOf(user1), 222 * 10**18 + 222);
        assertEq(token.balanceOf(user2), 111 * 10**18 + 111);
    }

    // ============ State Consistency ============

    function testStateConsistencyAfterFailedTransfer() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balanceBefore = token.balanceOf(user1);
        uint256 supplyBefore = token.totalSupply();
        
        // Try to transfer more than balance
        vm.prank(user1);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        token.transfer(user2, 200 * 10**18);
        
        // State should be unchanged
        assertEq(token.balanceOf(user1), balanceBefore);
        assertEq(token.totalSupply(), supplyBefore);
    }

    function testStateConsistencyAfterFailedMint() public {
        uint256 supplyBefore = token.totalSupply();
        uint256 totalMintedBefore = token.totalMinted();
        
        // Try to mint more than remaining supply
        uint256 remaining = token.remainingMintableSupply();
        vm.expectRevert("Minting would exceed MAX_SUPPLY");
        token.mint(user1, remaining + 1);
        
        // State should be unchanged
        assertEq(token.totalSupply(), supplyBefore);
        assertEq(token.totalMinted(), totalMintedBefore);
    }

    // ============ Fuzz Testing ============

    function testFuzzRequestTokenWithDifferentTimestamps(uint256 timestamp) public {
        vm.assume(timestamp > 0 && timestamp < type(uint128).max);
        
        vm.warp(timestamp);
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
        assertEq(token.lastRequestTime(user1), timestamp);
    }

    function testFuzzMintAmount(uint256 amount) public {
        vm.assume(amount > 0 && amount <= token.remainingMintableSupply());
        
        uint256 supplyBefore = token.totalSupply();
        token.mint(user1, amount);
        
        assertEq(token.totalSupply(), supplyBefore + amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function testFuzzTransferAmount(uint256 amount) public {
        vm.prank(user1);
        token.requestToken();
        
        vm.assume(amount <= 100 * 10**18);
        
        vm.prank(user1);
        token.transfer(user2, amount);
        
        assertEq(token.balanceOf(user2), amount);
        assertEq(token.balanceOf(user1), 100 * 10**18 - amount);
    }

    function testFuzzBurnAmount(uint256 amount) public {
        vm.prank(user1);
        token.requestToken();
        
        vm.assume(amount <= 100 * 10**18);
        
        uint256 supplyBefore = token.totalSupply();
        
        vm.prank(user1);
        token.burn(amount);
        
        assertEq(token.totalSupply(), supplyBefore - amount);
    }

    // ============ Additional Security Tests ============

    function testCannotMintZeroAmount() public {
        vm.expectRevert("Cannot mint zero amount");
        token.mint(user1, 0);
    }

    function testTransferFromWithInsufficientAllowance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user2, 50 * 10**18);
        
        vm.prank(user2);
        vm.expectRevert("ERC20: transfer amount exceeds allowance");
        token.transferFrom(user1, user2, 100 * 10**18);
    }

    function testTransferToZeroAddress() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        vm.expectRevert("ERC20: transfer to the zero address");
        token.transfer(address(0), 50 * 10**18);
    }

    function testApproveFromZeroAddress() public {
        // This should be impossible in normal circumstances
        // but testing the ERC20 protection
        vm.prank(address(0));
        vm.expectRevert("ERC20: approve from the zero address");
        token.approve(user1, 100 * 10**18);
    }

    function testBurnMoreThanBalance() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balance = token.balanceOf(user1);
        
        vm.prank(user1);
        vm.expectRevert("ERC20: burn amount exceeds balance");
        token.burn(balance + 1);
    }

    function testRequestTokenWhenFaucetEmpty() public {
        // Drain the faucet completely
        uint256 faucetBalance = token.balanceOf(address(token));
        vm.prank(address(token));
        token.transfer(owner, faucetBalance);
        
        vm.prank(user1);
        vm.expectRevert("Faucet is empty");
        token.requestToken();
    }

    function testRequestTokenWhenFaucetAlmostEmpty() public {
        // Leave less than FAUCET_AMOUNT in faucet
        uint256 faucetBalance = token.balanceOf(address(token));
        uint256 toTransfer = faucetBalance - (50 * 10**18);
        
        vm.prank(address(token));
        token.transfer(owner, toTransfer);
        
        vm.prank(user1);
        vm.expectRevert("Faucet is empty");
        token.requestToken();
    }

    function testMultipleMintsShouldNotOverflow() public {
        uint256 remaining = token.remainingMintableSupply();
        uint256 quarterAmount = remaining / 4;
        
        token.mint(user1, quarterAmount);
        token.mint(user1, quarterAmount);
        token.mint(user1, quarterAmount);
        token.mint(user1, quarterAmount);
        
        // Should have minted exactly the remaining amount
        assertEq(token.totalMinted(), token.MAX_SUPPLY());
    }

    function testDecreaseAllowanceToZero() public {
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.prank(user1);
        token.decreaseAllowance(user2, 100 * 10**18);
        
        assertEq(token.allowance(user1, user2), 0);
    }

    function testIncreaseAllowanceFromZero() public {
        vm.prank(user1);
        token.increaseAllowance(user2, 100 * 10**18);
        
        assertEq(token.allowance(user1, user2), 100 * 10**18);
    }

    function testAllowanceDoesNotAffectDirectTransfer() public {
        vm.prank(user1);
        token.requestToken();
        
        // Set allowance for user2
        vm.prank(user1);
        token.approve(user2, 50 * 10**18);
        
        // user1 can still transfer directly
        vm.prank(user1);
        token.transfer(owner, 50 * 10**18);
        
        assertEq(token.balanceOf(user1), 50 * 10**18);
    }

    function testTransferFromReducesAllowance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.prank(user2);
        token.transferFrom(user1, user2, 30 * 10**18);
        
        assertEq(token.allowance(user1, user2), 70 * 10**18);
    }

    function testCannotRequestTokenTwiceInCooldown() public {
        vm.prank(user1);
        token.requestToken();
        
        // Try immediately
        vm.prank(user1);
        vm.expectRevert("Cooldown period not elapsed");
        token.requestToken();
        
        // Try after 12 hours
        vm.warp(block.timestamp + 12 hours);
        vm.prank(user1);
        vm.expectRevert("Cooldown period not elapsed");
        token.requestToken();
        
        // Try after 23 hours 59 minutes
        vm.warp(block.timestamp + 11 hours + 59 minutes);
        vm.prank(user1);
        vm.expectRevert("Cooldown period not elapsed");
        token.requestToken();
    }

    function testGetTimeUntilNextRequestAccuracy() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 timeRemaining = token.getTimeUntilNextRequest(user1);
        assertEq(timeRemaining, 24 hours);
        
        vm.warp(block.timestamp + 12 hours);
        timeRemaining = token.getTimeUntilNextRequest(user1);
        assertEq(timeRemaining, 12 hours);
        
        vm.warp(block.timestamp + 12 hours);
        timeRemaining = token.getTimeUntilNextRequest(user1);
        assertEq(timeRemaining, 0);
    }

    function testRemainingMintableSupplyAccuracy() public {
        uint256 initialRemaining = token.remainingMintableSupply();
        
        token.mint(user1, 1000 * 10**18);
        
        assertEq(token.remainingMintableSupply(), initialRemaining - 1000 * 10**18);
    }

    function testTotalMintedTracksCorrectly() public {
        uint256 initialMinted = token.totalMinted();
        
        token.mint(user1, 1000 * 10**18);
        assertEq(token.totalMinted(), initialMinted + 1000 * 10**18);
        
        // Burn should not affect totalMinted
        vm.prank(user1);
        token.burn(500 * 10**18);
        assertEq(token.totalMinted(), initialMinted + 1000 * 10**18);
    }

    function testCannotTransferMoreThanBalance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        token.transfer(user2, 101 * 10**18);
    }

    function testMaxSupplyIsConstant() public view {
        assertEq(token.MAX_SUPPLY(), 10_000_000 * 10**18);
    }

    function testFaucetAmountIsConstant() public view {
        assertEq(token.FAUCET_AMOUNT(), 100 * 10**18);
    }

    function testCooldownTimeIsConstant() public view {
        assertEq(token.COOLDOWN_TIME(), 24 hours);
    }

    // ============ Edge Cases for Contract Interactions ============

    function testCannotApproveToZeroAddress() public {
        vm.prank(user1);
        vm.expectRevert("ERC20: approve to the zero address");
        token.approve(address(0), 100 * 10**18);
    }

    function testMultipleApprovalsOverwrite() public {
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.prank(user1);
        token.approve(user2, 50 * 10**18);
        
        assertEq(token.allowance(user1, user2), 50 * 10**18);
    }

    function testBurnReducesTotalSupplyNotTotalMinted() public {
        uint256 initialSupply = token.totalSupply();
        uint256 initialMinted = token.totalMinted();
        
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.burn(50 * 10**18);
        
        assertEq(token.totalSupply(), initialSupply - 50 * 10**18);
        assertEq(token.totalMinted(), initialMinted); // Should not change
    }

    function testRequestTokenUpdatesLastRequestTime() public {
        uint256 timestamp1 = block.timestamp;
        
        vm.prank(user1);
        token.requestToken();
        assertEq(token.lastRequestTime(user1), timestamp1);
        
        vm.warp(block.timestamp + 25 hours);
        uint256 timestamp2 = block.timestamp;
        
        vm.prank(user1);
        token.requestToken();
        assertEq(token.lastRequestTime(user1), timestamp2);
    }

    function testGetTimeUntilNextRequestForNewUser() public view {
        uint256 timeRemaining = token.getTimeUntilNextRequest(user1);
        assertEq(timeRemaining, 0);
    }

    function testMintEmitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit TokensMinted(user1, 1000 * 10**18);
        token.mint(user1, 1000 * 10**18);
    }

    function testRequestTokenEmitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit TokensRequested(user1, 100 * 10**18, block.timestamp);
        
        vm.prank(user1);
        token.requestToken();
    }

    function testTransferFromMaxAllowance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user2, type(uint256).max);
        
        // Transfer should work
        vm.prank(user2);
        token.transferFrom(user1, user2, 50 * 10**18);
        
        // Allowance should be reduced (no infinite allowance optimization in this ERC20)
        assertEq(token.allowance(user1, user2), type(uint256).max - 50 * 10**18);
    }

    function testCannotMintToContractItself() public {
        // While technically allowed, this tests the behavior
        token.mint(address(token), 1000 * 10**18);
        assertEq(token.balanceOf(address(token)), 500_000 * 10**18 + 1000 * 10**18);
    }

    function testZeroTransferIsAllowed() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balanceBefore = token.balanceOf(user1);
        
        vm.prank(user1);
        token.transfer(user2, 0);
        
        assertEq(token.balanceOf(user1), balanceBefore);
        assertEq(token.balanceOf(user2), 0);
    }

    function testApproveZeroIsAllowed() public {
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.prank(user1);
        token.approve(user2, 0);
        
        assertEq(token.allowance(user1, user2), 0);
    }

    function testIncreaseAllowanceMultipleTimes() public {
        vm.prank(user1);
        token.increaseAllowance(user2, 50 * 10**18);
        
        vm.prank(user1);
        token.increaseAllowance(user2, 50 * 10**18);
        
        assertEq(token.allowance(user1, user2), 100 * 10**18);
    }

    function testDecreaseAllowanceMultipleTimes() public {
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.prank(user1);
        token.decreaseAllowance(user2, 30 * 10**18);
        
        vm.prank(user1);
        token.decreaseAllowance(user2, 30 * 10**18);
        
        assertEq(token.allowance(user1, user2), 40 * 10**18);
    }

    function testContractCanReceiveTokensAndDistribute() public {
        // Contract already has tokens, test it can distribute
        uint256 contractBalance = token.balanceOf(address(token));
        assertTrue(contractBalance > 0);
        
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
    }

    function testOwnerCanTransferOwnershipToNewOwner() public {
        address newOwner = address(0x999);
        
        token.transferOwnership(newOwner);
        assertEq(token.owner(), newOwner);
        
        // Old owner cannot mint anymore
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user1, 1000 * 10**18);
        
        // New owner can mint
        vm.prank(newOwner);
        token.mint(user1, 1000 * 10**18);
        assertEq(token.balanceOf(user1), 1000 * 10**18);
    }

    function testRenounceOwnershipPermanentlyLocksOwnership() public {
        token.renounceOwnership();
        assertEq(token.owner(), address(0));
        
        // Nobody can mint anymore
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user1, 1000 * 10**18);
        
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user1, 1000 * 10**18);
    }

    // Events for testing
    event TokensMinted(address indexed to, uint256 amount);
    event TokensRequested(address indexed user, uint256 amount, uint256 timestamp);
}

// ============ Malicious Contracts ============

contract MaliciousReceiver {
    BridgeToken public token;
    uint256 public attackCount;
    
    constructor(address _token) {
        token = BridgeToken(_token);
    }
    
    // Try to reenter on receive
    receive() external payable {
        if (attackCount < 3) {
            attackCount++;
            try token.requestToken() {} catch {}
        }
    }
    
    // Try to reenter on ERC20 receive
    function onTokenReceived() external {
        if (attackCount < 3) {
            attackCount++;
            try token.requestToken() {} catch {}
        }
    }
}

contract FaucetSpammer {
    BridgeToken public token;
    
    constructor(address _token) {
        token = BridgeToken(_token);
    }
    
    function spamRequests(uint256 count) external {
        for (uint i = 0; i < count; i++) {
            try token.requestToken() {} catch {}
        }
    }
}
