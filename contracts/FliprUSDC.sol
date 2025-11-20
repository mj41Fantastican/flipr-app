// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FliprUSDC is ERC721, Ownable {
    using Strings for uint256;
    
    uint256 private _tokenIdCounter;
    IERC20 public constant USDC = IERC20(0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913);
    address public treasury = 0x50ef686123D82E0a37BC62AbcBdf1526FDE85DE6;
    
    uint256 public constant CLASSIC_FEE = 410000; // $0.41
    uint256 public constant DEGEN_FEE = 690000;   // $0.69
    
    struct LoserNFT {
        uint256 streak;
        uint256 timestamp;
        string mode;
        string coin;
        string roast;
    }
    
    mapping(uint256 => LoserNFT) public loserNFTs;
    event LoserNFTMinted(address indexed player, uint256 tokenId, uint256 streak);
    
    constructor() ERC721("Flipr Loser NFT", "FLIPR") Ownable(msg.sender) {}
    
    function mintLoserNFT(
        uint256 streak,
        string memory mode,
        string memory coin,
        string memory roast
    ) external returns (uint256) {
        uint256 fee = keccak256(bytes(mode)) == keccak256(bytes("classic")) ? CLASSIC_FEE : DEGEN_FEE;
        require(USDC.transferFrom(msg.sender, treasury, fee), "USDC transfer failed");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        loserNFTs[tokenId] = LoserNFT(streak, block.timestamp, mode, coin, roast);
        emit LoserNFTMinted(msg.sender, tokenId, streak);
        return tokenId;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        LoserNFT memory nft = loserNFTs[tokenId];
        
        string memory emojis = keccak256(bytes(nft.mode)) == keccak256(bytes("degen"))
            ? unicode"💃💃💃💃💃" : unicode"🪩🪩🪩🪩🪩";
        
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">',
            '<rect width="600" height="800" fill="#8B0000"/>',
            '<rect x="20" y="20" width="560" height="760" fill="none" stroke="#FF1493" stroke-width="8" rx="20"/>',
            '<text x="300" y="80" font-family="monospace" font-size="28" fill="#FF1493" text-anchor="middle" font-weight="bold">FLIPR HALL OF SHAME</text>',
            '<text x="300" y="140" font-family="monospace" font-size="20" fill="#FFD700" text-anchor="middle">THIS NFT IS A LOSER</text>',
            '<text x="300" y="260" font-family="monospace" font-size="120" fill="#FFD700" text-anchor="middle" font-weight="bold">', nft.streak.toString(), 'x</text>',
            '<text x="300" y="320" font-family="monospace" font-size="18" fill="#FFFFFF" text-anchor="middle">CONSECUTIVE LOSSES</text>',
            '<text x="300" y="380" font-family="monospace" font-size="20" fill="#FF1493" text-anchor="middle">Mode: ', nft.mode, '</text>',
            '<text x="300" y="420" font-family="monospace" font-size="16" fill="#FFFFFF" text-anchor="middle">Coin Used: ', nft.coin, '</text>',
            '<text x="60" y="500" font-family="monospace" font-size="13" fill="#FFB6C1" font-style="italic">"', nft.roast, '"</text>',
            '<text x="300" y="580" font-family="monospace" font-size="18" fill="#FFFFFF" text-anchor="middle">', emojis, '</text>',
            '<text x="300" y="680" font-family="monospace" font-size="14" fill="#FFFFFF" text-anchor="middle">Date of sub-optimal performance:</text>',
            '<text x="300" y="710" font-family="monospace" font-size="14" fill="#FFFFFF" text-anchor="middle">Block #', block.number.toString(), '</text>',
            '<text x="300" y="760" font-family="monospace" font-size="18" fill="#FFD700" text-anchor="middle" font-weight="bold">FlipnMint#', tokenId.toString(), '</text>',
            '</svg>'
        ));
        
        string memory json = string(abi.encodePacked(
            '{"name":"Flipr Loser #', tokenId.toString(),
            '","description":"', nft.streak.toString(), ' consecutive losses in ', nft.mode, ' mode",',
            '"image":"data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
        ));
        
        return string(abi.encodePacked('data:application/json;base64,', Base64.encode(bytes(json))));
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}