//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./Cryptomon.sol";

contract Nyfti is Cryptomon {
    constructor() Cryptomon("Nyfti", "NFT") public {
    }

    function _mint(string memory _name) public {
        mint(_name, 50, 50, 150, 100);
    }
}