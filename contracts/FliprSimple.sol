// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Flipr - Simple Loser NFT Minting
 * @notice Simplified contract for frontend-only game
 * @dev Users play for free, pay only to mint their shame
 */
contract FliprSimple is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Treasury address - receives all mint fees
    address public treasury = 0x50ef686123D82E0a37BC62AbcBdf1526FDE85DE6;

    // Mint fee in wei (will be set in ETH)
    uint256 public mintFee = 0.00041 ether; // $0.41 worth of ETH

    // NFT Storage
    struct LoserNFT {
        uint256 streak;
        uint256 timestamp;
        address minter;
    }

    mapping(uint256 => LoserNFT) public loserNFTs;
    mapping(address => uint256) public totalMints;

    // Leaderboard tracking
    struct LeaderboardEntry {
        address player;
        uint256 streak;
        uint256 tokenId;
        uint256 timestamp;
    }
    
    LeaderboardEntry[] public weeklyLeaderboard;
    LeaderboardEntry[] public allTimeLeaderboard;
    uint256 public weekStartTimestamp;

    // Events
    event LoserNFTMinted(address indexed player, uint256 tokenId, uint256 streak);
    event LeaderboardUpdated(address indexed player, uint256 streak, bool isAllTime);

    constructor() ERC721("Flipr Loser NFT", "FLIPR") Ownable(msg.sender) {
        weekStartTimestamp = block.timestamp;
    }

    /**
     * @notice Mint a Loser NFT after losing streak ends
     * @dev Anyone can mint at any time by paying the fee
     */
    function mintLoserNFT() external payable {
        require(msg.value >= mintFee, "Insufficient payment");

        // Send fee to treasury
        payable(treasury).transfer(msg.value);

        // Mint NFT
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);

        // Store basic NFT data (streak will be stored on frontend/IPFS)
        loserNFTs[tokenId] = LoserNFT({
            streak: 0, // Can be set later if needed
            timestamp: block.timestamp,
            minter: msg.sender
        });

        totalMints[msg.sender]++;

        emit LoserNFTMinted(msg.sender, tokenId, 0);
    }

    /**
     * @notice Mint a Loser NFT with streak tracking for leaderboard
     * @param streak The losing streak achieved
     * @dev Frontend passes the streak value for leaderboard tracking
     */
    function mintLoserNFTWithStreak(uint256 streak) external payable {
        require(msg.value >= mintFee, "Insufficient payment");
        require(streak > 0, "Streak must be greater than 0");

        // Send fee to treasury
        payable(treasury).transfer(msg.value);

        // Mint NFT
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);

        // Store NFT data with streak
        loserNFTs[tokenId] = LoserNFT({
            streak: streak,
            timestamp: block.timestamp,
            minter: msg.sender
        });

        totalMints[msg.sender]++;

        // Update leaderboards
        _updateLeaderboards(msg.sender, streak, tokenId);

        emit LoserNFTMinted(msg.sender, tokenId, streak);
    }

    /**
     * @notice Update leaderboards with new streak
     */
    function _updateLeaderboards(address player, uint256 streak, uint256 tokenId) internal {
        LeaderboardEntry memory entry = LeaderboardEntry({
            player: player,
            streak: streak,
            tokenId: tokenId,
            timestamp: block.timestamp
        });

        // Add to weekly leaderboard
        weeklyLeaderboard.push(entry);
        emit LeaderboardUpdated(player, streak, false);

        // Add to all-time if 4+ (legendary status)
        if (streak >= 4) {
            allTimeLeaderboard.push(entry);
            emit LeaderboardUpdated(player, streak, true);
        }

        // Reset weekly leaderboard if new week
        if (block.timestamp >= weekStartTimestamp + 7 days) {
            delete weeklyLeaderboard;
            weekStartTimestamp = block.timestamp;
        }
    }

    /**
     * @notice Get weekly leaderboard
     */
    function getWeeklyLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return weeklyLeaderboard;
    }

    /**
     * @notice Get all-time leaderboard
     */
    function getAllTimeLeaderboard() external view returns (LeaderboardEntry[] memory) {
        return allTimeLeaderboard;
    }

    /**
     * @notice Get NFT data by token ID
     */
    function getLoserNFT(uint256 tokenId) external view returns (LoserNFT memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return loserNFTs[tokenId];
    }

    /**
     * @notice Update mint fee (owner only)
     * @param newFee New mint fee in wei
     */
    function updateMintFee(uint256 newFee) external onlyOwner {
        mintFee = newFee;
    }

    /**
     * @notice Update treasury address (owner only)
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        treasury = newTreasury;
    }

    /**
     * @notice Get total mints by address
     */
    function getTotalMints(address player) external view returns (uint256) {
        return totalMints[player];
    }

    /**
     * @notice Get total supply of minted NFTs
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @notice Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
