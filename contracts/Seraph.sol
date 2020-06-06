//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./Cryptomon.sol";

contract Seraph is Cryptomon {
    constructor() Cryptomon("Seraph", "SWF") public {
    }

    function _mint(string memory _name) public {
        mint(_name, 150, 150, 100, 255, "Gust", "Holy Light", "Sear", "Hark");
    }
}