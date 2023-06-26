import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployDao: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments} = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying Dao...");
    const votingToken = await get("VotingToken");
    const nft = await get("NFT");
    const dao = await deploy("DAO",{
        from: deployer,
        args: [votingToken.address, nft.address],
        log: true,
        // waitConfirmations:
    });
    // verify
    log(`Deployed DAO to address ${dao.address}`)

};


export default deployDao;