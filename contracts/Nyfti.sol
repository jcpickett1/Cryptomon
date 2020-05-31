//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Nyfti is ERC721 {
    string[] public names;
    struct statBlock {
        string name;
        uint speed;
        uint health;
        uint attackPower;
    }

    mapping(string => bool) _nameExists;
    mapping(string => address) _tokenOwner;
    mapping(address => statBlock[]) _ownedTokens;

     modifier onlyOwner(string memory _name) {
        require(
            msg.sender == _tokenOwner[_name],
            "Only owner can call this function."
        );
        _;
    }

     modifier newName(string memory _oldName, string memory _newName) {
        require(
            _nameExists[_oldName],
            "Old name not assigned to any token."
        );
        require(
            !_nameExists[_newName],
            "New name already taken."
        );
        _;
    }

    constructor() ERC721("Nyfti", "NFT") public {
    }

    function mint(string memory _name) public {
        require(!_nameExists[_name], 'Name already taken');
        names.push(_name);
        uint _id = names.length;

        //ERC-721 mint
        _mint(msg.sender, _id);

        //Record ownership data to contract
        _nameExists[_name] = true;
        _tokenOwner[_name] = msg.sender;
        statBlock memory stats = statBlock(_name, 50, 100, 150);
        _ownedTokens[msg.sender].push(stats);
    }

    function checkName(string memory _name)
        public
        view
        returns(bool)
    {
        return _nameExists[_name];
    }

    function checkOwner(string memory _name)
        public
        view
        returns(address)
    {
        return _tokenOwner[_name];
    }

    function rename(string memory _oldName, string memory _newName)
        public
        onlyOwner(_oldName)
        newName(_oldName, _newName)
    {
        _nameExists[_oldName] = false;
        _tokenOwner[_oldName] = address(0x0);
        _nameExists[_newName] = true;
        _tokenOwner[_newName] = msg.sender;

    }

    function getStatBlock(uint _block)
        public
        view
        returns(statBlock memory)
    {
        require(_block < _ownedTokens[msg.sender].length, "Specified a nonexistant token index");
        statBlock memory resp = _ownedTokens[msg.sender][_block];
        return resp;
    }
}