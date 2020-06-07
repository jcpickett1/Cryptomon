var Seraph = artifacts.require("./Seraph.sol");

module.exports = function(deployer) {
  deployer.deploy(Seraph);
};