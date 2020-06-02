//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Cryptomon is ERC721 {
    string[] public names;
    struct statBlock {
        string name;
        uint8 health;
        uint8 currHealth;
        uint8 speed;
        uint8 attackPower;
    }

    mapping(string => bool) _nameExists;
    mapping(string => address) _tokenOwner;
    mapping(address => uint[]) _ownedTokens;
    statBlock[] _existingTokens;

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

    constructor(string memory _name, string memory _token) ERC721(_name, _token) public {
    }

    function mint(string memory _name, uint8 _health, uint8 _currHealth, uint8 _speed, uint8 _attackPower) public {
        require(!_nameExists[_name], 'Name already taken');
        names.push(_name);
        uint _id = names.length;

        //ERC-721 mint
        _mint(msg.sender, _id);

        //Record ownership data to contract
        _nameExists[_name] = true;
        _tokenOwner[_name] = msg.sender;
        statBlock memory stats = statBlock(_name, _health, _currHealth, _speed, _attackPower);
        _existingTokens.push(stats);
        _ownedTokens[msg.sender].push(_existingTokens.length);
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
        statBlock memory resp = _existingTokens[_ownedTokens[msg.sender][_block] - 1];
        return resp;
    }

    function updateHealth(uint _block, uint8 _hp)
        public
    {
        _existingTokens[_ownedTokens[msg.sender][_block] - 1].currHealth = _hp;
    }

    function rest(uint _block)
        public
    {
        _existingTokens[_ownedTokens[msg.sender][_block] - 1].currHealth = _existingTokens[_ownedTokens[msg.sender][_block] - 1].health;
    }

    function damage(uint _block, uint8 _hp)
        public
    {
        _existingTokens[_ownedTokens[msg.sender][_block] - 1]
            .currHealth = _existingTokens[_ownedTokens[msg.sender][_block] - 1].currHealth - _hp;
    }
}