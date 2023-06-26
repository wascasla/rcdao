import { ethers } from "hardhat";
import { expect } from "chai";

describe("DAO", function () {
  let daoContract: any;
  let votingTokenContract: any;
  let nftContract: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    const VotingTokenContract = await ethers.getContractFactory("VotingToken");
    votingTokenContract = await VotingTokenContract.deploy();
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy();
    const DAOContract = await ethers.getContractFactory("DAO");
    [owner, addr1, addr2] = await ethers.getSigners();
    daoContract = await DAOContract.deploy(votingTokenContract.address, nftContract.address);
  });

  it("should create a proposal with correct data", async function () {
    const description = "Sample Proposal";
    await votingTokenContract.connect(owner).transfer(addr1.address, 100);
    await daoContract.connect(owner).createProposal(description);

    const proposalId = 0;
    const [creator, resultDescription, startTime, endTime, optionA, optionB] = await daoContract.getProposalStatus(proposalId);
    expect(creator).to.equal(owner.address);
    expect(resultDescription).to.equal(description);
    expect(startTime).to.be.gt(0);
    expect(endTime).to.be.gt(0);
    expect(optionA).to.equal(0);
    expect(optionB).to.equal(0);
  });

  it("should not allow creating a proposal without ownership", async function () {
    const description = "Sample Proposal";
    await expect(daoContract.connect(addr1).createProposal(description)).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should allow voting for a proposal and mint an NFT", async function () {
    const description = "Sample Proposal";
    await votingTokenContract.connect(owner).transfer(addr1.address, 100);
    await votingTokenContract.connect(owner).transfer(addr2.address, 100);
    await daoContract.connect(owner).createProposal(description);

    const proposalId = 0;
    await daoContract.connect(addr2).vote(proposalId, true);

    const tokenId = 1;
    const tokenOwner = await nftContract.ownerOf(tokenId);
    expect(tokenOwner).to.equal(addr2.address);

    const [resultProposalId, resultDescription] = await nftContract.getNFTData(tokenId);
    expect(resultProposalId).to.equal(proposalId);
    expect(resultDescription).to.equal(description);
  });  
  
  it("should not allow voting multiple times for the same proposal", async function () {
    const description = "Sample Proposal";
    await votingTokenContract.connect(owner).transfer(addr1.address, 100);
    await daoContract.connect(owner).createProposal(description);

    const proposalId = 0;
    await daoContract.connect(addr1).vote(proposalId, true);
    await expect(daoContract.connect(addr1).vote(proposalId, true)).to.be.revertedWith("You have already voted for this proposal");
  });  

  it("should get all proposals", async function () {
    const description1 = "Sample Proposal 1";
    const description2 = "Sample Proposal 2";
    await votingTokenContract.connect(owner).transfer(addr1.address, 100);
    await votingTokenContract.connect(owner).transfer(addr2.address, 100);
    await daoContract.connect(owner).createProposal(description1);
    await daoContract.connect(owner).createProposal(description2);

    const proposals = await daoContract.getProposals();
    expect(proposals).to.have.lengthOf(2);
    expect(proposals[0].description).to.equal(description1);
    expect(proposals[1].description).to.equal(description2);
  });
});
