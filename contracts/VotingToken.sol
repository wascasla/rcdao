// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingToken is ERC20, Ownable {
    
    constructor() ERC20("Voting Token", "VOTE") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }    
    
}