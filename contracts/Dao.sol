// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./VotingToken.sol";
import "./NFT.sol";

contract DAO is Ownable{
    enum statusProposal { PENDING, CLOSED }

    Proposal[] proposals;
    
    struct Proposal {
        uint256 id;
        address creator;
        uint256 startTime;
        uint256 endTime;
        string description;
        uint256 optionA;
        uint256 optionB;
        statusProposal status;
    }   

    mapping(address => mapping(uint => bool)) public votes;    

    VotingToken public votingToken;

    NFT public nftContract;
        
    event ProposalCreated(uint256 proposalId, address creator, string description, uint256 endTime);
    event Voted(uint256 proposalId, address voter, bool inFavor, uint256 tokenId);
    event ProposalExecuted(uint256 indexed proposalId, address indexed proposer);

    
    constructor(address _votingTokenAddress, address _nftContractAddress) {
        votingToken = VotingToken(_votingTokenAddress);
        nftContract = NFT(_nftContractAddress);
    }
    
    function createProposal(string calldata _description) external onlyOwner{
        require(votingToken.balanceOf(msg.sender) > 0, "Insufficient tokens to create proposal");
           
        Proposal memory newProposal = Proposal({
            id: proposals.length,
            creator: msg.sender,
            description: _description,
            startTime: block.timestamp,
            endTime: block.timestamp + 5 minutes,
            optionA: 0,
            optionB: 0,
            status: statusProposal.PENDING
        });
    
        proposals.push(newProposal);
        emit ProposalCreated(newProposal.id, msg.sender, _description, newProposal.endTime);
    }
    
    function vote(uint256 _proposalId, bool _inFavor) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status != statusProposal.CLOSED, "Proposal has already been executed");
        require(block.timestamp >= proposal.startTime && block.timestamp <= proposal.endTime, "Invalid voting period");        
        require(votes[msg.sender][_proposalId] == false, "You have already voted for this proposal");
        require(votingToken.balanceOf(msg.sender) > 0, "Insufficient tokens to vote");
              
        if (_inFavor) {
            proposal.optionA++;
        } else {
            proposal.optionB++;
        }

        votes[msg.sender][_proposalId] = true;
        uint256 newTokenId = nftContract.mint(msg.sender, _proposalId, proposal.description);
        
        emit Voted(_proposalId, msg.sender, _inFavor, newTokenId);
    }
    
    function getProposalStatus(uint256 _proposalId) external view returns (address, string memory, uint256, uint256, uint256, uint256) {
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.creator, proposal.description, proposal.startTime, proposal.endTime, proposal.optionA, proposal.optionB);
    }

    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.status != statusProposal.CLOSED, "Proposal has already been executed");
        require(block.timestamp > proposal.endTime, "Voting period is still ongoing");
       
        proposal.status = statusProposal.CLOSED;
        emit ProposalExecuted(proposal.id, proposal.creator);
    }

    function getProposals() external view returns ( Proposal[] memory) {     
       return proposals;
    }
    
}