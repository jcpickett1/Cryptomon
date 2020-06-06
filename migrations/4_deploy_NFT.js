var Nyfti = artifacts.require("./Nyfti.sol");
var Seraphim = artifacts.require("./Seraph.sol");

module.exports = function(deployer) {
  deployer.deploy(Nyfti);
  deployer.deploy(Seraphim);
};
