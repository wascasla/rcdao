import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployVotingToken: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments} = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying Voting Token...");
    const votingToken = await deploy("VotingToken",{
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations:
    });
    // verify
    log(`Deployed Voting token to address ${votingToken.address}`)

};


export default deployVotingToken;