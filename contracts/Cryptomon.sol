//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Cryptomon is ERC721 {
    address payable owner;
    string[] public names;
    struct statBlock {
        string name;
        uint index;
        uint8 health;
        uint8 currHealth;
        uint8 speed;
        uint8 attackPower;
        string[] abilities;
    }

    mapping(string => bool) nameExists;
    mapping(string => address) tokenOwner;
    mapping(address => uint[]) ownedTokens;
    statBlock[] existingTokens;

    modifier onlyOwner(string memory _name) {
        require(
            msg.sender == tokenOwner[_name],
            "Only owner can call this function."
        );
        _;
    }

    modifier newName(string memory _oldName, string memory _newName) {
        require(
            nameExists[_oldName],
            "Old name not assigned to any token."
        );
        require(
            !nameExists[_newName],
            "New name already taken."
        );
        _;
    }

    constructor(string memory _name, string memory _token) ERC721(_name, _token) public {
        owner = msg.sender;
    }

    function mint(string memory _name, uint8 _health, uint8 _currHealth, uint8 _speed, uint8 _attackPower,
                    string memory _abilityOne, string memory _abilityTwo, string memory _abilityThree, string memory _abilityFour)
        public
    {
        // require(!nameExists[_name], 'Name already taken');
        names.push(_name);
        uint _id = names.length;

        //ERC-721 mint
        _mint(msg.sender, _id);

        //Record ownership data to contract
        nameExists[_name] = true;
        tokenOwner[_name] = msg.sender;
        string[] memory abilities;
        statBlock memory stats = statBlock(_name, existingTokens.length, _health, _currHealth, _speed, _attackPower, abilities);
        existingTokens.push(stats);
        existingTokens[existingTokens.length - 1].abilities = [_abilityOne, _abilityTwo, _abilityThree, _abilityFour];
        ownedTokens[msg.sender].push(existingTokens.length);
    }

    function checkName(string memory _name)
        public
        view
        returns(bool)
    {
        return nameExists[_name];
    }

    function checkOwner(string memory _name)
        public
        view
        returns(address)
    {
        return tokenOwner[_name];
    }

    function rename(string memory _oldName, string memory _newName)
        public
        onlyOwner(_oldName)
        newName(_oldName, _newName)
    {
        nameExists[_oldName] = false;
        tokenOwner[_oldName] = address(0x0);
        nameExists[_newName] = true;
        tokenOwner[_newName] = msg.sender;
    }

    function getStatBlock(uint _block)
        public
        view
        returns(statBlock memory)
    {
        require(_block < ownedTokens[msg.sender].length, "Specified a nonexistant token index");
        statBlock memory resp = existingTokens[ownedTokens[msg.sender][_block] - 1];
        return resp;
    }

    // function getAbilities(uint _index)
    //     public
    //     view
    //     returns(string[] memory)
    // {
    //     return existingTokens[ownedTokens[msg.sender][_index] - 1].abilities;
    // }

    function getStatsList()
        public
        view
        returns(statBlock[] memory)
    {
        statBlock[] memory stats = new statBlock[](ownedTokens[msg.sender].length);
        for(uint i = 0; i < ownedTokens[msg.sender].length; i++)
        {
            stats[i] = existingTokens[ownedTokens[msg.sender][i] - 1];
        }
        return stats;
    }

    function updateHealth(uint _block, uint8 _hp)
        public
    {
        existingTokens[ownedTokens[msg.sender][_block] - 1].currHealth = _hp;
    }

    function rest(uint _block)
        public
    {
        existingTokens[ownedTokens[msg.sender][_block] - 1].currHealth = existingTokens[ownedTokens[msg.sender][_block] - 1].health;
    }

    function damage(uint _block, uint8 _hp)
        public
    {
        existingTokens[ownedTokens[msg.sender][_block] - 1]
            .currHealth = existingTokens[ownedTokens[msg.sender][_block] - 1].currHealth - _hp;
    }

    function kill()
        public
    {
        if(msg.sender == owner) selfdestruct(owner);
    }
}