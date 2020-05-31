// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Nyfti = artifacts.require("./Nyfti.sol");

module.exports = function(deployer) {
//   deployer.deploy(SimpleStorage);
  deployer.deploy(Nyfti);
};
