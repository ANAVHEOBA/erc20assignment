// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/BridgeToken.sol";

contract BridgeTokenTest is Test {
    BridgeToken public token;
    address public owner;
    address public user1;
    address public user2;
    address public user3;

    uint256 constant INITIAL_SUPPLY = 1_000_000 * 10**18;

    event TokensRequested(address indexed user, uint256 amount, uint256 timestamp);
    event TokensMinted(address indexed to, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        user3 = address(0x3);
        
        token = new BridgeToken(INITIAL_SUPPLY);
        // Transfer tokens to contract for faucet
        token.transfer(address(token), 500_000 * 10**18);
    }

    // ============ Constructor Tests ============
    
    function testConstructorSetsCorrectValues() public {
        assertEq(token.name(), "BridgeToken");
        assertEq(token.symbol(), "BRG");
        assertEq(token.decimals(), 18);
        assertEq(token.totalSupply(), INITIAL_SUPPLY);
        assertEq(token.owner(), owner);
    }

    function testConstructorMintsToDeployer() public {
        assertEq(token.balanceOf(owner), INITIAL_SUPPLY - 500_000 * 10**18);
    }

    function testConstructorFailsIfExceedsMaxSupply() public {
        vm.expectRevert("Total supply exceeds MAX_SUPPLY");
        new BridgeToken(11_000_000 * 10**18);
    }

    function testConstructorWithZeroSupply() public {
        BridgeToken newToken = new BridgeToken(0);
        assertEq(newToken.totalSupply(), 0);
    }

    function testConstructorWithMaxSupply() public {
        BridgeToken newToken = new BridgeToken(10_000_000 * 10**18);
        assertEq(newToken.totalSupply(), 10_000_000 * 10**18);
    }

    // ============ requestToken Tests ============

    function testRequestTokenFirstTime() public {
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
        assertEq(token.lastRequestTime(user1), block.timestamp);
    }

    function testRequestTokenEmitsEvent() public {
        vm.expectEmit(true, false, false, true);
        emit TokensRequested(user1, 100 * 10**18, block.timestamp);
        
        vm.prank(user1);
        token.requestToken();
    }

    function testRequestTokenFailsBeforeCooldown() public {
        vm.startPrank(user1);
        token.requestToken();
        
        vm.expectRevert("Cooldown period not elapsed");
        token.requestToken();
        vm.stopPrank();
    }

    function testRequestTokenFailsAt23Hours59Minutes() public {
        vm.startPrank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 23 hours + 59 minutes);
        vm.expectRevert("Cooldown period not elapsed");
        token.requestToken();
        vm.stopPrank();
    }

    function testRequestTokenSucceedsExactlyAt24Hours() public {
        vm.startPrank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 24 hours);
        token.requestToken();
        assertEq(token.balanceOf(user1), 200 * 10**18);
        vm.stopPrank();
    }

    function testRequestTokenSucceedsAfter25Hours() public {
        vm.startPrank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 25 hours);
        token.requestToken();
        assertEq(token.balanceOf(user1), 200 * 10**18);
        vm.stopPrank();
    }

    function testRequestTokenMultipleTimes() public {
        vm.startPrank(user1);
        
        // First request
        token.requestToken();
        assertEq(token.balanceOf(user1), 100 * 10**18);
        
        // Second request after 24 hours
        vm.warp(block.timestamp + 24 hours);
        token.requestToken();
        assertEq(token.balanceOf(user1), 200 * 10**18);
        
        // Third request after another 24 hours
        vm.warp(block.timestamp + 24 hours);
        token.requestToken();
        assertEq(token.balanceOf(user1), 300 * 10**18);
        
        vm.stopPrank();
    }

    function testRequestTokenFailsWhenFaucetEmpty() public {
        // Drain the faucet
        uint256 faucetBalance = token.balanceOf(address(token));
        uint256 requests = faucetBalance / token.FAUCET_AMOUNT();
        
        for (uint256 i = 0; i < requests; i++) {
            address user = address(uint160(i + 100));
            vm.prank(user);
            token.requestToken();
        }
        
        vm.prank(user1);
        vm.expectRevert("Faucet is empty");
        token.requestToken();
    }

    function testRequestTokenWithPartialFaucetBalance() public {
        // Leave only 50 tokens in faucet
        uint256 faucetBalance = token.balanceOf(address(token));
        uint256 toTransfer = faucetBalance - 50 * 10**18;
        
        vm.prank(address(token));
        token.transfer(owner, toTransfer);
        
        vm.prank(user1);
        vm.expectRevert("Faucet is empty");
        token.requestToken();
    }

    function testMultipleUsersCanRequestIndependently() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user2);
        token.requestToken();
        
        vm.prank(user3);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 100 * 10**18);
        assertEq(token.balanceOf(user2), 100 * 10**18);
        assertEq(token.balanceOf(user3), 100 * 10**18);
    }

    function testRequestTokenUpdatesLastRequestTime() public {
        uint256 time1 = block.timestamp;
        vm.prank(user1);
        token.requestToken();
        assertEq(token.lastRequestTime(user1), time1);
        
        vm.warp(block.timestamp + 24 hours);
        uint256 time2 = block.timestamp;
        vm.prank(user1);
        token.requestToken();
        assertEq(token.lastRequestTime(user1), time2);
    }

    // ============ getTimeUntilNextRequest Tests ============

    function testGetTimeUntilNextRequestNeverRequested() public {
        assertEq(token.getTimeUntilNextRequest(user1), 0);
    }

    function testGetTimeUntilNextRequestImmediatelyAfter() public {
        vm.prank(user1);
        token.requestToken();
        
        assertEq(token.getTimeUntilNextRequest(user1), 24 hours);
    }

    function testGetTimeUntilNextRequestAfter1Hour() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 1 hours);
        assertEq(token.getTimeUntilNextRequest(user1), 23 hours);
    }

    function testGetTimeUntilNextRequestAfter12Hours() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 12 hours);
        assertEq(token.getTimeUntilNextRequest(user1), 12 hours);
    }

    function testGetTimeUntilNextRequestAfter23Hours() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 23 hours);
        assertEq(token.getTimeUntilNextRequest(user1), 1 hours);
    }

    function testGetTimeUntilNextRequestExactly24Hours() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 24 hours);
        assertEq(token.getTimeUntilNextRequest(user1), 0);
    }

    function testGetTimeUntilNextRequestAfter25Hours() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.warp(block.timestamp + 25 hours);
        assertEq(token.getTimeUntilNextRequest(user1), 0);
    }

    // ============ mint Tests ============

    function testMintByOwner() public {
        uint256 mintAmount = 1000 * 10**18;
        token.mint(user1, mintAmount);
        
        assertEq(token.balanceOf(user1), mintAmount);
        assertEq(token.totalSupply(), INITIAL_SUPPLY + mintAmount);
    }

    function testMintEmitsEvent() public {
        uint256 mintAmount = 1000 * 10**18;
        
        vm.expectEmit(true, false, false, true);
        emit TokensMinted(user1, mintAmount);
        
        token.mint(user1, mintAmount);
    }

    function testMintEmitsTransferEvent() public {
        uint256 mintAmount = 1000 * 10**18;
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(address(0), user1, mintAmount);
        
        token.mint(user1, mintAmount);
    }

    function testMintFailsWhenNotOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user1, 1000 * 10**18);
    }

    function testMintFailsToZeroAddress() public {
        vm.expectRevert("Cannot mint to zero address");
        token.mint(address(0), 1000 * 10**18);
    }

    function testMintFailsWhenExceedingMaxSupply() public {
        uint256 currentSupply = token.totalSupply();
        uint256 excessAmount = token.MAX_SUPPLY() - currentSupply + 1;
        
        vm.expectRevert("Minting would exceed MAX_SUPPLY");
        token.mint(user1, excessAmount);
    }

    function testMintExactlyToMaxSupply() public {
        uint256 currentSupply = token.totalSupply();
        uint256 remainingSupply = token.MAX_SUPPLY() - currentSupply;
        
        token.mint(user1, remainingSupply);
        assertEq(token.totalSupply(), token.MAX_SUPPLY());
    }

    function testMintZeroAmount() public {
        token.mint(user1, 0);
        assertEq(token.balanceOf(user1), 0);
    }

    function testMintMultipleTimes() public {
        token.mint(user1, 1000 * 10**18);
        token.mint(user1, 2000 * 10**18);
        token.mint(user1, 3000 * 10**18);
        
        assertEq(token.balanceOf(user1), 6000 * 10**18);
    }

    function testMintToMultipleAddresses() public {
        token.mint(user1, 1000 * 10**18);
        token.mint(user2, 2000 * 10**18);
        token.mint(user3, 3000 * 10**18);
        
        assertEq(token.balanceOf(user1), 1000 * 10**18);
        assertEq(token.balanceOf(user2), 2000 * 10**18);
        assertEq(token.balanceOf(user3), 3000 * 10**18);
    }

    function testMintToContractAddress() public {
        token.mint(address(token), 1000 * 10**18);
        assertEq(token.balanceOf(address(token)), 500_000 * 10**18 + 1000 * 10**18);
    }

    // ============ remainingMintableSupply Tests ============

    function testRemainingMintableSupplyInitial() public {
        uint256 expected = token.MAX_SUPPLY() - INITIAL_SUPPLY;
        assertEq(token.remainingMintableSupply(), expected);
    }

    function testRemainingMintableSupplyAfterMint() public {
        token.mint(user1, 1000 * 10**18);
        
        uint256 expected = token.MAX_SUPPLY() - token.totalSupply();
        assertEq(token.remainingMintableSupply(), expected);
    }

    function testRemainingMintableSupplyAfterBurn() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.burn(50 * 10**18);
        
        uint256 expected = token.MAX_SUPPLY() - token.totalSupply();
        assertEq(token.remainingMintableSupply(), expected);
    }

    function testRemainingMintableSupplyAtMaxSupply() public {
        uint256 toMint = token.MAX_SUPPLY() - token.totalSupply();
        token.mint(user1, toMint);
        
        assertEq(token.remainingMintableSupply(), 0);
    }

    // ============ burn Tests ============

    function testBurn() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balanceBefore = token.balanceOf(user1);
        uint256 burnAmount = 50 * 10**18;
        
        vm.prank(user1);
        token.burn(burnAmount);
        
        assertEq(token.balanceOf(user1), balanceBefore - burnAmount);
    }

    function testBurnReducesTotalSupply() public {
        uint256 supplyBefore = token.totalSupply();
        
        vm.prank(user1);
        token.requestToken();
        
        uint256 burnAmount = 50 * 10**18;
        vm.prank(user1);
        token.burn(burnAmount);
        
        assertEq(token.totalSupply(), supplyBefore - burnAmount);
    }

    function testBurnEmitsTransferEvent() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(user1, address(0), 50 * 10**18);
        
        vm.prank(user1);
        token.burn(50 * 10**18);
    }

    function testBurnEntireBalance() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balance = token.balanceOf(user1);
        vm.prank(user1);
        token.burn(balance);
        
        assertEq(token.balanceOf(user1), 0);
    }

    function testBurnFailsWithInsufficientBalance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        vm.expectRevert("ERC20: burn amount exceeds balance");
        token.burn(200 * 10**18);
    }

    function testBurnZeroAmount() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 balanceBefore = token.balanceOf(user1);
        vm.prank(user1);
        token.burn(0);
        
        assertEq(token.balanceOf(user1), balanceBefore);
    }

    // ============ Standard ERC20 Tests ============

    function testTransfer() public {
        vm.prank(user1);
        token.requestToken();
        
        uint256 transferAmount = 50 * 10**18;
        vm.prank(user1);
        token.transfer(user2, transferAmount);
        
        assertEq(token.balanceOf(user1), 50 * 10**18);
        assertEq(token.balanceOf(user2), transferAmount);
    }

    function testTransferEmitsEvent() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.expectEmit(true, true, false, true);
        emit Transfer(user1, user2, 50 * 10**18);
        
        vm.prank(user1);
        token.transfer(user2, 50 * 10**18);
    }

    function testTransferFailsWithInsufficientBalance() public {
        vm.prank(user1);
        vm.expectRevert("ERC20: transfer amount exceeds balance");
        token.transfer(user2, 100 * 10**18);
    }

    function testTransferToZeroAddressFails() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        vm.expectRevert("ERC20: transfer to the zero address");
        token.transfer(address(0), 50 * 10**18);
    }

    function testTransferZeroAmount() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.transfer(user2, 0);
        
        assertEq(token.balanceOf(user2), 0);
    }

    function testApprove() public {
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
        
        assertEq(token.allowance(user1, user2), 100 * 10**18);
    }

    function testApproveEmitsEvent() public {
        vm.expectEmit(true, true, false, true);
        emit Approval(user1, user2, 100 * 10**18);
        
        vm.prank(user1);
        token.approve(user2, 100 * 10**18);
    }

    function testApproveZeroAddress() public {
        vm.prank(user1);
        vm.expectRevert("ERC20: approve to the zero address");
        token.approve(address(0), 100 * 10**18);
    }

    function testTransferFrom() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user2, 50 * 10**18);
        
        vm.prank(user2);
        token.transferFrom(user1, user3, 50 * 10**18);
        
        assertEq(token.balanceOf(user1), 50 * 10**18);
        assertEq(token.balanceOf(user3), 50 * 10**18);
        assertEq(token.allowance(user1, user2), 0);
    }

    function testTransferFromFailsWithoutApproval() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user2);
        vm.expectRevert("ERC20: transfer amount exceeds allowance");
        token.transferFrom(user1, user3, 50 * 10**18);
    }

    function testTransferFromFailsWithInsufficientAllowance() public {
        vm.prank(user1);
        token.requestToken();
        
        vm.prank(user1);
        token.approve(user2, 30 * 10**18);
        
        vm.prank(user2);
        vm.expectRevert("ERC20: transfer amount exceeds allowance");
        token.transferFrom(user1, user3, 50 * 10**18);
    }

    function testIncreaseAllowance() public {
        vm.startPrank(user1);
        token.approve(user2, 100 * 10**18);
        token.increaseAllowance(user2, 50 * 10**18);
        vm.stopPrank();
        
        assertEq(token.allowance(user1, user2), 150 * 10**18);
    }

    function testDecreaseAllowance() public {
        vm.startPrank(user1);
        token.approve(user2, 100 * 10**18);
        token.decreaseAllowance(user2, 30 * 10**18);
        vm.stopPrank();
        
        assertEq(token.allowance(user1, user2), 70 * 10**18);
    }

    function testDecreaseAllowanceBelowZeroFails() public {
        vm.startPrank(user1);
        token.approve(user2, 100 * 10**18);
        
        vm.expectRevert("ERC20: decreased allowance below zero");
        token.decreaseAllowance(user2, 150 * 10**18);
        vm.stopPrank();
    }

    // ============ Ownership Tests ============

    function testOwnershipTransfer() public {
        assertEq(token.owner(), owner);
        
        token.transferOwnership(user1);
        assertEq(token.owner(), user1);
    }

    function testOwnershipTransferEmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit OwnershipTransferred(owner, user1);
        
        token.transferOwnership(user1);
    }

    function testOwnershipTransferFailsFromNonOwner() public {
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        token.transferOwnership(user2);
    }

    function testOwnershipTransferToZeroAddressFails() public {
        vm.expectRevert("Ownable: new owner is the zero address");
        token.transferOwnership(address(0));
    }

    function testRenounceOwnership() public {
        token.renounceOwnership();
        assertEq(token.owner(), address(0));
    }

    function testRenounceOwnershipPreventsOwnerFunctions() public {
        token.renounceOwnership();
        
        vm.expectRevert("Ownable: caller is not the owner");
        token.mint(user1, 1000 * 10**18);
    }

    function testNewOwnerCanMint() public {
        token.transferOwnership(user1);
        
        vm.prank(user1);
        token.mint(user2, 1000 * 10**18);
        
        assertEq(token.balanceOf(user2), 1000 * 10**18);
    }

    // ============ Integration Tests ============

    function testCompleteUserJourney() public {
        // User requests tokens
        vm.prank(user1);
        token.requestToken();
        assertEq(token.balanceOf(user1), 100 * 10**18);
        
        // User transfers some
        vm.prank(user1);
        token.transfer(user2, 30 * 10**18);
        assertEq(token.balanceOf(user1), 70 * 10**18);
        
        // User burns some
        vm.prank(user1);
        token.burn(20 * 10**18);
        assertEq(token.balanceOf(user1), 50 * 10**18);
        
        // Wait and request again
        vm.warp(block.timestamp + 24 hours);
        vm.prank(user1);
        token.requestToken();
        assertEq(token.balanceOf(user1), 150 * 10**18);
    }

    function testOwnerMintAndUsersClaim() public {
        token.mint(user1, 500 * 10**18);
        
        vm.prank(user2);
        token.requestToken();
        
        assertEq(token.balanceOf(user1), 500 * 10**18);
        assertEq(token.balanceOf(user2), 100 * 10**18);
    }

    function testComplexApprovalScenario() public {
        vm.prank(user1);
        token.requestToken();
        
        // Approve user2
        vm.prank(user1);
        token.approve(user2, 50 * 10**18);
        
        // user2 transfers some
        vm.prank(user2);
        token.transferFrom(user1, user3, 30 * 10**18);
        
        // Remaining allowance
        assertEq(token.allowance(user1, user2), 20 * 10**18);
        assertEq(token.balanceOf(user3), 30 * 10**18);
    }

    function testFuzzMint(uint256 amount) public {
        vm.assume(amount > 0 && amount <= token.remainingMintableSupply());
        
        token.mint(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function testFuzzTransfer(uint256 amount) public {
        vm.prank(user1);
        token.requestToken();
        
        vm.assume(amount <= 100 * 10**18);
        
        vm.prank(user1);
        token.transfer(user2, amount);
        assertEq(token.balanceOf(user2), amount);
    }
}
