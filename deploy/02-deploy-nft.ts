import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployNFT: DeployFunction = async function(
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments} = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying NFT...");
    const nft = await deploy("NFT",{
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations:
    });
    // verify
    log(`Deployed NFT to address ${nft.address}`)

};


export default deployNFT;