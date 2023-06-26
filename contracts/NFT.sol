// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct NFTData {
        uint256 proposalId;
        string description;
    }
    
    mapping(uint256 => NFTData) private nftData;
    
    constructor() ERC721("Voting NFT", "VNFT") {}
    
    function mint(address _to, uint256 _proposalId, string memory _description) external returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(_to, newTokenId);
        
        nftData[newTokenId] = NFTData(_proposalId, _description);
        
        return newTokenId;
    }
        
    function getNFTData(uint256 _tokenId) external view returns (uint256, string memory) {
        require(_exists(_tokenId), "Invalid NFT token ID");
        NFTData storage data = nftData[_tokenId];
        return (data.proposalId, data.description);
    }
}