// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./access/Ownable.sol";
import "./token/ERC20/ERC20.sol";

/**
 * @title BridgeToken
 * @dev ERC20 Token with faucet functionality and owner-controlled minting
 * 
 * Assignment Requirements:
 * - MAX_SUPPLY of 10,000,000 tokens
 * - requestToken(): Users can claim tokens every 24 hours (faucet)
 * - mint(): Owner can mint tokens up to MAX_SUPPLY
 * - Standard ERC20 functions (transfer, approve, balanceOf, etc.)
 */
contract BridgeToken is Ownable, ERC20 {
    // Constants
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10 million tokens
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18; // 100 tokens per request
    uint256 public constant COOLDOWN_TIME = 24 hours;

    // State variables for faucet
    mapping(address => uint256) public lastRequestTime;
    
    // Track total minted to prevent exceeding MAX_SUPPLY even after burns
    uint256 private _totalMinted;

    // Events
    event TokensRequested(address indexed user, uint256 amount, uint256 timestamp);
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @dev Constructor that sets token name and symbol
     * Mints initial supply to contract for faucet distribution
     */
    constructor(uint256 _totalSupply) ERC20("BridgeToken", "BRG") {
        require(_totalSupply <= MAX_SUPPLY, "Total supply exceeds MAX_SUPPLY");
        _mint(msg.sender, _totalSupply);
        _totalMinted = _totalSupply; // Track initial mint
    }

    /**
     * @dev Allows users to request tokens from the faucet
     * Can only be called once every 24 hours per address
     * 
     * Requirements:
     * - Cooldown period must have elapsed (or first time requesting)
     * - Contract must have sufficient balance
     */
    function requestToken() external {
        // Allow first-time requests (when lastRequestTime is 0)
        if (lastRequestTime[msg.sender] != 0) {
            require(
                block.timestamp >= lastRequestTime[msg.sender] + COOLDOWN_TIME,
                "Cooldown period not elapsed"
            );
        }
        
        require(
            balanceOf(address(this)) >= FAUCET_AMOUNT,
            "Faucet is empty"
        );

        lastRequestTime[msg.sender] = block.timestamp;
        _transfer(address(this), msg.sender, FAUCET_AMOUNT);

        emit TokensRequested(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    /**
     * @dev Returns the time remaining until user can request tokens again
     * @param user Address to check
     * @return Time in seconds until next request is allowed (0 if can request now)
     */
    function getTimeUntilNextRequest(address user) external view returns (uint256) {
        if (lastRequestTime[user] == 0) {
            return 0; // Never requested before
        }
        
        uint256 nextRequestTime = lastRequestTime[user] + COOLDOWN_TIME;
        if (block.timestamp >= nextRequestTime) {
            return 0; // Can request now
        }
        
        return nextRequestTime - block.timestamp;
    }

    /**
     * @dev Allows owner to mint new tokens
     * Cannot exceed MAX_SUPPLY (even after burns)
     * 
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * 
     * Requirements:
     * - Caller must be owner
     * - Total minted (not current supply) must not exceed MAX_SUPPLY
     * - Cannot mint to zero address
     * - Amount must not cause overflow
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Cannot mint zero amount");
        
        // Check for overflow before addition
        require(_totalMinted + amount >= _totalMinted, "Mint amount causes overflow");
        require(
            _totalMinted + amount <= MAX_SUPPLY,
            "Minting would exceed MAX_SUPPLY"
        );

        _totalMinted += amount;
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /**
     * @dev Returns remaining supply that can be minted
     * Based on total minted, not current supply (to prevent re-minting after burns)
     * @return Amount of tokens that can still be minted
     */
    function remainingMintableSupply() external view returns (uint256) {
        return MAX_SUPPLY - _totalMinted;
    }
    
    /**
     * @dev Returns total amount minted (including burned tokens)
     * @return Total minted amount
     */
    function totalMinted() external view returns (uint256) {
        return _totalMinted;
    }

    /**
     * @dev Allows users to burn their own tokens
     * @param value Amount of tokens to burn
     */
    function burn(uint256 value) external {
        _burn(msg.sender, value);
    }

    /**
     * @dev Hook that is called before any transfer of tokens
     * Can be overridden to add custom logic
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        // Add any custom logic here if needed
    }
}
