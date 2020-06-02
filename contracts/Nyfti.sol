//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "./Cryptomon.sol";

contract Nyfti is Cryptomon {
    constructor() Cryptomon("Nyfti", "NFT") public {
    }
}