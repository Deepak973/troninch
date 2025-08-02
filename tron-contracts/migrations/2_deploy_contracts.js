const EscrowFactory = artifacts.require("EscrowFactory");
const Resolver = artifacts.require("Resolver");

module.exports = async function (deployer, network, accounts) {
  // account[0] will be the deployer
  const deployerAddress = accounts[0];
  console.log("Deployer:", deployerAddress);

  // Deploy EscrowFactory
  await deployer.deploy(EscrowFactory);
  const factoryInstance = await EscrowFactory.deployed();
  console.log("EscrowFactory deployed at:", factoryInstance.address);

  // Deploy Resolver with factory address
  await deployer.deploy(Resolver, factoryInstance.address);
  const resolverInstance = await Resolver.deployed();
  console.log("Resolver deployed at:", resolverInstance.address);
};
