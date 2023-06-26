const { expect } = require("chai");

describe("NFT", function () {
  let nftContract: any;
  let owner: any;
  let addr1: any;

  beforeEach(async function () {
    const NFTContract = await ethers.getContractFactory("NFT");
    nftContract = await NFTContract.deploy();
    [owner, addr1] = await ethers.getSigners();
  });

  it("should mint an NFT with correct data", async function () {
    const proposalId = 1;
    const description = "Sample NFT";
    await nftContract.connect(owner).mint(addr1.address, proposalId, description);

    const tokenId = 1;
    const tokenOwner = await nftContract.ownerOf(tokenId);
    expect(tokenOwner).to.equal(addr1.address);

    const [resultProposalId, resultDescription] = await nftContract.getNFTData(tokenId);
    expect(resultProposalId).to.equal(proposalId);
    expect(resultDescription).to.equal(description);
  });

  it("should not allow getting data of an invalid NFT token ID", async function () {
    const tokenId = 1;
    await expect(nftContract.getNFTData(tokenId)).to.be.revertedWith("Invalid NFT token ID");
  });
});
