import { ethers } from "hardhat";
import { expect } from "chai";

describe("VotingToken", function () {
  let votingToken: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const VotingToken = await ethers.getContractFactory("VotingToken");
    votingToken = await VotingToken.deploy();
    await votingToken.deployed();
  });

  it("should have correct name, symbol, and initial supply", async function () {
    const name = await votingToken.name();
    const symbol = await votingToken.symbol();
    const totalSupply = await votingToken.totalSupply();

    expect(name).to.equal("Voting Token");
    expect(symbol).to.equal("VOTE");
    // expect(await totalSupply).to.equal(1000000 * 10 ** 18);
    expect(totalSupply.toString()).to.equal((BigInt(1000000) * BigInt(10 ** 18)).toString())
  });

  it("should assign initial supply to contract deployer", async function () {
    const balance = await votingToken.balanceOf(owner.address);
    // expect(BigInt(balance)).to.equal(1000000 * 10 ** 18);
    expect(balance.toString()).to.equal((BigInt(1000000) * BigInt(10 ** 18)).toString());
  });

  it("should transfer tokens between accounts", async function () {
    const amount = ethers.utils.parseEther("100");

    await votingToken.transfer(addr1.address, amount);
    let balance = await votingToken.balanceOf(addr1.address);
    expect(balance).to.equal(amount);

    await votingToken.connect(addr1).transfer(addr2.address, amount);
    balance = await votingToken.balanceOf(addr2.address);
    expect(balance).to.equal(amount);
  });

});
